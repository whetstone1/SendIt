const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    });
    await user.save();

    token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: 360000 });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Campaign Management', () => {
    beforeEach(async () => {
        await Campaign.deleteMany({});
    });

    it('should create a campaign', async () => {
        const res = await request(app)
            .post('/api/campaigns')
            .set('x-auth-token', token)
            .send({
                title: 'Test Campaign',
                description: 'Test Description',
                goalAmount: 1000,
                tiltPoint: 500,
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Test Campaign');
    });

    it('should fetch all campaigns', async () => {
        const campaign = new Campaign({
            title: 'Test Campaign',
            description: 'Test Description',
            goalAmount: 1000,
            tiltPoint: 500,
            createdBy: mongoose.Types.ObjectId(),
        });
        await campaign.save();

        const res = await request(app)
            .get('/api/campaigns');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('title', 'Test Campaign');
    });

    it('should fetch a campaign by ID', async () => {
        const campaign = new Campaign({
            title: 'Test Campaign',
            description: 'Test Description',
            goalAmount: 1000,
            tiltPoint: 500,
            createdBy: mongoose.Types.ObjectId(),
        });
        await campaign.save();

        const res = await request(app)
            .get(`/api/campaigns/${campaign.id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Test Campaign');
    });

    it('should contribute to a campaign', async () => {
        const campaign = new Campaign({
            title: 'Test Campaign',
            description: 'Test Description',
            goalAmount: 1000,
            tiltPoint: 500,
            createdBy: mongoose.Types.ObjectId(),
        });
        await campaign.save();

        const res = await request(app)
            .post(`/api/campaigns/contribute/${campaign.id}`)
            .set('x-auth-token', token)
            .send({
                amount: 100,
                token: 'fake_token',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.amountRaised).toBe(100);
    });
});
