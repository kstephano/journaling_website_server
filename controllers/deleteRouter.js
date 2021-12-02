const express = require('express')
const Entry = require('../models/Entry')
const deleteRouter = express.Router()


// delete entry 
deleteRouter.delete('/:id', function (req, res) {
  try{
    let entry = Entry.findById(req.params.id)
    if(entry) {
      Entry.deleteById(req.params.id)
      res.sendStatus(204)
    }
    else
      throw new Error(`${req.params.id} does not exist`)
  } catch(err) {
    res.status(404).send(err.message);
  }
})

module.exports = deleteRouter;