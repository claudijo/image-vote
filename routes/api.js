var express = require('express');
var User = require('../models/user');

exports.auth = express.basicAuth(User.authenticate);
