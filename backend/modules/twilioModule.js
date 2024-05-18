const whatsAppFrom = process.env.WHATS_APP_FROM;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendMessage = async (message, to) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: `whatsapp:${whatsAppFrom}`, 
            to: `whatsapp:+${to}`
        });
        console.log(response);
        return response.sid;
    } catch (error) {
        throw new Error(`Failed to send message: ${error.message}`);
    }
};

module.exports = { sendMessage };
