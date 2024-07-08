const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    client_id: String,
    acccountType: String
});

const User = mongoose.model('User', userSchema);

const scheduleSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
    dayOfWeek: { type: String, required: true, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: { type: String, required: true, validate: {
        validator: function(v) {
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} is not a valid time!`
    }},
    endTime: { type: String, required: true, validate: {
        validator: function(v) {
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} is not a valid time!`
    }},
    serviceId: { type: String, required: false},
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'schedules' });

scheduleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

const createUser = async (email, password, name, client_id, acccountType) => {
    if (!password) {
        throw new Error('Password is required');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, client_id, acccountType });
        await newUser.save();
        return true; 
    } catch (err) {
        throw new Error(`Unable to save user: ${err.message}`);
    }
};

const login = async (email, password, getClientById) => {
    if (!password) {
        throw new Error('errorMsgPasswordRequired');
    }
    if (!email) {
        throw new Error('errorMsgEmailRequired');
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            throw new Error('errorUserNotFound');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('errorMsgInvalidPassword');
        }

        const client = await getClientById(user.client_id);
        if (client) {
            user.clientLink = client.clientLink;
        }

        return user;
    } catch (err) {
        throw new Error(`${err.message}`);
    }
};

const getLoggedUserInfo = async (user_id) => {
    const user_objectId = new mongoose.Types.ObjectId(user_id);
    try {
        let user = await User.findById(user_objectId);
        if (!user) {
            throw new Error('errorUserNotFound');
        }
        return user;
    } catch (err) {
        throw new Error(`${err.message}`);
    }

}

const getClientSchedules = async  (client_id, startDate, endDate) => {
    return await Schedule.find({
        client_id: client_id,
        date: { $gte: startDate, $lte: endDate }
    });
}

module.exports = {
    createUser,
    login,
    getLoggedUserInfo,
    Schedule,
    getClientSchedules
};