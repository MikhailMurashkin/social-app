const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


mongoose.connect("mongodb+srv://michaelismur:iND7HQhat01Qtwbp@horsehelper.g1dwcs9.mongodb.net/" || process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});