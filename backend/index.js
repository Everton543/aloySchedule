require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const twilioRoutes = require('./routes/twilioRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

// Routes
app.use('/api/twilio', twilioRoutes);

// Serve React App
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'), {
        headers: {
        'Cache-Control': 'no-cache'
        }
    });
});
  
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
