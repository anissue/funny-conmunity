# funny-conmunity

## 前言
**我是一个经不起批评的人，如果你们批评我， 我就
夸你们**

	这是一个以社区为形式的内容分享网站
	由于是在暑假期间写的，家里的电脑不能装Linux，换成 Linux 的话估计要挨揍。
	所以只能在 window 环境下写，不保证linux的兼容性。
	这也许是史上第一个不去兼容 Linux 的网站项目吧。

## 说明
	细心的话会发现项目结构和 [cnode](https://github.com/cnodejs/nodeclub) 的很像
	写这个项目主要是为了更好的学习，理解 Node
	前端代码是快速撸出来的，没有去兼容其他浏览器。建议使用 chrome 新版查看
	手机端的效果不太理想，刚开始是准备电脑和手机端分开写的，但是 ... 但是由于  ...懒 没有分开写
	最后...  虽然写的不怎么样，但是我脸皮厚啊，请你们帮我把右上角的 "star" 点亮 (#^.^#)

## 效果演示
在线地址：  [正经网站](http://www.dounide.com) 由于图片是来自网上的，所以你们看到什么不可描述的东西不要怪我，反正网站是正经的

## 功能
- [x]注册
- [x] 登陆
- [x] qq 登陆
- [x] 微博登陆
- [x] 修改资料
- [x] qq 登陆
- [x] 发帖
- [x]  审帖
- [x]  回复
- [ ]  站内信
	后面我会继续更新其他功能，可以 “follow” 一下，一起学习

## 开发环境
 [Node.js](https://nodejs.org) 版本  v6.11.0，[MongoDB](https://www.mongodb.org) 版本是 v3.4.5
```
1. 环境中必须有 Node.js 和 MongoDb
2. 启动 MongoDB 数据库
3. npm install 安装项目依赖包
4. 根据需求修改配置文件 config.default.js => config.js
5. 运行 app.js
6. 访问 127.0.0.1:3000
```

## 目录
```
│  app.js                   // 入口
│  config.defualt.js        // 配置文件，修改后重命名为 config.js
│  web_router.js            // 页面路由
│  api_router.js            // api 路由
│  package.json             // 依赖管理
│
├─node_modules             // 组件包
│
├─public                   // 静态资源
│  │  favicon.ico          // 网站小图标
│  ├─css                   // 样式文件
│  ├─img                   // 公用图片
│  │      logo.png         // 网站logo
│  └─js                    // js 文件
│
├─views
│  │  footer.html          // 公用页脚
│  │  header.html          // 公用头部
│  │  index.html           // 网站主页
│  │
│  ├─body
│  │      body.html        // 组成页面的板块
│  │      reply.html       // 回复板块
│  │      to.html          // 右边悬浮工具
│  │      paging.html      // 分页
│  │      page.html        // 组成帖子的板块
│  │      post.html        // 帖子主要板块
│  │
│  ├─post
│  │      pass.html        // 审核页面
│  │      upload.html      // 上传帖子
│  │
│  ├─sidebar
│  │      sidebar.html     // 右边侧栏
│  │      user_rank.html   // 用户排行板块
│  │      post_rank.html   // 帖子排行板块
│  │      community.html   // 社区板块
│  │
│  └─user
│          body.html        // 组成用户页面主要板块
│          edit.html        // 修改用户资料
│          header.html      // 用户头部
│          center.html      // 用户中心
│          login.html       // 登陆页面
│          new.html         // 注册页面
│          index.html       // 用户主页
│          reply.html       // 用户的回复
│          topic.html       // 用户的帖子
│          reply_page.html  // 回复板块
│
├─middlewares
│      auth.js              // 第三方授权登陆
│      wb_auth.js           // 微博登录
│      qq_auth.js           // q q 登录
│
├─controllers               // 路由控制
│      post.js              // 帖子的路由控制
│      user.js              // 用户的路由控制
│      auth.js              // 所有的请求都添加授权
│
├─api
│      middlewares.js       // 所有的请求都添加授权
│      post.js              // 关于帖子的 api 操作
│      user.js              // 关于用户的 api 操作
│      tools.js             // 一些小工具
│      upload_img.js        // 上传图片的逻辑
│
├─models
│      index.js             // 代理
│      topic.js             // 未通过审核的帖子结构
│      topic_passed.js      // 通过审核的帖子结构
│      reply.js             // 回复结构
│      user.js              // 用户结构
│
├─avatar                    // 用户头像
│  └─default                // 存放用户默认头像
├─fmdb                      // 数据操作
│      topic_passed.js      // 未通过的帖子
│      topic.js             // 通过审核的帖子
│      user.js              // 用户
│      reply.js             // 回复
│      rank.js              // 排行
│      index.js             // 代理
│
└─picture
```