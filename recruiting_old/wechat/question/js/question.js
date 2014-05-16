!function() {
	$(document).ready(function() {
		$('#send-question').click(sendQuestion);
		initList();
	});
	var recruiting = recruiting || {};
	recruiting.question = {
		questionUrl : '${base.url}question'
	}

	function sendQuestion() {
		var questionContent = $('#question-content').val();
		if (!$.trim(questionContent)) {
			notification.generate({text:'您的问题为空了！', type : 'warning'});
			return false;
		}
		var data = {
			question : questionContent,
			openId : $('#openId').val()
		};
		ajax({
			url : recruiting.question.questionUrl,
			data : data,
			success : function(data) {
				if (data) {
					$('#question-content').val('');
				}
			}
		});
	}

	function initList() {
		var paggination = {
			page : 1,
			size : 20
		};
		/*
		 * ajax({url : '/recruting/question', method : 'GET', data : data,
		 * success : function(data){ if (data) { $.each(data.list, function(i,
		 * v) { data.list[i].number = parseInt(i) + 1; }); if (data.list.length) {
		 * var html = $('#question_list_tmpl').render(data.list);
		 * $('#questionList').html(html); } } }});
		 */
		$(document).scrollPagination(
				{
					method : 'GET',
					contentPage : recruiting.question.questionUrl + '?t='+ Math.random(),
					contentData : {
						offset : 0,
						size : paggination.size
					},
					scrollTarget : $(window),
					heightOffset : 90,
					dataType : 'json',
					scrolling : false,
					handleData : function(data) {
						var json = data.data;
						var offset = this['contentData'].offset;
						if (offset >= json.pagination.totalRecords) {
							$('#nomoreresults').fadeIn();
							$(document).stopScrollPagination();
							setTimeout(function() {
								$('#nomoreresults').fadeOut('slow');
							}, 1000);
							return false;
						}
						if (json) {
							$.each(json.list, function(i, v) {
								json.list[i].number = offset + parseInt(i) + 1;
							});
							if (json.list.length) {
								var html = $('#question_list_tmpl').render(json.list);
								$('#questionList').append(html);
							}
						}
						this.scrolling = true;
						this['contentData'].offset = this['contentData'].offset + paggination.size;
					},
					'beforeLoad' : function() {
						$('#loading').fadeIn();
						if (this.scrolling) {
							return;
						}
					},
					'afterLoad' : function(elementsLoaded) {
						$('#loading').fadeOut();
						this.scrolling = false;
					}
				});
	}

	function ajax(param) {
		$.ajax({
			url : param.url,
			method : param.method || 'POST',
			beforeSend : notification.blockUI,
			dataType : 'json',
			data : param.data,
			success : function(data) {
				if (data.code != 200 || !data.data) {
					notification.generate({text : '服务好像出错了，请稍等！', type : 'error'});
				}
				notification.generate();
				param.success(data.data);
			},
			error : function(data) {
				notification.generate({text : '服务好像出错了，请稍等！', type : 'error'});
			},
			complete : notification.unblockUI
		});
	}
	
	var notification = notification || {};
	notification.generate = function(options) {
		options = options || {};
		var n = noty({
			text : options.text || '操作成功了！',
			type : options.type || 'alert',
			dismissQueue : true,
			layout : options.layout || 'top',
			theme : 'defaultTheme',
			timeout : options.timeout != undefined ? options.timeout : 1500,
			maxVisible : 1
		});
	};
	notification.blockUI = function() {
		var blockUIDiv = "<div id='blockUI' class= blockOverlay' style='z-index: 1000; border: none; margin: 0px; padding: 0px; width: 100%; height: 100%; top: 0px; left: 0px; background-color: rgb(0, 0, 0); opacity: 0.6; cursor: wait; position: fixed;'></div>"
		$('body').append(blockUIDiv);
	}
	notification.unblockUI = function() {
		$('#blockUI').remove();
	}
}();
