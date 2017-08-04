// 过滤html标签
function filterScript(text) {
	text = text.
	replace(/</g, '&lt;').
	replace(/>/g, '&gt;');
	return text;
}