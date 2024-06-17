const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require('./routes/auth');
const campaign = require('./routes/campaigns');
const app = express();

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/auth', auth);
app.use('/api/campaigns', campaign);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
