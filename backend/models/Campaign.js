const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    tiltPoint: { type: Number, required: true },
    deadline: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountRaised: { type: Number, default: 0 },
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isTipped: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', CampaignSchema);
