DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

 -- TODO: make things work with a UNIQUE constraint here
CREATE TABLE users (
  id varchar(255) PRIMARY KEY NOT NULL
);

CREATE TABLE messages (
  /* Describe your table here.*/
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  message varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  roomname varchar(255) NOT NULL
);

alter table messages add FOREIGN KEY (username) REFERENCES users(id);

INSERT INTO users (id) VALUES ('anon');
INSERT INTO messages (message, username, roomname) VALUES('Hello', 'anon', 'lobby');

/* Create other tables and define schemas for them here! */


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

