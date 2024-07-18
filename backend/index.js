require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
// const twilioRoutes = require('./routes/twilioRoutes');
const zapiRoutes = require('./routes/zapiRoutes');
const clientsRoute = require('./routes/clientsRoute');
const userRoute = require('./routes/userRoute');
const i18n = require('./i18n'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(i18n.middleware.handle(i18n));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

// Routes
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: process.env.COOKIE_SECURE === 'true' }
}));
// app.use('/api/twilio', twilioRoutes);
app.use('/api/zapi', zapiRoutes);
app.use('/ajax/clients', clientsRoute);
app.use('/ajax/user', userRoute);

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
