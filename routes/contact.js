const router = require("express").Router();
const mongoose = require('mongoose');

const User = require("../models/User.model");
const Message = require("../models/Message.model");
// const { create } = require("../models/User.model");


////B U D D Y ___ V I E W //////

//GET /tiger details
//if buddy clicks on tiger preview (in auth/buddyView)  he gets redirected here to show the whole selfdescription of the tiger.
//here he can click on a button to message this tiger or go back to collection.

router.get('/:id', (req, res, next) => {
  //access user in session:
  // req.session.currentUser = user;
  User.findById(req.session.currentUser._id)
    .then((user) => {
      //safe choosen tiger_id
      const { id } = req.params;
      User.findById(id)
        .then(tigerDetails => {
          res.render('interaction/showTigerDetails', { tigerDetails: tigerDetails, userInSession: user })
        })
    })
  // .catch(error => console.log(`Error while updating the celeb details: ${error}`))
})

//messaging
router.get('/:id/message', (req, res, next) => {
  //access/safe user in session:
  User.findById(req.session.currentUser._id)
    .then((user) => {
      //safe choosen tiger_id
      const { id } = req.params;
      User.findById(id)
        .then(tigerContact => {
          if(user.usertype=='buddy'){
            res.render('interaction/mess2tiger', { tigerContact: tigerContact, userInSession: user })
          }
          else{
            res.render('interaction/mess2buddy', { tigerContact: tigerContact, userInSession: user })
          }
        })
    });
  // .catch(error => console.log(`Couldnt reach tiger contact: ${error}`))
})

router.post('/:id/message', (req, res, next) => {
  //access/safe user in session:
  User.findById(req.session.currentUser._id)
    .then((user) => {
      const message = req.body.typedMessage;
      const userID_receiver = req.params.id
      Message.create({ receiver: userID_receiver, sender: req.session.currentUser._id, content: message })
        .then(() => {
          res.redirect('/interact/inbox', { userInSession: user })
        })
    });
})


/////I N B O X //////////

router.get('/inbox', (req, res) => {
  User.findById(req.session.currentUser._id)
    .then((user) => {
      Message.find({ receiver: user }).populate('sender')
        .then((myMessages) => {
          console.log("msgs", myMessages);
          if(user.usertype=="buddy"){
            res.render('interaction/inboxBuddy', { msgs: myMessages, userInSession: user })
          }
          else{
            res.render('interaction/inboxTiger', { msgs: myMessages, userInSession: user })
          } 
        })
    });
})

//no option of writing messages in the inbox. Just in the /message route.
//
// router.post('/inbox', (req, res) => {
//   const message = req.body.typedMessage;
//   const userID_messageOriginBuddy = req.params.id
//   Message.create({ receiver: userID_messageOriginBuddy, sender: req.session.currentUser._id, content: message })
//     .then(() => {
//       res.redirect('/interact/inbox')
//     })
// })


////T I G E R ___ V I E W //////

//not necessary:

//message to buddy
//on tigerView the tiger sees the inbox
// //By clicking on one message he goes here:
// router.get('/:id/message', (req, res) => {
//   if (!req.session.currentUser) {
//     res.send('We are sorry, you re just able to see this if you are logged in')
//     res.redirect('/auth/login');
//   }
//   else {
//     User.findById(req.session.currentUser._id)
//       .then((user) => {
//         res.render('/interact/:id', {
//           userInSession: user
//         });

//       });
//   }
// })

// router.post('/:id/message', (req, res) => {

//   //accessing the user that has send the message the tiger wants to reply to for linking the message in the DB
//   const message = req.body.typedMessage;
//   const userID_messageOriginTiger = req.params.id
//   Message.create({ receiver: userID_messageOriginTiger, sender: req.session.currentUser._id, content: message })
//     .then(() => {
//       res.send('works')
//     });
// })






module.exports = router;