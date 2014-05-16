<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<title>我要提问</title>


<link rel="stylesheet" href="../wechat/question/css/style.css">
<link rel="stylesheet" href="../wechat/question/css/question.css">

</head>
<body>
<div id='question-wapper' class="question-wapper-container">
	<div class="send-question-title">
		我要提问
	</div>
	<div class="question-content-container">
		<div class="question-send-container">
			<textarea id="question-content"></textarea>
		</div>
		<div class="send-btn-container"><button id="send-question"></button></div>
		
	</div>

</div>
<div class="question-content" id="questionList"></div>
<div class="loading" id="loading">正在努力加载数据...</div>
<div class="loading" id="nomoreresults">亲，没有数据了！</div>
<input type="hidden" id="openId" value="${OpenId}"/>
</body>
<script id='question_list_tmpl' type="text/x-jsrender">
    <div class="question-item"><span class="item-user">Q{{:number}}</span><p></p>
        <div class="item-content">
                <div class="t_h">
				<div class="t_l"></div>
                <div class="t_m"></div>
                <div class="t_r"></div>
               </div>
                <div class="m_l"></div>
                <div class="m_m"><span>{{:question}}</span></div>
                <div class="m_r"></div>
                <div class="b_l"></div>
                <div class="b_m"></div>
                <div class="b_r"></div>
        </div>
   </div>
        <div class="answer-item">
            <div class="item-content">
                <div class="t_l"></div>
                <div class="t_m"></div>
                <div class="t_r"></div>
                <div class="m_l"></div>
                <div class="m_m"><span>{{:answer}}</span></div>
                <div class="m_r"></div>
                <div class="b_l"></div>
                <div class="b_m"></div>
                <div class="b_r"></div>
            </div>
            <p><span class="item-user">A</span></p>
        </div>
</script>
<script src="../js/jquery-1.10.2.js"></script>
<script type="text/javascript" src="../js/jsrender.min.js"></script>
<script type="text/javascript" src="../wechat/question/js/lib/scrollpagination.js"></script>
<script type="text/javascript" src="../wechat/question/js/lib/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="../wechat/question/js/question.js"></script>
</html>

