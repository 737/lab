<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<h1 class="page-title">微信后台管理</h1>
<div class="row">
    <div class="col-lg-12">
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3>微信后台管理</h3>
            </div>
            <div class="panel-body">
                <div class="pdtb10">现已支持自定义菜单设置，快来体验吧！</div>
                <div class="text-right">
                    <a href="menu">马上体验&nbsp;<i class="fa fa-arrow-circle-right"></i></a>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-lg-4">
        <div class="panel panel-success">
            <div class="panel-heading">
                <h3>关注回复设置</h3>
            </div>
            <div class="panel-body">
                <div class="pdtb10">设置微信用户关注公共账号后的欢迎语，设置后粉丝在添加公共账号时，会自动发送设置的文字/图文消息。</div>
                <div class="text-right">
                    <a href="keyword">去设置&nbsp;<i class="fa fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="panel panel-warning">
            <div class="panel-heading">
                <h3>自定义菜单设置</h3>
            </div>
            <div class="panel-body">
                <div class="pdtb10">现已支持自定义菜单设置，快来公众账号的服务号，拥有自定义菜单功能，可使用户在界面上的操作更加便捷。在这里添加/编辑菜单功能及其对应的消息回复。</div>
                <div class="text-right">
                    <a href="menu">去设置&nbsp;<i class="fa fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="panel panel-danger">
            <div class="panel-heading">
                <h3>图文素材管理</h3>
            </div>
            <div class="panel-body">
                <div class="pdtb10">编辑好看易读的图文素材，让消息回复不再单调。支持嵌入URL，可让用户点击进一步阅读。</div>
                <div class="text-right">
                    <a href="material">去设置&nbsp;<i class="fa fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(function() {
        $('#index_page_btn').addClass('active');
    });
</script>