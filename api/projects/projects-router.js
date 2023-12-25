const express = require('express');
const Project = require('./projects-model');

const {
    validateProjectId,
    validateProject,

} = require('./projects-middleware')

const router = express.Router();

router.get('/', (req, res, next) => {
    Project.get()
        .then(projects => {
            res.json(projects);
        })
        .catch(next);
});

router.get('/:id/', validateProjectId, async (req, res, next) => {
    try {
        res.json(req.project)
    } catch (err) {
        next(err)
    }
});

router.post('/', validateProject, (req, res, next) => {
    Project.insert(req.body)
        .then(newProject => {
            res.status(201).json(newProject)
        })
        .catch(next)
});

router.put('/:id/', validateProjectId, validateProject, (req, res, next) => {
    Project.update(req.params.id, req.body)
        .then(updatedProject => {
            res.json(updatedProject)
        })
        .catch(next)
});

router.delete('/:id/', validateProjectId, async (req, res, next) => {
    try {
        const result = await Project.remove(req.params.id)
        res.json(result)
    } catch (err) {
        next(err)
    }
});

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
        const result = await Project.getProjectActions(req.params.id)
        res.json(result)
    } catch (err) {
        next(err)
    }
});

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something went wrong in projects-router',
        message: err.message,
        stack: err.stack,
    });
});

module.exports = router;
