'use strict'
const mongoose = require('../config/db.config.js')

const accountSchema = new mongoose.Schema({
	openid: {
		type: String,
	},
	login_time: {
		type: Date,
		default: Date.now
	},
	using: {
		type: Boolean,
		default: false
	},
	nickName: {
		type: String
	},
	country: {
		type: String
	},
	province: {
		type: String
	},
	city: {
		type: String
	},
	gender: {
		type: Number
	},
	avatarUrl: {
		type: String
	},
	phone: {
		type: String
	}
})

const accountORM = mongoose.model('account', accountSchema)
// console.log(accountORM)

module.exports = accountORM;
