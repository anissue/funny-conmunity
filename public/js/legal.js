// 过滤html标签
function filterTag(text) {
	text = text.
	replace(/</g, '&lt;').
	replace(/>/g, '&gt;');
	return text;
}