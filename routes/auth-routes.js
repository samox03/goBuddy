
const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

//////////// S I G N U P ///////////

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("users/signup")
});


router.post("/signup", (req, res, next) => {
  console.log("User input:", req.body);
  //storing the userinput 
  const { username, email, password, usertype, birthday, choiceOfAction } = req.body;

  // all fields have to be filled stays untouched
  if (!username || !email || !password || !usertype || !birthday || !choiceOfAction) {
      res.render('users/signup', { errorMessage: 'All fields are mandatory. Please provide all required input.' })
      return;
  }

  //make sure passwords are strong
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
      res.status(500)
          .render('users/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
  }
  //creating the according data in db, but using the encrypted version:
  //generate salt
  const salt = bcrypt.genSaltSync(saltRounds);
  //create a hashed version of the password:
  const hash1 = bcrypt.hashSync(password, salt);

  User.create({ username: username, email: email, password: hash1, usertype: usertype, bithday: birthday, choiceOfAction: choiceOfAction })
      // .then(() => {
      //     res.send("user created")
      // })

      .then(userFromDB => {
          console.log('A new buddy has joined the pool: ', userFromDB);
          res.redirect('/auth/userView');
      })
      .catch(error => {
          if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('users/signup', {
                  errorMessage: error.message
              });
          } else if (error.code === 11000) {
              res.status(500).render('users/signup', {
                  errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              });
          }
          else {
              next(error);
          }
      });
})


//////////// Only for logged in users: ///////////

//user profile route
router.get('/userView', (req, res) => {
  res.render('users/userView', {
      userInSession: req.session.currentUser
  });
});

router.get('/loggedInContent', (req, res) => {
if(!req.session.currentUser) {
res.redirect('/')
}
else {
    res.send('we are sorry, you just can see this if you are logged in')
}
})


//////////// L O G O U T ///////////
router.post('/logout', (req, res) => {
    req.session.destroy();
});



module.exports = router;