// To insert in “seeds/celebrity.seed.js”
const mongoose = require('mongoose');
const User = require('../models/User.model')


mongoose.connect('mongodb://localhost/visualisesikk', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Create an array with data > compare with user.model.js 

const users = [

  {
    username: "Saime123",
    email: "saime@web.de",
    passwordHash: "$2a$10$l2BTNwNjB0ZwhLaCBI0xDeSeSnte/cvOGQ62FfSeF0saD1H3eja4C",
    userType: 'buddy',
    birthday: '1984-08-20',
    city: 'Berlin',
    choiceOfAction: ["dailyTasks", "hangingOut", "teaching"],
    profileInput: '',
  }, 

  {
    username: "Serafina",
    email: "serafina@mail.de",
    passwordHash: "$2a$10$/obu79sazfD5dILwK7AAA.uIFfmC5Jc.4vlfyNm/Z4rPJqt8tlLa2",
    userType: 'inNeed',
    birthday: '1992-08-17',
    city: 'Berlin',
    choiceOfAction: ["dailyTasks", "hangingOut"],
    profileInput: '',
  }

]


//Call the Celebrity model's create method with the array as argument = Datensatz exportieren + give display feedback (console.log lalala)


User.create(users)
  .then(usersFromDB => {
    console.log(`Created ${usersFromDB.length} users`);


    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('error with seed', err)
  });


