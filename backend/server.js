require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());
app.use(cors()); // allow all origins

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const photoRoutes = require('./routes/photoRoutes');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/photos', photoRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
