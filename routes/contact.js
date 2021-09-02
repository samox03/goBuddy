const router = require("express").Router();
const mongoose = require('mongoose');

const User = require("../models/User.model");
const Message = require("../models/Message.model");



//GET /tiger details
//if buddy clicks on tiger preview (in auth/buddyView)  he gets redirected here to show the whole selfdescription of the tiger.
//here he can click on a button to message this tiger or go back to collection.

router.get('/tigerslist/:id', (req, res, next) => {
  const { id } = req.params;
  user.findById(id)
      .then(tigersDetails => {
          res.render('interaction/showTigerDetails',  tigersDetails)
      })
      .catch(error => console.log(`Error while updating the celeb details: ${error}`))
})

//message to tiger
//TODO:implememting the messaging stuff!! :)
//
router.get('/tigerslist/:id/message', (req, res, next) => {
  const {id} = req.params;
  user.findById(id)
  .then(tigerContact => {
    res.render('interaction/mess2tiger', tigerContact)
  })
  .catch(error => console.log(`Couldnt reach tiger contact: ${error}`))
})


//message to buddy
//TODO:setting up setting tiger inbox and tiger replying to buddy.


module.exports = router;