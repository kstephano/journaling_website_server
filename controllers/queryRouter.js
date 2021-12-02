const express = require('express')
const Entry = require('../models/entry')
const queryRouter = express.Router()

// get all entries
queryRouter.get('/all', function (req, res) {
  try{
    res.status(200).json({ entries: Entry.all })
  } catch(err) {
    res.status(404).send(err.message);
  }
})

// get entries by page
queryRouter.get('/page/:num', function (req, res) {
  try{
    res.status(200).json(Entry.getEntriesByPageNumber(req.params.num))
  } catch(err) {
    res.status(404).send(err.message);
  }
})

// search by id
queryRouter.get('/:id', function (req, res) {
  try{
    let entry = Entry.findById(req.params.id)
    if(entry)
      res.status(200).json({ entry: entry })
    else
      throw new Error("Entry not found")
  } catch(err) {
    res.status(404).send(err.message)
  }
})

module.exports = queryRouter;