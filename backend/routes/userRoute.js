const express = require('express');
const router = express.Router();
const { login, getLoggedUserInfo, Schedule, getClientSchedules} = require('../modules/userModule');
const { getClientById, getClientByLink, getClientWorkHour, getClientServiceList } = require('../modules/clientsModule');
const { t } = require('i18next');
const {addMinutes, getScheduleDate} = require('../utils/timeUtils')

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: t('errorMsgEmailRequired') });
    }
    if (!password) {
        return res.status(400).json({ message: t('errorMsgPasswordRequired') });
    }

    try {
        const userInfo = await login(email, password, getClientById);

        req.session.user = {
            _id: userInfo._id,
            name: userInfo.name,
            client_id: userInfo.client_id,
            accountType: userInfo.acccountType,
            clientLink: userInfo.clientLink,
        };
        let returnPage = `/${userInfo.clientLink}`;
        res.json({ "returnPage": returnPage });
    } catch (err) {
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
    }
});

router.get('/take-client-schedule', async (req, res) => {
    let _id = null;
    let accountType = null;
    if(req.session && req.session.user){
        _id = req.session.user._id;
        accountType = req.session.user.accountType;
    }
    const { clientLink } = req.query;

    try {
        const client = await getClientByLink(clientLink);
        let loogedUserInfo = null;
        if(_id != null){
            logedUserInfo = await getLoggedUserInfo(_id);
        }
        const logedIn = (_id != null &&  _id != '');
        let dashboardOwner = false;
        if(logedUserInfo != null && client != null){
            dashboardOwner = (logedUserInfo.client_id == client._id && accountType == 'C');
        }
        let schedule = await getClientWorkHour(client._id);
        let services = await getClientServiceList(client._id);
        res.json({ accountType, logedIn, client, dashboardOwner, logedUserInfo, schedule, services});
    } catch (err) {
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
    }
});

router.get('/get-logged-user-info', async (req, res) => {
    if (!req.session.user) {
        return res.status(500).json({ message: 'errorMsgLogin' });
    } else {
        let result = { ...req.session.user };

        if (req.session.alert) {
            result.alert = req.session.alert;
            req.session.alert = null;
            res.json(result);
        } else {
            req.session.alert = null;
            req.session.user.alert = null;
            res.json(result);
        }
    }
});

router.get('/get-schedule', async (req, res) => {
    const { clientLink, viewType, start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    try {
        const client = await getClientByLink(clientLink);
        let schedule = [];
        let workHours = await getClientWorkHour(client._id);
        let existingSchedules = await getClientSchedules(client._id, startDate, endDate);

        workHours.forEach(workHour => {
            let currentStartTime = workHour.startTime;

            while (true) {
                const currentEndTime = addMinutes(currentStartTime, workHour.serviceDuration);

                if (currentEndTime > workHour.endTime) break;

                const scheduleDate = getScheduleDate(workHour.dayOfWeek, currentStartTime);

                if (scheduleDate >= startDate && scheduleDate <= endDate) {
                    let isVacant = true;
                    
                    existingSchedules.forEach(existingSchedule => {
                        const existingScheduleDate = new Date(existingSchedule.date);
                        const existingScheduleStartTime = existingSchedule.startTime;
                        const existingScheduleEndTime = addMinutes(existingScheduleStartTime, workHour.serviceDuration);

                        if (
                            scheduleDate.toISOString().split('T')[0] === existingScheduleDate.toISOString().split('T')[0] &&
                            ((currentStartTime >= existingScheduleStartTime && currentStartTime < existingScheduleEndTime) ||
                             (currentEndTime > existingScheduleStartTime && currentEndTime <= existingScheduleEndTime) ||
                             (currentStartTime <= existingScheduleStartTime && currentEndTime >= existingScheduleEndTime))
                        ) {
                            isVacant = false;
                        }
                    });

                    schedule.push({
                        dayOfWeek: workHour.dayOfWeek,
                        startTime: currentStartTime,
                        endTime: currentEndTime,
                        client_id: workHour.client_id,
                        date: scheduleDate.toISOString().split('T')[0], // Add date to workHour
                        availability: isVacant ? 'vacant' : 'not vacant'
                    });
                }

                currentStartTime = currentEndTime;
            }
        });

        res.json(schedule);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/add-schedule', async (req, res) => {
    const { clientLink, dayOfWeek, startTime, endTime, serviceId, date, name, phone, selectedService } = req.body;
    const client = await getClientByLink(clientLink);
    console.log(client);

    const newSchedule = new Schedule({
        client_id : client._id,
        dayOfWeek,
        startTime,
        endTime,
        serviceId,
        date,
        name,
        phone,
        selectedService
    });

    try {
        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
module.exports = router;