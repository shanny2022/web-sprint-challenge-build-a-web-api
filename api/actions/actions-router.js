const express = require('express');
const Action = require('./actions-model')

const {
    validateActionId,
    validateAction,
} = require('./actions-middlware')

const router = express.Router();

router.get('/', (req, res, next) => {
    Action.get()
        .then(actions => {
            res.json(actions);
        })
        .catch(next);
});

// router.get('/', async (req, res, next) => {
//     try {
//         const actions = await Action.get();
//         res.status(200).json(actions);
//         console.log(actions)
//     } catch (error) {
//         next(error);
//     }
// });

router.get('/:id', validateActionId, async (req, res, next) => {
    try {
        res.json(req.action)
    } catch (err) {
        next(err)
    }
})

router.post('/', validateAction, (req, res, next) => {
    Action.insert(req.body)
    .then(newAction => {
        res.status(201).json(newAction)
    })
    .catch(next)
})

router.put('/:id', validateActionId, validateAction, (req, res, next) => {
    Action.update(req.params.id, req.body)
    .then(updatedAction => {
        res.json(updatedAction)
    })
    .catch(next)
})

router.delete('/:id', validateActionId, async (req, res, next) => {
    try{
        const result = await Action.remove(req.params.id)
        res.json(result)
    } catch(err) {
        next(err)
    }
})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something went wrong in actions-router',
        message: err.message,
        stack: err.stack,
    });
});

module.exports = router;
