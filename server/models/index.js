var db = require('../db');

module.exports = {
  messages: {
    // a function which produces all the messages
    get: function (cb) {
      db.query('SELECT * FROM messages', function(err, rows, fields) {
        if (err) {
          throw err;
        }

        var results = rows || [{}];
        cb(results);
      });
    }, 
    // a function which can be used to insert a message into the database
    post: function (message, cb) {
      db.query('INSERT into messages SET ?', message, function(err, result) {
        if (err) {
          return db.rollback(function() {
            throw err;
          });
        }

        db.commit(function(err) {
          if (err) {
            return db.rollback(function() {
              throw err;
            });
          }

          cb();
        });
      });
    }
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (name, cb) {
      db.query('INSERT into users SET id=?', name, function(err, result) {
        if (err) {
          return db.rollback(function() {
            throw err;
          });
        }

        db.commit(function(err) {
          if (err) {
            return db.rollback(function() {
              throw err;
            });
          }

          cb();
        });
      });
    }
  }
};