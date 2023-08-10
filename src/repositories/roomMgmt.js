let Subscription = require("../models/SubscriptionModel");
let User = require("../models/userModel");
let Message = require("../models/messageModel");
let Room = require("../models/roomModel");
// const { ISubscription } = require("../models/SubscriptionModel");
const { LeanDocument } = require("mongoose");
const { sucRes } = require("../utils/utils");

const createRoom = async (body) => {
  try {
    const roomObject = new Room(body);
    const roomSaved = await roomObject.save();
    return roomSaved.toObject();
  } catch (error) {
    return error
  }
};

const getRoom = async () => {
  try {
    const rooms = await Room.find({});
    console.log("🚀 ~ file: roomMgmt.js ~ line 21 ~ getRoom ~ rooms", rooms)
    return sucRes(200, "Active room fetched successfully", rooms)
  } catch (error) {
    return error
  }
};

const editRoom = async (endpoint) => {
  try {
    const result = await Subscription.remove({ endpoint });
    return result.deletedCount > 0;
  } catch (error) {
    return error
  }
};

const deleteRoom = async () => {
  try {
    return Subscription.find();
  } catch (error) {
    return error
  }
};

module.exports = {
  createRoom,
  getRoom,
  editRoom,
  deleteRoom,
};
