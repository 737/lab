<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="lbs-content clearfix" id="lbs">
    <div class="row">
        <div class="col-lg-12">
            <h1>LBS管理</h1>
        </div>
    </div>
    

    <div>
        <div id="lbs-alert" class="alert alert-success" style="display: none;"></div>

        <div class="panel panel-info">
            <div class="panel-heading">
                <div class="lbs-edite row">
                    <div class="col-lg-7">
                        <div class="panel-title">
                            <h4><i class="fa fa-money"></i>&nbsp;LBS列表</h4>
                        </div>
                    </div>
                    <div class="col-lg-2 col-lg-offset-3">
                        <a data-toggle="modal" href="#fairPanel" id="add" class="btn btn-sm btn-success" style="margin-top: 5px;"><i class="fa fa-plus"></i> &nbsp;添加</a>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <table id="lbs-data-table" class="table table-bordered table-hover table-striped tablesorter">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>回复图文</th>
                            <th>活动名称</th>
                            <th>时间</th>
                            <th>活动人数</th>
                            <th>活动地址</th>
                            <th>活动链接</th>
                            <th>编辑</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        
    </div>

    <div class="modal fade text-muted" id="fairPanel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">添加活动信息</h4>
                </div>
      
                <div class="modal-body">
                    <div>
                        <div class="row">
                           <div class='col-lg-6'>
                            <table class="table table-bordered">
                                <tr class="hidden">
                                    <td><input type="hidden" name="dbId"><input type="hidden" name="location_id"></td>
                                </tr>
                                <tr>
                                    <td><strong>活动名称</strong></td>
                                    <td><input class="form-control input-sm" name="name"></input></td>
                                </tr>
                                <tr>
                                    <td><strong>活动时间</strong></td>
                                    <td><input type="text" name="time" class="form_datetime form-control input-sm" id="timepicker" readonly></td>
                                </tr>
                                <tr>
                                    <td><strong>活动人数</strong></td>
                                    <td><input class="form-control input-sm" name="count"></input></td>
                                </tr>
                                <tr>
                                    <td>回复图文</td>
                                    <td>
                                        <form class="upload-file-form" role="form" id="upload_file_form" enctype="multipart/form-data" action="${baseURL}news/image" method="post">
                                            <input type="file" name="uploadFile" class="file-inline form-control input-sm">
                                            <button type="button" id='upload_file_btn' class="btn btn-primary btn-sm" >上传</button>
                                        </form>
                                        <input class="hidden" name="image">
                                    
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>活动链接</strong></td>
                                    <td><input class="form-control input-sm" name="url"></input></td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="add-labs-group-title-2"><strong>活动地点</strong></td>
                                </tr>
                                <tr>
                                    <td>省</td>
                                    <td><input class="form-control input-sm" name="province"></input></td>
                                </tr>
                                <tr>
                                    <td>市</td>
                                    <td><input class="form-control input-sm" name="city"></input></td>
                                </tr>
                                <tr>
                                    <td>县/区</td>
                                    <td><input class="form-control input-sm" name="district"></input></td>
                                </tr>
                                <tr>
                                    <td>详细地址</td>
                                    <td><textarea class="form-control" name="detail"> </textarea></td>
                                </tr>
                                <tr class="hidden">
                                    <td><input name="lat"></input></td>
                                    <td><input name="lng"></input></td>
                                </tr>
                                <tr>
                                    <td align='center' colspan=2><button class="btn btn-primary" id="showMap">查看具体位置</button></td>
                                </tr>
                            </table>
                           </div>
                           <div class='col-lg-6 map-container'> 
                            <div id="map"></div>
                            </div>
                        </div>
                        <div class="popup-footer">
                            <div id="lbs-alert-form-message" class="alert alert-success" style="display: none;"></div>
                            <button type="button" id="save" class="btn btn-primary">保存</button>
                            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $(function() {
        $('#lbs_page_btn').addClass('active');
    });
</script>
<link href="${baseURL}css/bootstrap-datetimepicker.min.css" rel="stylesheet">
<script charset="utf-8" src="http://map.qq.com/api/js?v=2.exp"></script>
<script type="text/javascript" src="${baseURL}js/bootstrap-datetimepicker.min.js"></script>
<script type="text/javascript" src="${baseURL}js/lbs.js"></script>