let Subscription = require("../models/SubscriptionModel");
let User = require("../models/userModel");
let messageModel = require("../models/messageModel");
let roomModel = require("../models/roomModel");
// const { ISubscription } = require("../models/SubscriptionModel");
const {errRes, sucRes} = require("../utils/utils");
const { LeanDocument } = require("mongoose");
const { default: mongoose } = require("mongoose");

const createUser = async (user) => {
  try {
    const newUser = new User(user);
    const newUserSave = await newUser.save();
    return sucRes(200, "User added successfully", newUserSave)
  } catch (error) {
    return errRes(500, "Error while saving user data", error)
  }
};

const editUser = async (userId, body) => {
  try {
    const result = await User.updateOne({_id: mongoose.Types.ObjectId(userId)}, body);
    console.log("🚀 ~ file: userMgmt.js ~ line 23 ~ editUser ~ result", result)
    if(result.modifiedCount > 0){
      return sucRes(200, "User data updated successfully", result)
    }else{
      return errRes(400, "User does not exist")
    }
  } catch (error) {
    return errRes(500, "Error while updating user data", error)
  }
};

const deleteUser = async (userId) => {
console.log("🚀 ~ file: userMgmt.js ~ line 30 ~ deleteUser ~ userId", userId)
  try {
    const result = await User.deleteOne({_id: mongoose.Types.ObjectId(userId)});
    if(result && result.deletedCount > 0){
      return sucRes(200, "User deleted successfully")
    }else if(result && result.acknowledged === true && result.deletedCount === 0) {
      return sucRes(200, "User already deleted")

    }
  } catch (error) {
    return errRes(500, "Error while deleting user", error)
  }
};

module.exports = {
  createUser,
  editUser,
  deleteUser,
};
