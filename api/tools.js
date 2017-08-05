

/*
 * 把指定的 json 装换为重定向地址
 * json = {
 * 	states: *,
 * 	hint: *,
 *   data: *
 * }
 * */
exports.parseRedirect = function (json, res) {
	res.redirect('/uploadredirect/' + json.states + '/' + json.hint + '/' + json.data);
};


// 格式化时间
exports.time = function () {
	var date = new Date();
	return  '' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' +  date.getSeconds() + '_' + date.getMilliseconds() + '_' + Math.random();
};

// 过滤脚本标签
exports.filterTag = function (text) {
	text = text.
	replace(/</g, '&lt;').
	replace(/>/g, '&gt;').
	replace(/\//, '&frasl;');
	return text;
};

function checkChar (str) {
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
	if (pattern.test(str)) {
		return -1;
	} else {
		return 1;
	}
}