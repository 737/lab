/*
author:johnny
create on:2014-02-13
desc:定义横轴为日期，纵轴为房间的房态处理
*/
M.Page.DRTrans= M.createClass();
M.extend(M.Page.DRTrans.prototype,
{
    context: {},
	width:0,
	orderwidth:0,
	scroll_width:0,
	innmorewidth:0,
	index:0,
	inf:{},
	transtype:"DR",/**[DR|RD]**/
	tpl_divinfo:'<div class="date-have">'
		+'<div class="${css}" style="width:${width}px">'
		+'<p class="sortorder">${guestname}</p>'
  		+'<p class="t12 light sortorder" >${channel}</p>'
		+'<div class="demand"></div>'
  		+'</div>'
		+'</div>',
		
	init: function () {
    
    
    
        this.initDOM();
        
        this.initEvent();
        
        return;
        this.win_resize();
        this._locateinn();
	},
	initDOM: function () {
		this.context.pickerarea=$("#pickerarea");
		this.context.pickerdate=$("#pickerdate");

		this.context.scroller = $(".datepicker");
		this.context.scroll_top=$("#pickerdate");
        this.context.scroll_left=$("#roomtype");
        this.context.roomlist=$("#roomlist");
        this.context.roomtype=$("#roomtype");
        this.inf.ov=this.context.roomtype.attr("ov");
        this.inf.tp=this.context.roomtype.attr("tp");
        this.context.screen_left=$("#scroll_left");
        this.context.screen_right=$("#scroll_right");
        var obj =this.context.scroller[0];
        this.width = obj.scrollWidth;
    	this.scroll_width=$(window).width() - this.context.roomtype.outerWidth();
    	this.context.footer=$("#footer");
    	this.context.detectform=$("#detectform");
	},
	initEvent: function () {
		
		$("#pickerarea").scroll(this._scroll.toEventHandler(this));
        
        return;
		$(window).resize(this.win_resize.toEventHandler(this));
		this.context.screen_right.bind("click",this.scroll_right.toEventHandler(this));
		this.context.screen_left.bind("click",this.scroll_left.toEventHandler(this));
		this.context.footer.bind("click",this.scroll_innlist.toEventHandler(this));
		this.context.detectform.bind('click', this.detectform_click.toEventHandler(this));
		this.context.pickerarea.bind("click",this.pickerarea_click.toEventHandler(this));
	},
	pickerarea_click:function(e){
		var ele = M.EventEle(e);
		var rtid = ele.attr('rtid');
		var tpl_roomtype = this.context.roomlist.find('tbody').find('tr[rtid='+rtid+']').children('td').children('div[tag=fold]');
		var status = tpl_roomtype.attr('status');
		var tpl_room = this.context.roomlist.find("tbody").children("tr[tag=roomtype][rtid="+rtid+"]");
		var i = [];
		tpl_room.each(function(){
			i.push($(this).attr('i'));
		});
		var t = ele.attr("tag");
		if (t == 'leave'){
			this.room_expand(tpl_roomtype,tpl_room,i);
		}
	},
	roomlist_click:function(ele){
		
		var status = ele.attr('status');
		var rtid = ele.parents('tr').attr('rtid');
		var tpl_room = this.context.roomlist.find("tbody").children("tr[tag=roomtype][rtid="+rtid+"]");
		var tpl_picker = this.context.pickerarea.find('table').find('tbody');
		var i = [];
		tpl_room.each(function(){
			i.push($(this).attr('i'));
		});
		var t = ele.attr("tag");
		if(t=='roomtf'){
			ele.children('div').attr('status','0');
			ele.parents('tr').attr('fold','1').children('td[tag=roomtype]').show();
			ele.attr('rowspan','1');
			tpl_room.hide().attr('fold','0');
			for (var x = 0; x < i.length; x++) {
				tpl_picker.find('tr[i='+i[x]+']').hide().attr('rtid',rtid);
			}
			var lasti = i[x-1];
			var tpl_tr = tpl_picker.find('tr[collapse=1][i='+lasti+']');
			var tpl_div = tpl_tr.children('td').children('div');
			tpl_tr.show().attr('tag','c');
			tpl_div.attr('tag','leave').attr('rtid',rtid);
			this.selectedreset();
		}
		if (t == 'fold'){
			if(status == '1'){
				ele.attr('status','0');
				ele.parents('tr').attr('fold','1').children('td[tag=roomtype]').show();
				ele.parents('td').attr('rowspan','1');
				tpl_room.hide().attr('fold','0');
				for (var x = 0; x < i.length; x++) {
					tpl_picker.find('tr[i='+i[x]+']').hide().attr('rtid',rtid);
				}
				var lasti = i[x-1];
				var tpl_tr = tpl_picker.find('tr[collapse=1][i='+lasti+']');
				var tpl_div = tpl_tr.children('td').children('div');
				tpl_tr.show().attr('tag','c');
				tpl_div.attr('tag','leave').attr('rtid',rtid);
			}else{
				this.room_expand(ele,tpl_room,i);
			}
			this.selectedreset();
		}
		this._resettotal(tpl_room, rtid);
	},
	room_expand:function(ele,tpl_room,i){
		ele.attr('status','1');
		var rowspan = ele.attr('rs');
		var tpl_pick = this.context.pickerarea.find('table').find('tbody');
		ele.parents('tr').attr('fold','').children('td[tag=roomtype]').hide();
		ele.parents('td').attr('rowspan',rowspan);
		tpl_room.show();
		tpl_room.attr('fold','1');
		for (var x = 0; x < i.length; x++) {
			var tpl_col = tpl_pick.find('tr[collapse=1][i='+i[x]+']');
			tpl_pick.find('tr[i='+i[x]+']').show().attr('rtid',"");
			tpl_col.hide().children('td').children('div').attr('tag','').attr('rtid','');
		}
		var lasti = i[x-1];
		var tr_tpl = tpl_pick.find('tr[collapse=1][i='+lasti+']');
		var div_tpl = tr_tpl.children('td').children('div');
		tr_tpl.hide().attr('tag','');
		div_tpl.attr('tag','').attr('rtid','');
	},
	_resettotal:function(tpl_room,rtid){
		var length = this.context.pickerdate.find('tr').children('td').length;
		var countlist = [];
		var targetpicker = this.context.pickerarea.find("tr[collapse!=1][rtid="+rtid+"]");
		var total = targetpicker.length;
		for(var i = 0;i < length;i++){
			var unordertotal = targetpicker.children("td[sta=unordered][idx="+i+"]").length;
			countlist[i] = unordertotal;
		}
		var tpllist = this.context.pickerarea.find("tr[tag=c][rtid="+rtid+"]").find("td");
		tpllist.each(function(){
			var idx = $(this).attr("idx");
			var unordertotal = countlist[idx];
			var html = unordertotal;
			$(this).children("div").html(html);
		});
	},
	_scroll:function(){
    
    debugger;
        var top = this.context.scroller.scrollTop();
        var left = this.context.scroller.scrollLeft();
        
        this.context.scroll_top.scrollLeft(left);
        this.context.scroll_left.scrollTop(top);
        if(left>0){
        	this.context.screen_left.show();
    		this.context.screen_right.show();
        }
    },
    detectform_click:function(e){
    	var ele = M.EventEle(e);
		var t=ele.attr("tag");
		if(t=="close"){
			this.context.detectform.animate({height: '0'}, 300);
			var detectform=this.context.detectform;
		     setTimeout(function(){detectform.hide();}, 310);
		}
    },
    detectzoom:function(){
    	var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase(),
        yzgDoctor = this.context.detectform,
        yzgDoctorClose = this.context.detectform.find('.yzg-doctor-close');
	    if( ~ua.indexOf('firefox') ){
	        if( window.devicePixelRatio !== undefined ){
	            ratio = window.devicePixelRatio;
	        }
	    }
	    else if( ~ua.indexOf('msie') ){    
	        if( screen.deviceXDPI && screen.logicalXDPI ){
	            ratio = screen.deviceXDPI / screen.logicalXDPI;
	        }
	    }
	    else if( window.outerWidth !== undefined && window.innerWidth !== undefined ){
	        ratio = window.outerWidth / window.innerWidth;
	    }
	    
	    if( ratio ){
	        ratio = Math.round( ratio * 100 );
	    }    
    // 360安全浏览器下的innerWidth包含了侧边栏的宽度
	    if( ratio !== 100 ){
	        if( ratio >= 95 && ratio <= 105 ){
	            ratio = 100;
	            yzgDoctor.hide();
	        }
	        else{
	            yzgDoctor.show().animate({height: '45px'}, 300);
	        }
	    }
        if(ratio==100){
        	 yzgDoctor.hide();
        }
    },
    win_resize:function()
    {
    	var roomtypewidth=this.context.roomtype.outerWidth();
    	this.context.scroller.width($(window).width()-roomtypewidth);
        var scrollHeight = 0;
        var height=$(window).height();
        var pickerheadHeight = $(window).height() - $("#header").outerHeight() - $("#pickerdate").outerHeight() - $(".foot").outerHeight() - scrollHeight;
        if ($("#roomtype").height()>pickerheadHeight)
        {
        	$("#roomtype").height(pickerheadHeight);
        }
        else
        {
        	$("#roomtype").height(pickerheadHeight);
        }

    	//判断datepicker是否出现滚动条
        var obj =this.context.scroller[0];
        var sw = obj.scrollWidth;
        var cw = obj.clientWidth;
	    var sh = obj.scrollHeight;
	    var ch = obj.clientHeight;
        var ow = obj.offsetWidth;
        var sl=obj.scrollLeft;
        this.width = obj.scrollWidth;
    	this.scroll_width=$(window).width() - this.context.roomtype.outerWidth();
    	var scrollX_height=0;
    	if (sw>=cw) {
    		this.context.scroll_left.css("overflow-x","scroll");
    		scrollX_height=25;
    	}
    	else
    	{
    		this.context.scroll_left.css("overflow-x","hidden");
    	}    	
    	var pickerarea_height=this.context.pickerarea.children("table").outerHeight();
    	var footer_top=this.context.footer.offset().top;
    	var pickerarea_top=this.context.pickerarea.offset().top;
    	 var bodyblank_height=footer_top-pickerarea_top-pickerarea_height-scrollX_height;

      	if(bodyblank_height<=0){
      		this.context.pickerdate.css("overflow-y","scroll");
      		this.context.pickerarea.css("overflow-y","scroll");
      	}else{
      		this.context.pickerdate.css("overflow-y","hidden");
      		this.context.pickerarea.css("overflow-y","hidden");
      	}    	
    	if(sw>(cw+20)){
    		var left = this.context.scroller.scrollLeft();
    		this.context.screen_left.show();
    		this.context.screen_right.show();
    		if(left<=1){
    			this.context.screen_left.hide();
    		}
    	}else{
    		this.context.screen_left.hide();
    		this.context.screen_right.hide();
    	}

         this._handleinnlist();
//         if(this.index!=0){
//        	 this.detectzoom();
//         }
         this.index=1;
         this.context.pickerarea.css("width",this.context.pickerdate.width()+2);
         
    },  
    scroll_innlist:function(e){
    	var ele = M.EventEle(e);
        var tag = ele.attr("tag");
        var style=ele.attr("class");
        if(tag=="left"&&style.indexOf("prev_no")==-1){
        	var tpl=this.context.footer.children("div").children("div[tag=inn_div]").children("ul");
        	var margin_left=parseInt(tpl.css("margin-left").replace("px",""));
        	if(margin_left==0){
        		if(this.innmorewidth>500){
        			tpl.animate({"margin-left":margin_left-500+"px"},"slow");
            		this.context.footer.children("div").children("a").removeClass("prev_no");
        		}else{
        			tpl.animate({"margin-left":-this.innmorewidth+"px"},"slow");
        			this.context.footer.children("div").children("a").removeClass("prev_no");
        			ele.addClass("prev_no");
        		}
        	}else{
        		if((margin_left-500)<-this.innmorewidth){
        			var scrolllength=this.innmorewidth+margin_left;
        			tpl.animate({"margin-left":margin_left-scrolllength+"px"},"slow");
        			this.context.footer.children("div").children("a").removeClass("prev_no");
        			ele.addClass("prev_no");
        		}else{
        			tpl.animate({"margin-left":margin_left-500+"px"},"slow");
            		this.context.footer.children("div").children("a").removeClass("prev_no");
        		}
        	}	
        }
        if(tag=="right"&&style.indexOf("prev_no")==-1){
        	var tpl=this.context.footer.children("div").children("div[tag=inn_div]").children("ul");
        	var margin_left=parseInt(tpl.css("margin-left").replace("px",""));
        	if(margin_left==0){
        		return;
        	}
        	if(margin_left>-500){
        		tpl.animate({"margin-left":"0px"},"slow");
        		this.context.footer.children("div").children("a").removeClass("prev_no");
    			ele.addClass("prev_no");
        	}else{
        		tpl.animate({"margin-left":margin_left+500+"px"},"slow");
        		this.context.footer.children("div").children("a").removeClass("prev_no");
        	}       	
        }
    },
    _handleinnlist:function(){
    	var container=this.context.footer.children("div").children("div[tag=inn_div]");
    	var containerwidth=container.outerWidth();
    	var innlist=this.context.footer.children("div").children("div[tag=inn_div]").children("ul").children("li");
    	var innlistwidth=this._getinnlistwidth(innlist)-(innlist.length+1);
    	if((containerwidth+10)<innlistwidth){
    		this.innmorewidth=innlistwidth-containerwidth;
    		this.context.footer.children("div").children("a").show();
    	}else{
    		this.context.footer.children("div").children("a").hide();
    	}
    },
    _getinnlistwidth:function(innlist,innid){
    	var width=0;
    	innlist.each(function(){
    		var innwidth=$(this).outerWidth(); 
    		width=parseInt(width)+parseInt(innwidth);
    		if(!M.isEmpty(innid)){
    			var id=$(this).attr("innid");
    			if(id==innid){
    				return false;
    			}
    		}
    		
    	});
    	return width;
    },
    _locateinn:function(){
    	var innid=this.context.roomtype.attr("innid");
    	if(this.innmorewidth!=0){
    		var container=this.context.footer.children("div").children("div[tag=inn_div]");
        	var containerwidth=container.outerWidth();
    		var innlist=this.context.footer.children("div").children("div[tag=inn_div]").children("ul").children("li");
    		var width=this._getinnlistwidth(innlist,innid);
    		var needscroll=width-containerwidth;
    		var tpl=this.context.footer.children("div").children("div[tag=inn_div]").children("ul");
    		if(width<containerwidth){
    			return;
    		}
    		if(needscroll<this.innmorewidth){
    			tpl.animate({"margin-left":-needscroll+"px"},"slow");
        		this.context.footer.children("div").children("a").removeClass("prev_no");
    		}else{
    			tpl.animate({"margin-left":-this.innmorewidth+"px"},"slow");
    			this.context.footer.children("div").children("a").removeClass("prev_no");
    			this.context.footer.children("div").children("a[tag=left]").addClass("prev_no");
    		}
    		
    		
    	}
    	
    },
    scroll_right:function(){  	
        var sw = this.width;
    	var width=this.scroll_width;
    	var left = this.context.scroller[0].scrollLeft;
    	this.context.pickerarea.animate({scrollLeft: width + left},"slow",function(){
    		var current_left = this.context.scroller[0].scrollLeft;
        	this.context.screen_left.show();
        	if(current_left==left||(width + left)>current_left){
        		this.context.screen_right.hide();
        	}
    	}.toEventHandler(this));
    	
    },
    scroll_left:function(){
    	 var sw = this.width;
     	var width=this.scroll_width;
     	var left = this.context.scroller[0].scrollLeft;
     	var scrolllength=left-width;
     	if(width>left){
     		scrolllength=0;
     	}
     	this.context.pickerarea.animate({scrollLeft:left-width},"slow",function(){
     		var current_left = this.context.scroller[0].scrollLeft;
         	this.context.screen_right.show();
         	if(scrolllength==0){
         		this.context.screen_left.hide();
         	}
     	}.toEventHandler(this));
     	
    },
	gettranstype:function()
	{
		return this.transtype;
	},
	getpickerrows:function(){
		return this.context.roomlist.find("tr[fold=1]").length;
	},
	getcell_data:function(){
		
	},
	gettargetcell:function(date,roomid)
	{
		
	},
	nextdatecell:function(targetcell)
	{
		
	},
	getdatecell_bydate:function(pickerdate){
		var cell=this.context.pickerdate.children("table").children("tbody").children("tr[time="+date+"]");
		return cell;
	},
	getcellbycoordinate:function(i,idx){
		if(!M.isEmpty(i)){
			return this.context.roomlist.children("tbody").find("tr[i="+i+"]:first");
		}
		if(!M.isEmpty(idx)){
			return this.context.pickerdate.children("table").children("tbody").find("td[i="+idx+"]");
		}
	},
	getcoordinate_bydata:function(date,roomid,type){
		var data={"date_i":'',"roomid_idx":'',"type_i":''};
		if(!M.isEmpty(date)){
			data.roomid_idx=this.context.pickerdate.children("table").children("tbody").children("tr").children("td[time="+date+"]").attr("i");
		}
		if(!M.isEmpty(type)){					    
			data.type_i=this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal][type="+type+"]").attr("i");
		}
		if(!M.isEmpty(roomid)){
			data.date_i=this.context.roomlist.children("tbody").children("tr[rid="+roomid+"]").children("td").attr("i");
		}
		if(!M.isEmpty(type)){
			data.date_i=data.type_i;
			data.type_i=data.roomid_idx;
		}
		return data;    	
	},
	getroomnumbydate:function(date){
		return this.context.pickerdate.children("table").children("tbody").children("tr").children("td[time="+date+"]").children("i").text().replace("间","");
	},
	gettpl_divinfo:function(){
		return this.tpl_divinfo;
	},
	getdata_bycoordinate:function(row,col){
		var data={"date":'',"roomid":'',"rtid":'',"type":''};
		if(!M.isEmpty(col)){
			data.date=this.context.pickerdate.children("table").children("tbody").children("tr").children("td[i="+col+"]").attr("time");
		}
		if(!M.isEmpty(row)){
			data.roomid=this.context.roomlist.children("tbody").children("tr[i="+row+"]").attr("rid");
			data.rtid=this.context.roomlist.children("tbody").children("tr[i="+row+"]").attr("rtid");
			data.type=this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal][i="+row+"]").attr("type");
		}
		return data;		
	},
	_getjump_selected:function(idx,orderdata){
    	var tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+idx+"]").find("td.td-selected");
    	tpl.each(function(){
    		var has=0;
    		var i=$(this).attr("idx");
    		var idx=$(this).parent().attr("i");
    		if(!M.isEmpty(orderdata)){
    			for(var j=0;j<orderdata.length;j++){
    				var data=orderdata[j];
    				if(data.idx==idx){
    					if((i-data.end_i*1)==1){
    						data.end_i=i;
    						data.nights=data['nights']+1;
    						orderdata[j]=data;
    						has=1;
    					}
    				}
    			}
    		}    		
			if(has==0){
				var tmp={"idx":idx,"start_i":i,"end_i":i,"nights":1};
			    orderdata.push(tmp);
			}	
    	});
    	return orderdata;
    },
	getjumpselected_data:function(roomlist,datelist,orderdata){
		for(key in datelist){
    		var idx=datelist[key];
    		orderdata=this._getjump_selected(idx,orderdata);
    	}
		for(var j=0;j<orderdata.length;j++){
			var data=orderdata[j];
			var tmp=data.idx;
			data.idx=data.start_i;
			data.start_i=tmp;
			orderdata[j]=data;
		}
		return orderdata;
	},
	_getroomtotal:function(){
		var leftroom={};		
		
		var tpl=this.context.pickerarea.children("table").children("tbody").children("tr").children("td");
		tpl.each(function(){
			var idx=$(this).attr("idx");
			var sta=$(this).attr("sta");
			var tag=$(this).attr("tag");
			var total=leftroom[idx];
			if(M.isEmpty(total)){
				leftroom[idx]=0;
			}
			if((M.isEmpty(sta)||sta=="unordered")&&tag=='day'){
				var total=leftroom[idx];
				leftroom[idx]++;
			}
			
		});
		
		
		return leftroom;
	},
	resetroomamount_remain:function(){
		var leftroom={};
    	var allroom=this.context.roomlist.children("tbody").children("tr[tag=roomtype]").length;

    	var datelength=this.context.pickerdate.children("table").children("tbody").children("tr").children("td").length;
    	//var tpl=this.context.pickerarea.children("table").children("tbody");
    	//for(var i=0;i<datelength;i++){
    		//var ele=tpl.children("tr").children("td[idx="+i+"]");
    		//leftroom[i]=allroom-this._getroomtotal(ele);
    	//}
    	/*显示到列表*/
    	leftroom=this._getroomtotal();
    	this.context.pickerdate.children("table").children(":first")
    	.children("tr").children().each(function(){
    		var i=$(this).attr("i");
    		var leftc=leftroom[i]+"";
    		if(!M.isEmpty(leftc))
    		{
    			var td=$(this);
    			var istoday=td.attr("class")=="today";
    			if(allroom==0)
    			{
    				td.children("i").html('');
    			}	
    			else if(leftc==0)
    			{
    				td.children("i").html('满房').attr("class","red");
    			}	
    			else
    			{
    				td.children("i").html(leftc+"间").attr("class","");
    			}
    		}
    	});
	},
	changeorderstatus_moredays:function(target,nights,type,cols){
		for(var j=0;j<nights-1;j++)
    	{
        	target = target.next();
        	target.html("<div style=''></div>").attr("sta", type);
        	target.parents("td").attr("sta", type);
    	}
	},
	hightrow:function(e){
		var ele = M.EventEle(e);
		var x = ele.parents().attr("i");
		
	
		var selected=this.context.pickerarea.children("table").children("tbody").find("td[idx="+x+"]").attr("class");
		this.selectedreset();
		if(typeof(selected)!='undefined'&&(selected.indexOf('selected')>0||selected=='selected')){
			return;
		}
		ele.parent().addClass("selected");
		this.context.pickerarea.children("table").children("tbody").find("td[idx="+x+"]").addClass("selected");
		
	},
	hightcol:function(e){
		var ele = M.EventEle(e);	   
	    var y = ele.parents("tr").children("td").attr("i");
	    if(M.isEmpty(y)){
	    	return;
	    }
	    var tag=ele.parents("tr").children("td").attr("tag");
		if(!M.isEmpty(tag)&&tag=='roomtf')
			return;
		var selected=ele.parents("tr").children("td").attr("class");
		this.selectedreset();
		if(typeof(selected)!='undefined'&&(selected.indexOf('selected')>0||selected=='selected')){
			return;
		}
		 ele.parents("tr").children("td").addClass("selected");
	    this.context.pickerarea.children("table").children("tbody").find("tr[i="+y+"]").children().addClass("selected");
	},
	selectedreset:function(){
	   this.context.roomtype.children().find("td").removeClass("selected");
	   this.context.pickerdate.children().find("td").removeClass("selected");
	   this.context.pickerarea.children().find("td").removeClass("on");
	   $(".selected").removeClass("selected").removeClass("on");
	   $(".selected").removeClass("selected").removeClass("on");
	},
	canshiftedorders:function(ele,rows,sorttable){
		var ele_i=ele.parent().parent().attr("i");
    	var ele_idx=ele.parent().attr("idx");
    	var setid=ele.parent().attr("setid");
        var sta=ele.parent().attr("sta");
        if(sta=='checkedout'){
        	return false;
        }
    	var i=ele_idx*1;
    	var start=i;
    	var range=ele_idx*1+rows*1-1;
    	var has=0;
    	for(i;i<=range;i++){
        	var next_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+ele_i+"]").children("td[idx="+i+"]");
            var check_sta=next_tpl.attr("sta");
            var oid=next_tpl.children("div").attr("oid");
            var cid=next_tpl.children("div").attr("cid");
            var orderfrom=next_tpl.children("div").attr("from");
            if(check_sta=='checkedout'){
            	return false;
            }
            if(i==start){
            	if(!M.isEmpty(oid)||!M.isEmpty(cid)){
            		has=1;
            	}
            	if(!M.isEmpty(check_sta)&&check_sta!='unordered'){
            		if(M.isEmpty(oid)&&M.isEmpty(cid)){
                			var run=true,k=i;
                			while(run&&k>=0){
                				k=k-1;
                				var getnext_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+ele_i+"]").children("td[idx="+k+"]");
                				var getoid=getnext_tpl.children("div").attr("oid");
                		        var getcid=getnext_tpl.children("div").attr("cid");
                		        if(!M.isEmpty(getcid)||!M.isEmpty(getoid)){
                		        	run=false;
                		        	break;
                		        }
                				
                			}
                			if((!M.isEmpty(getoid)&&getoid!=sorttable.oid)||(!M.isEmpty(getcid)&&getcid!=sorttable.cid)){
                    			return false;
                    		} 
            		}        		           		
            	}            	
            }else{
            	if(!M.isEmpty(oid)||!M.isEmpty(cid)){
            		if(has==1){
            			return false;
            		}
                    if(oid!=sorttable.oid||cid!=sorttable.cid){
            			return false;
            		}
                }
            }            
            
        }    	
    	return true;    	
	},
	checkmaxi:function(idx,i,sorttable){
		
		
    	if(idx==sorttable.pretd_idx){
    		return false;
		}else{
			return true;
		}
    	
    },
    clearitem:function(col,row,length){
    	var target=col*1+length*1-1;
    	var orderwidth=this.context.pickerarea.find("td").children("div").css("width");
    	for(var i=col;i<=target;i++){
    		var tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+row+"]").children("td[idx="+i+"]");
    		var setid=tpl.attr("setid");
    		var sta=tpl.attr("sta");
    		if(i==col){
    			tpl.html('<div class="date-day" style="width:'+orderwidth+'"> </div>');
    		}else{
    			if(M.isEmpty(setid)){
    				tpl.html('<div class="date-day" style="width:'+orderwidth+'"> </div>');
    			}
    			
    		}
    		if(this.inf.ov=='1'&&this.inf.tp=='1'){
    			var showmsg=tpl.attr("msg");
    			tpl.children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:showmsg,show:{delay:100}});
			}
    		tpl.attr("sta","").attr("n","").attr("hidedays","").attr("setid","");
    	}   	
    },
    _clearitembyset:function(targets,type){
    	var len=targets.length;
		for(var i=0;i<len;i++)
		{
			var target=$(targets[i]);
			var cols=target.attr("idx");
			var orderwidth=this.context.pickerarea.find("td").children("div").css("width");
			if(!M.isEmpty(target))
			{
				var datehave=target.children(".date-have");
				if(datehave.length>0)
				{
					var n=datehave.attr("n");
					var nights=parseInt(n);
				
					var html='<div class="date-day" style="width:'+orderwidth+'"></div>';
					target.html(html);
					target.attr("sta","unordered").attr("n","").attr("hidedays","").attr("setid","");
					cols=cols*1-1;
					for(var j=0;j<nights;j++)
	            	{
	                	/*纵向查找*/
						cols=cols*1+1;
	                	target = target.parent().children("td[idx="+cols+"]");
	                	target.html(html).attr("sta", "unordered").attr("n","").attr("hidedays","").attr("setid","");
	            	}
				}
			}
		}
    },
    gettopwidth:function(){
    	return;
    },
    getdaterange:function(){
    	var fromddate=this.context.pickerdate.children().find("td:first").attr("time");
    	var enddate=this.context.pickerdate.children().find("td:last").attr("time");
    	return {"fromdate":fromddate,"enddate":enddate};
    },
    checkmaxnights:function(col,row){
    	var length=0;
    	var pre_col=0;
    	var tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+row+"]").children("td");
    	tpl.each(function(){
    		var style=$(this).attr("class");
    		var idx=$(this).attr("idx");
    		if(pre_col==0||idx==0){
    			pre_col=idx;
    		}
    		if((parseInt(idx)-parseInt(pre_col))>1){
    			length=0;
    		}else{
    			pre_col=idx;
    		}
    		if(typeof(style)!='undefined'&&style.indexOf('td-selected')>=0){
    			length++;
    		}
    	});
    	return length;
    },
    getcelldatabydateandid:function(date,id,type){
    	var data={"row":'',"col":'',"roomid":'',"status":'',"gid":'',"setid":'',"cid":''};
    	var col=this.context.pickerdate.children("table").children("tbody").children("tr").children("td[time="+date+"]").attr("i");
    	var row_tpl=this.context.pickerarea.children("table").children("tbody").children("tr").children("td[idx="+col+"]");
    	data.col=col;
    	row_tpl.each(function(){
    		var cid=$(this).children("div").attr("cid");
    		var oid=$(this).children("div").attr("oid");
    		if(type=="checkin"){
    			if(id==cid){
    				data.col=$(this).attr("idx");
    				data.roomid=$(this).children("div").attr("rid");
    				data.status="checkin";
    				data.gid=$(this).children("div").attr("gid");
    				data.cid=$(this).children("div").attr("cid");
    				data.setid=$(this).children("div").children("div").attr("setid");
    			}
    		}else{
    			if(id==oid){
    				data.col=$(this).attr("idx");
    				data.roomid=$(this).children("div").attr("rid");
    				data.status="order";
    			}
    		}
    	});
    	return data;
    },
    getorderwidth:function(){
    	return this.orderwidth;
    },
    expand_room:function(){
		var tpl_roomtype = this.context.roomlist.find('tbody').find('tr[p=1]').children('td').children('div[tag=fold]');
		var tpl_room = this.context.roomlist.find("tbody").children("tr[tag=roomtype]");
		var i = [];
		tpl_room.each(function(){
			i.push($(this).attr('i'));
		});
		tpl_roomtype.attr('status','1').parents('tr').attr('fold','').children('td[tag=roomtype]').hide();
		tpl_roomtype.each(function(){
			var rowspan = $(this).attr('rs');
			$(this).parents('td').attr('rowspan',rowspan);
		});
		tpl_room.show().attr('fold','1');
	},
	getroomlength:function(){
		return this.context.roomlist.find("tr[tag=roomtype]").length;
	},
});

