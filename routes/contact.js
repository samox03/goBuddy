const router = require("express").Router();
const mongoose = require('mongoose');

const User = require("../models/User.model");
const Message = require("../models/Message.model");
// const { create } = require("../models/User.model");




/////I N B O X //////////

router.get('/inbox', (req, res) => {
  User.findById(req.session.currentUser._id)
    .then((user) => {
      Message.find({ receiver: user }).populate('sender')
        .then((myMessages) => {
          console.log("msgs", myMessages);

          //try1, to show just onetimes the username if one user sendes several messages in the inbox:
          // let newMssgs =  myMessages.map(e=>{
          //       if(e.username == )
          //   })
          //
          let newMssgs = myMessages.filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.username === thing.username
            ))
          )

          if (user.usertype == "buddy") {
            res.render('interaction/inboxBuddy', { msgs: newMssgs, userInSession: user })
          }
          else {
            res.render('interaction/inboxTiger', { msgs: newMssgs, userInSession: user })
          }
        })
    });
})


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
      Message.find({ receiver: user }).populate('sender')
        .then((myMessages) => {

          //safe choosen tiger_id
          const { id } = req.params;
          User.findById(id)
            .then(tigerContact => {
              res.render('interaction/mess2tiger', { tigerContact: tigerContact, userInSession: user, msgs: myMessages })

              // if (user.usertype == 'buddy') {
              //   res.render('interaction/mess2tiger', { tigerContact: tigerContact, userInSession: user })
              // }
              // else {
              //   res.render('interaction/mess2buddy', { tigerContact: tigerContact, userInSession: user })
              // }

            })

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
          res.redirect(`/interact/${userID_receiver}/message`)
        })
    });
})


module.exports = router;