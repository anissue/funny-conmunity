function hint (text, callback) {
	callback = callback || function () {return false};
	$('body').append('<div id="hint">' + text + '</div>');
	var $hint = $('#hint');
	$hint.animate({
		'top': '0'
	}, 300);
	setTimeout(function () {
		$hint.animate({
			'top': '-60px'
		}, 300, function () {
			$hint.remove();
			callback();
		});
	}, 2000);
}
