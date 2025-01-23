const express = require('express');
const router = express.Router();
const save = require('../controllers/users/save');
const login =require('../controllers/users/login');
const deleted =require('../controllers/users/delete');

router.post('/register',save.registeruser);
router.get('/verfiy',save.verifyEmail);
router.post('/login',login);
router.post('/delete',deleted);

module.exports = router;
