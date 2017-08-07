
// 屏幕宽度
var clientWidth = $(window).width();
var sideOffsetTop = '';
var $sideFloat = {};

$(window).resize(function () {
	clientWidth = $(window).width();
	$sideFloat.css({position: 'static',top: '60px'});
	sideOffsetTop = $sideFloat.offset().top - 60;
});


$(window).ready(function () {
	var $header    = $('#header');
	var $logoBar   = $('.band');
	var $page      = $('.page');
	var $toTop     = $('.to-top');
	var $toBottom  = $('.to-bottom');
	var pageOffsetTop = 0;
	$sideFloat = $('.side-float');
	sideOffsetTop = $sideFloat.offset().top - 60; // 侧边栏到顶部的高度 减去头部的高度


	// 头部的显示和隐藏
	function head () {
		
		if (clientWidth < 800) {

			if ($(this).scrollTop() > 100) 
				$logoBar.css('display', 'none');
			else
				$logoBar.css('display', 'block');

		} else {

			$logoBar.css('display', 'block');
		}
	}

	// 侧边栏的浮动
	function side() {
		var scrollTop = $(window).scrollTop();
		if (scrollTop > sideOffsetTop) {
			$sideFloat.css({
				position: 'fixed',
				top: '60px'
			});
		} 
		if (scrollTop < sideOffsetTop){
			$sideFloat.css({
				position: 'static',
				top: '60px'
			});
		}

		if (scrollTop + 60 > pageOffsetTop) {
			$sideFloat.css({
				position: 'absolute',
				top: pageOffsetTop + 'px'
			});
		}
	}

	$toTop.on('click', function () {
		$('html,body').animate({
			scrollTop: 0
		}, 300);
	});

	$toBottom.on('click', function () {
		$('html,body').animate({
			scrollTop: $(document).height()
		}, 300);
	});

	$('#skip-bn').on('click', function () {
		$skipTo = $('#skip-to');
		if ($skipTo.val() === '') {
			hint('要输入页数啊!');
			return;
		}
		window.location.href = $skipTo.attr('paging-link') + $skipTo.val();
	});

	$(window).scroll(function () {

		pageOffsetTop = $page.offset().top + $page.height() - $sideFloat.height(); //打开和关闭评论会影响到page的高度，所以每次都重新获取下
		head();
		side();
	});

	$('.share-bn').on('click', function () {
		if (clientWidth < 800) {
			hint('点击浏览器的选项栏就可以分享啦!');
		}
	});
});
