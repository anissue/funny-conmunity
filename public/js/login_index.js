$(window).ready(function () {
	$('.finish').on('click', function () {
		var loginname = $('.loginname').val();
		var password  = $('.password').val();

		if (!loginname || !password) {
			hint('请完整填写选项!');
			return;
		}
		var $This = $(this);
		$This.html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');

		var data = 'loginname=' + loginname + '&password=' + md5(password);
		$.ajax({
			type: 'POST',
			url: '/api/user/login',
			data: data,
			success: function (msg) {
				if (msg.states < 1) {
					hint(msg.hint);
					$This.html('登录');
					return;
				}
				window.location.href = '/';
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				$This.html('登录');
				hint('服务器开了下小差! O__O');
			}
		})
	});
});
