const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Authentication', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
        await user.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with the same email', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
        await user.save();

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jane Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toBe('User already exists');
    });

    it('should not login with incorrect password', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
        await user.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'wrongpassword',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toBe('Invalid credentials');
    });
});
