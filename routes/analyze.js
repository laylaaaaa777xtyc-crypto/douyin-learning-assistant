const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const VideoInsight = require('../models/VideoInsight');

const mongoReady = () => mongoose.connection.readyState === 1;
const {
  classifyVideo,
  generateCharacterResponse,
  generateMindmapMermaid,
  getFallbackResponse
} = require('../services/deepseekService');
const { getCharacterById, matchCharacterByCategory } = require('../config/characters');

const router = express.Router();

router.post('/analyze', async (req, res, next) => {
  try {
    const { videoId, transcript, characterId } = req.body || {};
    if (!videoId || !transcript) {
      return res.status(400).json({
        success: false,
        error: 'videoId 和 transcript 为必填项'
      });
    }

    const cached = mongoReady() ? await VideoInsight.findOne({ videoId }).lean() : null;
    if (cached) {
      return res.json({
        success: true,
        data: {
          videoId: cached.videoId,
          classification: {
            category: cached.category,
            tags: cached.tags,
            difficulty: cached.difficulty
          },
          character: {
            id: cached.characterId,
            name: cached.characterName,
            avatarHint: getCharacterById(cached.characterId)?.avatarHint
          },
          reconstruction: {
            simpleExplanations: cached.simpleExplanations,
            logicTree: cached.logicTree,
            actionTips: cached.actionTips
          },
          mindmapMermaid: cached.mindmapMermaid,
          cached: true
        }
      });
    }

    let classification;
    let character;
    let reconstruction;
    let mindmapMermaid;
    let usedFallback = false;

    try {
      classification = await classifyVideo(transcript);
    } catch (err) {
      console.error('[analyze] classifyVideo failed:', err.message);
      classification = { category: '学术科普', tags: [], difficulty: 'medium' };
      usedFallback = true;
    }

    character = characterId ? getCharacterById(characterId) : null;
    if (!character) {
      character = matchCharacterByCategory(classification.category);
    }

    try {
      reconstruction = await generateCharacterResponse(transcript, character, classification.category);
    } catch (err) {
      console.error('[analyze] generateCharacterResponse failed:', err.message);
      reconstruction = getFallbackResponse(character);
      usedFallback = true;
    }

    try {
      mindmapMermaid = await generateMindmapMermaid(reconstruction, character, classification.category);
    } catch (err) {
      console.error('[analyze] generateMindmapMermaid failed:', err.message);
      mindmapMermaid = `mindmap\n  root((${classification.category}))\n    内容解读\n      暂无思维导图`;
    }

    const transcriptHash = crypto.createHash('md5').update(transcript).digest('hex');

    if (mongoReady()) try {
      await VideoInsight.create({
        videoId,
        transcriptHash,
        category: classification.category,
        tags: classification.tags,
        difficulty: classification.difficulty,
        characterId: character.id,
        characterName: character.name,
        simpleExplanations: reconstruction.simpleExplanations,
        logicTree: reconstruction.logicTree,
        actionTips: reconstruction.actionTips,
        mindmapMermaid
      });
    } catch (err) {
      console.error('[analyze] persist failed:', err.message);
    }

    res.json({
      success: true,
      data: {
        videoId,
        classification,
        character: {
          id: character.id,
          name: character.name,
          avatarHint: character.avatarHint
        },
        reconstruction: {
          simpleExplanations: reconstruction.simpleExplanations,
          logicTree: reconstruction.logicTree,
          actionTips: reconstruction.actionTips
        },
        mindmapMermaid,
        cached: false,
        fallback: usedFallback || Boolean(reconstruction.fallback)
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
