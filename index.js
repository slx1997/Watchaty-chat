//引入必须的包
var express = require("express");
var qrImg = require('qr-image');
const { Wechaty } = require("wechaty") // Wechaty核心包
const { PuppetPadplus } = require("wechaty-puppet-padplus") // padplus协议包
const { Friendship } = require("wechaty")
const config = require("./src/config") // 配置文件
//引入定时任务
const schedule = require('node-schedule');
var fs = require('fs');
var request = require('request');
//连接mysql数据库
const conn = require('./src/mysqlconfig');
const connectionmysql = conn();
//创建腾讯闲聊机器人
const tencentcloud = require("tencentcloud-sdk-nodejs");
const NlpClient = tencentcloud.nlp.v20190408.Client;

var app = express();

const addFriendKeywords = config.personal.addFriendKeywords

// 初始化
const bot = new Wechaty({
  puppet: new PuppetPadplus({
    token: config.token
  }),
  name: config.name
})

//初始化腾讯闲聊机器人，创建链接
const clientConfig = {
  credential: {
    secretId: "你的腾讯AI的secretId",
    secretKey: "以及对应的密码",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "nlp.tencentcloudapi.com",
    },
  },
};

const client = new NlpClient(clientConfig);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

bot
	.on("scan", function onScan(qrcode, status) {
		var img = qrImg.image(qrcode, { size: 10 });
		img.pipe(fs.createWriteStream("logo.png"));
	})
	.on('login', async user => {
		schedule.scheduleJob('0 30 6 * * *',async function() {
			var usersql = "SELECT * FROM sendwechatuser";
			connectionmysql.query(usersql, async (err1, data1) => {
				if (err1) console.log(err1);
				var userdata = JSON.stringify(data1)
				for (var i = 0; i < data1.length; i++){
					const contact1 = await bot.Contact.find({name: JSON.parse(userdata)[i].name})
					if(JSON.parse(userdata)[i].chp == 1){
						var sql = "SELECT content FROM soul";
						connectionmysql.query(sql, async (err, data) => {
							if (err) console.log(err);
							var Range = data.length - 1;
							var Rand = Math.random();
							var id = Math.round(Rand * Range) + 1;
							var content = JSON.stringify(data)
							await contact1.say(JSON.parse(content)[id].content)
						});
					}
					if(JSON.parse(userdata)[i].wea == 1){
						var url = 'https://tianqiapi.com/api?version=v6&appid=你的appid&appsecret=你的密码&city='+ encodeURI('如皋');
						request(url, async function(err, response, body){
							var tis = "当前实时温度："+ JSON.parse(body).tem +"℃\n"+
								"天气为：" + JSON.parse(body).wea + "\n"+
								"温度为：" + JSON.parse(body).tem2 + "℃ - " + JSON.parse(body).tem1 +"℃\n"+
								"风力等级：" + JSON.parse(body).win_speed + " \n"+
								"风速：" + JSON.parse(body).win_meter + " \n" + 
								"空气质量：" + JSON.parse(body).air + "\n" + 
								"空气质量等级：" + JSON.parse(body).air_level + "\n" + 
								"空气质量小贴士：" + JSON.parse(body).air_tips
							await contact1.say(tis)
							// console.log(JSON.parse(body).tem)//实时温度
							// console.log(JSON.parse(body).wea)//天气
							// console.log(JSON.parse(body).tem1)//白天温度(高温)
							// console.log(JSON.parse(body).tem2)//白天温度(低温)
							// console.log(JSON.parse(body).win)//风向
							// console.log(JSON.parse(body).win_speed)//风力等级
							// console.log(JSON.parse(body).win_meter)//风速
							// console.log(JSON.parse(body).air)//空气质量
							// console.log(JSON.parse(body).air_tips)//天气提示
							// console.log(JSON.parse(body).air_level)
						})
					}
				}
			})
		});
	})
	.on("message", async message => {
		if(message.self()) return ;
		const contact = message.from()
		const contact1 = await bot.Contact.find({name: contact.name()})
		var params = {
			"Query": message.text()
		}
		client.ChatBot(params).then(
			async function(data){
				await contact1.say(data.Reply)
			},
			(err) => {
				console.error("error", err);
			}
		);
	})
	.on("friendship", function onFriendShip(friendship){
		switch (friendship.type()) {
			case Friendship.Type.Receive:
			  if (addFriendKeywords.some(v => v == friendship.hello())) {
				friendship.accept()
			  }
			  break
		  }
	})
	.start();

var server = app.listen(8090, function() {
    var host = server.address().address;
    var port = server.address().port;

//    console.log("服务器启动成功了端口是", port);
})
