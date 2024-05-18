const express = require('express');
const router = express.Router();
const { sendMessage } = require('../modules/twilioModule');

router.post('/sendWhatsApp', async (req, res) => {
    const { message, to } = req.body;
    try {
        const messageId = await sendMessage(message, to);
        res.status(200).json({ message: 'Message sent successfully', messageId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;