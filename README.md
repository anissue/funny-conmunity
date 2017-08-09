-# funny-conmunity
```javascript
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
│  ├─css                  // 样式文件
│  ├─img                  // 公用图片
│  │      logo.png         // 网站logo
│  └─js                   // js 文件
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
├─controllers              // 路由控制
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
├─avatar                   // 用户头像
│  └─default              // 存放用户默认头像
├─fmdb                     // 数据操作
│      topic_passed.js      // 未通过的帖子
│      topic.js             // 通过审核的帖子
│      user.js              // 用户
│      reply.js             // 回复
│      rank.js              // 排行
│      index.js             // 代理
│
└─picture
```