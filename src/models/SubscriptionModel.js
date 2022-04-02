const mongoose = require('mongoose');
const { Schema, Document } = require('mongoose');

const SubscriptionModel = new Schema({
  endpoint: { type: String, unique: true, required: true },
  expirationTime: { type: Number, required: false },
  keys: {
    auth: String,
    p256dh: String,
  },
});

 module.exports = mongoose.model('Subscription', SubscriptionModel);
