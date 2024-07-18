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
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
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
        return await newUser.save();
    } catch (err) {
        throw new Error(`${err.message}`);
    }
};

const updatePassword = async (userId, newPassword) => {
    if (!newPassword) {
        throw new Error('errorMsgPasswordRequired');
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('errorMsgUserNotFound');
        }
        user.password = hashedPassword;
        await user.save();
        return true;
    } catch (err) {
        throw new Error(`${err.message}`);
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

const getClientSchedules = async (client_id, startDate, endDate) => {
    startDate.setUTCHours(0, 0, 0, 0);
    if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]) {
        endDate.setUTCHours(23, 59, 59, 999);
    }
    const client_id_objectId = new mongoose.Types.ObjectId(client_id);

    const schedules = await Schedule.aggregate([
        {
            $match: {
                client_id: client_id_objectId,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $addFields: {
                serviceObjectId: {
                    $cond: {
                        if: { $and: [{ $gt: [{ $strLenCP: '$serviceId' }, 0] }, { $eq: [{ $strLenCP: '$serviceId' }, 24] }] },
                        then: { $toObjectId: '$serviceId' },
                        else: null
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'services',
                localField: 'serviceObjectId',
                foreignField: '_id',
                as: 'service'
            }
        },
        {
            $unwind: {
                path: '$service',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                userName: '$user.name',
                serviceName: { $ifNull: ['$service.serviceName', ''] }
            }
        },
        {
            $project: {
                _id: 1,
                client_id: 1,
                user_id: 1,
                dayOfWeek: 1,
                startTime: 1,
                endTime: 1,
                serviceId: 1,
                date: 1,
                createdAt: 1,
                updatedAt: 1,
                userName: 1,
                serviceName: 1
            }
        }
    ]);

    return schedules;
}

const getUserSchedules = async  (user_id, startDate, endDate) => {
    startDate.setUTCHours(0, 0, 0, 0);
    if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]) {
        endDate.setUTCHours(23, 59, 59, 999);
    }
    const user_id_objectId = new mongoose.Types.ObjectId(user_id);

    const schedules = await Schedule.aggregate([
        {
            $match: {
                user_id: user_id_objectId,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $addFields: {
                serviceObjectId: {
                    $cond: {
                        if: { $and: [{ $gt: [{ $strLenCP: '$serviceId' }, 0] }, { $eq: [{ $strLenCP: '$serviceId' }, 24] }] },
                        then: { $toObjectId: '$serviceId' },
                        else: null
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'services',
                localField: 'serviceObjectId',
                foreignField: '_id',
                as: 'service'
            }
        },
        {
            $unwind: {
                path: '$service',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                userName: '$user.name',
                serviceName: { $ifNull: ['$service.serviceName', ''] }
            }
        },
        {
            $project: {
                _id: 1,
                client_id: 1,
                user_id: 1,
                dayOfWeek: 1,
                startTime: 1,
                endTime: 1,
                serviceId: 1,
                date: 1,
                createdAt: 1,
                updatedAt: 1,
                userName: 1,
                serviceName: 1
            }
        }
    ]);

    return schedules;
}

const deleteSchedule = async (_id) => {
    try {
        const objectId = new mongoose.Types.ObjectId(_id);

        return await Schedule.deleteOne({ _id: objectId });

    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

const updateUserName = async (userId, name) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('errorMsgUserNotFound');
        }
        user.name = name;
        await user.save();
        return true;

    } catch (err) {
        throw new Error(`errorMsgSystem`);
    }
};

module.exports = {
    createUser,
    login,
    getLoggedUserInfo,
    Schedule,
    getClientSchedules,
    updatePassword,
    getUserSchedules,
    deleteSchedule,
    updateUserName
};