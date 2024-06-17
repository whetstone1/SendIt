const mongoose = require('mongoose');
const PendingContributionSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  status: { type: String, default: 'pending' }, // 'pending' or 'completed'
});

module.exports = mongoose.model('PendingContribution', PendingContributionSchema);
