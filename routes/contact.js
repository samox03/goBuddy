const router = require("express").Router();
const mongoose = require('mongoose');

const User = require("../models/User.model");
const Message = require("../models/Message.model");
// const { create } = require("../models/User.model");


////B U D D Y ___ V I E W //////

//GET /tiger details
//if buddy clicks on tiger preview (in auth/buddyView)  he gets redirected here to show the whole selfdescription of the tiger.
//here he can click on a button to message this tiger or go back to collection.

router.get('/tigerslist/:id', (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(tigerDetails => {
      res.render('interaction/showTigerDetails', tigerDetails)
    })
  // .catch(error => console.log(`Error while updating the celeb details: ${error}`))
})

//message to tiger
router.get('/tigerslist/:id/message', (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(tigerContact => {
      res.render('interaction/mess2tiger', tigerContact)
    })
  // .catch(error => console.log(`Couldnt reach tiger contact: ${error}`))
})

router.post('/tigerslist/:id/message', (req, res, next) => {
  const message = req.body.typedMessage;
  const userID_messageOriginBuddy = req.params.id
  Message.create({ receiver: userID_messageOriginBuddy, sender: req.session.currentUser._id, content: message })
    .then(() => {
      res.redirect('/interact/inbox')
    })
})


/////Inbox

//inbox buddy
router.get('/inbox', (req, res) => {
  
  User.findById(req.session.currentUser._id)
    .then((user) => {
      Message.find({ receiver: user }).populate('sender')
        .then((myMessages) => {
          console.log("mssg",myMessages);
          res.render('interaction/inboxAll', { msgs: myMessages, userInSession:user })

        })
    })
})

router.post('/inbox', (req, res) => {
  const message = req.body.typedMessage;
  const userID_messageOriginBuddy = req.params.id
  Message.create({ receiver: userID_messageOriginBuddy, sender: req.session.currentUser._id, content: message })
    .then(() => {
      res.redirect('/interact/inbox')
    })
})


////T I G E R ___ V I E W //////
//message to buddy
//on tigerView the tiger sees the inbox
//By clicking on one message he goes here:
router.get('/message2buddy/:id', (req, res) => {
  if (!req.session.currentUser) {
    res.send('We are sorry, you re just able to see this if you are logged in')
    res.redirect('/auth/login');
  }
  else {
    User.findById(req.session.currentUser._id)
      .then((user) => {
        res.render('/interact/mess2tiger/:id', {
          userInSession: user
        });

      });
  }
})

router.post('/message2buddy/:id', (req, res) => {

  //accessing the user that has send the message the tiger wants to reply to for linking the message in the DB
  const message = req.body.typedMessage;
  const userID_messageOriginTiger = req.params.id
  Message.create({ receiver: userID_messageOriginTiger, sender: req.session.currentUser._id, content: message })
    .then(() => {
      res.send('functions')
    });
})






module.exports = router;