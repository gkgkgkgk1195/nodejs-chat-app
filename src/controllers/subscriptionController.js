const { NextFunction, Request, Response } = require('express');
const subscriptionRepository = require('../repositories/subscriptionRepository');
let webpush = require('web-push');
const { SendResult } = require('web-push');

const post = async (req, res, next) => {
  try {
    const subscription = req.body;
    const newSubscription = await subscriptionRepository.create(subscription);
    // Send 201 - resource created
    res.status(201).json(newSubscription);
  } catch (e) {
    next(e);
  }
};
// remove var
const remove = async (
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

    const successful = await subscriptionRepository.deleteByEndpoint(endpoint);
    if (successful) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    next(e);
  }
};

const broadcast = async (
  req,
  res,
  next,
) => {
  try {
    const {title, body} = req.body;
    const notification = { title, body };

    console.log("🚀 ~ file: subscriptionController.js:49 ~ notification:", notification)
    const subscriptions = await subscriptionRepository.getAll();
    console.log("🚀 ~ file: subscriptionController.js:50 ~ subscriptions:", subscriptions)

    const notifications = [];
    subscriptions.forEach((subscription) => {
      notifications.push(webpush.sendNotification(subscription, JSON.stringify(notification)));
    });

    const data = await Promise.all(notifications);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
module.exports ={
  post, remove, broadcast
}
