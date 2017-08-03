/*
* 操作页面中的帖子
* 	展开和收缩留言
* */



$(window).ready(function () {

	// 打开和收缩留言
	var $reply        = $('.reply');                // 留言页面
	var $replyDefault = $('.default');              // 加载评论动画
	var $replyButton  = $('.reply-button');         // 开关按钮
	var $replyWrap    = $('.reply-wrap');           // 放评论的
	var replyModel    = $('#replyTemplate').html(); // 评论模块

	$replyButton.on('click', function () {
		this.off = !this.off;  // 看看是展开还是收缩

		var $This = $(this);
		var height = $This.offset().top - 130;

		$('html,body').animate({scrollTop: height}, 300);

		var index = $replyButton.index($This);
		if (this.off) {
			$reply.eq(index).css('display', 'block');
		} else {
			$reply.eq(index).css('display', 'none');
		}
		if (!this.one) {
			this.one = true;       // 记录是否第一次点击
			getReply(1, function (data) {
				// 组成评论
				var temp = '';
				for (var i = 0; i < data.length; i++) {
					temp +=
						replyModel.replace('[name]', data[i].name).
						replace('[avatar]', data[i].avatar).
						replace('[text]', data[i].text).
						replace('[like]', data[i].like).
						replace('[floor]', data[i].floor);
				}
				$replyDefault.eq(index).css('display', 'none');
				$replyWrap.eq(index).append(temp);
			});
		}

	});


	// 喜欢
	var $likeButton = $('.like');
	var $likeIcon   = $('.like i');
	$likeButton.on('click', function () {
		var $This = $(this);
		var index = $likeButton.index($This);
		$This.css({'backgroundColor': '#eff3f5', 'color': '#3498DB'});

		$likeIcon.eq(index).html('&#xe60a;');
		$likeIcon.eq(index).css({
			'color': '#FF6161',
			'animation': 'like .6s ease',
			'-webkit-animation': 'like .6s ease',
			'textShadow': '0 0 10px #ff7ebc'
		})
	})
});
