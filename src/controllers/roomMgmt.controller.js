const { NextFunction, Request, Response } = require('express');
const roomMgmtModule = require('../repositories/roomMgmt');
let webpush = require('web-push');
const { SendResult } = require('web-push');

const createRoom = async (req, res, next) => {
  try {
    const subscription = req.body;
    const newSubscription = await roomMgmtModule.createRoom(subscription);
    // Send 201 - resource created
    res.status(201).json(newSubscription);
  } catch (e) {
    next(e);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const rooms = await roomMgmtModule.getRoom();
    // Send 201 - resource created
    res.status(201).json(rooms);
  } catch (e) {
    res.status(500).json(e);
    next(e);
  }
};

const editRoom = async (
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

    const successful = await roomMgmtModule.editRoom(endpoint);
    if (successful) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    next(e);
  }
};

const deleteRoom = async (
  req,
  res,
  next,
) => {
  try {
    const body = req.body;

    const subscriptions = await roomMgmtModule.deleteRoom();

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
module.exports ={
  createRoom, getRoom, editRoom, deleteRoom
}