/********************************************************************************************************************************************************************************************************/

/*
author:johnny
create on:2014-02-13
desc:定义横轴为房间，纵轴为日期的房态处理
*/
M.Page.RDTrans= M.createClass();
M.extend(M.Page.RDTrans.prototype,
{
    context: {},
	transtype:"DR",/**[DR|RD]**/
	addcolumn:0,
	orderwidth:0,
	tpl_divinfo:'<div class="date-have">'
		+'<div class="${css}" style="height:${height}px">'
		+'<p class="sortorder">${guestname}</p>'
  		+'<p class="t12 light sortorder" >${channel}</p>'
		+'<div class="demand"></div>'
  		+'</div>'
		+'</div>',
	width:0,
	scroll_width:0,
	index:0,
	inf:{},
	isfold:0,
	innmorewidth:0,
	init: function () {
        this.initDOM();
        this.initEvent();
        this.win_resize();
        this._locateinn();
	},
	initDOM: function () {
		this.context.roomlist=$("#roomlist");
		this.context.pickerarea=$("#pickerarea");
		this.context.pickerdate=$("#pickerdate");
		

		this.context.scroller = $(".datepicker");
		this.context.scroll_top =  $("#roomtype");
        this.context.scroll_left =$("#pickerdate");
        this.context.roomlist=$("#roomlist");
        this.context.roomtype=$("#roomtype");
        this.inf.ov=this.context.roomtype.attr("ov");
        this.inf.tp=this.context.roomtype.attr("tp");
        this.context.screen_left=$("#scroll_left");
        this.context.screen_right=$("#scroll_right");
        var pluginwaterstatistics=this.context.roomtype.attr("pluginwaterstatistics");
        if(pluginwaterstatistics=='1'){
           this.addcolumn=3;
        }
        var obj =this.context.scroller[0];
        this.width = obj.scrollWidth;
    	this.scroll_width=$(window).width() - this.context.pickerdate.outerWidth();
    	this.context.footer=$("#footer");
    	this.context.detectform=$("#detectform");
    	this.isfold=this.context.roomlist.attr("isfold");
	},
	initEvent: function () {
		
		$("#pickerarea").scroll(this._scroll.toEventHandler(this));
		$(window).resize(this.win_resize.toEventHandler(this));
		this.context.screen_right.bind("click",this.scroll_right.toEventHandler(this));
		this.context.screen_left.bind("click",this.scroll_left.toEventHandler(this));
		this.context.footer.bind("click",this.scroll_innlist.toEventHandler(this));
		  this.context.detectform.bind('click', this.detectform_click.toEventHandler(this));
	},
	 _scroll:function(){
        var top = this.context.scroller.scrollTop();
        var left = this.context.scroller.scrollLeft();
        this.context.scroll_top.scrollLeft(left);
        this.context.scroll_left.scrollTop(top);
        if(left>0){
        	this.context.screen_left.show();
    		this.context.screen_right.show();
        }
    },
    detectform_click:function(e){
    	var ele = M.EventEle(e);
		var t=ele.attr("tag");
		if(t=="close"){
			this.context.detectform.animate({height: '0'}, 300);
			var detectform=this.context.detectform;
		     setTimeout(function(){detectform.hide();}, 310);
		}
    },
    detectzoom:function(){
    	var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase(),
        yzgDoctor = this.context.detectform,
        yzgDoctorClose = this.context.detectform.find('.yzg-doctor-close');
	    if( ~ua.indexOf('firefox') ){
	        if( window.devicePixelRatio !== undefined ){
	            ratio = window.devicePixelRatio;
	        }
	    }
	    else if( ~ua.indexOf('msie') ){    
	        if( screen.deviceXDPI && screen.logicalXDPI ){
	            ratio = screen.deviceXDPI / screen.logicalXDPI;
	        }
	    }
	    else if( window.outerWidth !== undefined && window.innerWidth !== undefined ){
	        ratio = window.outerWidth / window.innerWidth;
	    }
	    
	    if( ratio ){
	        ratio = Math.round( ratio * 100 );
	    }    
    // 360安全浏览器下的innerWidth包含了侧边栏的宽度
	    if( ratio !== 100 ){
	        if( ratio >= 95 && ratio <= 105 ){
	            ratio = 100;
	            yzgDoctor.hide()
	        }
	        else{
	            yzgDoctor.show().animate({height: '45px'}, 300);
	        }
	    }
	    if(ratio==100){	    	
       	 yzgDoctor.hide();
       }
    },
    win_resize:function()
    {
    	this.context.scroller.width($(window).width()-125-1);
    	var width=$(".main")[0].clientWidth;
    	var isfold=this.context.roomlist.attr("isfold");
    	if(isfold==1){
    		 var roomcount=this.context.roomlist.find("tr[tag=rooms]").children().not("td:hidden").length;
    	}else{
    		 var roomcount=this.context.roomlist.find("td[tag=room]").length;
    	}
       
        var roomtypelist=this.context.roomlist.find("tr[tag=roomtypes]").children("td");
        var roomlist=this.context.roomlist.find("tr[tag=rooms]");
        var neww=0;
        if(80*roomcount<=width-126-25)
    	{
        	neww=(width-126-25)/roomcount;
    		//neww=parseInt(neww);
    		$(".date-day").css("width",neww+"px");
    		$(".roomnum .num").css("width",neww+"px");
    		$(".date-have").css("width",neww+"px");
    		this.orderwidth=neww;    		
    	}
    	
    	if(isfold==1){
    		 if(neww==0){
    	        	neww=this.context.pickerarea.find("td[tag=day]").width();
    	        	neww=80;
    	        	this.context.pickerarea.find("td[tag=c]").children("div").css("width",neww+"px");
    	        	roomlist.find("td").children("div").css("width",neww+"px");
    	        	$(".date-day").css("width",neww+"px");
    	    		$(".roomnum .num").css("width",neww+"px");
    	    		$(".date-have").css("width",neww+"px");
    	        }
    	        	
    	        roomtypelist.each(function(){
    	        	var rtid=$(this).attr("rtid");
    	        	var roomlength=roomlist.children("td[rtid="+rtid+"]").not("td:hidden").length;
    	        	$(this).children("div").css("width",roomlength*neww+"px");
    	        });
    	}
       
    	
    	//判断datepicker是否出现滚动条
    	this.context.scroll_top.css({"overflow-y":"scroll"});
        var obj =this.context.scroller[0];
        var sw = obj.scrollWidth;
        var cw = obj.clientWidth;
        var ow = obj.offsetWidth;
        var sl=obj.scrollLeft;
        this.width = obj.scrollWidth;
    	this.scroll_width=$(window).width() - this.context.pickerdate.outerWidth();
    	if (sw>cw) {
    		this.context.scroll_left.css("overflow-x","scroll");
    		this.context.pickerarea.css("overflow-x","scroll");
    	}
    	else
    	{
    		this.context.scroll_left.css("overflow-x","hidden");
    		this.context.pickerarea.css("overflow-x","hidden");
    	}
    	if(sw>(cw+20)){
    		var left = this.context.scroller.scrollLeft();
    		this.context.screen_left.show();
    		this.context.screen_right.show();
    		if(left<=1){
    			this.context.screen_left.hide();
    		}
    	}else{
    		this.context.screen_left.hide();
    		this.context.screen_right.hide();
    	}
    	if(isfold==1){
    		if((neww*roomcount)>this.scroll_width){
       		 this.context.pickerdate.css("overflow-x","scroll");
       		 this.context.pickerarea.css("overflow-x","scroll");
       	}else{
       		 this.context.pickerdate.css("overflow-x","hidden");
       		 this.context.pickerarea.css("overflow-x","hidden");
       	}
    	}
    	
    	
    	this._handleinnlist();
    	var roomwidth=this.context.roomlist.children("tbody").children("tr").children("td[tag=roomtype]").children("div").css("width");
          this.index=1;
    	return;
    },
    scroll_innlist:function(e){
    	var ele = M.EventEle(e);
        var tag = ele.attr("tag");
        var style=ele.attr("class");
        if(tag=="left"&&style.indexOf("prev_no")==-1){
        	var tpl=this.context.footer.children("div").children("div[tag=inn_div]").children("ul");
        	var margin_left=parseInt(tpl.css("margin-left").replace("px",""));
        	if(margin_left==0){
        		if(this.innmorewidth>500){
        			tpl.animate({"margin-left":margin_left-500+"px"},"slow");
            		this.context.footer.children("div").children("a").removeClass("prev_no");
        		}else{
        			tpl.animate({"margin-left":-this.innmorewidth+"px"},"slow");
        			this.context.footer.children("div").children("a").removeClass("prev_no");
        			ele.addClass("prev_no");
        		}
        	}else{
        		if((margin_left-500)<-this.innmorewidth){
        			var scrolllength=this.innmorewidth+margin_left;
        			tpl.animate({"margin-left":margin_left-scrolllength+"px"},"slow");
        			this.context.footer.children("div").children("a").removeClass("prev_no");
        			ele.addClass("prev_no");
        		}else{
        			tpl.animate({"margin-left":margin_left-500+"px"},"slow");
            		this.context.footer.children("div").children("a").removeClass("prev_no");
        		}
        	}
        }
        if(tag=="right"&&style.indexOf("prev_no")==-1){
        	var tpl=this.context.footer.children("div").children("div[tag=inn_div]").children("ul");
        	var margin_left=parseInt(tpl.css("margin-left").replace("px",""));
        	if(margin_left==0){
        		return;
        	}
        	if(margin_left>-500){
        		tpl.animate({"margin-left":"0px"},"slow");
        		this.context.footer.children("div").children("a").removeClass("prev_no");
    			ele.addClass("prev_no");
        	}else{
        		tpl.animate({"margin-left":margin_left+500+"px"},"slow");
        		this.context.footer.children("div").children("a").removeClass("prev_no");
        	}
        }
    },
    _handleinnlist:function(){
    	var container=this.context.footer.children("div").children("div[tag=inn_div]");
    	var containerwidth=container.outerWidth();
    	var innlist=this.context.footer.children("div").children("div[tag=inn_div]").children("ul").children("li");
    	var innlistwidth=this._getinnlistwidth(innlist)-(innlist.length+1);
    	if((containerwidth+10)<innlistwidth){
    		this.innmorewidth=innlistwidth-containerwidth;
    		this.context.footer.children("div").children("a").show();
    	}else{
    		this.context.footer.children("div").children("a").hide();
    	}
    },
    _getinnlistwidth:function(innlist,innid){
    	var width=0;
    	innlist.each(function(){
    		var innwidth=$(this).outerWidth(); 
    		width=parseInt(width)+parseInt(innwidth);
    		if(!M.isEmpty(innid)){
    			var id=$(this).attr("innid");
    			if(id==innid){
    				return false;
    			}
    		}
    		
    	});
    	return width;
    },
    _locateinn:function(){
    	var innid=this.context.roomtype.attr("innid");
    	if(this.innmorewidth!=0){
    		var container=this.context.footer.children("div").children("div[tag=inn_div]");
        	var containerwidth=container.outerWidth();
    		var innlist=this.context.footer.children("div").children("div[tag=inn_div]").children("ul").children("li");
    		var width=this._getinnlistwidth(innlist,innid);
    		var needscroll=width-containerwidth;
    		var tpl=this.context.footer.children("div").children("div[tag=inn_div]").children("ul");
    		if(width<containerwidth){
    			return;
    		}
    		if(needscroll<this.innmorewidth){
    			tpl.animate({"margin-left":-needscroll+"px"},"slow");
        		this.context.footer.children("div").children("a").removeClass("prev_no");
    		}else{
    			tpl.animate({"margin-left":-this.innmorewidth+"px"},"slow");
    			this.context.footer.children("div").children("a").removeClass("prev_no");
    			this.context.footer.children("div").children("a[tag=left]").addClass("prev_no");
    		}
    		
    		
    	}
    	
    },
    scroll_right:function(){  	
        var sw = this.width;
    	var width=this.scroll_width;
    	var left = this.context.scroller[0].scrollLeft;
    	this.context.pickerarea.animate({scrollLeft: width + left},"slow",function(){
    		var current_left = this.context.scroller[0].scrollLeft;
        	this.context.screen_left.show();
        	if(current_left==left||(width + left)>current_left){
        		this.context.screen_right.hide();
        	}
    	}.toEventHandler(this));
    	
    },
    scroll_left:function(){
    	 var sw = this.width;
     	var width=this.scroll_width;
     	var width=$(window).width() - this.context.pickerdate.outerWidth();
     	var left = this.context.scroller[0].scrollLeft;
     	var scrolllength=left-width;
     	if(width>left){
     		scrolllength=0;
     	}
     	this.context.pickerarea.animate({scrollLeft:left-width},"slow",function(){
     		var current_left = this.context.scroller[0].scrollLeft;
         	this.context.screen_right.show();
         	if(scrolllength==0){
         		this.context.screen_left.hide();
         	}
     	}.toEventHandler(this));
     	
    },
    _handle:function(){
    	var current_left = this.context.scroller[0].scrollLeft;
    	this.context.screen_left.show();
    	if(current_left==left){
    		this.context.screen_right.hide();
    	}
    },
	gettranstype:function()
	{
		return this.transtype;
	},
	getcell_data:function(tdele){
		var rdx = tdele.parent().attr("i");
		var idx = tdele.attr("idx");
		var timetd = this.context.picker_y.children("table").children(":first").children()[rdx];
        var time = $(timetd).attr("time");
		
		var room = this.context.picker_x.children("tbody").find("tr>td[i="+idx+"]:first");
		var rid = room.attr("rid");
		var rtid=room.attr("rtid");
				
		return {"rid":rid,"rtid":rtid,"fromdate":time};
	},
	getpickerrows:function(){
		var roomtypelisttpl=this.context.roomlist.find("tr[tag=roomtypes]").children("td");
		var isfold=this.context.roomlist.attr("isfold");
		var roomtypelist={};
		var roomlength=0;
		if(isfold==1){
			roomtypelisttpl.each(function(){
				var rtid=$(this).attr("rtid");
				roomtypelist['r'+rtid]={"rtid":rtid,"list":{}};
			});
			var roomlisttpl=this.context.roomlist.find("tr[tag=rooms]").children("td[tag=room]");
			roomlength=roomlisttpl.length;
			roomlisttpl.each(function(){
				var rid=$(this).attr("rid");
				var rtid=$(this).attr("rtid");
				roomtypelist['r'+rtid]['list'][rid]={"rid":rid,"rtid":rtid};
			});
		}else{
			roomlength=this.context.roomlist.find("td[tag=room]").length;
		}
		
		return {"list":roomtypelist,"isfold":isfold,"roomlength":roomlength};
	},
	gettargetcell:function(date,roomid)
	{
		
	},
	nextdatecell:function(targetcell)
	{
		
	},
	getdatecell_bydate:function(pickerdate){
		var cell=this.context.pickerdate.children("table").children("tbody").children("tr[time="+date+"]");
		return cell;
	},
	_getjump_selected:function(idx,orderdata){
    	var tpl=this.context.pickerarea.children("table").children("tbody").find("td[idx="+idx+"].td-selected");
    	tpl.each(function(){
    		var has=0;
    		var idx=$(this).attr("idx");
    		var i=$(this).parent().attr("i");
    		if(!M.isEmpty(orderdata)){
    			for(var j=0;j<orderdata.length;j++){
    				var data=orderdata[j];
    				if(data.idx==idx){
    					if((i-data.end_i*1)==1){
    						data.end_i=i;
    						data.nights=data['nights']+1;
    						orderdata[j]=data;
    						has=1;
    					}
    				}
    			}
    		}    		
			if(has==0){
				var tmp={"idx":idx,"start_i":i,"end_i":i,"nights":1};
			    orderdata.push(tmp);
			}	
    	});
    	return orderdata;
    },
	getjumpselected_data:function(roomlist,datelist,orderdata){
		for(key in roomlist){
    		var idx=roomlist[key];
    		orderdata=this._getjump_selected(idx,orderdata);
    	}
		return orderdata;
	},
	getdata_bycoordinate:function(row,col){
		var data={"date":'',"roomid":'',"rtid":'',"type":''};
		if(!M.isEmpty(row)){
			data.date=this.context.pickerdate.children("table").children("tbody").children("tr[i="+row+"]").attr("time");
		}
		if(!M.isEmpty(col)){
			data.roomid=this.context.roomlist.children("tbody").children("tr").children("td[tag=room][i="+col+"]").attr("rid");
			data.rtid=this.context.roomlist.children("tbody").children("td[tag=room][i="+col+"]").attr("rtid");
			data.type=this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal][i="+col+"]").attr("type");
		}
		return data;		
	},
	getroomnumbydate:function(date){
		return this.context.pickerdate.children("table").children("tbody").children("tr[time="+date+"]").children("td").children("i").text().replace("间","");
	},
	getcoordinate_bydata:function(date,roomid,type){
		var data={"date_i":'',"roomid_idx":'',"type_i":''};
		if(!M.isEmpty(date)){
			data.date_i=this.context.pickerdate.children("table").children(":first").children("tr[time="+date+"]").attr("i");
		}
		if(!M.isEmpty(type)){					    
			data.type_i=this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal][type="+type+"]").attr("i");
		}
		if(!M.isEmpty(roomid)){
			data.roomid_idx=this.context.roomlist.children("tbody").children("tr").children("td[rid="+roomid+"]").attr("i");
		}
		return data;    	
	},
	getroomlistbyroomtype:function(roomtypeid){
		return this.context.roomlist.children("tbody").children("tr[rtid="+roomtpyeid+"]");
	},
	getcellbycoordinate:function(i,idx){
		if(!M.isEmpty(idx)){
			return this.context.roomlist.children("tbody").find("tr>td[i="+idx+"]:first");
		}
		if(!M.isEmpty(i)){
			return this.context.pickerdate.children("table").children("tbody").find("tr[i="+i+"]");
		}
	},
	getroomlength:function(){
		return this.context.roomlist.children("tbody").children("tr:first").children("td[tag=roomtype]").length;		
	},
	getstatisticslength:function(){
		return this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal][show=1]").length;
	},
	gettpl_divinfo:function(){
		return this.tpl_divinfo;
	},
	resetroomamount_remain:function(){
		var leftroom={};
    	var allroom=this.context.roomlist.find("td").length;
    	
    	var addcolumn=this.addcolumn*1;
    	this.context.pickerarea.children("table").children(":first")
    	.children("tr:visible").each(function(){
    		var len=$(this).children("td[sta=unordered]").length;
    		var r=$(this).attr("i");
    		leftroom[r]=len;
    	});
    	var pickerarea=this.context.pickerarea;
    	/*显示到列表*/
    	this.context.pickerdate.children("table").children(":first")
    	.children().each(function(){
    		var i=$(this).attr("i");
    		var leftc=pickerarea.find("tr[i="+i+"]").children("td[sta=unordered]").length;
    		var leftc=leftroom[i]+"";
    		if(!M.isEmpty(leftc))
    		{
    			var td=$(this).children("td:first");
    			var istoday=td.attr("class")=="today";
    			if(allroom==0)
    			{
    				td.children("i").html('');
    			}	
    			else if(leftc==0)
    			{
    				td.children("i").html('满房').attr("class","red");
    			}	
    			else
    			{
    				td.children("i").html(leftc+"间").attr("class","");
    			}
    		}
    	});
	},
	changeorderstatus_moredays:function(target,nights,type,cols){
		if(this.isfold==1){
			
		}
		for(var j=0;j<nights-1;j++)
    	{
        	/*纵向查找*/
			if(this.isfold==1){
				target = target.parent().next().children("td[idx="+cols+"]");
			}else{
				target = target.parents("tr").next().next().children("td[idx="+cols+"]");
			}
        	
        	target.html("<div style=''></div>").attr("sta", type);
        	target.attr("sta", type);
    	}
	},
	hightrow:function(e){
		var ele = M.EventEle(e);	   
	    var y = ele.parents("tr").attr("i");
	    var tag=ele.parent().attr("tag");
		if(tag=='roomtype')
			return;
	    if(M.isEmpty(y)){
	    	return;
	    }
		var selected=ele.parents("tr").children("td").attr("class");
		this.selectedreset();
		if(typeof(selected)!='undefined'&&(selected.indexOf('selected')>0||selected=='selected')){
			return;
		}
		 ele.parents("tr").children("td").addClass("selected");
	    this.context.pickerarea.children("table").children("tbody").find("tr[i="+y+"]").children().addClass("selected");
	},
	hightcol:function(e){
		var ele = M.EventEle(e);
		var x = ele.parent().attr("i");
		var tag=ele.parent().attr("tag");
		if(tag=='roomtype'||tag=='roomcount')
			return;
		var selected=this.context.pickerarea.children("table").children("tbody").find("td[idx="+x+"]").attr("class");
		this.selectedreset();
		if(typeof(selected)!='undefined'&&(selected.indexOf('selected')>0||selected=='selected')){
			return;
		}
		ele.parent().addClass("selected");
		this.context.pickerarea.children("table").children("tbody").find("td[idx="+x+"]").addClass("selected");
	},
	selectedreset:function(){
	   this.context.roomtype.children().find("td").removeClass("selected");
	   this.context.pickerdate.children().find("td").removeClass("selected");
	   this.context.pickerarea.children().find("td").removeClass("on");
	   $(".selected").removeClass("selected").removeClass("on");
	   $(".selected").removeClass("selected").removeClass("on");
	},
	canshiftedorders:function(ele,rows,sorttable){
		var ele_i=ele.parent().parent().attr("i");
    	var ele_idx=ele.parent().attr("idx");
    	var setid=ele.parent().attr("setid");
        var sta=ele.parent().attr("sta");
       // console.log(ele_i+'a'+ele_idx);
        if(sta=='checkedout'){
        	return false;
        }
    	var i=ele_i*1;
    	var start=i;
    	var range=ele_i*1+rows*1-1;
    	var has=0;
    	for(i;i<=range;i++){
        	var next_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+i+"]").children("td[idx="+ele_idx+"][tag=day]");
            var check_sta=next_tpl.attr("sta");
            var oid=next_tpl.children("div").attr("oid");
            var cid=next_tpl.children("div").attr("cid");
            var orderfrom=next_tpl.children("div").attr("from");
            if(check_sta=='checkedout'){
            	return false;
            }
            if(i==start){
            	if(!M.isEmpty(oid)||!M.isEmpty(cid)){
            		has=1;
            	}
            	if(!M.isEmpty(check_sta)&&check_sta!='unordered'){
            		if(M.isEmpty(oid)&&M.isEmpty(cid)){
            			var run=true,k=i;
            			while(run&&k>=0){
            				k=k-1;
            				var getnext_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+k+"]").children("td[idx="+ele_idx+"][tag=day]");
            				var getoid=getnext_tpl.children("div").attr("oid");
            		        var getcid=getnext_tpl.children("div").attr("cid");
            		        if(!M.isEmpty(getcid)||!M.isEmpty(getoid)){
            		        	run=false;
            		        	break;
            		        }
            				
            			}
            			if((!M.isEmpty(getoid)&&getoid!=sorttable.oid)||(!M.isEmpty(getcid)&&getcid!=sorttable.cid)){
                			return false;
                		} 
            		}
            		           		
            	}
            }else{
            	if(!M.isEmpty(oid)||!M.isEmpty(cid)){
            		if(oid!=sorttable.oid||cid!=sorttable.cid){
            			return false;
            		}
            		if(has==1){
            			return false;
            		}
                }
            }            
            
        }    	
    	return true;    	
	},
	checkmaxi:function(idx,i,sorttable){
    	if(idx==sorttable.pretd_idx){
			var maxi=sorttable.pre_rows*1+sorttable.pretr_i*1-1;
			if(i>maxi){
				return false;
			}else{
				return true;
			}
		}else{
			
		}return false;
    	
    },
    clearitem:function(col,row,length){
    	var target=row*1+length*1-1;
    	var orderwidth=this.context.pickerarea.find("td").children("div").css("width");
    	for(var i=row;i<=target;i++){
    		var tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+i+"]").children("td[idx="+col+"]");
    		var setid=tpl.attr("setid");
    		var sta=tpl.attr("sta");
    		var html='<div class="date-day"> </div>';
    		if(!M.isEmpty(orderwidth)){
    			html='<div class="date-day" style="width:'+orderwidth+'"> </div>';
    		}
    		if(i==row){
    			tpl.html(html);
    		}else{
    			if(M.isEmpty(setid)){
    				tpl.html(html);
    			}    			
    		}
    		if(this.inf.ov=='1'&&this.inf.tp=='1'){
    			var showmsg=tpl.attr("msg");
    			tpl.children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:showmsg,show:{delay:100}});
			}
    		tpl.attr("sta","unordered").attr("n","").attr("hidedays","").attr("setid","");
    	}    	
    },
    _clearitembyset:function(targets,type){
    	var len=targets.length;
    	var orderwidth=this.context.pickerarea.find("td").children("div").css("width");
		for(var i=0;i<len;i++)
		{
			var target=$(targets[i]);
			var cols=target.attr("idx");
			if(!M.isEmpty(target))
			{
				var datehave=target.children(".date-have");
				if(datehave.length>0)
				{
					var n=datehave.attr("n");
					var nights=parseInt(n);
				
					var html='<div class="date-day" style="width:'+orderwidth+'"></div>';
					target.html(html);
					target.attr("sta","unordered").attr("n","").attr("hidedays","").attr("setid","");;
					for(var j=0;j<nights-1;j++)
	            	{
	                	/*纵向查找*/
	                	target = target.parent().next().children("td[idx="+cols+"]");
	                	target.html(html).attr("sta", "unordered").attr("n","").attr("hidedays","").attr("setid","");
	            	}
				}
			}
		}
    },
    gettopwidth:function(){
    	return this.context.roomlist.children("tbody").children("tr").children("td[tag=roomtype]").children("div").css("width");
    },
    getdaterange:function(){
    	var fromddate=this.context.pickerdate.children().find("tr:first").attr("time");
    	var enddate=this.context.pickerdate.children().find("tr:last").attr("time");
    	return {"fromdate":fromddate,"enddate":enddate};
    },
    checkmaxnights:function(col,row){
    	var length=0;
    	var pre_row=0;
    	var tpl=this.context.pickerarea.children("table").children("tbody").children().find("td[idx="+col+"]");
    	tpl.each(function(){
    		var style=$(this).attr("class");
    		var idx=$(this).attr("idx");
    		if(pre_row==0||idx==0){
    			pre_row=idx;
    		}
    		if((parseInt(idx)-parseInt(pre_row))>1){
    			length=0;
    		}else{
    			pre_col=idx;
    		}
    		if(typeof(style)!='undefined'&&style.indexOf('td-selected')>=0){
    			length++;
    		}
    	});
    	return length;
    },
    getcelldatabydateandid:function(date,id,type){
    	var data={"row":'',"col":'',"roomid":'',"status":'',"gid":'',"setid":'',"cid":''};
    	var row=this.context.pickerdate.children("table").children("tbody").children("tr[time="+date+"]").attr("i");
    	var col_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+row+"]").children("td");
    	data.row=row;
    	col_tpl.each(function(){
    		var cid=$(this).children("div").attr("cid");
    		var oid=$(this).children("div").attr("oid");
    		if(type=="checkin"){
    			if(id==cid){
    				data.col=$(this).attr("idx");
    				data.roomid=$(this).children("div").attr("rid");
    				data.status="checkin";
    				data.cid=$(this).children("div").attr("cid");
    				data.gid=$(this).children("div").attr("gid");
    				data.setid=$(this).children("div").children("div").attr("setid");
    			}
    		}else{
    			if(id==oid){
    				data.col=$(this).attr("idx");
    				data.roomid=$(this).children("div").attr("rid");
    				data.status="order";
    			}
    		}
    	});
    	return data;
    },
    getorderwidth:function(){
    	return this.orderwidth;
    },
    roomlist_click:function(ele){
    	var tag=ele.attr("tag");
    	if(M.isEmpty(tag)){
    		return;
    	}
    	if(tag=="roomtype"){
    		this.toggledatepicker(ele);
    	}
    	
    },
    _changecloroomtotal:function(rtid){
    	var rowlength=this.context.pickerarea.find("tr:last").attr("i");
    	for(var i=0;i<=rowlength;i++){
    		var target=this.context.pickerarea.find("tr[i="+i+"]");
    		var roomlength=target.find("td[sta=unordered][rtid="+rtid+"]").length;
    		target.find("td[tag=c][rtid="+rtid+"]").children().html(roomlength);    		
    	}
    	
    },
    toggledatepicker:function(ele){
    	var rtid=ele.attr("rtid");
    	if(M.isEmpty(rtid)){
    		rtid=ele.parents("td").attr("rtid");
    	}
    	var showstatus=this._getfoldstatus(rtid);
    	this._changefoldstatus(rtid, showstatus);
    	this._changecloroomtotal(rtid);
    	this.selectedreset();
//    	this.win_resize();
    	//setTimeout(this.win_resize.toEventHandler(this),20000);
    	
    },
    _changefoldstatus:function(rtid,showstatus){
    	var roomlength=this.context.roomlist.find("tr[tag=rooms]").find("td[tag=room][rtid="+rtid+"]").length;
    	if(showstatus==1){
    		this.context.roomlist.find("tr[tag=roomtypes]").find("td[rtid="+rtid+"]").attr("colspan",roomlength);
    		this.context.roomlist.find("tr[tag=rooms]").find("td[tag=room][rtid="+rtid+"]").css("display","");
    		this.context.roomlist.find("tr[tag=rooms]").find("td[tag=roomcount][rtid="+rtid+"]").css("display","none");
    		this.context.pickerarea.find("td[tag=day][rtid="+rtid+"]").show();
    		this.context.pickerarea.find("td[tag=c][rtid="+rtid+"]").hide();
    	}else{
    		this.context.roomlist.find("tr[tag=roomtypes]").find("td[rtid="+rtid+"]").attr("colspan",1);
    		this.context.roomlist.find("tr[tag=rooms]").find("td[tag=room][rtid="+rtid+"]").css("display","none");
    		this.context.roomlist.find("tr[tag=rooms]").find("td[tag=roomcount][rtid="+rtid+"]").css("display","");
    		this.context.pickerarea.find("td[tag=day][rtid="+rtid+"]").hide();
    		this.context.pickerarea.find("td[tag=c][rtid="+rtid+"]").show();
    	}
    	var roomtypelist=this.context.roomlist.find("tr[tag=roomtypes]").children("td");
    	var roomlist=this.context.roomlist.find("tr[tag=rooms]");
    	var neww=this.context.pickerarea.find("div.date-day").css("width");
    	if(!M.isEmpty(neww)){
    		 roomtypelist.each(function(){
 	         	var rtid=$(this).attr("rtid");
 	         	var roomlength=roomlist.children("td[rtid="+rtid+"]").not("td:hidden").length;
 	         	$(this).children("div").css("width",roomlength*neww+"px");
 	         });
    	}
    	
    },
    _getfoldstatus:function(rtid){
    	var showstatus=this.context.roomlist.find("tr[tag=rooms]").find("td[tag=room][rtid="+rtid+"]").css("display");
    	if(showstatus=="none"){
    		return 1;
    	}
    	return 0;
    },
    expand_room:function(){
		var roomtypetpl=this.context.roomlist.find("tr[tag=roomtypes]").children();
		var roomtpl=this.context.roomlist.find("tr[tag=rooms]");
		roomtypetpl.each(function(){
			var rtid=$(this).attr("rtid");
			var length=roomtpl.find("td[tag=room][rtid="+rtid+"]").length;
			$(this).attr("colspan",length);
			roomtpl.find("td[tag=room][rtid="+rtid+"]").show();
			roomtpl.find("td[tag=roomcount][rtid="+rtid+"]").hide();
			
		});
	},
	getroomlength:function(){
		return this.context.roomlist.find("td[tag=room]").length;
		
	},
});

