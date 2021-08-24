
const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');


//////////// L A N D I N G P A G E ///////////
router.get('/', (res, req) => {
    res.render('openViews/landingPage')
})

//////////// S I G N U P ___buddies  ///////////

/* GET home page */
router.get("/signup/buddy", (req, res, next) => {
  res.render("users/signupBuddy")
});


router.post("/signup/buddy", (req, res, next) => {
  console.log("User input:", req.body);
  //storing the userinput 
  //usertype still undefined and needs to be preset for this formvalidation 
  const { username, email, password, birthday, choiceOfAction } = req.body;

  // all fields have to be filled stays untouched
  if (!username || !email || !password || !birthday || !choiceOfAction) {
      res.render('users/signupBuddy', { errorMessage: 'All fields are mandatory. Please provide all required input.' })
      return;
  }

  //make sure passwords are strong
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
      res.status(500)
          .render('users/signupBuddy', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
  }
  //creating the according data in db, but using the encrypted version:
  //generate salt
  const salt = bcrypt.genSaltSync(saltRounds);
  //create a hashed version of the password:
  const hash1 = bcrypt.hashSync(password, salt);

  User.create({ username: username, email: email, password: hash1, usertype: "buddy", bithday: birthday, choiceOfAction: choiceOfAction })
      // .then(() => {
      //     res.send("user created")
      // })

      .then(userFromDB => {
          console.log('A new buddy has joined the pool: ', userFromDB);
          res.redirect('/auth/userView');
      })
      .catch(error => {
          if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('users/signupBuddy', {
                  errorMessage: error.message
              });
          } else if (error.code === 11000) {
              res.status(500).render('users/signupBuddy', {
                  errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              });
          }
          else {
              next(error);
          }
      });
})


//////////// Only for logged in ___buddies: ///////////

//user profile route
router.get('/buddyView', (req, res) => {
  res.render('users/buddyView', {
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



/////////////////////// T I G E R S ///////////////////////////////

//////////// S I G N U P ___tigers  ///////////

/* GET home page */
router.get("/signup/tiger", (req, res, next) => {
    res.render("users/signupTiger")
  });
  
  
  router.post("/signup/tiger", (req, res, next) => {
    console.log("User input:", req.body);
    //storing the userinput 
    //usertype still undefined and needs to be preset for this formvalidation 
    const { username, email, password, birthday, choiceOfAction } = req.body;
  
    // all fields have to be filled stays untouched
    if (!username || !email || !password || !birthday || !choiceOfAction) {
        res.render('users/signupTiger', { errorMessage: 'All fields are mandatory. Please provide all required input.' })
        return;
    }
  
    //make sure passwords are strong
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.status(500)
            .render('users/signupTiger', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    //creating the according data in db, but using the encrypted version:
    //generate salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //create a hashed version of the password:
    const hash1 = bcrypt.hashSync(password, salt);
  
    User.create({ username: username, email: email, password: hash1, usertype: "tiger", bithday: birthday, choiceOfAction: choiceOfAction })
        // .then(() => {
        //     res.send("user created")
        // })
  
        .then(userFromDB => {
            console.log('A new buddy has joined the pool: ', userFromDB);
            res.redirect('/auth/userView');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('users/signupTiger', {
                    errorMessage: error.message
                });
            } else if (error.code === 11000) {
                res.status(500).render('users/signupTiger', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            }
            else {
                next(error);
            }
        });
  })
  
  
  //////////// Only for logged in ___tigers: ///////////
  
  //user profile route
  router.get('/tigerView', (req, res) => {
    res.render('users/tigerView', {
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
  



//////////// L O G I N ////////////

// .get() route ==> to display the login form to users
router.get('/login', (req, res) => {
    res.render('users/login');
});

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION ====> ', req.session);
    const { email, password } = req.body;

    //user input not complete
    if (email === '' || password === '') {
        res.render('users/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }
    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('users/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                //******* SAVE THE USER IN THE SESSION ********//
                req.session.currentUser = user;
                res.redirect('/auth/userView');
            } else {
                res.render('users/login', { errorMessage: 'Incorrect password' });
            }
        })
        .catch(error => next(error));
});





//////////// L O G O U T ///////////
router.post('/logout', (req, res) => {
    req.session.destroy();
});



module.exports = router;