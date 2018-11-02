'use scrict'
const fs = require('fs');
const uuid = require('node-uuid');
const request = require('request');
const utils = require('../utils/util.js');
const map_config = require('../config/map.config.js');
const recordORM = require('../schema/record.schema.js');
const positionORM = require('../schema/position.schema.js');
const feedbackORM = require('../schema/feedback.schema.js');

let fileController = {}
// 获取上传录音存储
fileController.record = function (req, res) {
  if (req.method === 'POST') {
    let uid = uuid.v1();
    let args = req.body;
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      fs.rename(req.files.record.path, `./files/record/${ uid }.mp3`, function (err) {
        if (err) {
          res.send({code: 301, errMsg: '文件存储失败'})
        } else {
          recordORM.create({uid, filename: uid + '.mp3', travel_id: args.tid, openid: args.openid}, function (err) {
            if (err) {
              res.send({code: 801, errMsg: err})
            } else {
              res.send({code: 1, errMsg: '上传成功'})
            }
          })
        }
      })
    }
  } else if (req.method === 'GET') {
    let args = req.query
    // console.log(args)
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      let nosqlQuery = [
        {
          "$lookup": {
            from: "travels",
            localField: "travel_id",
            foreignField: "_id",
            as: "travels"}
          }
      ]
      let page, page_size
      !args.page ? page = 1 : page = args.page
      !args.page_size ? page_size = 5 : page_size = args.page_size
      recordORM.aggregate(nosqlQuery, function (err, data) {
        utils.pagenation(data, page, page_size).then(res1 => {
          console.log(res)
          res.send({list: res1, code: 1})
        })
      })
    }
  }
}

// 获取当前位置信息
fileController.position = function (req, res) {
  let args = req.body
  console.log(args)
  let qu = `${map_config.location_url}${args.latitude},${args.longitude}&key=${map_config.tencent_map_key}`
  if (args.openid) {
    request.get(qu, function (err, body, data) {
      if (err) {
        ren.send({code: 800, errMsg: err})
      } else {
        console.log(data)
        let pData = JSON.parse(data).result.address_component
        if (args.travel_id) {
          positionORM.create({...args, ...pData}, function (err1) {
            if (err1) {
              res.send({code: 800, errMsg: err1})
            } else {
              res.send({position_detail: pData, code: 1})
            }
          })
        } else {
          res.send({location: pData, code: 1})
        }
      }
    })
  } else {
    res.send({code: 0, errMsg: '无效的openid'})
  }
}

// 反馈相关
fileController.feedback = function (req, res) {
  if (req.method === 'POST') {
    let args = req.body
    let uid = uuid.v1()
    if (!args.openid) {
      res.send({code: 0, errMsg: '无效的openid'})
    } else {
      if (req.files) {
        fs.rename(req.files.imgFile.path, `./files/imgs/${ uid }.png`, function (err) {
          console.log(req.files.imgFile)
          if (err) {
            res.send({code: 301, errMsg: JSON.parse(err)})
          } else {
            let data = {
              file_path: `${uid}.png`,
              openid: args.openid,
              title: args.title,
              phone: args.phone,
              content: args.content
            }
            feedbackORM.create(data, function (err1) {
              if (err1) {
                res.send({code: 800, errMsg: err1})
              } else {
                res.send('提交成功')
              }
            })
          }
        })
      } else {
        let data = {
          file_path: '',
          openid: args.openid,
          title: args.title,
          phone: args.phone,
          content: args.content
        }
        feedbackORM.create(data, function (err1) {
          if (err1) {
            res.send({code: 800, errMsg: err1})
          } else {
            res.send({code: 1, errMsg: '提交成功'})
          }
        })
      }
    }
  }
}
module.exports = fileController
