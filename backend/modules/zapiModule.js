const zapiId = process.env.ZAPI_ID;
const zapiToken = process.env.ZAPI_TOKEN;
const zapiClientToken = process.env.ZAPI_CLIENT_TOKEN;
const axios = require('axios');

const sendMessage = async (message, to) => {
    try {
        const response = await axios.post(
            `https://api.z-api.io/instances/${zapiId}/token/${zapiToken}/send-text`,
            {
                phone: `+${to}`,
                message: message
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'client-token':  `${zapiClientToken}`
                }
            }
        );
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const restartInstance = async () => {
    try {
        const response = await axios.get(
            `https://api.z-api.io/instances/${zapiId}/token/${zapiToken}/restart`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'client-token':  `${zapiClientToken}`
                }
            }
        );
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


module.exports = { sendMessage, restartInstance };
