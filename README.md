# Watchaty-chat

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

基于 wechaty-puppet-padplus 的微信机器人助手



[Wechaty|NodeJS基于iPad协议手撸一个简单的微信机器人助手-暖喵先森](https://www.zyslx.com/article/11)



#### 目前实现功能

- 自动通过好友验证
  - 当有人添加机器人时，判断验证消息关键字后通过或直接通过
- 每日定时任务（每天在早上6.30的时候发送夸夸语句和今日天气）
- 自动聊天
  - 私聊发送消息即可聊天
  
#### 后续增加功能

- 当博客有内容新增的时候，将通过助手发送数据给订阅者
  - 在开始订阅的时候需要设置信息
- 增加每个人私人时间定时，不在是固定的一个时间统一发送
- 拉人入群
-以及还有功能没有考虑清楚的



#### 结构

```js
|-- src/
|---- config.js		  	# 配置文件
|---- mysqlconfig.js	# 数据库配置文件
|-- index.js				  # 入口文件
|-- pm2.json          # 端口监听文件
|-- package.json
```



#### 最后

技术方面主要借助[这位大佬的开源代码](https://github.com/isboyjc/wechaty-Robot),通过他的文档才能知道如何下手，另外你们也可以通过我的小助手进行体验，期待我们能一起玩耍

![WechatIMG127](./README.assets/WechatIMG127.jpeg)

