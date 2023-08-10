const mongoose = require('mongoose');
const { Schema, Document } = require('mongoose');

const messageModel = new Schema({
  message: {
    type: String,
  },
  time: {
     type: Date,
    },
  room_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Room'
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
});

 module.exports = mongoose.model('Message', messageModel);
