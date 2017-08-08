$(window).ready(function () {
	$('.finish').on('click', function () {
		var $this = $(this);
		var description = $('.description').val();
		var qq = $('.qq').val();
		var wb = $('.wb').val();

		if (description.length > 150) {
			hint('描述有点长，只能在150个字符以内');
			return;
		}
		if (qq.length > 100 || wb.length > 100) {
			hint('链接长度过长');
			return;
		}
		var data = 'description=' + description + '&qq=' + qq + '&wb=' + wb;
		$this.html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
		$.ajax({
			type: 'post',
			url : '/api/user/edit',
			data: data,
			success: function (msg) {
				hint(msg.hint);
				$this.html('更新');
			}
		})
	});


	uploadAvatar($('#avatar'), $('.avatar-img'));
});
