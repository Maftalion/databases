var models = require('../models');
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
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

      models.messages.post(message, function(result) {
        res.writeHead(201, headers);
        var json = JSON.stringify(result);
        res.end(json);
      });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {

    },
    post: function (req, res) {
      var name = req.body.username;

      models.users.post(name, function(err, result) {
        if (err) {
          res.writeHead(500, headers);
          res.end('Sorry, username taken. Try another!');
        } else {
          res.writeHead(201, headers);
          var json = JSON.stringify(result);
          console.log('from inside of succesful users/post contorller');
          console.log(json);
          res.end(json);
        }
      });
    }
  }
};

