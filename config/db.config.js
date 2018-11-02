'use strict'
const mongoose = require('mongoose');
const db_url = 'mongodb://localhost:27017/safe'

mongoose.connect(db_url, function (err) {
	if (err) {
		console.log(err)
	} else {
		console.log('db ok')
	}
})

module.exports = mongoose;