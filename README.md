#Image Vote#
Experimental Node.js server app exposing a RESTful API for uploading own photos and voting for other users´ photos.

##Prerequisites##
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

##REST API##
All resources have `_id` as id attribute.

###Register User###
The application enforces user registration. All subsequent api calls require authentication using HTTP Basic authentication.

####URL####

`POST /api/users`

####Data params####

`{email: [String (required)], password: [String (required)], gender: [enum: ['male', 'female'] (required)]}`

####Success response####

`201, {_id: [String], email: [String]}`

####Error responses####

`409, {error: 'Email already registered'}`

####Sample call####

`$ curl -d '{"email":"hello@example.org","password":"qwerty","gender":"male"}' -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/users`

###Create and upload Photo###
Users may create and upload photos. An array of created photo ids are provided when creating a contact sheet.

####URL####

`POST /api/photos`

####Data params####

`{photo: [binary image file data]}`

####Success response####

`201, {_id: [String], path: [String], userId: [String], displaysCount: [Number], likedBy: [Array(String)]}`

####Error responses####

`404, {error: 'User not found'}`

`400, {error: 'Missing photo'}`

####Sample call####
`$ curl -F photo="@/local/path/to/photo.jpg" -i H "Accept applciation/json" -X POST http://hello%40example.org:qwerty@127.0.0.1:3000/api/photos`

###Create Contact Sheet###
The contact sheet holds a collection of photos, and keeps track of how many other photos the user has voted for (liked).

####URL####

`POST /api/sheet`

####Data params####

`{photos: [Array(String)]}`

####Success response####

`201, {_id: [String], userId: [String], votesCount: [Number], photos: [Array(String)]}`

####Error responses####

`404, {error: 'User not found'}`

`400, {error: 'Missing photos'}`

`400, {error: 'Minimum of X photos must be provided'}`

####Sample call####

`$ curl -d '{"photos":["5352a2133fad13b40bdd64b1","5352bf963fad13b40bdd64b2"]}' -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST http://hello%40example.org:qwerty@127.0.0.1:3000/api/sheet`

###Get Photos###
The user can access an array of random photos from other users. By default two photos are returned.

####URL####

###Like Photo###
In the context of a Contact Sheet the user likes other photos.
