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
This application require user registration, and all subsequent api calls require Basic Authentication.

URL:

`POST /api/users`

Data params:

`{email: [String (required)], password: [String (required)], gender: [enum: ['male', 'femaile']]}`

Success response:

`201, {_id: [String], email: [String]}`

Error responses:

`409, {error: 'Email already registered'}`

Sample call:

`$ curl -i -H "Accept: application/json" -X POST -F email="hello@example.org" -F password="qwerty" http://127.0.0.1:3000/api/users`

Update User
-----------
Users may set or change their gender.

URL:

`PUT /api/users/:id`

Data params:

`{gender: [enum: ['male', 'female']]}`

Success response:

`200, {_id: [String], email: [String], gender: [enum: ['male', 'female']]}`

Error responses:

`404, {error: 'User not found'}`

`403, {error: 'Permission denied'}

Sample call:

`$ curl -i -H "Accept: application/json" -X PUT -F gender="male" http://hello%40example.org:qwerty@127.0.0.1:3000/api/users/53527f8a96d30b6c094bd57a`

Create and upload Photo
-----------------------
Users may create and upload photos. The `_id`s of created photos are provided when creating a contact sheet.

URL:
`POST /api/photos`

Data params:

`{photo: [binary data of image file]}`

Data params:

