const express = require("express");
const { post, remove, broadcast } = require('./controllers/subscriptionController');
const { insertMessage, editMessage, deleteMessage } = require('./controllers/chatMgmt.controller');
const { createRoom, getRoom, editRoom, deleteRoom } = require('./controllers/roomMgmt.controller');
const { createUser, editUser, deleteUser } = require('./controllers/userMgmt.controller');

const initializeRoutes = (app) => {
  app.post('/subscription', post);
  app.delete('/subscription', remove);
  app.post('/broadcast', broadcast);

  // user mgmt routes
  app.post('/user/add', createUser);
  app.put('/user/edit/:id', editUser);
  app.delete('/user/del/:id', deleteUser);

  // room mgmt routes
  app.get('/room/list', getRoom);
  app.post('/room/add', createRoom);
  app.put('/room/edit/:id', editRoom);
  app.delete('/room/del/:id', deleteRoom);
};


module.exports = initializeRoutes;
