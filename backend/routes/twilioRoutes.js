const express = require('express');
const router = express.Router();
const { sendMessage } = require('../modules/twilioModule');

router.post('/sendWhatsApp', (req, res) => {
    sendMessage(req.body)
        .then(message => res.send(message))
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to send message');
        });
});

module.exports = router;