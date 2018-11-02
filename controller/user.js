'use scrict'
var accountController = {}
// 引入ORM
const accountORM = require('../schema/account.schema.js');
const contactORM = require('../schema/contact.schema.js');
const travelORM = require('../schema/travel.schema.js');
const recordORM = require('../schema/record.schema.js');
const utils = require('../utils/util.js');
const request = require('request');
const appInfo = {
  appid: 'wxccffe1a08e43a80d',
  appSecret: '7725338b6167808b9edc5ac64509573e'
}


accountController.login = function (req, res) {
	let restful = req.method
	if (restful === 'GET') {
		// console.log(accountORM)
		// console.log(accountORM)
		// accountORM.create({code: '123455', using:false}, function (err) {
		// 	if (err) {
		// 		console.log(err)
		// 	} else {
		// 		cosnolelog(ok)
		// 	}
		// })
		res.send({accountORM: '1234'})
	}
}
// 登陆获取openid
accountController.getAppId = function (req, res) {
	let restful = req.method
	if (restful === 'POST') {
		let code = req.body.code
		const url = utils.getOpenIDURL(code, appInfo)
		request.get(url, function (err, res1, body) {
	    if (err) {
	      res.send(err)
	    } else {
        let openid = JSON.parse(body).openid
        let userData = JSON.parse(body)
        console.log(123)
        console.log(userData)
				accountORM.findOne({openid}, function (err1, data) {
					if (err1) {
						res.send({errMsg: err1, code: 801})
					} else {
						if (!data) {
              res.send({...JSON.parse(body), isNew: 1, code: 1})
						} else {
              res.send({...JSON.parse(body), code: 1, isNew: 0})
						}
					}
				})
	    }
	  })
	}
}

// 获取用户手机号
accountController.get_phone = function (req, res) {
  let args = req.query
  if (args.openid) {
    accountORM.findOne({openid: args.openid}, {phone: 1}, function (err, data) {
      if (err) {
        res.send({code: 800, errMsg: err})
      } else {
        res.send({code: 1, phone: data.phone})
      }
    })
  } else {
    res.send({code: 0, errMsg: '无效的openid'})
  }
}
// 获取验证码
accountController.verify = function (req, res) {
  let args = req.query
  if (!data) {
    res.send({code: 0, errMsg: '无效的token'})
  } else {
    res.send({code: 1, v_code: 8023})
  }
}

// 手机号注册
accountController.sign = function (req, res) {
  let args = req.body
  console.log(args)
  if (!args.openid) {
    res.send({code: 0, errMsg: '无效的openid'})
  } else {
    accountORM.findOne({phone: args.phone}, function (err, data) {
      if (err) {
        res.send({code: 801, errMsg: err})
      } else {
        if (!data) {
          if (Number(args.v_code) !== 8023) {
            res.send({code: 103, errMsg: '验证码错误'})
          } else {
            accountORM.create({...args}, function (err1) {
              if (err) {
                res.send({code: 801, errMsg: err1})
              } else {
                res.send({code: 1, errMsg: '注册成功'})
              }
            })
          }
        } else {
          res.send({code: 880, errMsg: '您已注册'})
        }
      }
    })
  }
}

// 用户联系人
accountController.contact = function (req, res) {
  if (req.method === 'GET') {
    let args = req.query
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      let data = {
        openid: args.openid,
        isDel: false
      }
      contactORM.find(data, function (err, data) {
        if (err) {
          res.send({code: 800, errMsg: err})
        } else {
          // 分页
          res.send({code: 1, contact_list: data})
        }
      })
    }
  } else if (req.method === 'POST') {
    let args = req.body
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      let data = {
        name: args.name, phone: args.phone, openid: args.openid
      }
      contactORM.create(data, function (err) {
        if (err) {
          res.send({code: 800, errMsg: err})
        } else {
          res.send({code: 1, errMsg: '添加成功'})
        }
      })
    }
  } else if (req.method === 'PUT') {
    let args = req.body
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      contactORM.updateOne({_id: args._id}, {name: args.name, phone: args.phone}, function (err) {
        if (err) {
          res.send({code: 800, errMsg: err})
        } else {
          res.send({code: 1, errMSg: '修改成功'})
        }
      })
    }
  } else if (req.method === 'DELETE') {
    let args = req.body
    console.log(args)
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      contactORM.updateOne({"_id": args._id, "openid": args.openid}, {"isDel": true}, function (err, data) {
        if (err) {
          console.log(err)
          res.send({code: 800, errMsg: err})
        } else {
          console.log(data)
          res.send({code: 1, errMSg: '删除成功'})
        }
      })
      // contactORM.findOne({_id: args._id, openid: args.openid}, function (err, data) {
      //   console.log(data)
      //   console.log(err)
      //   res.send({code: 1, errMsg: '删除成功'})
      // })
    }
  }
}

// 历史行程列表
accountController.history = function (req, res) {
  if (req.method === 'GET') {
    let args = req.query
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      // 无id查找列表，有id查看详情
      let openid = args.openid
      if (!args.tid) {
        travelORM.find({openid, is_del: false}, {_id:1, end_date: 1, end_time: 1, end_dist: 1, phone: 1, create_time: 1}, {lean: true}, function (err, data) {
          if (err) {
            res.send({code: 800, errMsg: err})
          } else {
            data.forEach(val => {
              val.show_time = utils.formatTime(val.create_time)
            });
            let page = args.page || 1
            let page_size = args.page_size || 5
            utils.pagenation(data, page, page_size).then(res1 => {
              res.send({code: 1, history: res1})
            })
          }
        })
      } else {
        travelORM.findOne({_id: args.tid}, null, {lean: 1}).exec( function (err, data) {
          if (err) {
            res.send({code: 800, errMsg: err})
          } else {
            console.log(args)
            recordORM.find({travel_id: args.tid, openid: args.openid, isDel: false},{filename: 1, update_time: 1}, {lean: 1}, function (err1, data1) {
              if (err1) {
                res.send({code: 800, errMsg: err1})
              } else {
                data1.forEach(val => {
                  val.show_time = utils.formatTime(val.update_time)
                })
                data.show_time = utils.formatTime(data.create_time)
                res.send({code: 1, history: data, list: data1, code: 1})
              }
            })
          }
        })
      }
    }
  } else if (req.method === 'DELETE') {
    let args = req.body
    travelORM.updateOne({"_id": args._id}, {is_del: true}, function (err) {
      if (err) {
        res.send({code: 800, errMsg: err})
      } else {
        accountORM.updateOne({openid: args.openid}, {using: false}, function (err1) {
          if (err1) {
            res.send({code: 800, errMsg: err1})
          }  else {
            res.send({code: 1, errMsg: '删除成功'})
          }
        })
      }
    })
  }
}

// 用户行程次数
accountController.travel_length = function (req, res) {
  let args = req.query
  if (!args.openid) {
    res.send({code: 0, errMsg: '无效的openid'})
  } else {
    travelORM.count({openid: args.openid}).exec(function (err, len) {
      if (err) {
        res.send({code: 800, errMsg: err})
      } else {
        res.send({travel_length: len, code: 1})
      }
    })
  }
}

module.exports = accountController;
