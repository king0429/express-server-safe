'use scrict'

var travelController = {}
const util = require('../utils/util.js');
// 引用orm
const travelORM = require('../schema/travel.schema.js');
const accountORM = require('../schema/account.schema.js');

// 创建
travelController.createTravel = function (req, res) {
  let args = req.body;
  if (!args.openid) {
    res.send({code: '100', errMsg: 'openid未传输'})
  } else {
    accountORM.findOne({openid: args.openid}, function (err1, data) {
      if (err1) {
        res.send({errInfo: err1, code: 801})
      } else {
        if (!data) {
          res.send({code: 102, errMsg: '无效的token'})
        } else {
          travelORM.create({...args, is_end: false}, function (err2, data2) {
            if (err2) {
              res.send({code: 801, errMsg: err2})
            } else {
              res.send({code: 1, tid: data2._id, errMsg: '创建成功'})
            }
          })
        }
      }
    })
  }
}

// 查看
travelController.getTravel = function (req, res) {
  let args = req.query
  if (!args.id) {
    res.send({code: 0, errMsg: '无效的行程'})
  } else {
    travelORM.findOne({"_id": args.id, openid: args.openid}, function (err, data) {
      if (err) {
        res.send({code: 801, errMsg: err})
      } else {
        console.log(data)
        res.send({code: 1, detail: data})
      }
    })
  }
}

// 结束
travelController.endTravel = function (req, res) {
  let args = req.body
  if (!args.id) {
    res.send({code: 0, errMsg: '无效的行程'})
  } else {
    travelORM.findOne({"_id": args.id, openid: args.openid}, function (err, data) {
      if (err) {
        res.send({code: 801, errMsg: err})
      } else {
        if (!data) {
          res.send({code: 301, errMsg: '行程不存在'})
        } else  {
          if (Number(data.phone) === Number(args.phone)) {
            travelORM.updateOne({"_id": args.id}, {"is_end": true, real_end_time: new Date()}, function (err1, data2) {
              if (err1) {
                res.send({code: 802, errMsg: err1})
              } else {
                res.send({code: 1, errMsg: '取消成功'})
              }
            })
          } else {
            res.send({code: 301, errMsg: '手机号错误'})
          }
        }
      }
    })
  }
}

// 状态检测
travelController.using = function (req, res) {
  let args = req.body
  console.log(args)
  if (!args.openid) {
    res.send({code: 0, errMsg: '无效的openid'})
  } else {
    travelORM.findOne({openid: args.openid, is_end: false}, function (err, data) {
      if (err) {
        res.send({code: 801, errMsg: err})
      } else {
        let is_using = -1
        let tid = null
        // data ? is_using = 1, tid = data._id : is_using = 0
        if (data) {
          is_using = 1
          tid = data._id
        } else {
          is_using = 0
        }
        res.send({code: 1, is_using, tid})
      }
    })
  }
}
module.exports = travelController;
