const express = require('express');
const router = express.Router();
const { getClients } = require('../modules/clientsModule');

router.get('/', async (req, res) => {
  try {
    const clients = await getClients();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;