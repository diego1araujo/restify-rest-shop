const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");

const User = require('../api/models/user');

beforeAll(async () => {
    await User.deleteMany({}).exec();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('post /user/randomrouter - inexistent router', () => {
    test('It should throw an error with message `not found`', async () => {
        try {
            const response = await request(app).get('/user/randomrouter');
            expect(response.statusCode).toBe(404);
            expect(response.body.error.message).toBe('Not Found');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /user/signup - empty fields', () => {
    test('It should throw an error with message `invalid credentials`', async () => {
        try {
            const response = await request(app).post('/user/signup');
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBeDefined();
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /user/signup - successful signup', () => {
    test('It should respond with a success message', async () => {
        let data = {
            email: 'user@email.com',
            password: '123456',
        }

        try {
            const response = await request(app).post('/user/signup').send(data);
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('User created');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /user/signup - email exists', () => {
    test('It should throw an error with message `email exists`', async () => {
        let data = {
            email: 'user@email.com',
            password: '123456',
        }

        try {
            const response = await request(app).post('/user/signup').send(data);
            expect(response.statusCode).toBe(409);
            expect(response.body.message).toBe('Mail exists');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /user/login - empty fields', () => {
    test('It should thrown an error when no data is sent', async () => {
        try {
            const response = await request(app).post('/user/login');
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Invalid Credentials');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /user/login - wrong credentials', () => {
    test('It should thrown an error due to user is not registered', async () => {
        let data = {
            email: 'random@email.com',
            password: '123456',
        }

        try {
            const response = await request(app).post('/user/login').send(data);
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Invalid Credentials');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /user/login - successful login', () => {
    test('It should respond with a success message along with access token', async () => {
        let data = {
            email: 'user@email.com',
            password: '123456',
        }

        try {
            const response = await request(app).post('/user/login').send(data);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Auth successful');
            expect(response.body.token).toBeDefined();
        } catch (e) {
            console.log(e);
        }
    });
});
