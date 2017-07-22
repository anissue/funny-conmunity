// 上传图片
function uploadAvatar(input, img) {
	$(input).on('change', function () {
		if (this.files !== undefined) {
			var file = this.files[0];
			var type = ['image/png','image/jpeg','image/gif'];

			if (file.size > 1024 * 1024) {
				hint('头像大小不能超过1M');
				return;
			}
			if (type.indexOf(file.type) === -1) {
				hint('头像只能为 jpg, png, gif格式');
				return;
			}
		}
		var iframeAvatar = document.getElementById('iframe-avatar');
		var $formAvatar = $('#form-avatar');
		$formAvatar.submit();
		$formAvatar.append('<div class="spinner spinner-position spinner-blue"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
		var url = '';

		var time = setInterval(function () {
			url = iframeAvatar.contentWindow.window.location.href;
			if (url.indexOf('uploadredirect') !== -1) {
				clearInterval(time);
				parseUrl(url);
				$('.spinner').remove();
			}
		}, 100)
	});

	function parseUrl(url) {
		var prefix = 'uploadredirect/';
		url = url.substring(url.indexOf(prefix) + prefix.length);
		url = url.split('/');
		if (url.length !== 3) {
			hint('头像上传错误');
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
		}
	}
}


