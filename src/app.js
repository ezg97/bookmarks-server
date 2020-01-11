//  --- requirements ---
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston');
const uuid = require('uuid/v4');
const { NODE_ENV } = require('./config');

const errorHandler = require('./error-handler')
const validateBearerToken = require('./validate-bearer-token')
const bookmarksRouter = require('./bookmarks/bookmarks-router')

//  --- middleware ---
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(validateBearerToken)

app.use(bookmarksRouter)

//  --- endpoints ---
app.get('/', (req, res) => {
    res.send('Hello, world!')
});



//last middleware in pipeline
app.use(errorHandler)
  
//  --- export ---
module.exports = app;

