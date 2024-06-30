const express = require('express');
const router = express.Router();
const { login, getLoggedUserInfo} = require('../modules/userModule');
const { getClientById, getClientByLink, getClientSchedule } = require('../modules/clientsModule');
const { t } = require('i18next');

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
        let schedule = await getClientSchedule(client._id);
        res.json({ accountType, logedIn, client, dashboardOwner, logedUserInfo, schedule});
    } catch (err) {
        if(err.message){
            res.status(500).json({ message: err.message });
        }else{
            res.status(500).json({ message: err});
        }
    }
});

module.exports = router;