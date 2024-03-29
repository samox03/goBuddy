
const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');


//////////// S I G N U P ___buddies  ///////////

/* GET home page */
router.get("/signup/buddy", (req, res, next) => {
    res.render("users/signupBuddy")
});


router.post("/signup/buddy", (req, res, next) => {
    console.log("User input (buddy):", req.body);


    //storing the userinput 
    //usertype still undefined and needs to be preset for this formvalidation 
    const { username, email, password, birthday, city, hangingOut, dailyTasks, teaching } = req.body;

    //reducing the passwords to one
    //still open: check if both inputs are the same
    let password1
    if (password[0] === password[1]) {
        password1 = password[0]
    }
    else {
        res.render('users/signupBuddy', { errorMessage: 'Please confirm your password again.' })
        return;
    }

    let choiceOfAction = []

    //task: Storing in choiceOfAction which checkboxes are activated: dailyTasks/hangignOut/teaching
    if (dailyTasks === "on") {
        choiceOfAction.push('dailyTasks')
    }
    if (hangingOut == "on") {
        choiceOfAction.push('hangingOut')
    }
    if (teaching == "on") {
        choiceOfAction.push('teaching')
    }

    // all fields have to be filled stays untouched
    //   if (!username || !email || !password || !birthday || !choiceOfAction) {
    if (!username || !email || !password || !birthday) {
        console.log("not all mandatory input is given..")
        res.render('users/signupBuddy', { errorMessage: 'All fields are mandatory. Please provide all required input.' })
        return;
    }

    //make sure passwords are strong
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password1)) {
        res.status(500)
            .render('users/signupBuddy', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    //creating the according data in db, but using the encrypted version:
    //generate salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //create a hashed version of the password:
    const hash1 = bcrypt.hashSync(password1, salt);

    console.log("creating user ...")
    User.create({ username: username, email: email, passwordHash: hash1, usertype: "buddy", city: city, birthday: birthday, choiceOfAction: choiceOfAction, profileInput: {} })

        .then(userFromDB => {
            console.log('A new buddy has joined the pool: ', userFromDB);
            res.redirect('/auth/login');
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
    if (!req.session.currentUser) {
        res.send('We are sorry, you re just able to see this if you are logged in')
        res.redirect('/');
    }
    else {
        User.find({ city: req.session.currentUser.city, usertype: 'inNeed' }).then(users => {
            let allUsersExceptMe = users.filter(e => {
                return e.email !== req.session.currentUser.email
            })
            console.log("users", users)
            res.render('users/buddyView', {
                userInSession: req.session.currentUser,
                users: allUsersExceptMe
            });
        })

    }
});



/////////////////////// T I G E R S ///////////////////////////////

//////////// S I G N U P ___tigers  ///////////

/* GET home page */
router.get("/signup/tiger", (req, res, next) => {
    res.render("users/signupTiger")
});


router.post("/signup/tiger", (req, res, next) => {
    console.log("User input (tiger):", req.body);
    //storing the userinput 


    //storing the userinput 
    //usertype still undefined and needs to be preset for this formvalidation 
    const { username, email, password, birthday, city, hangingOut, dailyTasks, teaching } = req.body;

    //reducing the passwords to one
    //still open: check if both inputs are the same
    let password1
    if (password[0] === password[1]) {
        password1 = password[0]
    }
    else {
        res.render('users/signupBuddy', { errorMessage: 'Please confirm your password again.' })
        return;
    }

    let choiceOfAction = []
    //task: Storing in choiceOfAction which checkboxes are activated: dailyTasks/hangignOut/teaching
    if (dailyTasks === "on") {
        choiceOfAction.push('dailyTasks')
    }
    if (hangingOut == "on") {
        choiceOfAction.push('hangingOut')
    }
    if (teaching == "on") {
        choiceOfAction.push('teaching')
    }

    // all fields have to be filled stays untouched
    //   if (!username || !email || !password || !birthday || !choiceOfAction) {
    if (!username || !email || !password || !birthday) {
        res.render('users/signupTiger', { errorMessage: 'All fields are mandatory. Please provide all required input.' })
        return;
    }

    //make sure passwords are strong
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password1)) {
        res.status(500)
            .render('users/signupTiger', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    //creating the according data in db, but using the encrypted version:
    //generate salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //create a hashed version of the password:
    const hash1 = bcrypt.hashSync(password1, salt);

    User.create({ username: username, email: email, passwordHash: hash1, usertype: "inNeed", city: city, birthday: birthday, choiceOfAction: choiceOfAction })

        .then(userFromDB => {
            console.log('A new buddy has joined the pool: ', userFromDB);

            res.redirect('/auth/login');
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
    if (!req.session.currentUser) {
        res.send('We are sorry, you re just able to see this if you are logged in')
        res.redirect('/');
    }
    else {
        User.findById(req.session.currentUser._id).then((user) => {
            res.render('users/tigerView', {
                userInSession: user
            });
        })
        
    }
});

router.post('/tigerView', (req, res) => {
    const userID = req.session.currentUser._id
    User.findByIdAndUpdate(userID, {
        profileInput: {
            tigerIntro: req.body.tigerIntro,
            helpDef: req.body.helpDef
        }
    })
        .then(() => {
            res.redirect("/auth/tigerView")
        });
});


//////////// L O G I N ////////////
//  dependency: 
//  ---------if user == tiger => display tigerView
//  ---------if user == buddy => display buddyView


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
    //look for the corresponding user in the data:
    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('users/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcrypt.compareSync(password, user.passwordHash)) {
                // when we introduce session, the following line gets replaced with what follows:
                // res.render('users/user-profile', { user });

                //******* SAVE THE USER IN THE SESSION ********//

                ////////////////////////////////
                /////////////////////////////////
                //differentiate between buddy and tiger view in session function          
                req.session.currentUser = user;
                if (user.usertype === 'buddy') {
                    res.redirect('/auth/buddyView');
                }
                else if (user.usertype === 'inNeed') {
                    res.redirect('/auth/tigerView');
                }
            } else {
                res.render('users/login', { errorMessage: 'Incorrect password' });
            }
        })
});


//////////// L O G O U T ///////////
router.post('/logout', (req, res) => {
    req.session.destroy();
    // req.session.destroy(req.sessionID);
    res.redirect('/');
});




module.exports = router;