'use strict'
const mongoose = require('../config/db.config.js')

const travelSchema = new mongoose.Schema({
	openid: {
		type: String,
	},
	create_time: {
		type: Date,
		default: Date.now
	},
  transform_number: {
    type: String
  },
	phone: {
		type: Number
	},
  start_dist: {
    type: String
  },
  start_dist_detail: {
    type: String
  },
  end_dist: {
    type: String
  },
  end_dist_detail: {
    type: String
  },
  end_date: {
    type: String
  },
  end_time: {
    type: String
  },
  is_end: {
    type: Boolean,
    default: true
  },
	is_del: {
		type: Boolean,
		default: false
	},
	real_end_time: {
		type: Date
	}
})

const travelORM = mongoose.model('travel', travelSchema)
// console.log(accountORM)

module.exports = travelORM;
