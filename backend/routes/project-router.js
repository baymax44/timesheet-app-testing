const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router
    .route('/getAllProjects')
    .get(projectController.getAllProjects);

router
    .route('/getProjectsByUserId/:userId')
    .get(projectController.getProjectsByUserId);

router
    .route('/getTasksByUserId/:userId')
    .get(projectController.getTasksByUserId);

router
    .route('/addEntry')
    .put(projectController.addEntry);

router
    .route('/updateEntry')
    .post(projectController.updateEntry);

router
    .route('/deleteEntry/:entryId')
    .delete(projectController.deleteEntry);

router
    .route('/getProjectDetail')
    .post(projectController.getProjectDetail);

router
    .route('/getProjectDetailbyTime')
    .post(projectController.getProjectDetailbyTime);

router
    .route('/changeEntryStatus')
    .post(projectController.changeEntryStatus);

router
    .route('/setStatusPending')
    .post(projectController.setStatusPending);


router
    .route('/addProject')
    .put(projectController.addProject);

module.exports = router;