/********************************************************************************************************************************************************************************************************/

M.Page.DatePickerTransform = M.createClass();
M.extend(M.Page.DatePickerTransform.prototype,
{
    context: {},
	transobj:null,
	transtype:"RD",/**[DR|RD]**/
	isreverse:0,
	init: function () {
    
        if(this.isreverse==1)
		{
			this.transobj=new M.Page.DRTrans();
		}
		else
		{
			this.transobj=new M.Page.RDTrans();			
		}
        
        
        this.transobj.init();
        
        
        return;
		this.initDOM();
        this.initEvent();
	},
	initDOM: function () {
		
	},
	initEvent: function () {
			
	},
	gettranstype:function()
	{
		return this.transtype;
	},
	getcell_data:function(){
		return this.transobj.getcell_data();
	},
	gettargetcell:function(date,roomid)
	{
		return this.transobj.gettargetcell(date,roomid);
	},
	nextdatecell:function(targetcell)
	{
		return this.transobj.nextdatecell(targetcell);
	},
	getdatecell_bydate:function(date){
		return this.transobj.getdatecell_bydate(date);
	},
	getjumpselected_data:function(roomlist,datelist,orderdata){
		return this.transobj.getjumpselected_data(roomlist,datelist,orderdata);		
	},
	getdata_bycoordinate:function(row,col,type_i){
		return this.transobj.getdata_bycoordinate(row,col);
	},
	getcoordinate_bydata:function(date,roomid,type){
		return this.transobj.getcoordinate_bydata(date,roomid,type);
	},
	getroomnumbydate:function(date){
		return this.transobj.getroomnumbydate(date);
	},
	getroomlistbyroomtype:function(roomtypeid){
		return this.transobj.getroomlistbyroomtype(roomtypeid);
	},
	getcellbycoordinate:function(row,col){
		return this.transobj.getcellbycoordinate(row,col);
	},
	getroomlength:function(){
		return this.transobj.getroomlength();
	},
	getstatisticslength:function(){
		return this.transobj.getstatisticslength();
	},
	gettpl_divinfo:function(){
		return this.transobj.gettpl_divinfo();
	},
	resetroomamount_remain:function(){
		return this.transobj.resetroomamount_remain();
	},
	getpickerrows:function(){
		return this.transobj.getpickerrows();
	},
	changeorderstatus_moredays:function(target,nights,type,cols){
		return this.transobj.changeorderstatus_moredays(target,nights,type,cols);
	},
	hightrow:function(e){
		return this.transobj.hightrow(e);
	},
	hightcol:function(e){
		return this.transobj.hightcol(e);
	},
	selectedreset:function(){
		return this.transobj.selectedreset();
	},
	canshiftedorders:function(ele,rows,sorttable){
		return this.transobj.canshiftedorders(ele,rows,sorttable);
	},
	clearitem:function(col,row,length){
		return this.transobj.clearitem(col,row,length);
	},
	win_resize:function()
	{
		return this.transobj.win_resize();
	},
	_clearitembyset:function(targets,type){
		return this.transobj._clearitembyset(targets,type);
	},
	win_resize:function(){
		return this.transobj.win_resize();
	},
	gettopwidth:function(){
		return this.transobj.gettopwidth();
	},
	getdaterange:function(){
		return this.transobj.getdaterange();
	},
	checkmaxnights:function(col,row){
		return this.transobj.checkmaxnights(col,row);
	},
	getcelldatabydateandid:function(row,id,type){
		return this.transobj.getcelldatabydateandid(row,id,type);
	},
	getorderwidth:function(){
    	return this.transobj.getorderwidth();
    },
    roomlist_click:function(ele){
    	return this.transobj.roomlist_click(ele);
    },
    expand_room:function(){
    	return this.transobj.expand_room();
    },
    getroomlength:function(){
    	return this.transobj.getroomlength();
    },
});
