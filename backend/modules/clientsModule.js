const mongoose = require('mongoose');
const { createUser } = require('./userModule');

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
    },
    clientLink: {
        type: String,
        required: true,
    },
});

const scheduleSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
    dayOfWeek: { type: String, required: true, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: { type: String, required: true }, // Store time in HH:mm format
    endTime: { type: String, required: true }, // Store time in HH:mm format
    serviceDuration: { type: Number, required: true, min: 10 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

scheduleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


const Client = mongoose.model('Client', clientSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

const getClients = async () => {
    try {
        const clients = await Client.find({});
        return clients;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const getClientById = async (id) => {
    try {
        const objectId = new mongoose.Types.ObjectId(id);
        const client = await Client.findById(objectId);
        return client;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const isClientLinkUnique = async (clientLink) => {
    clientLink = `.${clientLink}`;
    try {
        const client = await Client.findOne({ clientLink });
        return client === null;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const getClientByLink = async (clientLink) => {
    try {
        const client = await Client.findOne({ clientLink });
        return client;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const createClient = async (clientLink, email, password, name) => {
    try {
        const newClient = new Client({ clientLink, clientName : "" });
        const savedClient = await newClient.save();
        const client_id = savedClient._id;
        const acccountType = 'C';
        return await createUser(email, password, name, client_id, acccountType);
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const createSchedule = async (client_id, schedules) => {
    try {
        const newSchedules = schedules.map(schedule => ({
            client_id: new mongoose.Types.ObjectId(client_id),
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            serviceDuration: schedule.serviceDuration
        }));

        const createdSchedules = await Schedule.insertMany(newSchedules);
        return createdSchedules;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const getClientSchedule = async (client_id) => {
    try {
        const schedules = await Schedule.find({ client_id: client_id });
        return schedules;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const getWorkHourById = async (id) => {
    try {
        const objectId = new mongoose.Types.ObjectId(id);
        const schedule = await Schedule.findById(objectId);
        return schedule;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const getClientWorkHours = async (client_id, dayOfWeek) => {
    try {
        const schedules = await Schedule.find({ client_id: client_id, dayOfWeek: dayOfWeek });
        return schedules;
    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const updateWorkHour = async (_id, schedule) => {
    try {
        const objectId = new mongoose.Types.ObjectId(_id);

        return await Schedule.updateOne({ _id: objectId }, { $set: schedule });

    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const deleteWorkHour = async (_id) => {
    try {
        const objectId = new mongoose.Types.ObjectId(_id);

        return await Schedule.deleteOne({ _id: objectId });

    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

module.exports = {
    getClients,
    isClientLinkUnique,
    createClient,
    getClientById,
    getClientByLink,
    createSchedule,
    getClientSchedule,
    getWorkHourById,
    getClientWorkHours,
    updateWorkHour,
    deleteWorkHour
};