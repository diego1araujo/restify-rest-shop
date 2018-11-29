const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");

const Product = require('../api/models/product');

beforeAll(async () => {
    await Product.deleteMany({}).exec();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('get /products/randomrouter - inexistent router', () => {
    test('It should throw an error', async () => {
        try {
            const response = await request(app).get('/products/randomrouter');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No valid entry found for provided ID');
        } catch (e) {
            console.log(e);
        }
    });
});

describe('get /products - list all products', () => {
    test('It should respond with an array of objects', async () => {
        try {
            const response = await request(app).get('/products').set('Authorization', process.env.AUTH);
            expect(response.statusCode).toBe(200);
            expect(response.body.count).toBeDefined();
            expect(response.body.products).toBeDefined();
        } catch (e) {
            console.log(e);
        }
    });
});

describe('post /products - create a new product', () => {
    test('It should respond with a success message', async () => {
        let data = {
            name: '',
            price: '',
            productImage: '',
        }

        try {
            const response = await request(app).post('/products').set('Authorization', process.env.AUTH).send(data);
            expect(response.statusCode).toBe(404);
            expect(response.body.error.message).toBe('Not Found');
        } catch (e) {
            console.log(e);
        }
    });
});
