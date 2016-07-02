var db = require('../db');

module.exports = {
  messages: {
    // a function which produces all the messages
    get: function () {
      db.query('SELECT * FROM messages', function(err, rows, fields) {
        if (err) {
          throw err;
        }

        return rows;
      });
    }, 
    // a function which can be used to insert a message into the database
    post: function () {

    }
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};