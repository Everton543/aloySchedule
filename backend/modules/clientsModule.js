const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    clientIdentification: {
        type: String,
        required: true,
    },
});

const Client = mongoose.model('Client', clientSchema);

const getClients = async () => {
    try {
        const clients = await Client.find({});
        return clients;
    } catch (err) {
        throw new Error(`Unable to retrieve clients: ${err.message}`);
    }
};

module.exports = {
    getClients
};