const express = require('express');
const { check, validationResult } = require('express-validator');
const Campaign = require('../models/Campaign');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../utils/mailer');
const router = express.Router();

const validateCampaignInput = [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('goalAmount', 'Goal amount must be a number').isNumeric(),
    check('tiltPoint', 'Tilt point must be a number').isNumeric(),
];

router.post('/', [auth, validateCampaignInput], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, goalAmount, tiltPoint, deadline } = req.body;

    try {
        const newCampaign = new Campaign({
            title,
            description,
            goalAmount,
            tiltPoint,
            deadline,
            createdBy: req.user.id,
        });

        const campaign = await newCampaign.save();

        sendEmail(req.user.email, 'Campaign Created', `Your campaign "${title}" has been created.`);

        res.json(campaign);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('createdBy', ['name', 'email']);
        res.json(campaigns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('createdBy', ['name', 'email']);
        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Campaign not found' });
        }
        res.status(500).send('Server error');
    }
});

router.post('/contribute/:id', [auth, check('amount', 'Amount must be a number').isNumeric()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, token } = req.body;

    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        const charge = await stripe.charges.create({
            amount: amount * 100, // amount in cents
            currency: 'usd',
            description: `Contribution to ${campaign.title}`,
            source: token,
        });

        campaign.amountRaised += amount;
        campaign.contributors.push(req.user.id);

        if (campaign.amountRaised >= campaign.tiltPoint) {
            campaign.isTipped = true;
            sendEmail(campaign.createdBy.email, 'Campaign Tipped', `Your campaign "${campaign.title}" has reached its tilt point.`);
        }

        await campaign.save();
        sendEmail(req.user.email, 'Contribution Successful', `You have successfully contributed to "${campaign.title}".`);

        res.json(campaign);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
