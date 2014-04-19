Image Vote
==========
Simple Node.js / Express app exposing a RESTful API for uploading and voting for photos.

Prerequisites
-------------

Install Node.js
  see http://nodejs.org/

Install MongoDB
  see https://www.mongodb.org/

Install project dependencies:

`> npm install`

Run database:

`> mongod`

Run server:

`> node app.js`

REST API
========
Crate User
----------
`POST api/users`
Data params:
`{email: [String (required], password: [String (required)], gender: [enum: 'male' | 'femaile']}’
Success response:
`201, [User object]`



