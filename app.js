const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/' + process.env.MONGO_DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');

        return res.status(200).json({});
    }

    next();
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.all('*', (req, res) => {
    res.status(404).json({
        message: 'The request could not be satisfied :(',
    });
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
