// To insert in “seeds/celebrity.seed.js”
const mongoose = require('mongoose');
const User = require('../models/User.model')


mongoose.connect('mongodb://localhost/visualisesikk', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Create an array with data -> compare with user.model.js 

const users = [

  {
    username: "Saime123",
    email: "saime@web.de",
    passwordHash: "$2a$10$l2BTNwNjB0ZwhLaCBI0xDeSeSnte/cvOGQ62FfSeF0saD1H3eja4C",
    usertype: "buddy",
    birthday: 1984-08-20,
    city: 'Berlin',
    choiceOfAction: ["dailyTasks", "hangingOut", "teaching"],
    profileInput: { tigerIntro: '', helpDef: '' },
  }, 

  {
    username: "Serafina",
    email: "serafina@mail.de",
    passwordHash: "$2a$10$/obu79sazfD5dILwK7AAA.uIFfmC5Jc.4vlfyNm/Z4rPJqt8tlLa2",
    usertype: 'inNeed',
    birthday: 1992-08-17,
    city: 'Berlin',
    choiceOfAction: ["dailyTasks", "hangingOut"],
    profileInput: { tigerIntro: '', helpDef: '' },
  },

  {
    username: "Maik",
    email: "maik@web.de",
    passwordHash: "$2a$10$ulTByvGRZHK6J.T5Z.ggZ.orEl2kbsH5HwnTIeCDTKWhNpu9J3S/q",
    // Password: Maik123
    usertype: 'buddy',
    birthday: 3003-03-03,
    city: 'Berlin',
    choiceOfAction: ['dailyTasks', 'teaching'],
    profileInput: { tigerIntro: '', helpDef: '' },
  },

  {
    username: "Giovanni",
    email: "giovanni@web.de",
    passwordHash: "$2a$10$qCksGiBWyWQ85c677ezwoe856XlfI.oT/lWlnBnhELbSXO6kWE/1.",
    // Password: Giovanni123
    usertype: 'buddy',
    birthday: 3003-03-03,
    city: 'Kiel',
    choiceOfAction: ['dailyTasks'],
    profileInput: { tigerIntro: '', helpDef: '' }
  },

  {
    username: "Meike",
    email: "meike@web.de",
    passwordHash: "$2a$10$CYSgVxoBeAB6yR3j5/xxSuvU.77hvwENiBWADOFdkQu.lpbybr77m",
    // Password: Meike123
    usertype: 'inNeed',
    birthday: 3003-03-30,
    city: 'Kiel',
    choiceOfAction: ['dailyTasks', 'hangingOut', 'teaching'],
    profileInput: { tigerIntro: '', helpDef: '' }
  },

  {
    username: "Gisela",
    email: "gisela@web.de",
    passwordHash: "$2a$10$Q2KGSS3j4XI3MpfPdCKeb.I.dQV6m0mzB/g6E1xyQRKRVvrwXOkS.",
    // Password: Gisela123
    usertype: 'inNeed',
    birthday: 2002-03-20,
    city: 'Kiel',
    choiceOfAction: ['dailyTasks'],
    profileInput: { tigerIntro: '', helpDef: '' }
  },

]


//Call the Celebrity model's create method with the array as argument = Datensatz exportieren + give display feedback (console.log lalala)


User.create(users)
  .then(usersFromDB => {
    console.log(`Created ${usersFromDB.length} users`);


    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('error with seed', err);
    mongoose.connection.close();
  });


