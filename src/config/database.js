const mongoose = require('mongoose');

module.exports = async () => {
  
  // Connect to the database
  try {
    mongoose.connect(
      'mongodb+srv://admin:Qz5scltFOPAZt2oH@letstalkhere.q1jrk.mongodb.net/?retryWrites=true&w=majority',
      // 'mongodb://localhost:27017/web-push-notifications',
      {
    // mongodb://localhost/web-push-notifications
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // mongoose.set('useCreateIndex', true);
  } catch (e) {
    console.error(`Couldn't connect to the database: ${e}`);
    process.exit(1);
  }
};
