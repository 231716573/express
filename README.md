# express
###Express入门教程
http://www.ybao.org/book/express/5418.html

### 生成 express
通过应用生成器工具 express 可以快速创建一个应用的骨架。
```
npm install express-generator -g
```

-h 选项可以列出所有可用的命令行选项：

```
express -h

  Usage: express [options] [dir]

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -e, --ejs           add ejs engine support (defaults to jade)
        --hbs           add handlebars engine support
    -H, --hogan         add hogan.js engine support
    -c, --css <engine>  add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git           add .gitignore
    -f, --force         force on non-empty directory
```

在当前工作目录下创建一个命名为 myapp 的应用。

```
express myapp

   create : myapp
   create : myapp/package.json
   create : myapp/app.js
   create : myapp/public
   create : myapp/public/javascripts
   create : myapp/public/images
   create : myapp/routes
   create : myapp/routes/index.js
   create : myapp/routes/users.js
   create : myapp/public/stylesheets
   create : myapp/public/stylesheets/style.css
   create : myapp/views
   create : myapp/views/index.jade
   create : myapp/views/layout.jade
   create : myapp/views/error.jade
   create : myapp/bin
   create : myapp/bin/www
```

然后进入目录，并且安装所有依赖包：
```
cd myapp & npm install
```

启动这个应用（Windows 平台使用如下命令）：
```
set DEBUG=myapp & npm start
```
然后在浏览器中打开 http://localhost:3000/ 网址就可以看到这个应用了。i

### 安装第三方中间件

```
// body-parser是一个HTTP请求体解析中间件
// 使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体
npm install body-parser --save 

// cookie-parser 在用 express 生成器构建项目时自动安装的
// 它的作用就是设置,获取和删除 cookie。
npm install cookie-parser --save 

// 图片上传是web开发中经常用到的功能
// 常用的开源组件有multer，可以轻松搞定图片上传。
npm install multer --save

```

### 错误处理

```
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### Express会话管理
```
npm install express-session --save
```

express-session的一些方法:
* Session.destroy():删除session，当检测到客户端关闭时调用。
* Session.reload():当session有修改时，刷新session。
* Session.regenerate()：将已有session初始化。
* Session.save()：保存session。

### nodemon设置修改代码后服务自动重启
``
npm install -g nodemon
```
或者安装到本地
```
npm install nodemon --save
```
在项目目录下创建 nodemon.json 文件
```
{
  "restartable": "rs",
  "ignore": [
    ".git",
    ".svn",
    "node_modules/**/node_modules"
  ],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "watch": [

  ],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js json"
}
```
restartable-设置重启模式 <br>
ignore-设置忽略文件 <br>
verbose-设置日志输出模式，true 详细模式 <br>
execMap-设置运行服务的后缀名与对应的命令 <br>
```
{ 
  "js": "node –harmony" 
} 
```
表示使用 nodemon 代替 node <br>
watch-监听哪些文件的变化，当变化的时候自动重启 <br>
ext-监控指定的后缀文件名<br>

修改app.js文件 <br>
记得注稀最后一行的：module.exports = app;<br>
```
var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

//module.exports = app;//这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来
```
配置已经完成了，现在就差在cmd里输入
```
nodemon app.js
```

### express 使其支持'.html'后缀
在app.js中，将
```
app.set('view engine', 'jade');
```
替换为
```
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
```
就可以了。

其中第一句是让ejs能够识别后缀为’.html’的文件，app.engine 相当于 express2 中的 app.register 。

第二句是使在调用render函数时能自动为我们加上’.html’ 后缀。如果没有第二句，我们就得把res.render(‘users’)写成res.render(‘users.html’)，否则会报错。

需要注意的是，用这种方法在实现模版嵌套的时候，还是需要加后缀。比如在index.html里面引用header.html ：
```
<% include header.html %>
```
这里如果省略了 .html ，还是会报错。