
!function($){
    var questionsURL = wcm.getApiURL('questions'),
        wcm_message = wcm_message || {};

    wcm_message.isShowBoxOrNot = function(elm, isShow, sector) {
        var $sector = $(elm).parents('.question-wrapper').find(sector);

        if (!!isShow) {
            if (!!$sector.hasClass('hide')) {
                $sector.removeClass("hide");
            } else {
                $sector.show();
            }
        } else {
            $sector.hide();
        }
    };

    wcm_message.initList = function(currentPageNum, url) {
        var params = {
            page: currentPageNum || 1,
            size: 10
        };
        url = url || questionsURL;
        sun.ajax.getJSON(url, params, function(jsonData) {
            var json = jsonData.data;
            $('#questionCount').text('(' + json.pagination.totalRecords + ')');
            sun.util.each(json.list, function(v, i) {
                json.list[i].createTime = sun.util.formatTime('yyyy-MM-dd hh:mm:ss', v.create_time);
                json.list[i].number = (params.page - 1) * params.size + parseInt(i) + 1;
            });
            if (json.list.length) {
            	 var html = $('#question_list_tmpl').render(json.list);

                 $('#question_all').html(html);

                 $('#DOM_pgn').bootstrapPaginator({
                     currentPage: json.pagination.pageNum,
                     totalPages: json.pagination.totalPage,
                     onPageChanged: function(event, oldPage, newPage) {
                         wcm_message.initList(newPage, url);
                     }
                 });
            }else {
            	$('#question_all').html("<div class='no-data'>无数据</div>");
            	$('#DOM_pgn').empty();
            }
            
        });
    };

    wcm_message.bindEvent = function() {
        // reply button
        var $containerEle = $('#question_all');
        $containerEle.off('click', '.reply-question');
        $containerEle.on('click', '.reply-question', function() {
            var tag = this.getAttribute('data-tag');
            if (!!tag && tag === 'show') {
                this.innerText = '回答';
                this.setAttribute('data-tag', 'hide');
                wcm_message.isShowBoxOrNot(this, true, '.reply-question');
                wcm_message.isShowBoxOrNot(this, false, '.hidable');

                var hideStr = $(this).parents('.question-wrapper').find('.msg-reply').css('display');
                
                if (hideStr === 'none') {
                    wcm_message.isShowBoxOrNot(this, false, '.parting-line');
                }
            } else {
                this.innerText = '取消回答';
                this.setAttribute('data-tag', 'show');
                wcm_message.isShowBoxOrNot(this, true, '.hidable');
                wcm_message.isShowBoxOrNot(this, true, '.parting-line');
            }
        });

        // button save
        $containerEle.off('click', '.answer-save');
        $containerEle.on('click', '.answer-save', function() {
        	var correntDOM = $(this).parents('.WCM_TAG_replyBox').find("div.active");

        	var $msgWrapper = $(this).parents('.question-wrapper');
            var questionId = $msgWrapper.attr('data-id');
            var openId = $msgWrapper.attr('data-openId');
        	var answer = $(this).parents('.WCM_TAG_replyBox').find('textarea').val();
 			if ($.trim(answer) == '') {
 			  alert('答案不能为空！');
 			  return false;
 			}
 			var options = { 
 					url : questionsURL + '/' + questionId,
 					data : {answer:answer}
 	        };
 			/*wcm.ajaxPost(options, function(data){
            	if (data) {
            		$('.reply-question', $msgWrapper).click();
					$('.question-is-answered', $msgWrapper).text('（已回答）');
					$('.question-answer', $msgWrapper).text(answer);
                } else {
                    alert("发送失败!");
                }
 			});*/
 			/*sun.ajax.post({
                url : questionsURL + '/' + questionId,
                data : {answer : answer},
                contentType : 'application/json',
                done : function (json){
                	if (json.data) {
                		$('.reply-question', $msgWrapper).click();
    					$('.question-is-answered', $msgWrapper).text('（已回答）');
    					$('.question-answer', $msgWrapper).text(answer);
                    } else {
                        alert("发送失败!");
                    }
                }
            });*/
 			
 			$.ajax({
 				url : questionsURL + '/' + questionId,
 				method : 'POST',
 				dataType : 'json',
 				data : {answer:answer},
 				success : function(data) {
 					if (data.data) {
                		$('.reply-question', $msgWrapper).click();
                		clickActiveBtn();
    					/*$('.question-answer-label', $msgWrapper).text('（已回答）');
    					$('.question-answer', $msgWrapper).text(answer);
    					$('.question-answer-textarea', $msgWrapper).val(answer);*/
                    } else {
                        alert("发送失败!");
                    }
 				},
 				error : function(data) {
 					
 				}
 			});
             return false;
        });

        // button cancel
        $('#question_all').off('click', '.answer-clear');
        $('#question_all').on('click', '.answer-clear', function() {
            var correntDOM = $(this).parents('.WCM_TAG_replyBox').find("div.active");
            var _replyId = correntDOM.children().attr('id');
            
            if (!_replyId) { // msg type is txt
                correntDOM.children(':first').val('');
            } else {
                correntDOM.removeClass('active');
            }
        });

        $('#question_all').off('click', '.question-publish');
        $('#question_all').on('click', '.question-publish', function(e) {
            e.preventDefault();
            var $msgWrapper = $(this).parents('.question-wrapper');
            var answer = $('.question-answer-textarea', $msgWrapper).val();
 			if ($.trim(answer) == '') {
 			  alert('答案为空, 不能发布');
 			  return false;
 			}
            var questionId = $msgWrapper.attr('data-id');
            var openId = $msgWrapper.attr('data-openId');
            var realPublished = $msgWrapper.attr('data-published');
            var isPublished = true;
			if (realPublished == 'true') {
				isPublished = false;
			}
			
			var options = { 
 					url : questionsURL + '/' + questionId +'/publish?isPublish='+isPublished,
 					data : {}
 	        };
			wcm.ajaxPut(options, function(data){
                if (data) {
                   $msgWrapper.attr('data-published', isPublished)
                   clickActiveBtn();
				   /*if (!isPublished) {
						$('.question-publish-label', $msgWrapper).text('发布');
				   } else {
						$('.question-publish-label', $msgWrapper).text('取消发布');
				   }*/
                } else {
                    alert("发送失败!");
                }
			});
            return false;
        });
        
        $('#unAnswer_tab_btn').click(function(){
        	var url = questionsURL + '/unAnswer'
        	wcm_message.initList(undefined, url);
        	$('#unAnswer_tab_btn').attr('active', true);
        	$('#unPublished_tab_btn').attr('active', false);
        	$('#all_tab_btn').attr('active', false);
        });
        $('#unPublished_tab_btn').click(function(){
        	var url = questionsURL + '/unPublished'
        	wcm_message.initList(undefined, url);
        	$('#unAnswer_tab_btn').attr('active', false);
        	$('#unPublished_tab_btn').attr('active', true);
        	$('#all_tab_btn').attr('active', false);
        });
        $('#all_tab_btn').click(function(){
        	wcm_message.initList();
        	$('#unAnswer_tab_btn').attr('active', false);
        	$('#unPublished_tab_btn').attr('active', false);
        	$('#all_tab_btn').attr('active', true);
        });
        $('#question_all').on('click', '.push-answer',function(){
        	wcm_message.pushToUser(this);
        });
    };
    
    wcm_message.pushToUser = function(self){
    	var $msgWrapper = $(self).parents('.question-wrapper');
        var answer = $('.question-answer-textarea', $msgWrapper).val();
		if ($.trim(answer) == '') {
			  alert('答案为空, 不能推送给用户');
			  return false;
		}
		if(confirm('确定推送给这个用户吗？')) {
			var questionId = $msgWrapper.attr('data-id');
			var options = { 
 					url : questionsURL + '/' + questionId +'/push',
 					data : {questionId : questionId}
 	        };
			wcm.ajaxPost(options, function(data){
				$(self).remove();
			});
            return false;
		}
    }
    
    function clickActiveBtn(){
    	$('.fliter-btn', '#question-wrapper').each(function(){
    		if($(this).attr('active') == 'true'){
    			$(this).click();
    		};
    	});
    }

    // bind event
    $(document).ready(function() {
    	wcm_message.initList();
        wcm_message.bindEvent();
    })
}(window.jQuery);

