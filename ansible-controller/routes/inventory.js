const express = require('express');
const bodyParser = require('body-parser');

const Inventory = require('../models/inventory');

const inventory_router = express.Router();

inventory_router.use(bodyParser.json());

inventory_router.route('/')
    .get((req, res, next) => {
        Inventory.find({})
            .then((inventories) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(inventories);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Inventory.create(req.body)
            .then((inventory) => {
                console.log('Host Created', host);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(inventory);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported');
    })
    .delete((req, res, next) => {
        Inventory.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

inventory_router.route('/:inventoryId')
    .get((req, res, next) => {
        Inventory.findById(req.params.inventoryId)
            .then((inventory) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(inventory);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported');
    })
    .put((req, res, next) => {
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
    .delete((req, res, next) => {
        Inventory.findByIdAndRemove(req.params.inventoryId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });