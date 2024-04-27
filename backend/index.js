require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const path = require('path');
app.use(express.static(path.join(__dirname, '../build')));


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

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
