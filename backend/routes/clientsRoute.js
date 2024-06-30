const express = require('express');
const router = express.Router();
const { getClients, isClientLinkUnique, createClient, getClientById, createSchedule, getClientSchedule, getClientByLink} = require('../modules/clientsModule');

router.get('/', async (req, res) => {
    try {
        const clients = await getClients();
        res.json(clients);
    } catch (err) {
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
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
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
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
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
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
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
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


module.exports = router;