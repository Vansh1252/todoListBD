const express = require('express');
const router = express.Router();
const save = require('../controllers/tasks/save');
const deleted = require('../controllers/tasks/delete');
const status = require('../controllers/tasks/status');
const search = require('../controllers/tasks/getone');
const edit = require('../controllers/tasks/edit');


router.post('/save', save);
router.get('/', search);
router.post('/completed', status.statuschangetocompleted);
router.post('/cancelled', status.statuschangetocancelled);
router.post('/edit', edit);
router.post('/deleted', deleted);


module.exports = router;
