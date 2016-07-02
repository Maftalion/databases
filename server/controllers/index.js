var models = require('../models');
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/plain'
};

module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      // call models.messages.get()
        // pipe the result to http response
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
      console.log('----------- inside of messages/post handler');
      // call models.messages.post(data)
      // respond to client
      var message = req.body;

      models.messages.post(message, function() {
        res.writeHead(201, headers);
        res.end('Message added');
      });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {

    },
    post: function (req, res) {
      var name = req.body.username;

      models.users.post(name, function() {
        res.writeHead(201, headers);
        res.end('User added');
      });
    }
  }
};

