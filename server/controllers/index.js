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
      models.messages.get(function(results) {
        var json = JSON.stringify(results);
        console.log(results);
        console.log(json);
        res.send(results);
      });
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
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

