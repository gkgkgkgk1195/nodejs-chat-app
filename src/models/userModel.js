const mongoose = require('mongoose');
const { Schema, Document } = require('mongoose');

const userModel = new Schema({
  name: {
    type: String,
  }
});

 module.exports = mongoose.model('User', userModel);
