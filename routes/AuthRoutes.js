const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);
router.get('/register', AuthController.register);
router.post('/register', AuthController.createUser);
router.get('/logout', AuthController.logoutUser);


module.exports = router;