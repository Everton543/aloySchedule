const express = require('express');
const router = express.Router();
const { login, getLoggedUserInfo, Schedule, getClientSchedules, updatePassword, deleteSchedule, updateUserName, createUser, getUserSchedules} = require('../modules/userModule');
const { getClientById, getClientByLink, getClientWorkHour, getClientServiceList } = require('../modules/clientsModule');
const {addMinutes, getScheduleDate, formatDate, getDayOfWeekIndex} = require('../utils/timeUtils');
const {extractPhoneNumber, createMessage} = require('../utils/infoUtils');
const { sendMessage} = require('../modules/zapiModule');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'errorMsgEmailRequired'});
    }
    if (!password) {
        return res.status(400).json({ message: 'errorMsgPasswordRequired'});
    }

    try {
        const userInfo = await login(email, password, getClientById);

        req.session.user = {
            _id: userInfo._id,
            name: userInfo.name,
            client_id: userInfo.client_id,
            accountType: userInfo.acccountType,
            clientLink: userInfo.clientLink,
            email: userInfo.email,
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

router.post('/logoff', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ result: false, message: 'Failed to log off.' });
            }
            res.clearCookie('connect.sid', { path: '/' });
            return res.status(200).json({ result: true, message: 'Logged off successfully.' });
        });
    } catch (error) {
        console.error('Unexpected error during logoff:', error);
        return res.status(500).json({ result: false, message: 'Unexpected error occurred.' });
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
        let logedUserInfo = null;
        if(_id != null){
            logedUserInfo = await getLoggedUserInfo(_id);
        }
        const logedIn = (_id != null &&  _id != '');
        let dashboardOwner = false;
        if (logedUserInfo != null && client != null) {
            dashboardOwner = (logedUserInfo.client_id === client._id.toString() && logedUserInfo.acccountType === 'C');
        }
        let schedule = await getClientWorkHour(client._id);
        let services = await getClientServiceList(client._id);
        res.json({ accountType, logedIn, client, dashboardOwner, schedule, services});
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
    let { clientLink, viewType, start, end } = req.query;
    if(viewType == 'listDay'){
        end = start;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);

    try {
        let currentUserName = '';
        if (req.session && req.session.user) {
            currentUserName = req.session.user.name;
        }
        const client = await getClientByLink(clientLink);
        let schedule = [];
        let existingSchedules = await getClientSchedules(client._id, startDate, endDate);
        let workHours = await getClientWorkHour(client._id);
        const today = new Date();
        if(viewType == 'timeGridWeek'){
            workHours.forEach(workHour => {
                let currentStartTime = workHour.startTime;
                while (true) {
                    const currentEndTime = addMinutes(currentStartTime, workHour.serviceDuration);
                    if (currentEndTime > workHour.endTime) break;
    
                    const scheduleDate = getScheduleDate(workHour.dayOfWeek, currentStartTime, start, end);
                    if (scheduleDate >= startDate && scheduleDate <= endDate) {
                        let isVacant = true;
                        if(scheduleDate < today){
                            isVacant = false;
                        }
                        
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
                            date: scheduleDate.toISOString().split('T')[0],
                            availability: isVacant ? 'vacant' : 'not vacant'
                        });
                    } 
    
                    currentStartTime = currentEndTime;
                }
            });
        } else if(viewType =='listDay'){
            workHours.forEach(workHour => {
                let currentStartTime = workHour.startTime;
                while (true) {
                    const currentEndTime = addMinutes(currentStartTime, workHour.serviceDuration);
                    if (currentEndTime > workHour.endTime) break;
            
                    const scheduleDate = new Date(startDate);
                    if (scheduleDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase() !== workHour.dayOfWeek) {
                        currentStartTime = currentEndTime;
                        continue;
                    }
            
                    let isVacant = true;
                    if (scheduleDate < today) {
                        isVacant = false;
                    }
            
                    existingSchedules.forEach(existingSchedule => {
                        const existingScheduleDate = new Date(existingSchedule.date);
                        const existingScheduleStartTime = existingSchedule.startTime;
                        const existingScheduleEndTime = addMinutes(existingScheduleStartTime, workHour.serviceDuration);
            
                        if (
                            scheduleDate.toISOString().split('T')[0] === existingScheduleDate.toISOString().split('T')[0] &&
                            (
                                (currentStartTime >= existingScheduleStartTime && currentStartTime < existingScheduleEndTime) ||
                                (currentEndTime > existingScheduleStartTime && currentEndTime <= existingScheduleEndTime) ||
                                (currentStartTime <= existingScheduleStartTime && currentEndTime >= existingScheduleEndTime)
                            )
                        ) {
                            isVacant = false;
                        }
                    });
            
                    schedule.push({
                        dayOfWeek: workHour.dayOfWeek,
                        startTime: currentStartTime,
                        endTime: currentEndTime,
                        client_id: workHour.client_id,
                        date: scheduleDate.toISOString().split('T')[0],
                        availability: isVacant ? 'vacant' : 'not vacant'
                    });
            
                    currentStartTime = currentEndTime;
                }
            });
        } else if(viewType =='dayGridMonth'){
            existingSchedules.forEach(existingSchedule => {
                schedule.push({
                    dayOfWeek: existingSchedule.dayOfWeek,
                    startTime: existingSchedule.startTime,
                    endTime: existingSchedule.endTime,
                    client_id: existingSchedule.client_id,
                    date: existingSchedule.date.toISOString().split('T')[0],
                    availability: 'not vacant'
                });
            });
        }
        res.json({schedule, currentUserName});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/add-schedule', async (req, res) => {
    const { clientLink, dayOfWeek, startTime, endTime, serviceId, date, name, phone, selectedService, email, password } = req.body;
    let user_id = '';
    if(req.session && req.session.user){
        user_id = req.session.user._id;
    }
    try {
        const client = await getClientByLink(clientLink);
        if(user_id === ''){
            const userInfo = await createUser(email, password, name, client._id, 'U');
            user_id = userInfo._id;
            req.session.user = {
                _id: userInfo._id,
                name: userInfo.name,
                client_id: userInfo.client_id,
                accountType: userInfo.acccountType,
                clientLink: clientLink,
                email: userInfo.email,
            };
        }
        const newSchedule = new Schedule({
            client_id : client._id,
            user_id,
            dayOfWeek,
            startTime,
            endTime,
            serviceId,
            date,
            name,
            phone,
            selectedService
        });
        const userMessageVariables = {
            CLIENT_NAME: client.clientName,
            DATE: formatDate(date, req.t('dateStyle')),
            HOUR: startTime,
            ADDRESS: ''
        };
        const clientMessageVariables = {
            USER_NAME: name,
            DATE: formatDate(date, req.t('dateStyle')),
            HOUR: startTime,
            PHONE: phone
        };
        if(client.address){
            userMessageVariables.ADDRESS = `In the address: ${client.address}`;
        }
        let userTemplate = req.t('messageUserAppointmentMarkedTemplate');
        let clientTemplate = req.t('messageClientAppointmentMarkedTemplate');
        let userMessage = createMessage(userTemplate, userMessageVariables);
        let clientMessage = createMessage(clientTemplate, clientMessageVariables);
        const userSentToPhone = extractPhoneNumber(phone);
        const clientSentToPhone = extractPhoneNumber(client.phone);
        sendMessage(userMessage, userSentToPhone);
        sendMessage(clientMessage, clientSentToPhone);
        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/edit-user', async (req, res) => {
    const { password, user_id, name} = req.body;
    try {
        let resultado = false;
        if(password != ''){
            resultado = await updatePassword(user_id, password);
        }
        if(name != ''){
            resultado = await updateUserName(user_id, name);
            req.session.user.name = name;
        }
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/delete-schedule', async (req, res) => {
    let client_id = '';
    let accountType = '';
    let user_id = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
        user_id = req.session.user._id;
    }
    const { _id } = req.body;
    const schedule = await Schedule.findById(_id);
    
    if ((accountType === 'C' && client_id != schedule.client_id) ||  (accountType !== 'C' && user_id != schedule.user_id)) {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    try{
        const result =  await deleteSchedule(_id);
        req.session.alert = 'alertScheduleDeleteSuccessfully';
        res.status(200).json({ "success": result });
    }catch(err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.get('/get-schedule-list', async (req, res) => {
    let { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    try {
        let client_id = '';
        let accountType = '';
        let user_id = '';
        let schedules = [];
        if (req.session && req.session.user) {
            client_id = req.session.user.client_id;
            accountType = req.session.user.accountType;
            user_id = req.session.user._id;
        }
        if(accountType == 'C'){
            schedules = await getClientSchedules(client_id, startDate, endDate);
        }else{
            schedules = await getUserSchedules(user_id, startDate, endDate);
        }
        schedules = schedules.map(schedule => ({
            ...schedule,
            date: formatDate(schedule.date.toISOString().split('T')[0], req.t('dateStyle')),
        }));
      
        res.json(schedules);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;