const { NextFunction, Request, Response } = require('express');
const userMgmtModule = require('../repositories/userMgmt');
let webpush = require('web-push');
const { SendResult } = require('web-push');

const createUser = async (req, res, next) => {
  try {
    const subscription = req.body;
    const newUserCreated = await userMgmtModule.createUser(subscription);
    // Send 201 - resource created
    res.status(201).json(newUserCreated);
  } catch (e) {
    res.status(500).json(e);
    next(e);
  }
};
// remove var
const editUser = async (
  req,
  res,
  next,
)=> {
  try {
    const id = req.params.id

    if (!id === undefined) {
      res.sendStatus(400);
      return;
    }

    const response = await userMgmtModule.editUser(id, req.body);
    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (e) {
    res.status(500).json(e);
    next(e);
  }
};

const deleteUser = async (
  req,
  res,
  next,
) => {
  try {
    const id = req.params;

    const response = await userMgmtModule.deleteUser(id);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(response);
    next(e);
  }
};
module.exports ={
  createUser, editUser, deleteUser
}
