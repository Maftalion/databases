// https://github.com/hackreactor/2016-06-chatterbox-client/blob/solution/client/scripts/app.js

var app = {

  //TODO: The current 'toggleFriend' function just toggles the class 'friend'
  //to all messages sent by the user
  messagesEndpoint: 'http://localhost:3000/classes/messages',
  usersEndpoint: 'http://localhost:3000/classes/users',
  username: 'anonymous',
  roomname: 'lobby',
  lastMessageId: 0,
  friends: {},

  promptUsername: function() {
    if (!/(&|\?)username=/.test(window.location.search)) {
      var newSearch = window.location.search;
      if (newSearch !== '' & newSearch !== '?') {
        newSearch += '&';
      }
      newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
      window.location.search = newSearch;
    }
  },

  init: function() {
    // Get username
    // app.promptUsername();
    

    // Cache jQuery selectors
    app.$username = $('#username');
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
    app.$sendUser = $('#sendUser');

    // Add listeners
    app.$chats.on('click', '.username', app.toggleFriend);
    app.$send.on('submit', app.handleSubmit);
    app.$sendUser.on('submit', app.handleSubmitUsername);
    app.$roomSelect.on('change', app.saveRoom);

    // Fetch previous messages
    app.fetch(false);

    // Poll for new messages
    // setInterval(app.fetch, 3000);
  },

  sendUsername: function(data) {
    // Clear messages input
    app.$username.val('');
    console.log(data);
    // POST the message to the server
    $.ajax({
      url: app.usersEndpoint,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (json) {
        app.username = data.username;
        console.log(app.username);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send username', data);
        alert('Username taken, pick another!');
      }
    });
  },

  sendMessage: function(data) {
    // Clear messages input
    app.$message.val('');

    // POST the message to the server
    $.ajax({
      url: app.messagesEndpoint,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (data) {
        // Trigger a fetch to update the messages, pass true to animate
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function(animate) {
    $.ajax({
      url: app.messagesEndpoint,
      type: 'GET',
      contentType: 'application/json',
      // data: { order: '-createdAt'},
      success: function(data) {
        // Don't bother if we have nothing to work with
        if (!data || !data.length) { return; }

        // Get the last message
        var mostRecentMessage = data[data.length - 1];
        var displayedRoom = $('.chat span').first().data('roomname');
        // Only bother updating the DOM if we have a new message
        if (mostRecentMessage.id !== app.lastMessageId || app.roomname !== displayedRoom) {
          // Update the UI with the fetched rooms
          app.populateRooms(data);

          // Update the UI with the fetched messages
          app.populateMessages(data, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.id;
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  populateMessages: function(results, animate) {
    // Clear existing messages

    app.clearMessages();
    if (Array.isArray(results)) {
      // Add all fetched messages
      results.forEach(app.addMessage);
    }

    // Make it scroll to the bottom
    var scrollTop = app.$chats.prop('scrollHeight');
    if (animate) {
      app.$chats.animate({
        scrollTop: scrollTop
      });
    } else {
      app.$chats.scrollTop(scrollTop);
    }
  },

  populateRooms: function(results) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

    if (results) {
      var rooms = {};
      results.forEach(function(data) {
        var roomname = data.roomname;
        if (roomname && !rooms[roomname]) {
          // Add the room to the select menu
          app.addRoom(roomname);

          // Store that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.roomname);
  },

  addRoom: function(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    app.$roomSelect.append($option);
  },

  addMessage: function(data) {
    if (!data.roomname) {
      data.roomname = 'lobby';
    }

    // Only add messages that are in our current room
    if (data.roomname === app.roomname) {
      // Create a div to hold the chats
      var $chat = $('<div class="chat"/>');

      // Add in the message data using DOM methods to avoid XSS
      // Store the username in the element's data
      var $username = $('<span class="username"/>');
      $username.text(data.username + ': ')
        .attr('data-username', data.username)
        .attr('data-roomname', data.roomname)
        .appendTo($chat);

      // Add the friend class
      if (app.friends[data.username] === true) {
        $username.addClass('friend');
      }

      var $message = $('<br><span/>');
      $message.text(data.message).appendTo($chat);

      // Add the message to the UI
      app.$chats.append($chat);
    }
  },

  toggleFriend: function(evt) {
    var username = $(evt.currentTarget).attr('data-username');

    if (username !== undefined) {
      // Store as a friend
      app.friends[username] = true;

      // Bold all previous messages
      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  saveRoom: function(evt) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;

        // Add the room to the menu
        app.addRoom(roomname);

        // Select the menu option
        app.$roomSelect.val(roomname);

        // Fetch messages again
        app.fetch();
      }
    } else {
      // Store as undefined for empty names
      app.roomname = app.$roomSelect.val();

      // Fetch messages again
      app.fetch();
    }
  },

  handleSubmitUsername: function(evt) {
    var username = app.$username.val();
    app.sendUsername({ username: username });

    // Stop the form from submitting
    evt.preventDefault();
  },

  handleSubmit: function(evt) {
    var message = {
      username: app.username,
      message: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.sendMessage(message);

    // Stop the form from submitting
    evt.preventDefault();
  },

};