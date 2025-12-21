const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const port = process.env.PORT || process.env.port || 3000;
require('./connection');

const app = express();
app.use(express.json());
app.use(cors());

const userroute = require('./route/userroute');
const wasteroute = require('./route/wasteRoute');
const registrationRoute = require('./route/registrationRoute');
const logRoute = require('./route/logRoute');
const waterRoute = require('./route/waterRoute');
const grievanceRoute = require('./route/grievanceRoute');

app.use('/api', userroute);
app.use('/api/waste', wasteroute);
app.use('/api/registrations', registrationRoute);
app.use('/api/logs', logRoute);
app.use('/api/water', waterRoute);
app.use('/api/grievance', grievanceRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});

module.exports = app;
