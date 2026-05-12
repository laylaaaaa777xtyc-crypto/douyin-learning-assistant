const express = require('express');
const { characters, getCharacterById } = require('../config/characters');

const router = express.Router();

router.get('/characters', (_req, res) => {
  res.json({
    success: true,
    data: characters.map((c) => ({
      id: c.id,
      name: c.name,
      nameEn: c.nameEn,
      avatarHint: c.avatarHint,
      personality: c.personality,
      videoTypes: c.videoTypes
    }))
  });
});

router.get('/characters/:id', (req, res) => {
  const character = getCharacterById(req.params.id);
  if (!character) {
    return res.status(404).json({ success: false, error: '角色不存在' });
  }
  res.json({ success: true, data: character });
});

module.exports = router;
