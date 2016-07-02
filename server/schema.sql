DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

 -- TODO: make things work with a UNIQUE constraint here
CREATE TABLE users (
  id varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE messages (
  /* Describe your table here.*/
  id int NOT NULL AUTO_INCREMENT,
  message varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  roomname varchar(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (username) REFERENCES users(id)
);

/* Create other tables and define schemas for them here! */


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

