
!function($){
    var responseURL = wcm.getApiURL('message_response'),
        listURL = wcm.getApiURL('message_list'),
        menuURL = wcm.getApiURL('message_menu'),
        msgPostReplyURL = wcm.getApiURL("message_postReply"),
        PutMenuURL = wcm.getApiURL('message_PutMenu'),
        deleteMenuURL = wcm.getApiURL('message_deleteMenu'),
        wcm_message = wcm_message || {};

    wcm_message.setMsgReplyHtml = function(dom, popenId) {
        var options = {
            openId : popenId
        };

        wcm.ajaxGet({ url: responseURL, data: options }, function(json) {
            sun.util.each(json, function(v, i) {
                json[i].createTime = sun.util.formatTime('yyyy-MM-dd hh:mm:ss', v.createTime);

                if (v.reply.length > 0) {
                    sun.util.each(v.reply, function(w, j) {
                        json[i].reply[j].create_time = sun.util.formatTime('yyyy-MM-dd hh:mm:ss', w.create_time);
                    });
                }
            });

            var html = $('#msg_reply_tmpl').render(json);

            dom.html(html);
        });
    };

    wcm_message.isShowBoxOrNot = function(elm, isShow, sector) {
        var $sector = $(elm).parents('.msg-wrapper').find(sector);

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

    wcm_message.initList = function(nId, currentPageNum) {
        var params = {
            label_id: nId,
            page_num: currentPageNum || 1,
            page_size: 0
        };

        sun.ajax.getJSON(listURL, params, function(jsonData) {
            var json = jsonData.data;

            sun.util.each(json.list, function(v, i) {
                json.list[i].createTime = sun.util.formatTime('yyyy-MM-dd hh:mm:ss', v.createTime);
            });

            var html = $('#msg_list_tmpl').render(json.list);

            $('#msg_all').html(html);

            $('#DOM_pgn').bootstrapPaginator({
                currentPage: json.pagination.pageNum,
                totalPages: json.pagination.totalPage,
                onPageChanged: function(event, oldPage, newPage) {
                    wcm_message.initList(nId, newPage);
                }
            });
        });
    };

    // nav bar    
    wcm_message.initMenu = function(isActiverLast) {
        var $navbar = $('#msg_nav');

        sun.ajax.getJSON(menuURL, function(json) {
            var html = $('#msg_menu_tmpl').render(json.data);

            $navbar.html(html);

            $('body').off('click', '#msg_nav li a');
            $('body').on('click', '#msg_nav li a', function(e) {
                e.preventDefault();

                var id = e.target.attributes['data-id'].value;

                $(e.target).parents('ul').find('li').removeClass('active');
                $(e.target.parentNode).addClass('active');

                wcm_message.initList(sun.util.parseToInt(id));
            });

            $('body').off('click', '#msg_nav li button');
            $('body').on('click', '#msg_nav li button', function(e) {
                e.preventDefault();

                var result = confirm("您确定要删除此项吗？"),
                    id = this.nextElementSibling.getAttribute('data-id'),
                    _url = '';

                if (!!result) {
                    _url = sun.util.stringFormat(deleteMenuURL, id);

                    wcm.ajaxDelete({
                        url: _url
                    }, function() {
                        wcm_message.initMenu();
                    });
                }
            });

            if (!!isActiverLast) {
                var index = $('#msg_nav li').length > 0 ? $('#msg_nav li').length - 1 : 0;

                $($('#msg_nav li')[index]).addClass("active");
                wcm_message.initList(json.data[index].id);
            } else if (json.data && json.data.length > 0) {
                $($('#msg_nav li')[0]).addClass("active");
                wcm_message.initList(json.data[0].id);
            }
        });
    };

    // render the reply box with type
    wcm_message._renderReplyBox = function(sType, nodeAppendPlace) {
        var nodeDialogBox = $('#msg_qote_msg');

        //TEXT(1), NEWS(2), IMAGE(3), VOICE(4), VIDEO(5), MUSIC(6), URL(7)
        switch(sType) {
            case "1":               //文本
                break;
            case "2":               //图文
                nodeDialogBox.empty();
                nodeAppendPlace.empty();
                $("#WCM_TAG_replyBox").modal('show');
                metariaApi.render_news(nodeDialogBox, nodeAppendPlace);
                break; 
            case "3":               //图片
                nodeDialogBox.empty();
                nodeAppendPlace.empty();
                $("#WCM_TAG_replyBox").modal('show');
                metariaApi.render_images(nodeDialogBox, nodeAppendPlace);
                break;
            case "4":               //音频
                nodeDialogBox.empty();
                nodeAppendPlace.empty();
                $("#WCM_TAG_replyBox").modal('show');
                metariaApi.render_voices(nodeDialogBox, nodeAppendPlace);
                break;
            case "5":               //视频
                nodeDialogBox.empty();
                nodeAppendPlace.empty();
                $("#WCM_TAG_replyBox").modal('show');
                metariaApi.render_video(nodeDialogBox, nodeAppendPlace);
                break;
            case "6":               //MUSIC
                nodeDialogBox.empty();
                nodeAppendPlace.empty();
                $("#WCM_TAG_replyBox").modal('show');
                metariaApi.render_music(nodeDialogBox, nodeAppendPlace);
                break;
            case "7":               //URL
                break;
        }
    };

    wcm_message.bindEvent = function() {
        var TAG_msgType = '1';

        // reply button
        $('#msg_all').off('click', '.reply-msg');
        $('#msg_all').on('click', '.reply-msg', function() {
            var tag = this.getAttribute('data-tag');
            if (!!tag && tag === 'show') {
                this.innerText = '回复';
                this.setAttribute('data-tag', 'hide');
                wcm_message.isShowBoxOrNot(this, true, '.reply-msg');
                wcm_message.isShowBoxOrNot(this, false, '.hidable');

                var hideStr = $(this).parents('.msg-wrapper').find('.msg-reply').css('display');
                
                if (hideStr === 'none') {
                    wcm_message.isShowBoxOrNot(this, false, '.parting-line');
                }
            } else {
                this.innerText = '取消回复';
                this.setAttribute('data-tag', 'show');
                wcm_message.isShowBoxOrNot(this, true, '.hidable');
                wcm_message.isShowBoxOrNot(this, true, '.parting-line');
            }
        });

        // button send message
        $('#msg_all').off('click', '.msg-reply-save');
        $('#msg_all').on('click', '.msg-reply-save', function() {
            var correntDOM = $(this).parents('.WCM_TAG_replyBox').find("div.active");

            var _replyId = correntDOM.children().attr('id'),
                _msgId = $(this).parents('.msg-wrapper').attr('data-id').toString(),
                _openId = $(this).parents('.msg-wrapper').attr('data-openId').toString(),
                txt = '';

            var postReply = function (nReplyId, nReplyType) {
                var options = {
                    openId : _openId,
                    message_id : _msgId,
                    replyType : nReplyType | 0,
                    replyId : nReplyId | 0
                };

                sun.ajax.post({
                    url : msgPostReplyURL,
                    data : JSON.stringify(options),
                    contentType : 'application/json',
                    done : function (json){
                        // close
                        correntDOM.parents('.msg-wrapper').find('.reply-msg').click();
                        var nodebtnDetail  = correntDOM.parents('.msg-wrapper').find('.msg-detail'),
                            tag = nodebtnDetail.attr('data-tag');
                        if (tag === 'detail') {
                            nodebtnDetail.click();
                        } else {
                            nodebtnDetail.click();
                            nodebtnDetail.click();
                        }
                    }
                });
            };
      
            if (TAG_msgType === '1') { // msg type is txt
                txt = correntDOM.find('textarea').val().trim();

                if (txt.length > 0) {
                    sun.ajax.post({
                        url : wcm.getApiURL("saveKeywordReplyText"),
                        data : JSON.stringify({ content : txt }),
                        contentType : 'application/json',
                        done : function (json){
                            postReply(json.data.id, 1);
                        }
                    });
                } else {
                    alert('内容不能为空');
                }
            } else if (TAG_msgType === '7') {
                txt = correntDOM.find('input').val().trim();

                if (txt.length > 0) {
                    sun.ajax.post({
                        url : wcm.getApiURL("url"),
                        data : JSON.stringify({ url : txt }),
                        contentType : 'application/json',
                        done : function (json){
                            postReply(json.data.id, 7);
                        }
                    });
                }
            } else { // msg is packbag element
                if (!_replyId) {
                    alert('您没有选任何素材!');
                } else {
                    postReply(_replyId, TAG_msgType);
                }
            }
        });

        // button cancel
        $('#msg_all').off('click', '.msg-reply-del');
        $('#msg_all').on('click', '.msg-reply-del', function() {
            var correntDOM = $(this).parents('.WCM_TAG_replyBox').find("div.active");
            var _replyId = correntDOM.children().attr('id');
            
            if (!_replyId) { // msg type is txt
                correntDOM.children(':first').val('');
            } else {
                correntDOM.removeClass('active');
            }
        });

        // reply history
        $('#msg_all').off('click', '.msg-detail');
        $('#msg_all').on('click', '.msg-detail', function(e) {
            e.preventDefault();

            var replyList = $(this).parents('.msg-wrapper').find('.msg-reply'),
                tag = $(this).attr('data-tag');

            var openidId = $(this).parents('.msg-wrapper').attr('data-openid');
            if (tag.indexOf('detail') > -1) {
                $(this).text('收起');
                $(this).attr('data-tag', 'hide');

                wcm_message.isShowBoxOrNot(this, true, '.parting-line');
                wcm_message.isShowBoxOrNot(this, true, '.msg-reply');

                wcm_message.setMsgReplyHtml(replyList, openidId);
            } else {
                $(this).text('展开');
                $(this).attr('data-tag', 'detail');

                var hideStr = $(this).parents('.msg-wrapper').find('.hidable').css('display');
                wcm_message.isShowBoxOrNot(this, false, '.msg-reply');
                if (hideStr === 'none') {
                    wcm_message.isShowBoxOrNot(this, false, '.parting-line')
                }
                
                replyList.html('');
            }
        });

        // bind the reply message nav bar
        $('#msg_all').on('click', '.WCM_TAG_replyBox ul li', function(e) {
            e.preventDefault();

            try {
                var msgType = this.attributes['data-type'].value,
                    nodeContentBox = $(this).parent(':first').next(':first').children(),
                    toggleType = this.children[0].href.split('#')[1],
                    nodeAppend = '';
            
                nodeContentBox.children('[data-toggle]').removeClass('active');
                nodeAppend = nodeContentBox.children('[data-toggle = ' + toggleType + ']');
                nodeAppend.addClass("active");
                $(this.parentElement).children('li').removeClass('active');
                $(this).addClass("active");

                TAG_msgType = msgType;

                wcm_message._renderReplyBox(msgType, nodeAppend);
            } 
            catch(err) {
                console.error(err.message);
            }
        });

        // button : add class
        $('body').on('click', '#msg_add', function() {
            var newName = document.getElementById('new_tab_name').value.trim();

            // double check
            if (newName.length > 0) {
                wcm.ajaxPost(
                    {
                        url : PutMenuURL,
                        data: {
                            name: newName,
                            pattern: newName
                        }
                    }, 
                    function (json) {
                        document.getElementById('new_tab_name').value = '';
                    }
                );

                wcm_message.initMenu(true);
            } else {
                alert('分类名称不能为空！');
            }
        });
    };

    // bind event
    $(document).ready(function() {
        wcm_message.initMenu();
        wcm_message.bindEvent();
    })
}(window.jQuery);

