Image Vote
==========
Experimental Node.js / Express app exposing a RESTful API for uploading own photos and voting for other users´ photos.

Prerequisites
-------------

Install Node.js
  see http://nodejs.org/

Install MongoDB
  see https://www.mongodb.org/

Install project dependencies:

`$ npm install`

Run database:

`$ mongod`

Run server (Default port is 3000):

`$ node app.js`

REST API
========
All resources have `_id` as id attribute.

Register User
----------
URL:

`POST api/users`

Data params:

`{email: [String (required)], password: [String (required)], gender: [enum: ['male', 'femaile']]}`

Success response:

`201, [Newly created user object]`

Error responses:

`409, {error: 'Email already registered'}`

Sample call:

`$ curl -F email='hello@claudijo.com' -F password='qwerty' http://127.0.0.1:3000/api/users`




