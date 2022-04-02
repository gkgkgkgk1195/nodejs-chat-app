const express = require("express");
const { post, remove, broadcast } = require('./controllers/subscriptionController');

const initializeRoutes = (app) => {
  app.post('/subscription', post);
  app.delete('/subscription', remove);
  app.post('/broadcast', broadcast);
};

module.exports = initializeRoutes;
