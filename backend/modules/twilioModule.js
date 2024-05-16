const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsAppFrom = process.env.WHATS_APP_FROM;
const client = new twilio(accountSid, authToken);

const sendMessage = async ({ message, to }) => {
    return await client.messages.create({
        body: message,
        from: `whatsapp:${whatsAppFrom}`, 
        to: `whatsapp:+${to}`
    });
};

module.exports = { sendMessage };
