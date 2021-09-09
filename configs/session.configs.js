//require session
const session = require('express-session');
//require mongostore
const MongoStore = require('connect-mongo');
//require mongoose
const mongoose = require('mongoose');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 6000000 }, // 60 * 1000 ms === 1 min
          
          //OLD VERSION: [_doesnt work anymore_]
          // store: new MongoStore({
          //   mongooseConnection: mongoose.connection,
     
      //NEW VERSION:
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        // ttl => time to live
        
      })
    })
  );
};