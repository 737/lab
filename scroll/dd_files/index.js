
M.Page.IndexPage = M.createClass();
M.extend(M.Page.IndexPage.prototype,
{
    context: {},
    datepickeraction:null,
    roomstatus:[],
	roomprice:{},
	dateprice:{},
	formatedateprice:{},
	switchdata:{},
	index:0,
	options:{fromtime:null,endtime:null},
	submittext:"处理中...",
	hotelroomtype:{},
	droplist:{},
	otahotellist:{},
	initclientwidth:'',
	initdata:{width:''},
	tpl_serarchorder:'<div class="single">'
                  	+' <div>'
                  	+'<span class="name">${guestname}</span>'
                  	+'<span class="phone">${phone}</span>'
                  	+'<span class="status">已预订</span>'
                  	+'</div>'
                  	+'<div>'
                  	+'<span>${fromdate}</span>, '
                  	+'<span>${roomname}</span>, '
                  	+'<span>住${nights}晚</span>'
                  	+'</div>'
                  	+'<div>'
                  	+'<span>${channelname}</span>, '
                  	+'<span>订单金额：&yen;${totalprice}</span>'
                  	+'</div>'
                  	+'<div class="note">${remark}</div>'
                  	+'<div class="other" style="${showstatus}">订单来自&lt;<a href="index.php?innid=${innid}">${innname}</a>&gt;<br/>请切换到该客栈查找才可查看订单详情。</div>'
                  	+'</div>',
	roomtypeoption_tpl:'<option value="${roomcode}" t="room">${roomname}</option>',
	switchhistory_tpl:'<tr tag="h">'
                      +'<td>${roomtypename}</td>'
					  +'<td>${daterange}</td>'
					  +'<td class="red">${targetstatus}</td>'
					  +'<td>${createon}</td>'
					  +'<td class="red">${opstatus}</td>'
					  +'</tr>',
	hoteltab:'<li class="${sestyle}"><a tag="switchinn" innid="${innid}" href="javascript:;">${innname}</a></li>',
	roomtpl:'<td class="${styleclass}" hotelcode="${hotelcode}" tip="${hotelroomtypename}" tag="${tag}" roomtypeid="${roomtypeid}" roomtypecode="${hotelroomtypecode}" day="${date}">${roomnum}</td>',
	roomtypetpl:'<label class="mr10" style="white-space:nowrap;"><input name="checkbox" type="checkbox" value="${hotelroomtypecode}">${hotelroomtypename}</label>',
	_getdatetime:function()
	{	
		var date=M.getTime();
		return date;
	},
    init: function () {
        this.initDOM();
        this.initEvent();
        //this.win_resize();
        this.resetroomtypecount();
        /*init*/
        //判断cookie 的值：0 关闭  1开启   
        if ($.cookie('example') == '0') {
        	this.context.turnover_toggle.click();
    	} 
        
    },
    win_resize:function()
    {
    	return;
    },   
    initDOM: function () {
        this.context.pickerarea = $("#pickerarea");
        this.context.right = $("#rightpanel");
        this.context.roomlist=$("#roomlist");
//        this.context.scroll_top =  $("#roomtype");
//        this.context.scroll_left =$("#pickerdate");
//        this.context.scroller = $(".datepicker");
        this.context.roomtype=$("#roomtype");
        this.context.roomtypeswitchform=$("#roomtypeswitchform");
        this.context.roomtypeswitch_btn=$("#roomtypeswitch_btn");
        this.context.switchtable=$("#switchtable");
        this.context.page=$("#formdaypage"); 
        this.context.fromdate=$("#fromdate");
        this.context.enddate=$("#enddate");
        this.context.switchroomtype=$("#switchroomtype")
        this.context.remind_message=$("#remind_message");
        this.context.tipmessageform=$("#tipmessageform");
        this.context.innidlist=$("#innidlist");
        this.context.show_legend=$("#show_legend");
		this.context.legend=$("#legend");
		this.context.batchswitch=$("#batchswitch");
		this.context.batchform=$("#batchform");
		this.context.batch_fromdate=$("#batch_fromdate");
		this.context.batch_enddate=$("#batch_enddate");
		this.context.saveswitch_btn=$("#saveswitch_btn");
		this.context.batchswitch_btn=$("#batchswitch_btn");
		this.context.turnover_toggle=$("#turnover_toggle");
		this.context.turnover_toggle.css("display",'');
		this.context.header=$("#header");
		this.context.foot=$(".foot");
		this.context.otalist=$("#otalist");
		this.context.otainnlist=$("#otainnlist");
		this.context.roomswitchhistory=$("#roomswitchhistory");
		this.context.switchhistorylist=$("#switchhistorylist");
		this.context.qunarroomswitchhistory=$("#qunarroomswitchhistory");
		this.context.searchswitchhistory_btn=$("#searchswitchhistory_btn");
		this.context.s_fromdate=$("#s_fromdate");
		this.context.s_enddate=$("#s_enddate");
		this.context.batch_fromdate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
		this.context.batch_enddate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
		this.context.s_fromdate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
		this.context.s_enddate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
		this.context.menu_search=$("#menu_search");
		this.context.searchorderlist=$("#searchorderlist");
		this.context.innroomdate=$("#innroomdate");
		this.context.searchkeyword=$("#searchkeyword");
	    this.context.mains = $('#mains');
	    this.context.footer = $('#footer');
        //this.win_resize();
    },
    initEvent: function () {
    	//$(window).resize(this.win_resize.toEventHandler(this));
        //$("#pickerarea").scroll(this._scroll.toEventHandler(this));
        this.context.roomtypeswitch_btn.bind("click",this.roomtypeswitch_click.toEventHandler(this));
        this.context.page.bind("click",this.page_click.toEventHandler(this));
        this.context.roomtypeswitchform.bind("click",this.roomtypeswitchform_click.toEventHandler(this));
        this.context.switchroomtype.bind("click",this.switchroomtype_click.toEventHandler(this));
        this.context.tipmessageform.bind("click",this.tipmessageform_click.toEventHandler(this));
        this.context.remind_message.bind("click",this.remind_messages.toEventHandler(this));
        this.context.innidlist.bind("change",this.tipmessageinnidchange.toEventHandler(this));
        this.context.legend.bind("mousemove", this.show_legend.toEventHandler(this));
        this.context.legend.bind("mouseout", this.hide_legend.toEventHandler(this));   
        this.context.batchswitch.bind("click",this.batchswitch_click.toEventHandler(this));
        this.context.batchswitch_btn.bind("click",this.batchswitch_btn.toEventHandler(this));
        this.context.turnover_toggle.bind("click",this.togglestatistics_btn.toEventHandler(this));
        this.context.roomswitchhistory.bind("click",this.roomswitchhistory_btn.toEventHandler(this));
        this.context.searchswitchhistory_btn.bind("click",this.roomswitchhistory_search.toEventHandler(this));
        this.context.qunarroomswitchhistory.bind("click",this.roomswitchhistory_btn.toEventHandler(this));
        this.context.menu_search.bind("click",this.menu_search.toEventHandler(this));
        this.context.searchorderlist.bind("click",this.searchorderlist_click.toEventHandler(this));
        this.context.searchkeyword.bind("keydown",this.searchkeyword_keydown.toEventHandler(this));
        
    },
    reqbusy:function()
    {
    	alert("请求处理中，请稍后再试");
    },
    req_before:function(btn)
    {
    	var busy=btn.attr("busy");
        if(busy=="1")
        {
        	this.reqbusy();
        	return false;
        }	
        btn.html(this.submittext).attr("busy","1");
        btn.attr("class",btn.attr("tempclass")+" disabled");
        return true;
    },
    req_end:function(btn)
    {
    	btn.html(btn.attr("text")).attr("busy","");
    	btn.attr("class",btn.attr("tempclass"));
    },
    menu_search:function(){
    	this.context.searchorderlist.children("div[tag=error]").hide();
    	this.context.searchorderlist.toggle();
    	//this.context.searchorderlist.children().find("input[name=keyword]").focus();
    },
    searchkeyword_keydown:function(evt){
    	this.context.searchorderlist.children("div[tag=error]").hide();
    	 var evt=evt?evt:(window.event?window.event:null);
    	  if (evt.keyCode==13){
    		  this.searchorder();
    	  }    	
    },
    searchorderlist_click:function(e){
    	var ele = M.EventEle(e);
        var t = ele.attr("tag");
        if(t=="search"){
        	this.searchorder();
        	return;
        }
        if(t=="close"){
        	this._closesearchform();
        	return;
        }
        if(t=="loadmore"){
        	this.loadmoreorder(ele);
        }else{
        	var tpl=ele.parents("div[tag=o]");
        	var showstatus=ele.parents("div[tag=o]").children("div[tag=other]").css("display");
        	if(showstatus!='none')
        		return;
        	if(tpl.length>0){
        		pickeraction.searchorderdetail(tpl);
        	}
        }
    },
    _closesearchform:function(){
    	M.emptyVal(this.context.searchorderlist.children().find("input[name=keyword]"));
    	this.context.searchorderlist.children("div[tag=error]").hide();
    	this.context.searchorderlist.children().find("div[tag=list]").children("div[tag=o]").remove();
    	this.context.searchorderlist.children("div[tag=listform]").hide();
    	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=total]").hide();
    	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=list]").hide().children("a[tag=loadmore]").hide();
    	this.context.searchorderlist.hide();
    },
    loadmoreorder:function(ele){
    	ele.html('<i class="loading16"></i>');
    	var keyword=M.getVal(this.context.searchorderlist.children().find("input[name=keyword]"));
    	var innid=this.context.roomtype.attr("innid");
   	    M._getjson("/ajax.php", {"a":"searchorder","innid":innid,"keyword":keyword,"index":this.index},this.searchorder_finished.toEventHandler(this));
    },
    searchorder:function(){
    	this.page=0;
    	var keyword=M.getVal(this.context.searchorderlist.children().find("input[name=keyword]"));
    	this.context.searchorderlist.children("div[tag=error]").hide();
    	if(M.isEmpty(keyword)){
    		this.context.searchorderlist.children("div[tag=error]").show();
    		this.context.searchorderlist.children("div[tag=listform]").hide();
    		return ;
    	}
    	this.context.searchorderlist.children("div[tag=listform]").show();
    	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=total]").hide();
    	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=list]").hide().children("a[tag=loadmore]").hide();
    	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=loading]").show();
    	this.context.searchorderlist.children().find("div[tag=list]").children("div[tag=o]").remove();
    	
    	var innid=this.context.roomtype.attr("innid");
   	    M._getjson("/ajax.php", {"a":"searchorder","innid":innid,"keyword":keyword},this.searchorder_finished.toEventHandler(this));
    },
    searchorder_finished:function(d){
    	if(d.status=="success"){
    		var list=d.d.list;
    		this.index=d.d.minid;
    		var total=d.d.total;
    		var target=this.context.searchorderlist.children().find("div[tag=list]");
    		if(list.length<7){
    			target.children("a[tag=loadmore]").hide();
    		}else{
    			target.children("a[tag=loadmore]").show();
    		}
    		for(var i=0;i<list.length;i++){
    			var item=list[i];
    			this._showorderlist(item, target);
    		}
    		if(total<=0){
    			target.hide();
    		}else{
    			target.show();
    		}
    		this.context.searchorderlist.children("div[tag=listform]").show();
    		target.children("a[tag=loadmore]").html("加载更多");
        	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=total]").show().children("strong").html(total);
        	this.context.searchorderlist.children("div[tag=listform]").children("div[tag=loading]").hide();
    		this.context.searchorderlist.children("div[tag=listform]").show();
    		this._resizeorderlist();
    	}
    },
    _resizeorderlist:function(){
    	var headheight=this.context.header.outerHeight();
		var footheight=this.context.foot.outerHeight();
		var roomtypeheight=this.context.roomtype.outerHeight();
		var searchconditionheight=this.context.searchorderlist.children("div[tag=condition]").outerHeight();
		var list_offet=this.context.searchorderlist.children().children("div[tag=list]").offset();
		var page_offset=this.context.searchorderlist.children().children("div[tag=page]").offset();
		var winheight=this.getWindowHeight();
		var heigth=winheight-list_offet.top-footheight-headheight-40;
		this.context.searchorderlist.children().find("div[tag=list]").css("height",heigth);
    },
    getWindowHeight:function(){  
    	  
        var de = document.documentElement;  
        return self.innerHeight || ( de && de.clientHeight ) || document.body.clientHeight;  
      
    },
    _showorderlist:function(item,target){
    	var tpl=target.children("div[tag=tpl]").clone(true).attr("tag","o").attr("oid",item.orderid).attr("uniqid",item.orderuniqid).attr("cid",item.checkingroupid).attr("status",item.ischeckin).attr("checkindate",item.fromdate).show();
    	tpl.children("div").children("span[tag=name]").html(item.guestname);
    	tpl.children("div").children("span[tag=phone]").html(item.phone);
    	tpl.children("div").children("span[tag=orderstatus]").html(item.orderstatusmsg);
    	tpl.children("div").children("span[tag=checkindate]").html(item.fromdate);
    	tpl.children("div").children("span[tag=roomname]").html(item.roomname);
    	tpl.children("div").children("span[tag=nights]").html('住'+item.nights+'晚');
    	tpl.children("div").children("span[tag=orderfrom]").html(item.channelname);
    	tpl.children("div").children("span[tag=totalprice]").html("订单金额：&yen;"+item.totalprice);
    	tpl.children("div[tag=remark]").html(item.remark);
    	tpl.children("div[tag=other]").css("display",item.showstatus).children("a").attr("href","index.php?innid="+item.innid).text(item.innname);
    	target.children("a[tag=loadmore]").before(tpl);
    	if(M.isEmpty(item.showstatus)){
    		tpl.addClass("cursor-d");
    	}    	
    },
    roomswitchhistory_search:function(){
    	 var tpl=this.context.roomtypeswitchform.children().find("ul").children("li[class=active]");
  	     var innid=tpl.children("a[tag=switchinn]").attr("innid");
  	     var hotelfrom=this.context.roomtypeswitchform.attr("hotelfrom");
  	     var fromdate=this.context.s_fromdate.val();
         var enddate=this.context.s_enddate.val();
         var room=this.context.switchhistorylist.children().find("select[tag=roomtypelist]").val();
    	 M._getjson("/ajaxota.php", {"a":"roomswitchhistory","hotelfrom":hotelfrom,"innid":innid,"startdate":fromdate,"enddate":enddate,"room":room},this.switchhistorylist_finished.toEventHandler(this));
    },
    roomswitchhistory_btn:function(){
    	 var tpl=this.context.roomtypeswitchform.children().find("ul").children("li[class=active]");
  	     var innid=tpl.children("a[tag=switchinn]").attr("innid");
  	     var hotelfrom=this.context.roomtypeswitchform.attr("hotelfrom");
	     var now=M.getTime();
	     var enddate = M.timeformat(now);
	     var fromdate=M.timeformat(new Date(now.getFullYear(),now.getMonth(),now.getDate()-1));
  	     this.context.s_fromdate.val(fromdate);
         this.context.s_enddate.val(enddate);
         var room=this.context.switchhistorylist.children().find("select[tag=roomtypelist]").val();
    	 M._getjson("/ajaxota.php", {"a":"roomswitchhistory","hotelfrom":hotelfrom,"innid":innid,"startdate":fromdate,"enddate":enddate,"room":room},this.switchhistorylist_finished.toEventHandler(this));
    },
    switchhistorylist_finished:function(d){
    	if(d.status=="success"){
    		var room=d.req.room;
    		var historylist=d.historylist;
    		
    		var h_tpl=$.tmpl(this.switchhistory_tpl,historylist);
    		var target_tpl=this.context.switchhistorylist.children().find("table[tag=historylist]").children("tbody");
    		target_tpl.children("tr[tag=h]").remove();
    		target_tpl.append(h_tpl);
    		var roomtypelist=d.roomtypelist;
    		var r_tpl=$.tmpl(this.roomtypeoption_tpl,roomtypelist);
    		this.context.switchhistorylist.children().find("select[tag=roomtypelist]").children("option[t=room]").remove();
    		this.context.switchhistorylist.children().find("select[tag=roomtypelist]").append(r_tpl);
    		this.context.switchhistorylist.children().find("select[tag=roomtypelist]").val(room);
    		if(historylist.length>0){
    			target_tpl.show();
    			this.context.switchhistorylist.children().find("div[tag=nohistory]").hide();
    		}else{
    			target_tpl.hide();
    			this.context.switchhistorylist.children().find("div[tag=nohistory]").show();
    		}
    		
    		M.Popup(this.context.switchhistorylist,{"hideclass":"modal setotaroom fade ","showclass":"modal setotaroom fade  in"});
    	}
    	
    },
    page_click:function(e){
    	var ele = M.EventEle(e);
        var t = ele.attr("tag");
        var fromtime=M.strtotime(this.context.fromdate.val());
        if(!M.isEmpty(t)){
        	this.roomtypeswitch_click(t,fromtime);
        }    	
    },
    switchroomtype_click:function(e){
    	var ele = M.EventEle(e).parent();
        var t = ele.attr("tag");
        switch(t){
           case "open":
        	   ele.addClass("switch-off");
        	   ele.attr("tag","close");
        	   break;
           case "close":
        	   ele.removeClass("switch-off");
        	   ele.attr("tag","open");
        	   break;
           case "saveswitch":
        	   this.saveswitch();
        	   break;         
        }
    },
    batchswitch_btn:function(){
    	 this.req_before(this.context.batchswitch_btn);
    	 var data=this._getbatchdata();
    	 M._getjson("/ajaxota.php", data,this.batchswitch_finished.toEventHandler(this));   	 
    },
    _getbatchdata:function(){
    	var tpl_roomtype=this.context.batchform.children().find("li div[tag=roomtype] label input:checked");
    	var hotelcode=this.context.batchswitch_btn.attr("hotelcode");
    	var fromdate=this.context.batch_fromdate.val();
 	    var enddate=this.context.batch_enddate.val();
 	    var tpl=this.context.roomtypeswitchform.children().find("ul").children("li[class=active]");
 	    var innid=tpl.children("a[tag=switchinn]").attr("innid");
 	    var status=this.context.batchswitch_btn.attr("status");
    	var data={"a":"batchswitchroom","hotelcode":hotelcode,"fromdate":fromdate,"enddate":enddate,"innid":innid,"status":status};
    	var i=0;
    	tpl_roomtype.each(function(){
    			var roomtypecode=$(this).val();
        		data['roomtypecode'+i]=roomtypecode;
        		i++;
    		
    	});
    	data.length=i;
    	return data;
    },
    batchswitch_finished:function(d){
    	this.req_end(this.context.batchswitch_btn);
    	if(d.status=="success"){
    		var data=d.data;
    		var fromdate=data.fromdate;
    		var enddate=data.enddate;
    		var status=d.req.status;
    		var roomtypelist=data.roomtypecodelist;
    		var fromtime=M.strtotime(fromdate);
            var endtime=M.strtotime(enddate);
            var tpl=this.context.switchtable.children("table").children("tbody");
            while(fromtime<=endtime){
            	date=M.timeformat(fromtime,'Y-m-d');  
            	for(var i=0;i<roomtypelist.length;i++){
            		var roomtypecode=roomtypelist[i];
            		if(status=="close"){
        				tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").removeClass("editable").addClass("closed").text("已关闭");
        			}else{
        				var roomnum=tpl.children("tr[tag=d]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").text();
                        if(roomnum!=0){
                            tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").removeClass("closed").addClass("editable").text(roomnum);
                        }
        			}
            	}
        		
            	fromtime.setDate(fromtime.getDate()+1);
            }
            M.CloseLast();
    	}else{
    		alert(d.msg);
    	}
    },
    batchswitch_click:function(e){
    	var ele = M.EventEle(e);
        var t = ele.attr("tag");
        switch(t){
	        case "batch_open":
	        	this.batchroomtype(t);
	        	break;
	        case "batch_close":
	        	this.batchroomtype(t);
	        	break;
        }
        this.context.batchswitch.children("div").toggle();
    	
    },
    togglestatistics_btn:function(){
    	this.context.pickerarea.children("table").children("tbody").children("tr").children("td[tag=total]").toggle();
    	this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal]").toggle();
    	var show=this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal]").attr("show");
    	if(show=='0'){
    		this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal]").attr("show","1");
    	}else{
    		this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal]").attr("show","0");
    	}
    	pickeraction.transform.win_resize();
    	
    	if(show=='0'){
    		this.context.turnover_toggle.children("div").removeClass("switch-off").addClass("switch-on");
    		$.cookie("example", "1",{expires:3600});         	
    	}else{
    		this.context.turnover_toggle.children("div").removeClass("switch-on").addClass("switch-off");
    		$.cookie("example", "0",{expires:3600});          
    	}   	
    	
    },
    batchroomtype:function(t){
    	if(t=='batch_close'){
    		this.context.batchswitch_btn.attr("status","close");
    		this.context.batchform.children("div").children("h4[tag=title]").html("批量关闭房型");
    		var tpl=this.context.batchform.children().find("ul[tag=cntlist]");
    		tpl.children("li").children("tt[tag=time_tip]").html('选择关闭时间段：');
    		tpl.children("li").children("tt[tag=roomtype_tip]").html('选择关闭的房型：');
    		this.context.batchswitch_btn.html('确认关闭');
    		this.context.batchswitch_btn.attr('text','确认关闭');
    	}else{
    		this.context.batchswitch_btn.attr("status","open");
    		this.context.batchform.children("div").children("h4[tag=title]").html("批量开启房型");
    		var tpl=this.context.batchform.children().find("ul[tag=cntlist]");
    		tpl.children("li").children("tt[tag=time_tip]").html('选择开启时间段：');
    		tpl.children("li").children("tt[tag=roomtype_tip]").html('选择开启的房型：');
    		this.context.batchswitch_btn.html('确认开启');
    		this.context.batchswitch_btn.attr('text','确认开启');
    	}
    	var now=this._getdatetime();
	    var date=M.timeformat(now,'Y-m-d');
	    this.context.batch_fromdate.val(date);
	    this.context.batch_enddate.val(date);
	 
	    var roomtypelist=this.hotelroomtype.list;
	    var html=$.tmpl(this.roomtypetpl,roomtypelist);
	    this.context.batchswitch_btn.attr("hotelcode",this.hotelroomtype.hotelcode);
	    this.context.batchform.children().find("ul[tag=cntlist] li div[tag=roomtype]").html(html);
	    this.context.batchform.children().find("ul[tag=cntlist] li div[tag=roomtype] label").after(' ');
    	M.Popup(this.context.batchform,{"hideclass":"bootbox modal view fade","showclass":"bootbox modal view fade in","dragable":true},function(){}.toEventHandler(this));
    },
    saveswitch:function(){
    	this.req_before(this.context.saveswitch_btn);
    	var data=this.switchdata;
    	var status=this.context.switchroomtype.children().find("div[tag=switch]").children("div").attr("tag");
    	data.status=status;
    	data.a="switchroomtype";
    	
    	var tpl=this.context.roomtypeswitchform.children().find("ul").children("li[class=active]");
    	data.innid=tpl.children("a[tag=switchinn]").attr("innid");
    	 M._getjson("/ajaxota.php", data,this.saveswitch_finished.toEventHandler(this));   	    	    	  
    },
    saveswitch_finished:function(d){
    	if(d.status=='success'){
    		var req=d.req;
    		var roomtypecode=req.roomtypecode;
			var date=req.fromdate;
			var status=req.status;
    		var tpl=this.context.switchtable.children("table").children("tbody");
    		if(status=="close"){
				tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").removeClass("editable").addClass("closed").text("已关闭");
			}else{
				var roomnum=tpl.children("tr[tag=d]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").text();
				tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").removeClass("closed").addClass("editable").text(roomnum);
			}
    		
    	}else{
    		alert(d.msg);
    	}
	    this.req_end(this.context.saveswitch_btn);
	    M.CloseLast();
    },    
    roomtypeswitchform_click:function(e){
    	var ele = M.EventEle(e);
        var t = ele.attr("tag");
        var styleclass=ele.attr("class");
        switch(t){
	        case "switch":
	        	this.switchroomtype(ele);
	        	break;   
	        case "switchinn":
	        	var innid=ele.attr("innid");
	        	this.roomtypeswitch_click('','',innid);
	        	break;	        
        }    	
    },
    switchroomtype:function(ele){
    	var roomname=ele.attr("tip");
    	var roomtypeid=ele.attr("roomtypeid");
    	var roomtypecode=ele.attr("roomtypecode");
    	var hotelcode=ele.attr("hotelcode");
    	var fromdate=ele.attr("day");
    	var styleclass=ele.attr("class");
    	var roomnum=ele.text();
    	if(styleclass=="closed"){
    		this.context.switchroomtype.children().find("div[tag=switch]").children("div").addClass("switch-off").attr("tag","close");
    	}else{
    		this.context.switchroomtype.children().find("div[tag=switch]").children("div").removeClass("switch-off").attr("tag","open");    		
    	}
    	this.switchdata={"roomtypeid":roomtypeid,"roomtypecode":roomtypecode,"roomtypename":roomname,"hotelcode":hotelcode,"fromdate":fromdate,"enddate":fromdate};
    	this.context.switchroomtype.children("div").children("h4").children("span").text(roomname).css("padding-left",'0');
    	M.Popup(this.context.switchroomtype,{"hideclass":"bootbox modal sm fade","showclass":"bootbox modal sm fade in","dragable":true},function(){}.toEventHandler(this));
    },
    otalist_change:function(ele){
    	var tpl=ele.parents("div[t=otalist]");
    	var hotelfrom=tpl.children("span").attr("value");
    	this.context.roomtypeswitchform.attr("hotelfrom",hotelfrom);
    	this.roomtypeswitch_click();
    },
    roomtypeswitch_click:function(t,fromtime,innid){
    	 var now=this._getdatetime();
    	 var nowdate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    	 if(t=='prev'){
    		 if(nowdate>=fromtime){
    			 return ;
    		 }
    		 var fromtime=M.strtotime(this.context.fromdate.val());
        	 var fromtime=new Date(fromtime.getFullYear(),fromtime.getMonth(),fromtime.getDate()-6);
        	 var endtime=new Date(fromtime.getFullYear(),fromtime.getMonth(),fromtime.getDate()+6);
    	 }else if(t=='next'){
    		 nowdate.setDate(nowdate.getDate()+90);    		
    		 var fromtime=M.strtotime(this.context.fromdate.val());
        	 var fromtime=new Date(fromtime.getFullYear(),fromtime.getMonth(),fromtime.getDate()+6);
        	 var endtime=new Date(fromtime.getFullYear(),fromtime.getMonth(),fromtime.getDate()+6);
        	 if(nowdate<=endtime){
        		 return ;
        	 }
    	 }else{
        	 var fromtime=new Date(now.getFullYear(),now.getMonth(),now.getDate());
             var endtime=new Date(now.getFullYear(),now.getMonth(),now.getDate()+6);
    	 }  
    	 if(M.isEmpty(innid)){
    		 innid=this.context.roomtypeswitchform.children().find("li[class=active]").children("a[tag=switchinn]").attr("innid");
    	 }
         var fromdate=M.timeformat(fromtime,'Y-m-d');
         var enddate=M.timeformat(endtime,'Y-m-d');
         this.context.fromdate.val(fromdate);
         this.context.enddate.val(enddate);
         this.context.s_fromdate.val(fromdate);
         this.context.s_enddate.val(enddate);
         var hotelfrom=this.context.roomtypeswitchform.attr("hotelfrom");
    	 M._getjson("/ajaxota.php", { "a": "getroomtypeswitch","innid":innid,"fromdate":fromdate,"enddate":enddate,"hotelfrom":hotelfrom}, this.getroomtypeswitch_finished.toEventHandler(this));  	   	    	 
    },
    getroomtypeswitch_finished:function(d){
    	if(d.status=="success"){
    		this.context.switchtable.children("table").children("tbody").children("tr[tag=d]").remove(); 
        	this.context.switchtable.children("table").children("tbody").children("tr[tag=d_ota]").remove();
        	this.context.roomtypeswitchform.children().find("a[tag=switchinn]").parent().removeClass("active");
        	this.context.roomtypeswitchform.children().find("a[tag=switchinn][innid="+d.req.innid+"]").parent().addClass("active");
    		var defaultllist=d.d.defaultroomlist;
    		this.hotelroomtype={"list":defaultllist,"hotelcode":d.d.hotelcode};
    		var roomswitchlist=d.d.roomswitchlist;
    		var roomnumlist=d.d.roomnum;
    		var hotelfrom=d.d.hotelfrom;
    		
    		this.context.roomtypeswitchform.attr("hotelfrom",hotelfrom);
    		if(hotelfrom=="ctrip"){
    			this.context.batchswitch.hide();
    			this.context.switchtable.children("div[tag=ctripfrom]").show();
    			this.otahotellist=d.otahotellist.ctrip;
    			this.context.roomtypeswitchform.children().find("h3[tag=title]").html("房态对照表<span>(提供90天的房态对照)</span>");
			    this.context.switchtable.children("div[tag=ctripfrom]").show();
			    this.context.switchtable.children("div[tag=quarfrom]").hide();
    		}else if(hotelfrom=="elong"){
    			this.otahotellist=d.otahotellist.elong;
    			this.context.batchswitch.show();
    			this.context.switchtable.children("div[tag=ctripfrom]").hide();
    			this.context.switchtable.children("div[tag=qunarfrom]").hide();
    			this.context.roomtypeswitchform.children().find("h3[tag=title]").html("设置开关房");
			    this.context.switchtable.children("div[tag=quarfrom]").hide();
			    this.context.switchtable.children("div[tag=ctripfrom]").hide();
    		}else{
    			this.context.batchswitch.hide();
    			this.context.switchtable.children("div[tag=ctripfrom]").hide();
    			this.context.switchtable.children("div[tag=qunarfrom]").show();
    			this.otahotellist=d.otahotellist.qunar;
    			this.context.roomtypeswitchform.children().find("h3[tag=title]").html("房态对照表<span>(提供90天的房态对照)</span>");
			    this.context.switchtable.children("div[tag=quarfrom]").show();
			    this.context.switchtable.children("div[tag=ctripfrom]").hide();
    		}
    		var hoteltab=$.tmpl(this.hoteltab,this.otahotellist);
    		this.context.otainnlist.html(hoteltab);
    		var otatpl=this.context.otalist.children("div[t=otalist]").attr("value",hotelfrom);
    		if(M.isEmpty(this.droplist.otatpl)){
    			this.droplist.otatpl=M.DropdownList(otatpl,this.otalist_change.toEventHandler(this),{});
    		}
    		this.context.otalist.find("div[tag=option]").hide();
    		this.context.otalist.find("div[value="+hotelfrom+"][tag=option]").show();
    		var tablist=d.tablist;
    		for(var type in tablist){
    			var typestatus=tablist[type];
    			if(typestatus==1){
    				this.context.otalist.find("div[value="+type+"][tag=option]").show();
    			}
    		}
    		this.inittabledata(defaultllist,hotelfrom);
    		var tpl=this.context.switchtable.children("table").children("tbody");
    		if(!M.isEmpty(roomnumlist)){
    			for(var r in roomnumlist){
    				var room=roomnumlist[r];
    				var roomtypecode=room.hotelroomtypecode;
					var fromtime=M.strtotime(this.context.fromdate.val());
			        var endtime=M.strtotime(this.context.enddate.val());
			        var roomname=room.hotelroomtypename;
			        var status=room.status;
			        tpl.children("tr[tag=d][roomtypecode="+roomtypecode+"]").children("td[tag=roomname]").html(roomname);
			        while(fromtime<=endtime){
			        	var date=M.timeformat(fromtime,'Y-m-d');
			        	var num=status[date];
			        	tpl.children("tr[tag=d]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").html(num);
			        	if(hotelfrom=="ctrip"||hotelfrom=="qunar"){
			        		tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").html(num).hide();;
			        	}else{
			        		tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+date+"]").html(num).show();
			        	}
	 					
	 					fromtime.setDate(fromtime.getDate()+1);
			        }
				}
    			
    		}
    		if(!M.isEmpty(roomswitchlist)){    			
    			for(var i=0;i<roomswitchlist.length;i++){
    				var roomtypecode=roomswitchlist[i].roomtypecode;
    				var fromdate=roomswitchlist[i].fromdate;
    				var status=roomswitchlist[i].status;
    				if(status==0){
    					tpl.children("tr[tag=d_ota]").children("td[roomtypecode="+roomtypecode+"][day="+fromdate+"]").removeClass("editable").addClass("closed").text("已关闭");
    				}    				
    			}
    		}
    		M.Popup(this.context.roomtypeswitchform,{"hideclass":"modal setotaroom fade","showclass":"modal setotaroom fade in","dragable":true},function(){}.toEventHandler(this));
    	}else{
    		alert(d.msg);
    	}
    },
    inittabledata:function(defaultllist,hotelfrom){
    	 var fromtime=M.strtotime(this.context.fromdate.val());
         var endtime=M.strtotime(this.context.enddate.val());
         var html='<th></th><th>渠道</th>';
         var datestr=M.timeformat(fromtime,'m/d');
         var enddatestr=M.timeformat(endtime,'m/d');
         var year=M.timeformat(fromtime,'Y');;
         this.context.page.children("div[class=range]").children("p").text(datestr+'~'+enddatestr);
         this.context.page.children("div[class=range]").children("b").text(year);
    	 while(fromtime<=endtime){
    		 datestr=M.timeformat(fromtime,'m/d');
    		 html+='<th>'+datestr+'</th>';
    		 fromtime.setDate(fromtime.getDate()+1);
    	 }
    	 this.context.switchtable.children("table").children("thead").children("tr").html(html);
    	 var tmpl= this.context.switchtable.children("table").children("tbody").children("tr[tag=tmpl]");
    	 var tmplnext=this.context.switchtable.children("table").children("tbody").children("tr[tag=tmplnext]");
    	 for(var i=0;i<defaultllist.length;i++){
    		 var datarow=tmpl.clone(true).show().attr('tag','d');
    		 datarow.children("td[tag=roomname]").text(defaultllist[i].hotelroomtypename).attr("rowspan","2");
    		 if(hotelfrom=="ctrip"||hotelfrom=="qunar"){
    			 datarow.children("td[tag=roomname]").removeAttr("rowspan");
    		 }
    		 datarow.attr("roomtypeid",defaultllist[i].roomtypeid);
    		 datarow.children("td[tag=innname]").text('云掌柜');
    		 
    		 datarow=this.showitem(datarow,defaultllist[i],'','');
    		 datarow.insertBefore(tmpl);
    		 var row=tmplnext.clone(true).show().attr('tag','d_ota');
    		 row.children("td[tag=innname]").text('艺龙');
    		 row=this.showitem(row,defaultllist[i],'editable','switch');
    		 if(hotelfrom=="ctrip"||hotelfrom=="qunar"){
    			 row.hide();
    		 }else{
    			 row.show();
    		 }
    		 row.insertBefore(tmpl);
    	 }
    },
    showitem:function(tpl,room,stylecalss,t){
    	 var fromtime=M.strtotime(this.context.fromdate.val());
         var endtime=M.strtotime(this.context.enddate.val());
         while(fromtime<=endtime){
        	 room.date=M.timeformat(fromtime,'Y-m-d');
        	 room.styleclass=stylecalss;
        	 room.tag=t;
        	 var html=$.tmpl(this.roomtpl,room);
        	 tpl.append(html);  
        	 fromtime.setDate(fromtime.getDate()+1);
         }
         return tpl;
    },    
    resetroomtypecount:function(){    	
    	var i=count=0;
    	this.context.roomtype.children("table").children("tbody").find("td").each(function(){
    		i=$(this).attr("i");
    		if(i==undefined){
    			$(this).attr("i",count);
    			count=count*1+1;
    		}else{
    			count=i*1+1;
    		}
    	});
    },
    tipmessageform_click:function(e){
    	var ele = M.EventEle(e);
    	var t=ele.attr("tag");
    	if(t=='checkoutuser'){
    		this.getcheckoutuser();
    	}
    	if(t=='checkinuser'){
    		this.getcheckinuser();
    	}

	    if(t == 'closebtn'){
		    this.context.tipmessageform.hide();
		    this.context.mains.children('div[tag=tomorrow]').children('table').find('tbody').children('tr[tag=o]').remove();
		    this.context.mains.children('div[tag=today]').children('table').find('tbody').children('tr[tag=o]').remove();
	    }
    },
    tipmessageinnidchange:function(){
    	var sele=this.context.tipmessageform.children().find("li[class=active]").children("a").attr("tag");
 	   if(sele=='checkinuser'){
 		   this.getcheckinuser();
 	   }else{
 		   this.getcheckoutuser();
 	   }
    },
    getcheckoutuser:function(){
    	var innid=this.context.tipmessageform.children().find("select[name=innidlist]").val();
    	this.context.tipmessageform.children().find("a[tag=checkinuser]").parent().removeClass("active");
    	this.context.tipmessageform.children().find("a[tag=checkoutuser]").parent().addClass("active");
    	M._getjson("/ajax2.php", { "a": "getcheckoutusers","innid":innid}, this.remind_message_finished.toEventHandler(this));
    	M.Popup(this.context.tipmessageform,{"hideclass":"modal fade","showclass":"modal fade in","dragable":true},function(){}.toEventHandler(this));
   },
    getcheckinuser:function(){
    	var innid=this.context.tipmessageform.children().find("select[name=innidlist]").val();
    	this.context.tipmessageform.children().find("a[tag=checkinuser]").parent().addClass("active");
    	this.context.tipmessageform.children().find("a[tag=checkoutuser]").parent().removeClass("active");   
    	M._getjson("/ajax.php", { "a": "getcheckinusers","innid":innid}, this.remind_message_finished.toEventHandler(this));
    	M.Popup(this.context.tipmessageform,{"hideclass":"modal fade","showclass":"modal fade in","dragable":true},function(){}.toEventHandler(this));
    	
    },
	remind_messages:function(){
		var innid=this.context.roomtype.attr("innid");
		var level = this.context.footer.attr('level');
		var t=this.context.remind_message.attr("tag");
		if(t=='tool-alert-unread'){
    		this.context.remind_message.removeClass("tool-alert-unread");
        	this.context.remind_message.attr("tag","tool-alert-unread");
    		M._getjson("/ajax.php", { "a": "alertread"}, function(){});
    	}
		if(level != 1){
			M.error('对不起，您没有该权限，请联系客栈管理员');
			exit;
		}
		M._getjson("/ajax.php", { "a": "getcheckinoutusers","innid":innid}, this.remind_messages_finished.toEventHandler(this));
		M.Popup(this.context.tipmessageform,{"hideclass":"modal fade","showclass":"modal fade in","dragable":true},function(){}.toEventHandler(this));
	},
	remind_messages_finished:function(d){
		if(d.status=="success"){
			var tpl = this.context.mains.children('div[tag=total]').children('div');
			var tpl1 = this.context.mains.children('div[tag=tomorrow]').children('h3');
			var tpl2 = this.context.mains.children('div[tag=today]').children('h3');
			tpl.find('span[tag=rooms]').text(d.checkincount);
			tpl.find('span[tag=percent]').text(d.checkinrate+'%');
			tpl.find('span[tag=roomfee]').text(d.totalresult);
			tpl.find('span[tag=otherincome]').text(d.otherincome);
			tpl.find('span[tag=otherpay]').text(d.otheroutcome);
			tpl1.children('span[tag=date]').text(d.checkinusertotal.date);
			tpl1.children('span[tag=tomorrowperson]').text(d.checkinusertotal.total);
			tpl1.children('span[tag=tomorrowcar]').text(d.checkinusertotal.needcarcount);
			tpl2.children('span[tag=todayperson]').text(d.checkoutusertotal.total);
			tpl2.children('span[tag=todaycar]').text(d.checkoutusertotal.needcarcount);
			if(M.isEmpty(d.checkoutuser)){
				this.context.mains.children('div[tag=today]').hide();
				this.context.mains.children('div[tag=todayempty]').show();
			}else{
				this.context.mains.children('div[tag=today]').show();
				this.context.mains.children('div[tag=todayempty]').hide();
			}

			if(M.isEmpty(d.checkinuser)){
				this.context.mains.children('div[tag=tomorrow]').hide();
				this.context.mains.children('div[tag=tomorrowempty]').show();
			}else{
				this.context.mains.children('div[tag=tomorrow]').show();
				this.context.mains.children('div[tag=tomorrowempty]').hide();
			}
			var html = '';
			var html1 = '';
			for(var i=0;i< d.checkinuser.length;i++){

				html +='<tr tag="o">';

				html+='<td>';
				html+= d.checkinuser[i]['guestname'];
				html+='</td>';

				html+='<td>';
				if(!M.isEmpty(d.checkinuser[i]['phone'])){
					html+=d.checkinuser[i]['phone'];
				}else{
					html+='-';
				}
				html+='</td>';

				html+='<td>';
				html+=d.checkinuser[i]['roomname']+'-'+d.checkinuser[i]['roomtypename'];
				html+='</td>';

				html+='<td>';
				html+=d.checkinuser[i]['channelname'];
				html+='</td>';

				html+='<td>已预订';
				html+='</td>';

				html+='<td>';
				if(d.checkinuser[i]['needcar']!=0){//车接
					html+='<span class="car-red"></span>';
				}else{
					html+='<span>-</span>';
				}

				html+='</td>';

				html+='</tr>';
			}

			this.context.mains.children('div[tag=tomorrow]').children('table').find('tbody').append(html);

			for(var j=0;j< d.checkoutuser.length;j++){

				html1 +='<tr tag="o">';

				html1+='<td>';
				html1+= d.checkoutuser[j]['guestname'];
				html1+='</td>';

				html1+='<td>';
				if(!M.isEmpty(d.checkoutuser[j]['phone'])){
					html1+=d.checkoutuser[j]['phone'];
				}else{
					html1+='-';
				}
				html1+='</td>';

				html1+='<td>';
				html1+=d.checkoutuser[j]['roomname']+'-'+d.checkoutuser[j]['roomtypename'];
				html1+='</td>';

				html1+='<td>';
				html1+=d.checkoutuser[j]['channelname'];
				html1+='</td>';

				html1+='<td>';
				if(d.checkoutuser[j]['status']==1){
					html1+='已入住';
				}else{
					html1+='已退房';
				}
				html1+='</td>';

				html1+='<td>';
				if(d.checkoutuser[j]['needcar2']!=0){//车送
					html1+='<span class="car-red"></span>';
				}else{
					html1+='<span>-</span>';
				}

				html1+='</td>';

				html1+='</tr>';
			}

			this.context.mains.children('div[tag=today]').children('table').find('tbody').append(html1);

		}
	},
    remind_message:function(){
    	var t=this.context.remind_message.attr("tag");
    	if(t=='tool-alert-unread'){
    		this.context.remind_message.removeClass("tool-alert-unread");
        	this.context.remind_message.attr("tag","tool-alert-unread");
    		M._getjson("/ajax.php", { "a": "alertread"}, function(){});
    	}
    	this.context.tipmessageform.children().find("select[name=innidlist]").val("0");
    	var now= M.getTime();
    	var hours=now.getHours();
    	if(hours<12){
    	  	this.getcheckoutuser();
    	}else{    		
    		this.getcheckinuser();
    	}
    },
    remind_message_finished:function(d){
    	if(d.status=="success"){
    		var userlist=d.userlist;
        	var tip='需要车送';
        	var action="离店";
        	var html='';
        	var dayname='明日';
        	var tpl=this.context.tipmessageform.children().children().find("div[tag=userlist]");
        	if(d.type=='checkin'){
        		tip='需要车接';
        		action='到店';
        		html=' <div class="tc t14 m20">明日没有客人到店</div>';
        	}else{
        		dayname='今日';    		
        		html=' <div class="tc t14 m20">今日没有客人离店</div>';
        	}			
        	if(!M.isEmpty(userlist)){
        		html=' <div class="mb10">'+dayname+'（'+d.date+'）将要'+action+d.total+'人，'+tip+d.needcarcount+'人</div>';
        		html+='<table class="table table-striped"><tbody>';
        		for(var i=0;i<userlist.length;i++){
        			html+='<tr>';
    	    		html+='<td width="15">';
    	    		if((userlist[i].needcar=='1'&&d.type=='checkin')||(userlist[i].needcar2=='1'&&d.type!='checkin'))
    	    		    html+='<span class="car-red"></span>';
    	    		html+='</td>';
    	    		
    	    		var channelname=userlist[i].channelname;
    	    		channelname=M.isEmpty(channelname)?'':'<'+channelname+'>';
    	    		html+='<td>'+userlist[i].guestname+channelname+'，';
    	    		if(!M.isEmpty(userlist[i].phone))
    	    			html+=userlist[i].phone+'，';
    	    		html+=userlist[i].roomname+'('+userlist[i].roomtypename+')';
    	    		if((userlist[i].needcar=='1'&&d.type=='checkin')||(userlist[i].needcar2=='1'&&d.type!='checkin'))
    	    			html+='，<br/>'+tip;
    	            if(!M.isEmpty(userlist[i].remark))
    	            	html+='，备注：'+userlist[i].remark;
    	    		html+='</td>';
    	    		html+='</tr>';
        		}
    	    	html+='</tbody></table>';
        	}
        	tpl.html(html);   	
    	}else{
    		M.error(d.msg);
    	}
    },

    show_legend:function(){
    	var ele=this.context.show_legend;
    	ele.css("display","block");
    	ele.css("opacity","1");    	
    },
    hide_legend:function(){
    	var ele=this.context.show_legend;
    	var waterstatus=this.context.roomtype.attr("pluginwaterstatistics");
    	if(waterstatus!=1){
    		ele.addClass("msgSymbolRight");
    	}
    	ele.css("display","none");
    	ele.css("opacity","0");    	
    },
    close_click:function(e)
    {
        M.CloseLast();
    },
    _managecell:function(tdele){
        $(tdele).css({ "border-left": "none" });
    },
    zerosize:function (value, length) {
        if (!length) length = 2;
        value = String(value);

        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    },
    timeformat:function(date,format)
    {
		if(M.isEmpty(format))
		{
			format="Y-m-d";
		}
		
		var year=date.getFullYear();
		var month=this.zerosize(date.getMonth() + 1 + "", 2);
		var day=this.zerosize(date.getDate() + "", 2);
		
		
        var time = format.replace("Y",year)
		.replace("m",month)
		.replace("d",day);
        
        return time;
    },
    NoUndefined:function(str)
    {
    	return M.isEmpty(str)?"":str;
    },
    datepicker_scrollhandler:function(){
        
    },
    _closepopup:function()
    {
    	M.ClosePopup();
    },
    destroy: function () {

    }
});

