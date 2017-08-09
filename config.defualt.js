var config = {
	domain: '',

	title: '逗你的 (正经网站)',

	description: '网站描述',

	keywords: '关键字',

	mini_assets: false,  // 启用静态资源压缩

	static_host: '',    // cdn 静态文件储存域名

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

	// 七牛图片空间，帖子储存在本地的话，这里留空
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
	session_secret: '随便输入点啥就好了啦(字母,符号,数字)',

	// token 密匙
	token_secret: '随便输入点啥就好了啦(字母,符号,数字)',

	// 用户密码 密匙
	password_secret: '随便输入点啥就好了啦(字母,符号,数字)',

	// 多少人同意通过审核就展示这个帖子
	// 多少人不同意就隐藏掉这个帖子
	pass_count: 3,

	// 发布时给1到多少区间的赞
	start_like: 10,

	// 点赞时随机给多少区间的赞
	like: 10,

	// 一页显示多少条帖子
	topic_limit: 20,

	// 一页显示多少评论
	reply_limit: 20,

	// 默认头像有多少张
	avatar_default_count: 80,

	// 帖子最大多少m
	max_topic_img: 3
};
module.exports = config;