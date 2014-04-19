Image Vote
==========
Experimental Node.js server app exposing a RESTful API for uploading own photos and voting for other users´ photos.

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
-------------
This application user registration, and all subsequent api calls require basic Authentication.

URL:

`POST api/users`

Data params:

`{email: [String (required)], password: [String (required)], gender: [enum: ['male', 'femaile']]}`

Success response:

`201, [Newly created user object]`

Error responses:

`409, {error: 'Email already registered'}`

Sample call:

`$ curl -i -H "Accept: application/json" -X POST -F email="hello@claudijo.com" -F password="qwerty" http://127.0.0.1:3000/api/users`

Update User
-----------
Users may set or change their gender.

URL:

`PUT api/users`

Data params:

`{gender: [enum: ['male', 'femaile']]}`

Success response:

`200, [User object]`

Error responses:

`404, {error: 'User not found'}`

Sample call:

`$ curl -i -H "Accept: application/json" -X PUT -F gender="male" http://hello%40claudijo.com:qwerty@127.0.0.1:3000/api/users`

