const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./authenticate');
const Inventory = require('../models/inventory');
const Host = require('../models/host');
const Project = require('../models/project');

var inventory_router = express.Router();

inventory_router.use(bodyParser.json());

const getHostsByInventories = async (inventories) => {
    var result = [];
    for (const inventory of inventories) {
        const hosts = await Host.find({_id: {
            $in: inventory.hosts
        }});
        result.push({_id: inventory._id, name: inventory.name , hosts: hosts});
    }
    return result;
}

inventory_router.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Inventory.find({})
            .then(async (inventories) => {
                if (!inventories.length) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                } else {
                    const result = await getHostsByInventories(inventories);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(result);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Inventory.create(req.body)
            .then((inventory) => {
                console.log('inventory created', inventory);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(inventory);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Inventory.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

inventory_router.route('/:inventoryId')
    .get(authenticate.verifyUser, (req, res, next) => {
        Inventory.findById(req.params.inventoryId)
            .then((inventory) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(inventory);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported');
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Inventory.findByIdAndUpdate(req.params.inventoryId, {
            $set: req.body
        }, { new: true })
            .then((inventory) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(inventory);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Inventory.findByIdAndRemove(req.params.inventoryId)
            .then((resp) => {
                Project.updateMany({inventory: resp._id}, { $set: { "active" : false }}, )
                    .then((projects) => {
                        console.log('---------------------------- impacted projects', projects);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }, err => next(err))
                    .catch((err) => {console.log('----------------------- delete inventory error', err)})
            }, (err) => next(err))
            .catch((err) => next(err));
    });

inventory_router.route('/:inventoryId/hosts')
    .get(authenticate.verifyUser, (req, res, next) => {
        Host.find({ inventory: req.params.inventoryId})
            .then((hosts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hosts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = inventory_router;