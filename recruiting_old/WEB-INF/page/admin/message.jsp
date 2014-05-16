<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/lib/sun.js"></script>
<script type="text/javascript" src="${baseURL }js/lib/sun.util.js"></script>
<script type="text/javascript" src="${baseURL }js/message.js"></script>
<script type="text/javascript" src="${baseURL }js/bootstrap-paginator.js"></script>
<script type="text/javascript" src="${baseURL }js/materialListTmplApi.js"></script>
<link rel="stylesheet" type="text/css" href="../css/message.css" />

<div id='msg-wrapper'>
		<nav class="navbar navbar-default" role="navigation">
	        <div class="navbar-header">
	            <a class="navbar-brand" href="javascript:void(0)">消息分类</a>
	        </div>
	        <div class="navbar-collapse navbar-ex1-collapse collapse" style="height: 0px;">
                <!-- nav bar -->
	            <ul id='msg_nav' class="nav navbar-nav massage-tab-list"></ul>
                <!-- /nav bar -->
                <!-- search -->
                <div class="navbar-form navbar-right" role="search">
                    <div class="form-group">
                        <input id="new_tab_name" type="text" class="form-control" placeholder="添加分类">
                    </div>
                    <button type="button" id="msg_add" class="btn btn-default">添加</button>
                </div>
                <!-- /search -->
	        </div>
	    </nav>

        <div id='msg_all' class='msg-list'>

        </div>

        <!-- wrop about reply box -->
        <div id='WCM_TAG_replyBox' class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">请选择图文消息</h4>
                    </div>
                    <div id='msg_qote_msg' class="modal-body news-list clearfix">

                    </div>
                </div>
            </div>
        </div>
        <!-- /wrop about reply box -->

        <!-- pagination -->
        <div id='DOM_pgn' class="pagination"></div>
        <!-- /pagination -->
</div>


<script id="msg_menu_tmpl" type="text/x-jsrender">
    <li class="tab-item">
        <button type="button" class="close tab-item-delete">×</button>
        <a data-id='{{:id}}' href="javascript:void(0)">{{:name}}</a>
    </li>
</script>

<script id='msg_list_tmpl' type="text/x-jsrender">
    <!-- list item -->
    <div data-openId='{{:open_id}}'   data-id='{{:id}}' class="msg-wrapper">
        <div class="row">
            <div class="col-lg-10 row">
                <div class="msg-author-avatar pull-left">
                    <img style="width: 80px; height: 80px" src="{{:avatar}}">
                </div>
                <div class="msg-content pull-left">
                    <div class="user-name">
                        <p>
                            <b>
                                <span></span>
                                <span>{{:nickname}}</span>
                            </b>
                        </p>
                    </div>
                    <div class="message-content">
                        <p>{{:content}}</p>
                    </div>   
                    <div class="msg-time">
                        <p>{{:createTime}}</p>
                    </div>
                </div>
            </div>
            <div class="msg-operation col-lg-2">
                <button class="reply-msg btn btn-default">
                    <span>回复</span>
                </button>
                <button data-tag='detail' class="msg-detail btn btn-default">
                    <span>展开</span>
                </button>
            </div>
        </div>
        <div class="parting-line hide">
            <div class="ang_i bor2"></div>
            <div class="ang_i bor_bg"></div>
        </div>
        <div class="row hidable hide">
            <div class="WCM_TAG_replyBox reply-wrapper col-lg-10 col-lg-offset-1">
                <span class="pull-right">
                    <a class="msg-reply-save btn btn-primary btn-sm">完成</a>
                    <a class="msg-reply-del btn btn-danger btn-sm">清除</a>
                </span>
                <ul class="nav nav-tabs msg-reply-conf-nav">
                    <li class="active" data-type='1'>
                        <a href="#msg_content_replymsg" class="msg-content-reply">文字</a>
                    </li>
                    <li data-type='2'>
                        <a href="#msg_imgmsg_replymsg" class="msg-pic-reply">图文</a>
                    </li>
                    <li data-type='3'>
                        <a href="#msg_img_replymsg" class="msg-img-reply">图片</a>
                    </li>
                    <li data-type='4'>
                        <a href="#msg_audio_replymsg" class="msg-audio-reply">音频</a>
                    </li>
                    <li data-type='5'>
                        <a href="#msg_video_replymsg" class="msg-video-reply">视频</a>
                    </li>
                    <li data-type='6'>
                        <a href="#msg_video_replymsg" class="msg-video-reply">音乐</a>
                    </li>
                    <li data-type='7'>
                        <a href="#msg_video_replymsg" class="msg-video-reply">链接</a>
                    </li>
                </ul>
                <div class="tab-content-wrapper">
                    <div class="tab-content">
                        <div class="tab-pane active clearfix" data-toggle="msg_content_replymsg">
                            <textarea style="width: 100%; max-width: 100%; height: 68px;"></textarea>
                        </div>
                        <div class="tab-pane clearfix" data-toggle="msg_imgmsg_replymsg"></div>
                        <div class="tab-pane clearfix" data-toggle="msg_img_replymsg"></div>
                        <div class="tab-pane clearfix" data-toggle="msg_audio_replymsg"></div>
                        <div class="tab-pane clearfix" data-toggle="msg_video_replymsg"></div>
                    </div>
                </div>
            </div>

            <div class="msg-reply-operation col-lg-10 col-lg-offset-1">
                
            </div>
        </div>
        <div class="row msg-reply hide  msg-list">
        </div>
    </div>
    <!-- /list item -->
</script>

<script id='msg_reply_tmpl' type="text/x-jsrender">
    <div class="msg-reply-content msg-request-content row">
        <div class="msg-author-avatar pull-left">
            <img style="width: 60px; height: 60px" src="http://gaming.wc.augmarketing.cn/resource/avatar/1388744324631.jpg">
        </div>
        <div class="msg-content pull-left">
            <div>
                <p>
                    <b class="user-name">
                        <span></span>
                        <span>{{:nickname}}</span>
                    </b>
                </p>
            </div>
            <div>
                <span class="message-content">{{:content}}</span>
            </div>
            <div class="msg-time">
                <p>{{:createTime}}</p>
            </div>
        </div>
    </div>
    {{if reply.length > 0}}
    <div class="msg-reply-content msg-response-content row">
        <div class="msg-author-avatar pull-left">
            <img style="width: 60px; height: 60px" src="../img/webwxgeticon.jpg" />
        </div>
        <div class="msg-content pull-left">
            <div>
                <p>
                    <b class="user-name">
                        <span></span>
                        <span>Admin</span>
                    </b>
                </p>
            </div>
            <div>
                <span class="message-content">{{:content}}</span>
            </div>
            <div class="msg-time">
                <p>{{:createTime}}</p>
            </div>
        </div>
    </div>
    {{/if}}
</script>

<script type="text/javascript">
    $(function() {
        $('#message_page_btn').addClass('active');
    });
</script>