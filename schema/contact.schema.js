'use strict'
const mongoose = require('../config/db.config.js')
var Schema = mongoose.Schema

const contactSchema = new mongoose.Schema({
	openid: {
		type: String,
	},
	create_time: {
		type: Date,
		default: Date.now
	},
  name: {
    type: String
  },
  phone: {
    type: String
  },
  isDel: {
    type: Boolean,
    default: false
  },
  used: {
    type: Number,
    default: 0
  }
})

const contactORM = mongoose.model('contact', contactSchema)
// console.log(accountORM)

module.exports = contactORM;
