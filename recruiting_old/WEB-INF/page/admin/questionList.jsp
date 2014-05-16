<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/lib/sun.js"></script>
<script type="text/javascript" src="${baseURL }js/lib/sun.util.js"></script>
<script type="text/javascript" src="${baseURL }js/questionList.js"></script>
<script type="text/javascript"
	src="${baseURL }js/bootstrap-paginator.js"></script>
<script type="text/javascript"
	src="${baseURL }js/materialListTmplApi.js"></script>
<link rel="stylesheet" type="text/css" href="../css/question.css" />

<div id='question-wrapper'>
	<nav class="navbar navbar-default" role="navigation">
		<div class="navbar-header">
			<a class="navbar-brand" href="javascript:void(0)">问题列表<span id="questionCount"></span></a>
		</div>
		<div class="navbar-collapse navbar-ex1-collapse collapse"
			style="height: 0px;">
			<div class="navbar-form navbar-right" role="search">
				<div class="navbar-collapse navbar-ex1-collapse collapse"
					style="height: 0px;">
					<button type="button" id="all_tab_btn" class="btn btn-default btn-success fliter-btn" active="true">全部</button>
					<button type="button" id="unAnswer_tab_btn" class="btn btn-default btn-success fliter-btn">未回答</button>
					<button type="button" id="unPublished_tab_btn" class="btn btn-default btn-success fliter-btn">未发布</button>
				</div>
			</div>
		</div>
	</nav>

	<div id='question_all' class="question-list"></div>

	<!-- pagination -->
	<div id='DOM_pgn' class="pagination"></div>
	<!-- /pagination -->
</div>


<script id='question_list_tmpl' type="text/x-jsrender">
    <!-- list item -->
    <div data-openId='{{:openId}}'   data-id='{{:id}}' data-published='{{:published}}'class="question-wrapper">
        <div class="row">
            <div class="col-lg-9 row">
                <div class="question-content pull-left">
                    <div class="question-titile">
                        <p>
                            <b>
                                <span>{{:number}}.</span>
                                <span>{{:question}}</span>
                                {{if answer =='' || answer == null }}
                                   <span class="question-answer-label">(未回答)</span>
                                {{/if}}
								{{if answer !='' && answer != null }}
                                   <span class="question-answer-label">(已回答)</span>
                                {{/if}}
                            </b>
                        </p>
                    </div>
                    <div class="answer-content">
                        <p><span>答案:</span><span class="question-answer">{{:answer}}</span></p>
                    </div>   
                    <div class="question-time">
                        <p>
							<span>{{:nickname}}</span>
							<span>在</span>
                            <span>{{:createTime}}</span>
							<span>提出</span>
					  </p>
                    </div>
                </div>
            </div>
            <div class="question-operation col-lg-3">
                <button class="reply-question btn btn-default">
                    <span>回答</span>
                </button>
                <button data-tag='detail' class="question-publish btn btn-default">
                    {{if published }}
                    <span class="question-publish-label">取消发布</span>
                    {{/if}}
					{{if !published }}
                    <span class="question-publish-label">发布</span>
                    {{/if}}
                 </button>
				{{if !pushed }}
                     <button class="push-answer btn btn-default">
                      <span>推送</span>
                    </button>
                {{/if}}
            </div>
        </div>
        <div class="parting-line hide">
            <div class="ang_i bor2"></div>
            <div class="ang_i bor_bg"></div>
        </div>
        <div class="row hidable hide">
            <div class="WCM_TAG_replyBox reply-wrapper col-lg-10 col-lg-offset-1">
                <div class="tab-content-wrapper">
                    <div class="tab-content">
                        <div class="tab-pane active clearfix">
                            <textarea class="question-answer-textarea" style="width: 100%; max-width: 100%; height: 68px;">{{:answer}}</textarea>
                        </div>
                    </div>
                </div>
				<span class="pull-right">
                    <a class="answer-save btn btn-primary btn-sm">完成</a>
                    <a class="answer-clear btn btn-danger btn-sm">清除</a>
                </span>
            </div>
        </div>
        <div class="row msg-reply hide  question-list">
        </div>
    </div>
    <!-- /list item -->
</script>

<script type="text/javascript">
	$(function() {
		$('#question_page_btn').addClass('active');
	});
</script>