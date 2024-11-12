const {  startMining, registerUser, getMiningStatus } = require('../controllers/mining_controller');
const express = require('express');
const miningRouter = express.Router();

miningRouter.post('/register', registerUser);
miningRouter.post('/start-mining/:id', startMining);
miningRouter.get('/mining-status/:id', getMiningStatus);

module.exports = miningRouter;
