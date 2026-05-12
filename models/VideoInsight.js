const mongoose = require('mongoose');

const VideoInsightSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true, index: true },
  transcriptHash: { type: String, index: true },
  category: String,
  tags: [String],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  characterId: String,
  characterName: String,
  simpleExplanations: [
    {
      term: String,
      explanation: String
    }
  ],
  logicTree: {
    mainArgument: String,
    supportPoints: [String],
    potentialFlaws: [String],
    score: Number
  },
  actionTips: [String],
  mindmapMermaid: String,
  createdAt: { type: Date, default: Date.now, expires: 2592000 },
  updatedAt: { type: Date, default: Date.now }
});

VideoInsightSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('VideoInsight', VideoInsightSchema);
