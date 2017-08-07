var config = {
	title: '逗你的 一个正经网站',

	description: '网站描述',

	keywords: '关键字',

	// 微博授权 http://open.weibo.com/
	wb: {
		ID: '',
		SECRET: '',
		CALLBACK_URI: ''
	},

	// qq授权 https://connect.qq.com/
	qq: {
		ID: '',
		SECRET: '',
		CALLBACK_URI: ''
	},

	// 七牛图片空间，帖子图片加载本地的话，这里不需要更改
	// 保存在本地的话，下面的都留空
	qiniu: {
		ACCESS_KEY: '',
		SECRET_KEY: '',
		BUCKET: '', // 图片仓库名
		watermark: '', // 水印样式
		shrink: '',  // 缩放样式
		URL: '' // 地址头
	},

	// 数据库配置
	db: 'mongodb://127.0.0.1/funny_conmunity',

	// session 密匙
	session_secret: 'qWjou456W.qouY',

	// token 密匙
	token_secret: 'qiouwWOU.WREJL?&29',

	// 用户密码 密匙
	password_secret: 'Qoiu)23&.,w!',

	// 帖子展示的话，需要多少人同意通过 t.t。
	// 当多少人不同意时隐藏帖子也是这个
	pass_count: 1,

	// 发布时给1到多少区间的赞
	start_like: 10,

	// 点赞时随机给多少区间的赞
	like: 10,

	// 一页显示多少条帖子
	topic_limit: 20,

	// 一页显示多少评论
	reply_limit: 20
};

module.exports = config;