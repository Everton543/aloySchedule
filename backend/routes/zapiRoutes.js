const express = require('express');
const router = express.Router();
const { sendMessage, restartInstance} = require('../modules/zapiModule');

router.post('/sendWhatsApp', async (req, res) => {
    const { message, to } = req.body;
    try {
        const messageId = await sendMessage(message, to);
        res.status(200).json({ message: 'Message sent successfully', messageId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/restartInstance', async (req, res) => {
    try {
        const result = await restartInstance();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;