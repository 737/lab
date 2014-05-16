<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<title>微信后台管理</title>

<!-- Bootstrap core CSS -->
<link href="${baseURL}css/bootstrap.css" rel="stylesheet">

<!-- Add custom CSS here -->
<link href="${baseURL}css/sb-admin.css" rel="stylesheet">
<link rel="stylesheet" href="${baseURL}font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" href="${baseURL}css/style.css">
<link rel="stylesheet" href="${baseURL}css/labs.css">
<link rel="stylesheet" href="${baseURL }css/bootstrap-combined.min.css">

    <!-- JavaScript -->
<script src="${baseURL}js/jquery-1.10.2.js"></script>
<script src="${baseURL}js/bootstrap.js"></script>
<script src="${baseURL}js/main.js"></script>
<script type="text/javascript" src="${baseURL }js/jsrender.min.js"></script>
<script type="text/javascript" src="${baseURL }js/bootstrap-paginator.js"></script>
<script type="text/javascript" src="${baseURL}js/jquery.form.js"></script>
<script type="text/javascript" src="${baseURL }js/bootstrap-alert.js"></script>
<script type='text/javascript'>
    var baseURL = "${baseURL}";
</script>
</head>

<body>

    <div id="wrapper">
        <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        	<div id="alert"></div>
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="${baseURL}admin/index">微信后台管理</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav side-nav">
                    <c:if test="${ !empty config.menu }">
                        <c:forEach var="item" items="${ config.menu }">
                            <li id="${ item.id }" ><a class="menu-nav-item" href="${baseURL}${ item.url }"><i class="fa ${ item.icon }"></i> ${ item.cnName }</a></li>
                        </c:forEach>
                    </c:if>
                </ul>

                <ul class="nav navbar-nav navbar-right navbar-user">
                    <li class="dropdown user-dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> John Smith <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="#"><i class="fa fa-user"></i> Profile</a></li>
                            <li><a href="#"><i class="fa fa-envelope"></i> Inbox <span class="badge">7</span></a></li>
                            <li><a href="#"><i class="fa fa-gear"></i> Settings</a></li>
                            <li class="divider"></li>
                            <li><a href="#"><i class="fa fa-power-off"></i> Log Out</a></li>
                        </ul></li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </nav>

        <div id="page-wrapper">
            <jsp:include page="${content}" />
        </div>
    </div>
    <!-- /#wrapper -->
</body>
<script type="text/x-jsrender" id="alert-tmpl">
<div class="alert {{:alerttype}} fade in float-alert">  
    <button type="button" class="close" data-dismiss="alert">×</button>
    <div class="alert-content">{{:content}}</div>
</div>
</script>
</html>
