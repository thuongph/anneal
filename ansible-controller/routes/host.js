const express = require('express');
const bodyParser = require('body-parser');

const Host = require('../models/host');

var host_router = express.Router();

host_router.use(bodyParser.json());

host_router.route('/')
    .get((req, res, next) => {
        Host.find({})
            .then((hosts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hosts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Host.create(req.body)
            .then((host) => {
                console.log('Host Created', host);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(host);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        // console.log(req.body)
        // Host.updateMany({
        //     name: {
        //         $in: req.body.hosts
        //     }
        // }, {
        //     $set: {  inventory: req.body.inventoryId }
        // })
        // .then((hosts) => {
        //     res.statusCode = 200;
        //     res.setHeader('Content-Type', 'application/json');
        //     console.log({hosts})
        //     res.json(hosts);
        // }, (err) => next(err))
        // .catch((err) => next(err));
        res.statusCode = 2403;
        res.setHeader('Content-Type', 'application/json');
    })
    .delete((req, res, next) => {
        Host.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

host_router.route('/:hostId')
    .get((req, res, next) => {
        Host.findById(req.params.hostId)
            .then((host) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(host);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported');
    })
    .put((req, res, next) => {
        Host.findByIdAndUpdate(req.params.hostId, {
            $set: req.body
        }, { new: true })
            .then((host) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(host);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Host.findByIdAndRemove(req.params.hostId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

host_router.route('/:hostId')

module.exports = host_router;