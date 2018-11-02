'use strict'
const mongoose = require('../config/db.config.js');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const recordSchema = {
  uid: {
    type: String,
  },
  filename: {
    type: String
  },
  isDel: {
    type: Boolean,
    default: false
  },
  openid: {
    type: String
  },
  travel_id: {
    type: ObjectId
  },
  update_time: {
    type: Date,
		default: Date.now
  }
}

const recordORM = mongoose.model('record', recordSchema);

module.exports = recordORM;
