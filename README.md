# express
###Express入门教程

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