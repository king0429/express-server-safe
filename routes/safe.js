'use strict'
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const accountController = require('../controller/user.js');
const travelController = require('../controller/travel.js');
const fileController = require('../controller/file.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'safe_api' });
});
// 登陆
router.get('/test', accountController.login)
// 获取openID
router.post('/get_appid', accountController.getAppId)
// 获取短信验证码
router.get('/verify', accountController.verify)
// 创建行程
router.post('/safe', travelController.createTravel)
// 查看当前行程
router.get('/safe', travelController.getTravel)
// 手动结束行程
router.put('/safe', travelController.endTravel)
// 注册
router.post('/sign', accountController.sign)
// 检测是否正在使用
router.post('/is_using', travelController.using)
// 获取录音文件
router.all('/record', multipartMiddleware, fileController.record)
// 获取当前位置记录
router.put('/position', fileController.position)
// 联系人管理
router.all('/contact', accountController.contact)
// 反馈相关
router.all('/feedback', multipartMiddleware, fileController.feedback)
// 历史行程
router.all('/history', accountController.history)
// 总行程数量
router.get('/travel_length', accountController.travel_length)
// 获取当前用户手机号
router.get('/user_phone', accountController.get_phone)
module.exports = router;
