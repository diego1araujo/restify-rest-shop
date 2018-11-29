const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");

const Order = require('../api/models/order');

beforeAll(async () => {
    await Order.deleteMany({}).exec();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('get /orders/randomrouter - inexistent router', () => {
    test('It should throw an error with message `not found`', async () => {
        try {
            const response = await request(app).get('/orders');
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('get /orders - list all orders', () => {
    test('It should respond with an array of objects', async () => {
        try {
            const response = await request(app).get('/orders').set('Authorization', process.env.AUTH);
            expect(response.statusCode).toBe(200);
            expect(response.body.count).toBeDefined();
            expect(response.body.orders).toBeDefined();
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /orders - create a new order', () => {
    test('It should respond with a success message', async () => {
        let data = {
            product: '',
            quantity: '',
        }

        try {
            const response = await request(app).post('/orders').set('Authorization', process.env.AUTH).send(data);
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('User created');
        } catch (e) {
            console.log(e);
        }
    });
});
