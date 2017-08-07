$(window).ready(function () {
	$('.back').on('click', function () {
		if (document.referrer === window.location.href || document.referrer.indexOf('http://' + document.domain) === -1) {
			window.location.href = '/';
			return;
		}
		window.history.back();
	});
});