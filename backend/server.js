require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors()); // allow all origins

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
