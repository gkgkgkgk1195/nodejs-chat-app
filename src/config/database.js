const mongoose = require('mongoose');

module.exports = async () => {
  // Connect to the database
  try {
    mongoose.connect('mongodb+srv://admin:gMbzfMgG0aS8Lzc7@letstalkhere.q1jrk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
