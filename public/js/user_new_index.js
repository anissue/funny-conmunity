$(window).ready(function () {
	$('.finish').on('click', function () {
		var loginname = $('.loginname').val();
		var password  = $('.password').val();
		var email = $('.email').val();
		if (checkChar(loginname) !== 1) {
			return hint('昵称不能含有特殊字符!');
		}
		if (!loginname || !password || !email) {
			return hint('不填完是不行得!');
		}
		if (loginname.length < 3 || loginname.length > 12) {
			hint('名字不能太长也不能太短了!');
			return;
		}
		if (password.length < 6) {
			hint('密码不能那么短啊?');
			return;
		}
		if (password.length > 16) {
			hint('密码那么长你记得住?');
			return;
		}
		if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
			hint('邮箱不是这样的吧?');
			return;
		}
		var $This = $(this);
		$This.html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
		var data = 'loginname=' + loginname + '&password=' + md5(password) + '&email=' + email;
		$.ajax({
			type: 'POST',
			url: '/api/user/new',
			data: data,
			success: function (msg) {
				if (msg.states < 1) {
					hint(msg.hint);
					$This.html('注册');
					return;
				}
				window.location.href = '/';
			}
		})
	});
});