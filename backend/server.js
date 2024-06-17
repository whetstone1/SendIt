const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const campaigns = require('./routes/campaigns');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/tilt-redux', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/campaigns', campaigns);
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
