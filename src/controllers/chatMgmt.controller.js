const { NextFunction, Request, Response } = require('express');
const chatMgmtModule = require('../repositories/chatMgmt');
let webpush = require('web-push');
const { SendResult } = require('web-push');

const insertMessage = async (req, res, next) => {
  try {
    const subscription = req.body;
    const newSubscription = await chatMgmtModule.insertMessage(subscription);
    // Send 201 - resource created
    res.status(201).json(newSubscription);
  } catch (e) {
    next(e);
  }
};
// remove var
const editMessage = async (
  req,
  res,
  next,
)=> {
  try {
    const endpoint = req.query.endpoint?.toString();
    if (!endpoint) {
      res.sendStatus(400);
      return;
    }

    const successful = await chatMgmtModule.editMessage(endpoint);
    if (successful) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    next(e);
  }
};

const deleteMessage = async (
  req,
  res,
  next,
) => {
  try {
    const body = req.body;

    const subscriptions = await chatMgmtModule.deleteMessage();

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
module.exports ={
  insertMessage, editMessage, deleteMessage
}
