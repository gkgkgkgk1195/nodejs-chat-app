let Subscription = require("../models/SubscriptionModel");
// const { ISubscription } = require("../models/SubscriptionModel");
const { LeanDocument } = require("mongoose");

const create = async (subscription) => {
  try {
    const newSubscription = new Subscription(subscription);
    const savedSubscription = await newSubscription.save();
    return savedSubscription.toObject();
  } catch (error) {
    return error
  }
};

const deleteByEndpoint = async (endpoint) => {
  try {
    const result = await Subscription.remove({ endpoint });
    return result.deletedCount > 0;
  } catch (error) {
    return error
  }
};

const getAll = async () => {
  try {
    return Subscription.find();
  } catch (error) {
    return error
  }
};

module.exports = {
  create,
  deleteByEndpoint,
  getAll,
};
