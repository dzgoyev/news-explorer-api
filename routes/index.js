const router = require('express').Router();
const { validateUser, validateLogin } = require('../middlewares/validator');

const { login, createUser } = require('../controllers/user');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);

module.exports = router;
