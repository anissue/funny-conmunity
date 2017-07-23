$(window).ready(function () {
	window.login_state = false;
	$.ajax({
		type: 'post',
		url: '/api/user/islogin',
		success: function (msg) {
			if (msg.states === 1) {
				window.login_state = true;
			} else if (msg.states < 1) {
				window.login_state = false;
			}
			bind();
		}
	});
});

// 主要用于登录和没登录后能做那些事情
function bind() {
	var login = window.login_state;

	// 首页投稿点击
	$('.post-up').on('click', function () {
		if (!login) return hint('登陆后才能进行投稿！');
		window.location.href = '/post/up';
	});
}


// 上传帖子图片
function uploadPostImg(input, img) {
	uploadAvatar(input, img, function () {
		$('#form-img').css('display', 'none');
		$('.show-img').css('display', 'block');
	})
}

// 上传头像的
function uploadAvatar(input, img, callback) {
	callback = callback || function () {};
	$(input).on('change', function () {
		var login = window.login_state;
		if (!login) return hint('登陆后才能进行操作！');
		if (this.files !== undefined) {
			var file = this.files[0];
			var type = ['image/png','image/jpeg','image/gif'];

			if (file.size > 1024 * 1024 * 5) {
				hint('大小不能超过2M');
				return;
			}
			if (type.indexOf(file.type) === -1) {
				hint('只能为 jpg, png, gif格式');
				return;
			}
		}
		var iframeAvatar = document.getElementById('iframe-img');
		var $formImg = $('#form-img');
		$formImg.submit();
		$formImg.append('<div class="spinner spinner-position spinner-blue"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
		var url = '';

		var time = setInterval(function () {
			url = iframeAvatar.contentWindow.window.location.href;
			if (url.indexOf('uploadredirect') !== -1) {
				clearInterval(time);
				parseUrl(url, callback);
				$('.spinner').remove();
			}
		}, 100)
	});

	function parseUrl(url, callback) {
		var prefix = 'uploadredirect/';
		url = url.substring(url.indexOf(prefix) + prefix.length);
		url = url.split('/');
		if (url.length !== 3) {
			hint('图片上传错误');
			return;
		}
		url[1] = decodeURIComponent(url[1]);
		if (url[0] < 1) {
			hint(url[1]);
			return;
		}
		if (url[0] > 0) {
			hint(url[1]);
			$(img).attr('src', '/avatar/' + url[2] + '?t=' + new Date().getTime());
			console.log(callback);
			callback();
		}
	}
}