const mongoose = require('mongoose');
const { Schema, Document } = require('mongoose');

const roomModel = new Schema({
  room_name: {
    type: String,
  },
  room_desc: {
    type: String,
    },
  room_user: {
    type: Array,
    },
  room_expiry_time: {
    type: Number,
    },
  room_name: {
    type: String,
  },
  room_admin: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
});

 module.exports = mongoose.model('Room', roomModel);
