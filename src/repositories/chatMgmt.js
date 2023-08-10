let Subscription = require("../models/SubscriptionModel");
let userModel = require("../models/userModel");
let messageModel = require("../models/messageModel");
let roomModel = require("../models/roomModel");
// const { ISubscription } = require("../models/SubscriptionModel");
const { LeanDocument } = require("mongoose");

const insertMessage = async (subscription) => {
  try {
    const newSubscription = new Subscription(subscription);
    const savedSubscription = await newSubscription.save();
    return savedSubscription.toObject();
  } catch (error) {
    return error
  }
};

const editMessage = async (endpoint) => {
  try {
    const result = await Subscription.remove({ endpoint });
    return result.deletedCount > 0;
  } catch (error) {
    return error
  }
};

const deleteMessage = async () => {
  try {
    return Subscription.find();
  } catch (error) {
    return error
  }
};

module.exports = {
  insertMessage,
  editMessage,
  deleteMessage,
};
