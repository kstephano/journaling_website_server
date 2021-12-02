const express = require('express')
const Entry= require('../models/Entry')
const updateRouter = express.Router()

// create new entry
updateRouter.post('/create', function (req, res) {
  try{
    Entry.create(req.body)
    res.sendStatus(201)
  } catch(err) {
    res.status(404).send(err.message);
  }
})

// add comment
updateRouter.post('/comments/:id', function(req, res) {
  try{
      Entry.addCommment(req.params.id, req.body)
      res.sendStatus(201)
  } catch(err) {
    res.status(404).send(err.message);
  }
})

// add emojis in batch
updateRouter.post('/emojis', function(req, res) {
  try{
      Entry.addEmojis(req.body.emojis)
      res.sendStatus(201)
  } catch(err) {
    res.status(404).send(err.message);
  }
})

module.exports = updateRouter;