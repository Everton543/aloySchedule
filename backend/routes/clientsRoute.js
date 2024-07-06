const express = require('express');
const router = express.Router();
const { getClients, isClientLinkUnique, createClient, getClientById, createSchedule, getClientSchedule, getClientByLink, getWorkHourById, getClientWorkHours, updateWorkHour, deleteWorkHour, createService, getClientServiceList, checkServiceUniqueness, updateService, deleteService, getServiceById} = require('../modules/clientsModule');

router.get('/', async (req, res) => {
    try {
        const clients = await getClients();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.get('/client/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        const client = await getClientById(clientId);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.get('/check-link', async (req, res) => {
    const clientLink = req.query.clientLink;

    if (!clientLink) {
        return res.status(400).json({ message: 'clientLink query parameter is required' });
    }

    try {
        const isUnique = await isClientLinkUnique(clientLink);
        if (isUnique) {
            req.session.clientLink = '.' + clientLink;
        }
        res.json({ isUnique });
    } catch (err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.post('/create-account', async (req, res) => {
    const clientLink = req.session.clientLink;
    const { email, password, name } = req.body;
    try {
        const client = await createClient(clientLink, email, password, name);
        let returnPage = `/${clientLink}`;
        res.json({ created: client, returnPage });
    } catch (err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.post('/save-schedule', async (req, res) => {
    let client_id = '';
    let accountType = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!client_id) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }

    const { schedules } = req.body;

    try {
        const newSchedules = schedules.map(schedule => ({
            client_id,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            serviceDuration: schedule.serviceDuration
        }));

        const createdSchedules = await createSchedule(client_id, newSchedules);
        res.status(201).json(createdSchedules);
    } catch (err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.post('/save-service', async (req, res) => {
    let client_id = '';
    let accountType = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!client_id) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }

    const { serviceName, servicePrice } = req.body;
    try {
        const isServiceUnique = await checkServiceUniqueness('', client_id, serviceName);
        if (!isServiceUnique) {
            return res.status(500).json({ message: 'errorMsgServiceMustBeUnique' });
        }

        const createdService = await createService(client_id, serviceName, servicePrice);
        res.status(201).json(createdService);
    } catch (err) {
        res.status(500).json({ message: (err.message) ? err.message : 'errorMsgSystem' });
    }
});

router.get('/get-schedule', async (req, res) => {
    const { clientLink } = req.query;
    
    try {
        const client = await getClientByLink(clientLink);
        let schedules = await getClientSchedule(client._id);
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/get-work-hours', async (req, res) => {
    const { clientLink } = req.query;
    try {
        const client = await getClientByLink(clientLink);
        let schedules = await getClientSchedule(client._id);
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/get-services-list', async (req, res) => {
    let client_id = '';
    let accountType = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!client_id) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }
    try {
        let services = await getClientServiceList(client_id);
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/get-work-hour-by-id', async (req, res) => {
    const { _id } = req.query;
    try {
        let schedules = await getWorkHourById(_id);
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/get-service-by-id', async (req, res) => {
    const { _id } = req.query;
    try {
        let schedules = await getServiceById(_id);
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit-work-hour', async (req, res) => {
    let clientId = '';
    let accountType = '';
    if (req.session && req.session.user) {
        clientId = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!clientId) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }
    const { schedule, _id } = req.body;
    try {
        let doesHaveScheduleOnThisDay = await getClientWorkHours(clientId, schedule.dayOfWeek);
        
        for (const existingSchedule of doesHaveScheduleOnThisDay) {
            if (existingSchedule._id.toString() !== _id) {
                const existingStartTime = new Date(`1970-01-01T${existingSchedule.startTime}:00`);
                const existingEndTime = new Date(`1970-01-01T${existingSchedule.endTime}:00`);
                const newStartTime = new Date(`1970-01-01T${schedule.startTime}:00`);
                const newEndTime = new Date(`1970-01-01T${schedule.endTime}:00`);

                if ((newStartTime < existingEndTime && newEndTime > existingStartTime)) {
                    if (newStartTime >= existingStartTime && newEndTime <= existingEndTime) {
                        res.status(500).json({ message: 'errorMsgConflictOnWorkHours' });
                        return;
                    }

                    if (newStartTime < existingStartTime) {
                        await createSchedule(clientId, [{
                            client_id: clientId,
                            dayOfWeek: schedule.dayOfWeek,
                            startTime: schedule.startTime,
                            endTime: existingSchedule.startTime,
                            serviceDuration: schedule.serviceDuration
                        }]);
                    }

                    if (newEndTime > existingEndTime) {
                        await createSchedule(clientId, [{
                            client_id: clientId,
                            dayOfWeek: schedule.dayOfWeek,
                            startTime: existingSchedule.endTime,
                            endTime: schedule.endTime,
                            serviceDuration: schedule.serviceDuration
                        }]);
                    }

                    req.session.alert = 'alertNewWorkHourCreatedBecauseOfConflicts';
                    res.status(200).json({ "success": true });
                    return;
                }
            }
        }

        const result = await updateWorkHour(_id, schedule);
        req.session.alert = 'alertWorkHourUpdatedSuccessfully';
        res.status(200).json({ "success": result });
    } catch (err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.post('/edit-service', async (req, res) => {
    let client_id = '';
    let accountType = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!client_id) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }

    const { serviceName, servicePrice, _id } = req.body;
    try {
        const isServiceUnique = await checkServiceUniqueness(_id, client_id, serviceName);
        if (!isServiceUnique) {
            return res.status(500).json({ message: 'errorMsgServiceMustBeUnique' });
        }

        const service = {
            serviceName,
            servicePrice
        };
        const createdSchedules = await updateService(_id, service);
        req.session.alert = 'alertServiceUpdatedSuccessfully';

        res.status(201).json(createdSchedules);
    } catch (err) {
        res.status(500).json({ message: (err.message) ? err.message : 'errorMsgSystem' });
    }
});

router.post('/delete-work-hour', async (req, res) => {
    let client_id = '';
    let accountType = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!client_id) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }
    const { _id } = req.body;
    try{
        const result = await deleteWorkHour(_id);
        req.session.alert = 'alertWorkHourDeleteSuccessfully';
        res.status(200).json({ "success": result });
    }catch(err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});

router.post('/delete-service', async (req, res) => {
    let client_id = '';
    let accountType = '';
    if (req.session && req.session.user) {
        client_id = req.session.user.client_id;
        accountType = req.session.user.accountType;
    }
    
    if (accountType !== 'C') {
        return res.status(403).json({ message: 'errorMsgPermission' });
    }

    if (!client_id) {
        return res.status(401).json({ message: 'errorMsgLogin' });
    }
    const { _id } = req.body;
    try{
        const result = await deleteService(_id);
        req.session.alert = 'alertServiceDeleteSuccessfully';
        res.status(200).json({ "success": result });
    }catch(err) {
        res.status(500).json({ message: err.message || 'errorMsgSystem' });
    }
});
module.exports = router;