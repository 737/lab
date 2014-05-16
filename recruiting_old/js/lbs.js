var wcm = wcm || {};

wcm.LBSPage = function() {
    var LBSData = null;
    var pageSize = 10;
    var format = "yyyy-MM-dd HH:mm:ss";
    var that = this;
    that.province = "";
    that.city = "";
    that.district = "";
    that.detail = "";

    function handleMessage(msg, type, alertObj) {
        var alertDom;

        if ('listAlert' === alertObj){
            alertDom = $("#lbs-alert");
        } else {
            alertDom = $("#lbs-alert-form-message");
        }

        alertDom.html(msg);
        if ('danger' == type){
            alertDom.removeClass().addClass("alert alert-danger");
        } else if ('success' == type){
            alertDom.removeClass().addClass("alert alert-success");
        }

        alertDom.slideDown(1000).slideUp(5000);
    }

    function dateFormat(val) {
        //val = parseFloat(val);
        var d = new Date(val);
        var dateStr = d.pattern(format);
        return dateStr;
    }

    function generateFair(index, fair) {
        var tr = $('<tr></tr>');
        tr.append('<td>' + fair['id'] + '</td>');
        if (fair['thumbnail']){
            tr.append('<td><img src=' + baseURL + 'resource/' + fair['thumbnail'] + ' class="preview-img"></td>');	
        }else {
            tr.append('<td><img src=' + baseURL + 'resource/' + fair['map_image'] + ' class="preview-img"></td>');
        }

        // tr.append('<td name="dbId" style="display:none;">' + fair['id'] +  '</td>');
        tr.append('<td>' + fair['name'] + '</td>');
        tr.append('<td>' + dateFormat(fair['time']) + '</td>');
        tr.append('<td>' + fair['people_count'] + '</td>');
        tr.append('<td>' + fair['province'] + fair['city'] + fair['district'] + fair['detail'] + '</td>');
        tr.append('<td><a href="' + fair['homepage'] + '" type="button" class="btn btn-sm btn-info" target="_black"><i class="fa fa-eye"></i>&nbsp;查看</a></td>');
        // tr.append('<td >' + fair['location']['newsId'] + '</td>');
        tr.append('<td><a data-toggle="modal" href="#fairPanel" onclick="modifyFair(' + index + ')" class="btn btn-sm btn-primary"><i class="fa fa-edit"></i> 修改</a> '
                + '<a class="btn btn-sm btn-danger" onclick="deleteFair(' + index + ')"> <i class="fa fa-trash-o"></i> 删除</a> </td>');
        return tr;
    }

    $("#timepicker").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',
        autoclose: true,
        todayBtn: true,
    });

    $('#add').click(function() {
        $("#lbs-alert-form-message").hide();

        $('#fairPanel [name="dbId"]').val('');
        $('#fairPanel [name="locationId"]').val('');
        $('#fairPanel [name="name"]').val('');
        $('#fairPanel [name="time"]').val('');
        $('#fairPanel [name="count"]').val('');
        $('#fairPanel [name="province"]').val('');
        $('#fairPanel [name="city"]').val('');
        $('#fairPanel [name="district"]').val('');
        $('#fairPanel [name="detail"]').val('');
        $('#fairPanel [name="image"]').val('');
        $('#fairPanel [name="url"]').val('');
        $('#fairPanel [name="lat"]').val('');
        $('#fairPanel [name="lng"]').val('');
        showMap();
    });

    $('#showMap').click(function() {
        showMap();
    });

    function getFormData() {
        var _name = $('#fairPanel [name="name"]').val();
        var _time = $('#fairPanel [name="time"]').val();
        var _count = $('#fairPanel [name="count"]').val();
        var _province = $('#fairPanel [name="province"]').val();
        var _city = $('#fairPanel [name="city"]').val();
        var _district = $('#fairPanel [name="district"]').val();
        var _detail = $('#fairPanel [name="detail"]').val();
        var _image = $('#fairPanel [name="image"]').val();
        var _url = $('#fairPanel [name="url"]').val();
        var _lat = $('#fairPanel [name="lat"]').val();
        var _lng = $('#fairPanel [name="lng"]').val();

        if (_lat && _lng) {
            _lat = parseFloat(_lat);
            _lng = parseFloat(_lng);
        }

        if (_count || _count == 0) {
            _count = parseInt(_count);
        }

        var data = {
                name : _name,
                time : _time,
                count : _count,
                province : _province,
                city : _city,
                district : _district,
                detail : _detail,
                image : _image,
                url: _url,
                latitude: _lat,
                longitude: _lng
            };

        return data;
    }

    function validateAddress(data) {
        if (data.latitude == '' || data.longitude == '' || data.province != that.province || data.city != that.city
                || data.district != that.district || data.detail != that.detail) {
            handleMessage('请先单击“查看具体位置”,确保位置正确；或者重新填写正确的位置信息', 'danger');
            return false;
        }

        return true;
    }

    $("#upload_file_btn").click(function () {
        $("#upload_file_form").ajaxSubmit({
            success: function(result) {
                if (200 == result['code']) {
                    $('#fairPanel [name="image"]').val(result.data.newsImageRelativeUrl);
                    handleMessage('<strong>提示</strong> 图片上传成功!', 'success');
                } else {
                    handleMessage('<strong>提示</strong> 图片上传失败!', 'danger');
                }
            },
            error: function () {
                handleMessage('<strong>提示</strong> 图片上传失败!', 'danger');
            }
        });
    });

    function createRecruitment() {
        var _data = getFormData(); 

        if(!validateAddress(_data)) {
            return;
        }

        wcm.ajaxPost({url : wcm.getApiURL('addActivity') ,data : _data},
            function(result) {
                handleMessage('<strong>提示</strong> 添加成功 ', 'success', 'listAlert');
                $(".modal").modal('hide');
                initData(0);
            },
            function () {
                handleMessage('<strong>提示</strong> 添加失败!', 'danger');
            }
        );
    }
    function updateRecruitment() {
        var _id = $('#fairPanel [name="dbId"]').val();
        var _location_id = $('#fairPanel [name="location_id"]').val();
        var _data = getFormData();
        _data.location_id = parseInt(_location_id);
        _data.id = parseInt(_id);

        if(!validateAddress(_data)) {
            return;
        }
        wcm.ajaxPut({url : wcm.getApiURL('updateActivity') + '/' + _id, data : _data},
            function(result) {
	             handleMessage('<strong>提示</strong> 修改成功 ', 'success', 'listAlert');
	             $(".modal").modal('hide');
	             initData(0);
            },
            function () {
                handleMessage('<strong>提示</strong> 修改失败!', 'danger', 'listAlert');
            }
        );
    }
    var modifyFair = function(index) {
        $("#lbs-alert-form-message").hide();
        var fair = LBSData[index];

        $('#fairPanel [name="dbId"]').val(fair['id']);
        $('#fairPanel [name="name"]').val(fair['name']);
        $('#fairPanel [name="time"]').val(dateFormat(fair['time']));
        $('#fairPanel [name="count"]').val(fair['people_count']);
        $('#fairPanel [name="province"]').val(fair['province']);
        $('#fairPanel [name="city"]').val(fair['city']);
        $('#fairPanel [name="district"]').val(fair['district']);
        $('#fairPanel [name="detail"]').val(fair['detail']);
        $('#fairPanel [name="lat"]').val(fair['latitude']);
        $('#fairPanel [name="lng"]').val(fair['longitude']);
        $('#fairPanel [name="image"]').val(fair['thumbnail']);
        $('#fairPanel [name="url"]').val(fair['homepage']);
        $('#fairPanel [name="location_id"]').val(fair['location_id']);
        showMap();
    };

    var deleteFair = function(index) {
        var fair = LBSData[index];
        wcm.ajaxDelete({url : wcm.getApiURL('deleteActivity') + '/' + fair['id']},
            function(result) {
	            handleMessage('<strong>提示</strong> 删除成功 ', 'success', 'listAlert');
	            initData(0);
            },
            function () {
            	handleMessage('<strong>提示</strong> 删除失败 ', 'danger', 'listAlert');
            }
        
        );
    };
    $('#save').click(function() {
        var dbId = $('#fairPanel [name="dbId"]').val();
        if (!dbId) {
            createRecruitment();
        } else {
            updateRecruitment();
        }
    });

    function showMap() {
        var province = that.province = $('#fairPanel [name="province"]').val();
        var city = that.city = $('#fairPanel [name="city"]').val();
        var district = that.district = $('#fairPanel [name="district"]').val();
        var detail = that.detail = $('#fairPanel [name="detail"]').val();
        var address = province + ',' + city + ',' + district + ',' + detail;
        var geocoder, map;
        var lat = 0, lng = 0;

        var show = function() {
            var center = new qq.maps.LatLng(31.204655, 121.599846);
            map = new qq.maps.Map(document.getElementById('map'), {
                center : center,
                zoom : 15
            });
            geocoder = new qq.maps.Geocoder({
                complete : function(result) {
                    map.setCenter(result.detail.location);
                    var marker = new qq.maps.Marker({
                        map : map,
                        position : result.detail.location
                    });
                    lat = marker.getPosition().getLat();
                    lng = marker.getPosition().getLng();
                    $('#fairPanel [name="lat"]').val(lat);
                    $('#fairPanel [name="lng"]').val(lng);
                }
            });
            geocoder.getLocation(address);
            $('#map').show();
        };
        show();
    }

    var initData = function(pageIndex) {
        $('#lbs-data-table tbody').empty();
        $(function() {
            wcm.ajaxGet({url : wcm.getApiURL('activityList') + '?page_num=' + pageIndex + '&page_size=' + pageSize ,data : {}},
                function(result) {
                        LBSData = result;
                        for ( var i = 0; i < LBSData.length; i++) {;
                            $('#lbs-data-table tbody').append(generateFair(i, LBSData[i]));
                        }
                        $('#lbs-page-index').html(pageIndex + 1);
                        $('#lbs-total-page').html(Math.ceil(result['count'] / pageSize));
                }
            );
        });
    };
    $('#lbs-last-page').click(function() {
        var index = parseInt($('#lbs-page-index').html()) - 1;
        if (!(index <= 0)) {
            initData(index - 1);
        }
    });
    $('#lbs-next-page').click(function() {
        var index = parseInt($('#lbs-page-index').html()) - 1;
        var pageNum = parseInt($('#lbs-total-page').html());
        if (pageNum > index + 1) {
            initData(index + 1);
        }
    });
    wcm.LBSPage.modifyFair = modifyFair;
    wcm.LBSPage.deleteFair = deleteFair;
    initData(0);
};

new wcm.LBSPage();

function modifyFair(index) {
    wcm.LBSPage.modifyFair(index);
};
function deleteFair(index) {
    wcm.LBSPage.deleteFair(index);
};
