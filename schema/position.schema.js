'use strict'
const mongoose = require('../config/db.config.js')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const positionSchema = new mongoose.Schema({
	openid: {
		type: String,
	},
	get_time: {
		type: Date,
		default: Date.now
	},
  travel_id: {
    type: ObjectId
  },
  nation: {
    type: String,
    default: '中国'
  },
  province: {
    type: String,
    default: '未知区域'
  },
  district: {
    type: String,
    default: '未知城市'
  },
  street: {
    type: String,
    default: '未知街区'
  },
  street_number: {
    type: String,
    default: '未知街道'
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  }
})

const positionORM = mongoose.model('position', positionSchema)
// console.log(accountORM)

module.exports = positionORM;
