'use strict'
const mongoose = require('../config/db.config.js')
var Schema = mongoose.Schema

const feedbackSchema = new mongoose.Schema({
	openid: {
		type: String,
	},
	create_time: {
		type: Date,
		default: Date.now
	},
  title: {
    type: String
  },
  phone: {
    type: String
  },
  content: {
    type: String
  },
  file_path: {
    type: String
  },
  deal: {
    type: Boolean,
    default: false
  }
})

const feebackORM = mongoose.model('feedback', feedbackSchema)
// console.log(accountORM)

module.exports = feebackORM;
