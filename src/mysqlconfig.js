const mysql = require('mysql')

const connectdb=()=>{
  let connection = mysql.createConnection({
    host     : '你的数据库地址',
    port     : '数据库端口',
    user     : '数据库用户名',
    password : '数据库密码',
    database : '数据库名称'
  }) 
  return connection;
}

module.exports=connectdb;