M.Page.DatePickerAction = M.createClass();
M.extend(M.Page.DatePickerAction.prototype,
	{
		context: {},
		transform:null,
		roomstatus:[],
		roomprice:{},
		formatedateprice:{},
		tempavarooms:null,
		temporderdetail:null,
		tempcheckdetail:null,
		orderdetail:null,
		editCheckinRootPop:null,
		targetidtype:null,
		tpl_del:null,
		addordertpl:null,
		caneditaccount:0,
		canvisitlog:0,
		pid:0,
		isfirst:0,
		checkonwer:0,
		haspluginid:0,
		accounttarget:null,
		search_tpl:null,
		multiguest:[],
		searchguestlist:{},
		defaultcolor:{"order":"ofreshgreen","checkin":"ofreshorange","checkout":"ogray"},
		droplist:{"order":{},"checkin":{},"checkout":{},"del":{}},
		submittext:"处理中...",
		submitcss:"btn disabled",
		channelico:{
			"self":"ico-self",
			"familiar":"ico-familiar",
			"taobao":"ico-taobao",
			"ctrip":"ico-ctrip",
			"elong":"ico-elong",
			"qunar":"ico-qunar",
			"tongcheng":"ico-tongcheng",
			"qingmangguo":"ico-qingmangguo",
			"songguo":"ico-songguo",
			"tuniu":"ico-tuniu",
			"xuzhu":"ico-xuzhu",
			"booking":"ico-booking",
			"agoda":"ico-agoda",
			"other":"ico-other",
			"empty":"ico-nochoice",
			"weixin":"ico-weixin",
			"wkz":"ico-wkz",
			"miot":"ico-miot"
		},
		channelname:{
			"self":"自来客",
			"familiar":"熟客及推荐",
			"taobao":"淘宝",
			"ctrip":"携程",
			"elong":"艺龙",
			"qunar":"去哪儿",
			"tongcheng":"同程",
			"qingmangguo":"青芒果",
			"songguo":"松果",
			"tuniu":"途牛",
			"xuzhu":"续住",
			"booking":"Booking",
			"agoda":"Agoda",
			"other":"其它",
			"empty":"未选择"
		},
		idtypelist:{"1":'身份证',"2":"护照","3":"港澳通行证","4":"军官证","5":"其它"},
		arrivetimedata:{"before18:00":"18:00前","before20:00":"20:00前","before22:00":"22:00前","before24:00":"24:00前","after24:00":"24:00后"},
		tpl_divinfo:'',
		tpl_otherinfo:'<p class="t12 light">${arrivedate}入住</p>'+'<p class="t12 light">${nights}晚</p>',
		tpl_nopay:'<span class="nopay"></span>',
		tpl_car:'<span class="car"></span>',
		tpl_checkedin:'<div class="demand_top"><span class="ico-slept"></span></div>',
		typename:{"1":"身份证号","2":"护照","3":"港澳通行证","4":"军官证","5":"其它"},
		tpl_ota:'<span class="ota"></span>',
		tpl_otamsg:'${guestname}${phone}，${confirmdate}入住，住${nights}晚，${roomtypename}，${roomnum}间，订单金额￥${amount};${guaranteetype}；约${arrivedate}前到店。',
		tpl_winxinmsg:'${guestname}，${phone}，${indate}入住，住${nights}晚，${roomtypename}，${roomnum}间，${remark}。',
		tpl_watertype:' <li><a href="javascript:;" typeid="${id}" tag="type">${name}</a></li>',
		tpl_roomrate:'<tr><td>${roomname}</td><td>￥${price}</td></tr>',
		tpl_account:'<div class="mb5 clx" style="display:none;">'
			+'<div class="fr">'
			+'<span class="label-input li-pay fl">预订时支付房费300元[支付宝]</span>'
			+'<a href="#?" class="li-edit">修改</a>'
			+'</div>'
			+'<div class="fr" style="display:none;">'
			+' <span class="label-input fl">预订时支付房费300元[支付宝]</span>'
			+' <input type="text" class="fl" style="width:30px; margin-right:0;" value="300"/>'
			+' <div class="droplist fl" tag="payments" style="width:58px; margin-left:-1px;">'
			+' <span class="value">支付方式</span>'
			+' </div>'
			+' <a class="btn btn-primary" href="javascript:;" style="padding:4px 10px; font-size:12px;">保存</a>'
			+'</div>'
			+'</div>',
		tpl_checkout:'<div class="demand_top sortorder"><span class="ico-checkout"></span></div>',
		tpl_log:'<div class="node">'
			+'<div class="title clx">'
			+'<span class="fl" tag="date"></span>'
			+'<span class="fr"><span tag="username"></span> <span tag="ua"></span></span>'
			+'</div>'
			+'<div class="content">'
			+'<p>${detail}</p>'
			+' </div>'
			+'</div>',
			
		sorttable:{},
		tooltipmsg:{},
		maxnights:10,
		orderdays:10,
		constaynights:3,
		addcolumn:0,
		canmoveorder:0,
		ordermanage:0,
		printset:{"checkin":0,"checkout":0},
		jumpauth:0,
		jump_order:{roomlist:[],daylist:[],datelist:[]},
		color:{ordercolor:null,checkincolor:null},
		inf:{},
		qrOpened:false,
		getdatetime:function(){
			var date=M.getTime();
			return date;
		},
		init: function () {
			//$(document.body).hide().show(300,function(){});
			this.initDOM();
			this.initEvent();
			this.init_datepickerevent();
			this._getroomstatus();
			
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
		initDOM: function () {
			this.context.main=$('.main');
			this.context.body=$("body");
			this.context.pickerarea = $("#pickerarea");
			this.context.pickerdate = $("#pickerdate");
			this.context.page=$("#page");
			this.context.orderform = $("#orderform");
			this.context.roomtype = $("#roomtype");
			this.inf.ov=this.context.roomtype.attr("ov");
			this.inf.tp=this.context.roomtype.attr("tp");
			this.context.scroll_top =  $("#roomtype");
			this.context.scroll_left =$("#pickerdate");
			this.context.roomlist=$("#roomlist");
			this.context.opennewurl=$("#opennewurl");
			this.context.innhiddendata=$("#innhiddendata");
			/*-------------------------------------------*/
			this.context.orderformbody=$("#orderformbody");
			this.context.o_nights = $("#o_nights");
			this.context.o_guestname = $("#o_guestname");
			this.context.o_phone = $("#o_phone");
			this.context.o_arrivetime = $("#o_arrivetime");
			this.context.o_remark = $("#o_remark");
			this.context.o_channel=$("#o_channel");
			this.context.ordercell=$("#ordercell");
			this.context.o_totalprice = $("#o_totalprice");
			this.context.o_paystatus=$("#o_paystatus");
			this.context.o_deposit=$("#o_deposit");
			this.context.o_needcar=$("#o_needcar");
			this.context.o_needcar2=$("#o_needcar2");
			this.context.orderandcheckinbtn=$("#orderandcheckinbtn");
			this.context.depositBox=$("#depositBox");
			this.context.scroller = $(".datepicker");
			this.context.idnum=$("#idnum");
			this.context.idtype=$("#idtype");
			this.context.idtypeoption=$("#idtypeoption");
			this.context.checkin_idnum=$("#checkin_idnum");
			this.context.checkin_idtype=$("#checkin_idtype");
			this.context.idnuminfo=$("#idnuminfo");
			this.context.checkin_idnuminfo=$("#checkin_idnuminfo");
			this.context.hidemultiguesttip=$("#hidemultiguesttip");
			this.context.multiguestform=$("#multiguestform");

			this.context.e_orderdetail=$("#orderdetail");
			this.context.e_guestname=$("#e_guestname");
			this.context.e_guestphone=$("#e_guestphone");
			this.context.e_orderinfo=$("#e_orderinfo");
			this.context.e_remark=$("#e_remark");
			this.context.idtypelist=$("#idtypelist");

			this.context.e_idnum=$("#e_idnum");
			this.context.e_logo=$("#e_logo");
			this.context.e_ordercell=$("#e_ordercell");
			this.context.e_needcar=$("#e_needcar");
			this.context.e_checkinbtn=$("#e_checkinbtn");
			this.context.e_line=$("#e_line");
			this.context.submitlayer=$("#submitlayer");

			this.context.checkin=$("#checkin");
			this.context.ck_logo=$("#ck_logo");
			this.context.ck_guestname=$("#ck_guestname");
			this.context.ck_phone=$("#ck_phone");
			this.context.ck_info=$("#ck_info");
			this.context.ck_appendmoney=$("#ck_appendmoney");
			this.context.ck_remark=$("#ck_remark");

			this.context.checkinoption=$("#checkinoption");
			this.context.c_logo=$("#c_logo");
			this.context.c_guestname=$("#c_guestname");
			this.context.c_phone=$("#c_phone");

			this.context.c_info=$("#c_info");
			this.context.c_needcar=$("#c_needcar");
			this.context.c_remark=$("#c_remark");

			this.context.c_hiddencell=$("#c_hiddencell");
			this.context.c_checkoutbtn=$("#c_checkoutbtn");
			this.context.c_editbtn=$("#c_editbtn");
			this.context.c_paystatus=$("#c_paystatus");

			this.context.editcheck=$("#editcheck");
			this.context.editcheckbody=this.context.editcheck.children(".modal-body").find('.cntlist');
			this.context.ed_paystatus=$("#ed_paystatus");
			this.context.ed_deposit=$("#ed_deposit");

			this.context.msgform=$("#msgform");
			this.context.msg_hidden=$("#msg_hidden");
			this.context.msgtpl=$("#msgtpl");
			this.context.msg=$("#msg");
			this.context.leftwords=$("#leftwords");
			this.context.msgrole=$("#msgrole");
			this.context.searchorderlist=$("#searchorderlist");

			this.context.checkoutform=$("#checkoutform");
			this.context.ot_logo=$("#ot_logo");
			this.context.ot_guestname=$("#ot_guestname");
			this.context.ot_phone=$("#ot_phone");
			this.context.ot_body=this.context.checkoutform.children(".modal-body").find(".cntlist");
			this.context.ot_hidden=$("#ot_hidden");
			this.context.selecttime=$("#selecttime");
			this.context.datedesc=$("#datedesc");
			this.context.selecttime.datepicker({ onSelect: this.onselect.toEventHandler(this) });
			this.context.inputtime=$("#datepickers");
			this.context.selectdate = $("#selectdate");
			this.context.savebtn = $("#r_savebtn");
			this.context.otamsgbox=$("#otamsgbox");
			this.context.waterstaticsform=$("#waterstaticsform");
			this.context.watertypelist=$("#watertypelist");
			this.context.header=$("#header");
			this.context.roomratedetail=$("#roomratedetail");
			this.context.multiguesttip=$("#multiguesttip");
			this.context.multiguestinfo=$("#multiguestinfo");
			this.context.footer=$("#footer");
			this.context.ordercolor=$("#ordercolor");
			this.context.findetailform=$("#findetailform");

			//this.context.o_guestname=$("#o_guestname");

			this.context.orderlogform=$("#orderlogform");


			this.context.delform=$('#delform');
			this.context.delhidden=$("#delhidden");
			var now=this.getdatetime();
			var fromdate=new Date(now.getFullYear(),now.getMonth(),now.getDate()-3);
			var enddate=new Date(fromdate.getFullYear(),fromdate.getMonth()+1,fromdate.getDate());
			var ordermanage=this.context.roomtype.attr("ordermanage");
			if(ordermanage==1){
				this.ordermanage=ordermanage;
			}
			var jumpauth=this.context.roomtype.attr("jumpauth");
			if(jumpauth==1){
				this.jumpauth=jumpauth;
			}
			var checkonwer=this.context.roomtype.attr("checkonwer");
			if(checkonwer==1){
				this.checkonwer=1;
			}
			var caneditaccount=this.context.roomtype.attr("caneditaccount");
			if(caneditaccount==1){
				this.caneditaccount=1;
			}
			var haspluginid=this.context.roomtype.attr("haspluginid");
			if(haspluginid==1){
				this.haspluginid=1;
			}
			var canvisitlog=this.context.roomtype.attr("canvisitlog");
			if(canvisitlog==1){
				this.canvisitlog=1;
			}
			var printcheckin=this.context.roomtype.attr("printcheckin");
			if(printcheckin==1){
				this.printset.checkin=1
			}
			var printcheckout=this.context.roomtype.attr("printcheckout");
			if(printcheckout==1){
				this.printset.checkout=1
			}
			var isreverse=M.isEmpty(this.transform)?0:this.transform.isreverse;
			this.context.mainpicker = new M.DatePicker(this.context.pickerdate,this.context.pickerarea, {"fromdate":fromdate,"enddate":enddate,"now":now,"transform":this.transform,"isreverse":isreverse}, this.datepicker_convert.toEventHandler(this), null);
			this.context.mainpicker.transform=this.transform;
			var rows = this.transform.getpickerrows();
			this.context.mainpicker.setrows(rows);
			//日历表头和表体
			this.context.pickertbody = this.context.pickerarea.children("table").children(":first");
			this.context.pickerheader = this.context.pickerdate.children("table").children(":first");
			this._pagedesc();

			//修改渠道颜色
			this.context.selectcolor = $("#o_channel");
			this.context.inroom= $("#inroom");
			this.context.warnota= $("#warnota");
			this.tpl_divinfo=this.transform.gettpl_divinfo();
			this.context.roomstatusthumb=$("#roomstatusthumb");
			this.context.showroomthumb=$("#showroomthumb");
			this.context.roomstatusdetail=$("#roomstatusdetail");
			this.context.roomstatustime=$("#roomstatustime");
			this.context.roomstatusscroll=$("#roomstatusscroll");


			this.context.droplist=$("#droplist");
			this.context.selectDay=$("#selectDay");
			this.context.selectRoom=$("#selectRoom");
			this.context.selectNights=$("#selectNights");
			this.context.payments=$("#payments");
			this.context.depositpayment=$("#depositpayment");

			this.context.roomcost=$("#roomcost");
			this.context.roompaytype=$("#roompaytype");
			this.context.depositcost=$("#depositcost");
			this.context.depositpaytype=$("#depositpaytype");
			this.context.rmpayBox=$("#rmpayBox");
			this.context.dtpayBox=$("#dtpayBox");
			this.context.checkincolor=$("#checkincolor");
			//云掌柜收银台
			this.context.cashiermsgPop=$("#cashiermsgPop");
			this.context.cashierPop=$("#cashierPop");
			this.context.cashiermsg=$("#cashiermsg");
			this.context.cashierResult=$("#cashierResult");
			this.context.switchPaytype=$("#switchPaytype");
			this.context.payinfo=$("#payinfo");
			this.context.paymentmsgbox=$("#paymentmsgbox");

			this.context.canPopDetail = false;

			this.context.loginQunar=$("#loginQunar");
			this.context.qunarLoginBtn = $(".qunarLoginBtn");
			this.context.printform=$("#printform");
			this.context.cashierform=$("#cashierform");
			this.context.cashierhiddedata=$("#cashierhiddedata");
			this.context.cashierdetailBox=$("#cashierdetailBox");
			this.context.syt=$('#syt');
			this.context.rightbox = $('#rightboxf');
			this.context.rnsBox = $('#rnsBox');
			this.context.IEbrowser=$("#IEbrowser");
		},
		initEvent: function () {
			this.context.mainpicker.setcontent_clickhandler(this.datepicker_click.toEventHandler(this));
			this.context.orderform.bind("click", this.orderform_click.toEventHandler(this));
			this.context.orderformbody.children("li[tag=orderroomlist]").children("div[tag=order]").children("input[tag=price]").bind("input propertychange", this.orderprice_blur.toEventHandler(this));
			this.context.editcheck.bind("click",this.editcheck_click.toEventHandler(this));
			this.context.editcheckbody.children("li[tag=orderroomlist]").children("div[tag=order]").children("input[tag=price]").bind("input propertychange", this.orderprice_blur.toEventHandler(this));
			this.context.o_nights.bind("change", this.nights_change.toEventHandler(this));
			this.context.e_orderdetail.bind("click",this.orderdetail_click.toEventHandler(this));
			this.context.checkinoption.bind("click",this.checkinoption_click.toEventHandler(this));
			this.context.page.bind("click",this.page_click.toEventHandler(this));
			this.context.checkin.bind("click",this.checkin_click.toEventHandler(this));
			this.context.o_paystatus.bind("change",this.opaystatus_change.toEventHandler(this));
			this.context.msgtpl.bind("change",this.msgtpl_change.toEventHandler(this));
			this.context.msgform.bind("click",this.msgform_click.toEventHandler(this));
			this.context.msg.bind("keyup",this.msg_keydown.toEventHandler(this));
			this.context.msg.bind("blur",this.msg_keydown.toEventHandler(this));
			this.context.checkoutform.bind('click',this.checkoutform_click.toEventHandler(this));
			this.context.savebtn.bind("click",this.savebtn_click.toEventHandler(this));
			this.context.highlight=this.context.pickerarea.children("table").children("tbody").children("tr").children("td").children("div");
			this.context.highlight.bind("mousemove",this.mousemovechange.toEventHandler(this));
			this.context.highlight.bind("mouseleave",this.mouseleavechange.toEventHandler(this));
			this.context.main.bind('click',this.main_click.toEventHandler(this));
			this.context.otamsgbox.bind('click',this.shownextotamsg.toEventHandler(this));
			this.context.roomtype.bind('click',this.hightcol.toEventHandler(this));
			this.context.pickerdate.bind('click',this.hightrow.toEventHandler(this));
			this.context.waterstaticsform.bind("click",this.waterstaticsform_click.toEventHandler(this));
			this.context.watertypelist.children("ul").bind("click",this.watertype_click.toEventHandler(this));
			this.context.delform.bind('click',this.delform_click.toEventHandler(this));
			this.context.selectcolor.bind("change",this.channel_change.toEventHandler(this));
			this.context.inroom.bind("change",this.editcheck_change.toEventHandler(this));
			this.context.warnota.bind("click",this.warnota_click.toEventHandler(this));
			this.context.showroomthumb.bind("click",this.showroomthumb_click.toEventHandler(this));
			this.context.body.bind("click",this.body_click.toEventHandler(this));
			this.context.hidemultiguesttip.bind("click",this.hidemultiguesttip.toEventHandler(this));
			this.context.multiguestform.bind("click",this.multiguestform_click.toEventHandler(this));
			this.context.o_guestname.bind("keydown",this.guestchange.toEventHandler(this));
			this.context.ordercolor.children("div[tag=color]").bind("mousemove",this.color_mousemove.toEventHandler(this));
			this.context.ordercolor.children("div[tag=color]").bind("mouseleave",this.color_mouseleave.toEventHandler(this));
			this.context.checkincolor.children("div[tag=color]").bind("mousemove",this.color_mousemove.toEventHandler(this));
			this.context.checkincolor.children("div[tag=color]").bind("mouseleave",this.color_mouseleave.toEventHandler(this));
			//添加支付方式
			this.context.orderformbody.children("li[tag=paystatus]").find("div[tag=addoption]").children("input[class=btn]").bind("click",this.addpaytype_click.toEventHandler(this));
			this.context.findetailform.bind('click',this.findetailform.toEventHandler(this));

			this.context.cashiermsg.bind('click',this.cashiermsg.toEventHandler(this));
			this.context.switchPaytype.bind('click',this.switchPaytype_click.toEventHandler(this));
			this.context.cashiermsgPop.find("a[class=close]").bind('click',this.msgPopclose.toEventHandler(this));
			this.context.cashierPop.find("a[class=close]").bind('click',this.msgPopclose.toEventHandler(this));
			this.context.loginQunar.bind('click',this.loginQunar_click.toEventHandler(this));
			this.context.idtypelist.bind('click',this.idtypelist_click.toEventHandler(this));
			this.context.qunarLoginBtn.bind('click', this.relogin_click.toEventHandler(this));
			this.context.multiguestform.children("div[tag=list]").scroll(this.idtypelist_scroll.toEventHandler(this));
			this.context.printform.bind('click',this.printform_click.toEventHandler(this));
			this.context.cashierform.bind('click',this.cashierform_click.toEventHandler(this));

			this.context.syt.find('a[tag=dis]').bind('click',this.dis.toEventHandler(this));
			this.context.syt.find('div[tag=close]').bind('click',this.closesyt.toEventHandler(this));
			this.context.cashierdetailBox.find('a[tag=closebtn]').bind('click',this.closesdetail.toEventHandler(this));
			this.context.orderform.find('a[tag=close]').bind('click',this.closesyt.toEventHandler(this));
			this.context.checkin.find('a[tag=closebtn]').bind('click',this.closesyt.toEventHandler(this));
			this.context.syt.bind('click',this.syt_click.toEventHandler(this));
			this.context.roomlist.bind("click",this.roomlist_click.toEventHandler(this));
			this.context.IEbrowser.bind("click",this.IEbrowserclick.toEventHandler(this));
            this.checkroomlength();
            this.checkieversion();
		},
		IEbrowserclick:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if(t=='close'){
				this.context.IEbrowser.hide();
			}
		},
		checkieversion:function(){
			var browser=navigator.appName
			var b_version=navigator.appVersion
			var version=b_version.split(";");
			if(M.isEmpty(version[1]))
				return;
			var trim_Version=version[1].replace(/[ ]/g,"");
			var iebrowser='';
			if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0")
			{
				iebrowser=1;
			}
			else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")
			{
				iebrowser=1;
			}
			else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0")
			{
				iebrowser=1;
			} 
			if(iebrowser==1){
				this.context.IEbrowser.show();
			}
		},
		checkroomlength:function(){
			var length=this.transform.getroomlength();
			if(length==0){
				var isowner=this.context.roomtype.attr("isowner");
				if(isowner==1){
					var innid=this.context.roomtype.attr("innid");
					var url='/roomtypemanage.php?innid='+innid;
					this.context.pickerarea.html('<div class="datepickerempty">您还没有添加房间，请进入<a href="'+url+'">设置-客栈及房型</a>，为您的客栈你添加房间吧。</div>');
				}else{
					this.context.pickerarea.html('<div class="datepickerempty">您还没有添加房间，请联系管理员进入“设置-客栈及房型”添加。</div>');
				}
				
			}
		},
		roomlist_click:function(e){
			var ele = M.EventEle(e);			
			this.transform.roomlist_click(ele);
			this.transform.win_resize();
		},
		syt_click:function(e) {
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if (t == 'kt') {
				var isowner = this.context.roomtype.attr('checkonwer');
				if (isowner != 1) {
					this.auth_failed();
					return false;
				} else {
					this.context.syt.css("display","none");
					$.cookie('opencashier',1,{expires:3600});
					window.open('/pluginmanage.php#syt12');
					//window.location.href = 'pluginmanage.php#syt12';
				}
			}
		},
		closesdetail:function(){
			this.context.cashierdetailBox.hide();
			this.context.syt.show();

		},
		closesyt:function(){
			this.context.syt.css("display","none");
		},
		cashierform_click:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if(t=='pos'||t=='qrcode'||t=="msg"){
				this.context.body.find("div.graylayer").removeClass("deepgraylayer");
				this.qrOpened=false;
				this._handlecashiertypeform(t);
			}else if(t=="close"){
				this.context.body.find("div.graylayer").removeClass("deepgraylayer");
				this._closepopup();
				this.qrOpened=false;
			}else if(t=="sendmsg"){
				this.cashiermsg(ele);
			}
			if(t=='qrcode'){
				this.context.body.find("div.graylayer").addClass("deepgraylayer");
				this.context.cashierhiddedata.attr("channel",'qrcode');
				this.qrOpened=true;
				this.channelstatus();
				this._longPolling();
			}
			if(t=='pos'){
				this.context.cashierhiddedata.attr("channel",'pos');
				this.qrOpened=true;
				this.channelstatus();
				this._longPolling();
				this.updatecashiergateway();
			}
			if(t=="msg"){
				this.context.cashierhiddedata.attr("channel",'msg');
				this.channelstatus();
			}
		},
		channelstatus:function(){
			var innid=this.context.roomtype.attr("innid");
			var cstatus = this.context.cashierhiddedata.attr("channel");
			var ouniqid = this.context.cashierhiddedata.attr("unqid");
			var tradeno = this.context.cashierform.attr("trade_no");
			var data = {"a":'updatechannel',"innid":innid,"channel":cstatus,"orderuniqid":ouniqid,"tradingcode":tradeno};
			M._getjson("ajax.php",data,this.channelstatus_finished.toEventHandler(this));
		},
		channelstatus_finished:function(d){
			if(d.status=="success"){
				this.context.cashierhiddedata.attr("status",1);
			}else{
				M.error(d.msg)
			}
		},
		updatecashiergateway:function(){
			var accountid=this.context.cashierhiddedata.attr("accountid");
			var unqid=this.context.cashierhiddedata.attr("unqid");
			var posstatus=this.context.cashierhiddedata.attr("posstatus");
			if(!M.isEmpty(posstatus)&&posstatus==1){
				return;//已更新过则不进行更新
			}
			var innid=this.context.roomtype.attr("innid");
			var data={"a":"updatecashiergateway","accountid":accountid,"unqid":unqid,"innid":innid,"type":1};
			M._getjson("ajax.php",data,this.updatecashiergateway_finished.toEventHandler(this));
		},
		updatecashiergateway_finished:function(d){
			if(d.status=="success"){
				this.context.cashierhiddedata.attr("posstatus",1);
			}else{
				M.error(d.msg)
			}
		},
		_handlecashiertypeform:function(type){
			var tpl=this.context.cashierform.find("div[tag=paytypelist]");
			tpl.find("li").removeClass("checked");
			tpl.find("i[tag="+type+"]").parents("li").addClass("checked");
			this.context.cashierform.find("div[tag=msg]").hide();
			this.context.cashierform.find("div[tag=qrcode]").hide();
			this.context.cashierform.find("div[tag=pos]").hide();
			this.context.cashierform.find("div[tag="+type+"]").show();
		},
		_longPolling:function(){
			if (!this.qrOpened) {
				return;
			}
			var aid = this.context.cashierform.attr("aid");
			var trade_no = this.context.cashierform.attr("trade_no");
			var data = {"a":"getpaystatus","out_trade_no":aid,"trade_no":trade_no};
			M._getjson("ajax.php",data,this.getpaystatus_finished.toEventHandler(this));
		},
		getpaystatus_finished:function(d){
			var data = d.info;
			if ('202' == data.code) {
				var showstatus=this.context.cashierform.css("display");
				if(showstatus!='none'){
					this._longPolling();
				}
			}else{
				this.context.body.find("div.graylayer").removeClass("deepgraylayer");
				this.context.cashierform.find("div[tag=pay]").hide();
				var tpl=this.context.cashierform.find("div[tag=payresult]").show();
				tpl.find("span[tag=gateway]").html(data.gateway);
				tpl.find("span[tag=totalprice]").html(data.total_fee);
				if('200' == data.code){
					tpl.find("div[tag=success]").show();
					tpl.find("div[tag=fail]").hide();
				}else{
					tpl.find("div[tag=success]").hide();
					tpl.find("div[tag=fail]").show();
				}

			}
		},
		cashier:function(){
			var detail=this.orderdetail;
			var paydetail=detail.paydetail;
			if(paydetail.rm_paytype!='shouyintai'){
				return;
			}
			this.context.cashierform.find("div[tag=pay]").show();
			this.context.cashierform.find("div[tag=payresult]").hide();
			this._showcashiermsg();
			var action=this.orderdetail.a;
			var paytype='';
			var typemsg="支付房费";
			if(action=="saveorder"){
				typemsg="补交房费";
			}
			if(action=="submitorder"||action=="saveorder"){
				paytype='msg';
				this.context.cashierform.find("div[tag=msg]").show();
			}else{
				typemsg="补交房费";
				var posstatus=this.context.cashierform.find("div[tag=paytypelist]").find("li[tag=pos]").parent().attr("status");
				if(M.isEmpty(posstatus)){
					paytype='pos';
					this.context.cashierform.find("div[tag=pos]").show();
				}else{
					paytype='qrcode';
					this.context.cashierform.find("div[tag=qrcode]").show();
				}
			}
			this.context.cashierhiddedata.attr("accountid",paydetail.accountid).attr("posstatus",0);
			var data={"a":"getpayinfo","paytype":paytype};
			data.accountid=paydetail.accountid;
			var items=detail.items;
			var desc='';
			var comm='';
			for(var i=0;i<items.length;i++){
				var item=items[i];
				var datetime=M.strtotime(item.indate);
				var datestr=M.timeformat(datetime,'m/d');
				desc+=comm+item.roomname+'('+item.roomtypename+')，'+datestr+'入住，住'+item.nights+'晚';
				comm=';';
			}
			data.desc=desc;
			data.guestname=item.guestname;
			data.appendmoney=paydetail.appendmoney;
			data.innname=this.context.header.children("div[class=inn-name]").children("h1").text();
			if(data.appendmoney==0){
				return;
			}
			M._getjson("ajax.php", data,this.getpay_finished.toEventHandler(this));
		},
		getpay_finished:function(d){
			if(d.status=="success"){
				var info = d.info;
				var data = info.data;
				var paytype=d.req.paytype;

				this._handlecashiertypeform(paytype);

				this.context.cashierform.attr("trade_no",data.trade_no)
				this.context.cashierform.find("img[tag=qrcode]").attr("src",data.pay_qr);
				this.context.cashierform.find("div[tag=msgdesc]").children("a").attr("href",data.pay_url).html(data.pay_url);
				this.context.cashierhiddedata.attr("channel",paytype);
				M.Popup(this.context.cashierform, {"hideclass": "modal cashier fade", "showclass": "modal cashier fade in", "dragable": true});
				if(paytype=='qrcode'){
					this.context.body.find("div.graylayer").addClass("deepgraylayer");
				}
				if(paytype=='qrcode'||paytype=='pos'){
					this.qrOpened=true;
					this._longPolling();
				}
				if(paytype=='pos'){
					this.updatecashiergateway();
				}
			}else{
				M.error(d.msg);
			}
		},
		_showcashiermsg:function(){
			var action=this.orderdetail.a;
			var detail=this.orderdetail;
			var paydetail=detail.paydetail;
			var items=detail.items;
			var tpl_info=this.context.cashierform.find("div[tag=info]");
			tpl_info.find("span[tag=totalprice]").html('&yen;'+paydetail.appendmoney);
			var order=items[0];
			if(!M.isEmpty(order.indate)){
				var datetime=M.strtotime(order.indate);
			}else{
				var datetime=M.strtotime(order.arrivedate);
			}

			var datestr=M.timeformat(datetime,'m/d');
			var  orderinfo=order.roomname+"("+order.roomtypename+"),"+datestr+"入住，住"+order.nights+"晚";
			if(items.length>1){
				orderinfo+="...<i class='ico-question' tag='desctip'></i>";
			}
			var action=this.orderdetail.a;
			var typemsg="补交房费";
			if(action=="submitorder"||action=="hisadd"||action=="orderandcheckin"){
				typemsg="支付房费";
			}
			orderinfo+="</br>"+order.guestname+"，"+typemsg;
			tpl_info.find("span[tag=desc]").html(orderinfo);
			var innname=this.context.header.children("div[class=inn-name]").children("h1").text();
			var msgdesc='';
			if(action=='submitorder'||action=="hisadd"||action=="orderandcheckin"){
				msgdesc='您已预订&lt;'+innname+'&gt';
			}else{
				msgdesc='您有一笔来自&lt;'+innname+'&gt';
			}
			this.context.cashierform.find("div[tag=payresult]").find("span[tag=guestname]").html(order.guestname);
			this.context.cashierform.find("div[tag=payresult]").find("span[tag=totalprice]").html(paydetail.appendmoney);
			var roomtypelist=[];
			var tipmsg='';
			var unqid=0;
			for(var i=0;i<items.length;i++){
				var item=items[i];
				var roomtypeid=item.roomtypeid;
				var has=0;
				for(var j=0;j<roomtypelist.length;j++){
					if(roomtypelist[j]==item.roomtypename){
						has=1;
					}
				}
				if(has==0){
					roomtypelist.push(item.roomtypename);
				}
				if(!M.isEmpty(order.indate)){
					var datetime=M.strtotime(item.indate);
				}else{
					var datetime=M.strtotime(item.arrivedate);
				}
				var datestr=M.timeformat(datetime,'m/d');
				tipmsg+=item.roomname+"("+item.roomtypename+"),"+datestr+"入住，住"+item.nights+"晚<br/>";
				unqid=item.orderuniqid;
			}
			if(items.length>1){
				tpl_info.find("i[tag=desctip]").attr("title","").tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:tipmsg,show:{delay:100}});
			}
			var roomtypestr=roomtypelist.join("，");

			this.context.cashierhiddedata.attr("rtmsg",roomtypestr).attr("unqid",unqid);

			if(action=='submitorder'||action=="hisadd"||action=="orderandcheckin"){
				msgdesc+=roomtypestr+'，需要您支付'+paydetail.appendmoney+'元定金，请点击以下链接以完成支付。';
			}else{
				msgdesc='您有一笔来自&lt;'+innname+'&gt的交易，需支付'+paydetail.appendmoney+'元，请点击以下链接以完成支付。';
			}

			this.context.cashierform.find("div[tag=msgdesc]").children("span").html(msgdesc);
			this.context.cashierform.find("input[name=phone]").val(paydetail.phone);
			this.context.cashierform.attr("oid",paydetail.accountid);
			this.context.cashierform.attr("aid",paydetail.accountid)
		},
		cashiermsg:function(ele){
			var name =this.orderdetail.items[0].guestname;
			var phone = this.context.cashierform.find("input[name=phone]").val();
			var msg=this.context.cashierform.find("div[tag=msgdesc]").children("span").text();
			var href=this.context.cashierform.find("div[tag=msgdesc]").children("a").attr("href");
			var msgcon=msg+href;
			var other = this.context.cashierhiddedata.attr("rtmsg");
			var orderstatus=this.context.cashierhiddedata.attr("orderstatus");
			if(M.isEmpty(orderstatus)){
				orderstatus='ordered';
			}
			if(!M.isEmpty(phone)){
				var re= /^(13|15|18)[0-9]{9}$/ ;
				if(!re.test(phone))
				{
					alert("请输入正确的手机号");
					return false;
				}else{
					alert("短信已发送，客人成功支付后，您会在房态页收到提醒。");
				}
			}else{
				alert('手机号不能为空');
				return;
			}
			var uniqid = this.context.cashierhiddedata.attr("unqid");
			M._getjson("ajaxmsg.php",{"a":"sendpaymsg","uniqid":uniqid,"name":name,"phone":phone,"msgcon":msgcon,"other":other,"orderstatus":orderstatus,"type":1},this.cashiermsg_finished.toEventHandler(this));
			this._closepopup();
		},
		cashiermsg_finished:function(d){
			if(d.status=="success"){
				var data = d.data;
				this.context.cashiermsg.removeClass("btn btn-primary btn-small").addClass("btn btn-cancel btn-small").attr("flag", "disabled").text("已发送");
				this._showitems(data);
			}else{
				M.error((d.msg));
			}
		},
		printform_click:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			switch(t){
				case 'A4':
					this.context.printform.attr("printtype","A4");
					this.print();
					break;
				case 'memo':
					this.context.printform.attr("printtype","memo");
					this.print();
					break;
			}
		},
		print:function(){
			var operate=this.context.printform.attr("operate");
			var unqid=this.context.printform.attr("unqid");
			var innid=this.context.roomtype.attr("innid");
			var cidstr=this.context.printform.attr("cidstr");
			if(M.isEmpty(cidstr)){
				cidstr='';
			}
			M.CloseLast();
			var href="/print.php?innid="+innid+"&operate="+operate+"&unqid="+unqid+"&cidstr="+cidstr;
			this.context.opennewurl.attr("href",href);
			var msg="";
			if(operate=='checkin'){
				msg="您已开启打印入住单功能，确认打印吗？";
			}else{
				msg="您已开启打印退房单功能，确认打印吗？";
			}

			var domsg='确定';
			var canclemsg='取消';
			M.confirm(msg,this.print_confirm.toEventHandler(this),this.print_cancle.toEventHandler(this),domsg,canclemsg);
		},
		print_confirm:function(){
			var href=this.context.opennewurl.attr("href");
			window.open(href);
			M.closeMessage();
		},
		print_cancle:function(){
			M.closeMessage();
		},
		relogin_click: function (e) {
			// 获取用户的登陆信息
			var ele = M.EventEle(e);
			var innid = ele.attr("data-innid");
			M._getjson("ajaxota.php", {"a": "getuserinfo", "innid": innid}, this.relogin_finished.toEventHandler(this));
		},
		relogin_finished:function(d){
			if(d.status == "success"){
				var hotelinfo = d.d;
				var hotelcode = hotelinfo.hotelcode;
				var username = hotelinfo.username;
				var password = hotelinfo.password;
				var cid = hotelinfo.id;
				var vcode = hotelinfo.vcode;
				//this.context.loginQunar.find("tt[name=username]").text("");
				//username
				this.context.loginQunar.find("tt[name=username]").attr("value",username);
				this.context.loginQunar.find("span[tag=username]").text(username)
				this.context.loginQunar.find("input[name=password]").val(password);
				this.context.loginQunar.find("input[tag=hidedata]").attr("hotelcode",hotelcode).attr("cid",cid);
				this.context.loginQunar.find("img[tag=changevcode]").attr("src",vcode);
				M.Popup(this.context.loginQunar, {"hideclass": "modal sm fade", "showclass": "modal sm fade in", "dragable": true});
			}else{
				alert(d.msg);
			}
		},
		loginQunar_click:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if(t=="nextlink"){
				this.trylogin();
			}
			if(t=="changevcode"){
				this.changevcode();
			}
		},
		trylogin:function(){
			var hotelcode = this.context.loginQunar.find("input[tag=hidedata]").attr("hotelcode");
			var cid = this.context.loginQunar.find("input[tag=hidedata]").attr("cid");
			var innid=this.context.roomtype.attr("innid");
			var username=this.context.loginQunar.find("tt[name=username]").attr("value");
			var password=this.context.loginQunar.find("input[name=password]").val();
			var vcode = this.context.loginQunar.find("input[name=vcode]").val();
			M._getjson("ajaxota.php",{"a":"editqunarpassword","cid":cid,"innid":innid,"hotelcode":hotelcode,"username":username,"password":password,"vcode":vcode},this.savepassword_finished.toEventHandler(this));
		},
		savepassword_finished:function(d){
			if(d.status=="success"){
				this._closepopup();
			}else{
				alert(d.msg);
				this.changevcode();
			}
		},
		changevcode:function(){
			var innid=this.context.roomtype.attr("innid");
			M._getjson("ajaxota.php",{"a":"getvcode","innid":innid},this.changevcode_finished.toEventHandler(this));
		},
		changevcode_finished:function(d){
			if(d.status == "success"){
				var vcodepath = d.d;
				this.context.loginQunar.find("img[tag=changevcode]").attr("src",vcodepath);
			}
		},
		msgPopclose:function(e){
			this.qrOpened = false;
			this._closepopup();
		},



		switchPaytype_click:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if(t=="qrcode"){
				this.context.cashierPop.find("div[tag=qrcodeinfo]").show();
				this.context.cashierPop.find("div[tag=qrcodedesc]").show();
				this.context.cashierPop.find("div[tag=boxpayinfo]").hide();
				this.context.cashierPop.find("li[tag=qrcode]").attr("class","checked");
				this.context.cashierPop.find("li[tag=boxpay]").attr("class","");
				var accountid = this.context.payinfo.attr("oid");
				M._getjson("ajax.php",{"a":"updategateway","accountid":accountid,'flag':"qrcode"});
			}
			if(t=="boxpay"){
				this.context.cashierPop.find("div[tag=qrcodeinfo]").hide();
				this.context.cashierPop.find("div[tag=qrcodedesc]").hide();
				this.context.cashierPop.find("div[tag=boxpayinfo]").show();
				this.context.cashierPop.find("li[tag=qrcode]").attr("class","");
				this.context.cashierPop.find("li[tag=boxpay]").attr("class","checked");
				var accountid = this.context.payinfo.attr("oid");
				M._getjson("ajax.php",{"a":"updategateway","accountid":accountid,'flag':"boxpay"});
			}
		},
		showfindetail: function (ele, type) {
			var text = ele.html().replace("¥", "");
//    	if(text==0)
//    		return;
			if (!this.context.canPopDetail) {
				return;
			}
			this.context.findetailform.attr("ordertype", type);
			M.Popup(this.context.findetailform, {"hideclass": "modal w500 fade", "showclass": "modal w500 fade in", "dragable": true});
		},
		findetailform:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			switch(t){
				case "editaccount":
					this.editaccount(ele);
					break;
				case "saveaccount":
					this.saveaccount(ele);
					break;
				case "paysyt":
					this.paysyt(ele);
					break;
			}
		},
		paysyt:function(ele){
			this.context.cashierform.find("div[tag=pay]").show();
			this.context.cashierform.find("div[tag=payresult]").hide();
			var remarkguest = ele.parents('div[tag=re]').find('div[tag=remark]').find('span:first').text();
			var remarktpl = ele.parents('div[tag=re]').find('div[tag=remark]').children('span');
			var remark = '';
			var i = 1;
			remarktpl.each(function() {
				if (i > 1) {
					remark += $(this).text();
					remark += '，'+remarkguest+'<br />';
				}
				i++;
			});
			var accountid=this.context.cashierhiddedata.attr("accountid");
			var trade_no = ele.parents('div[tag=re]').find('span[class=red]').attr('tradingcode');
			var out_trade_no = ele.parents('div[tag=re]').find('span[class=red]').attr('id');
			var total_fee = ele.parents('div[tag=re]').find('span[class=red]').attr('total_fee');
			this.context.cashierform.attr("aid", out_trade_no);
			this.context.cashierform.find('span[tag=totalprice]').text('￥'+total_fee);
			this.context.cashierform.find('span[tag=desc]').html(remark);
			var innname=this.context.header.children("div[class=inn-name]").children("h1").text();
			var operate=ele.parents("div[t=account]").attr("operate");
			var operatetype=ele.parents("div[t=account]").attr("operatetype");
			var msgdesc='您有一笔来自&lt;'+innname+'&gt的交易，需支付'+total_fee+'元，请点击以下链接以完成支付。';
			this.context.cashierform.find('div[tag=msgdesc]').find('span').html(msgdesc);
			this.context.cashierhiddedata.attr("accountid",out_trade_no).attr("posstatus",0).attr("operate",operate).attr("operatetype",operatetype);
			var data={"a":"getrepayinfo","tradingcode":trade_no,"cashierid":out_trade_no,"payfee":total_fee,"accountid":accountid};
			M._getjson("ajax.php",data,this.paysyt_finished.toEventHandler(this));
		},
		paysyt_finished:function(d){
			if(d.status=="success"){
				M.ClosePopup();
				var info = d.info;
				var data = info.data;
				this.context.cashierform.attr("trade_no",data.trade_no);
				this.context.cashierform.find("img[tag=qrcode]").attr("src",data.pay_qr);
				this.context.cashierform.find("div[tag=msgdesc]").children("a").attr("href",data.pay_url).html(data.pay_url);
				this._handlerepayorderinfo(d);
				M.Popup(this.context.cashierform, {"hideclass": "modal cashier fade", "showclass": "modal cashier fade in"});
				if(this.context.cashierform.find('li[tag=msg]').attr('class')=='checked'){
					this.context.cashierform.find("div[tag=msg]").show();
				}else if(this.context.cashierform.find('li[tag=qrcode]').attr('class')=='checked'){
					this.context.cashierform.find("div[tag=qrcode]").show();
					this.context.body.find("div.graylayer").addClass("deepgraylayer");
				}else{
					this.context.cashierform.find("div[tag=pos]").show();

				}
				this.qrOpened = true;
				this._longPolling();
			}else{
				M.error(d.msg);
			}
		},
		_handlerepayorderinfo:function(d){
			var ordertype=this.context.findetailform.attr("ordertype");
			var tpl_info=this.context.cashierform.find("div[tag=info]");
			var items='';
			if(ordertype=="order"){
				items=this.temporderdetail.orderset.orders;
			}else{
				items=this.tempcheckdetail.checkinset.orders;
			}
			var appendmoney=d.req.payfee;
			var accountid=d.req.trade_no;
			var payname={"appendmoney":appendmoney,"accountid":accountid};
			var operate=this.context.cashierhiddedata.attr("operate");
			var operatetype=this.context.cashierhiddedata.attr("operatetype");
			var a="editorder";
			if(operatetype=='1'){
				a="submitorder";
			}
			this.orderdetail={"a":a,"items":items,"paydetail":payname};
			this._showcashiermsg();
		},
		editaccount:function(ele){
			ele.parent("div[tag=d]").hide();
			ele.parents("div[t=account]").children("div[tag=editform]").show();
		},
		saveaccount:function(ele){
			var innid=this.context.roomtype.attr("innid");
			var id=ele.parents("div[t=account]").attr("aid");
			var money=ele.parent().children("input[name=money]").val();
			var paytype=ele.parent().children("div[t=editaccount]").children("span").attr("value");
			this.accounttarget=ele.parents("div[t=account]");
			if(M.isEmpty(paytype)){
				M.error("支付方式不能为空");
				return ;
			}
			var ordertype=this.context.findetailform.attr("ordertype");
			M._getjson("ajax2.php",{"a":"editaccount","innid":innid,"id":id,"money":money,"paytype":paytype,"ordertype":ordertype},this.saveaccount_finished.toEventHandler(this));
		},
		saveaccount_finished:function(d){
			if(d.status=="success"){
				var id=d.req.id;
				var data=d.data;
				var account=d.account;
				var ordertype=d.req.ordertype;
				var account_tpl=this.accounttarget;
				account_tpl.children("div[tag=d]").children("span").html(data.title);
				account_tpl.children("div[tag=editform]").children("span").html(data.edittitle);
				account_tpl.children("div[tag=d]").show();
				account_tpl.children("div[tag=editform]").hide();
				if(ordertype=="order"){
					var temp=this.temporderdetail;
					var setid=temp.ordersetid;
					var orderlist=temp.orderset.orders;
					var totalprice=temp.orderset.totalprice;
					var tpl=this.context.orderformbody.children("li[tag=paytype]").children("div[tag=paystatistics]");
				}else{
					var temp=this.tempcheckdetail;
					var setid=temp.checkinsetid;
					var orderlist=temp.checkinset.orders;
					var totalprice=temp.checkinset.totalprice;
					tpl=this.context.editcheck.find("div[tag=paystatistics]");
				}
				var payedtotal=account.payedtotal;
				tpl.find("a[tag=showfindetail]").html("&yen;"+payedtotal);
				var needpay=parseInt(totalprice)-parseInt(payedtotal);
				tpl.find("span[tag=needpay]").html("&yen;"+needpay);
				var tpl=this.context.pickerarea.children().find("td[setid="+setid+"]");
				this._handletooltip(ordertype, tpl, orderlist, account);
				M.success("保存成功");
			}else{
				M.error(d.msg);
			}
		},
		color_mousemove:function(e){
			var ele = M.EventEle(e);
			var style=ele.parents("div[tag=color]").children("span").attr("class");
			var value=style.replace(/(^\s*)|(\s*$)/g,"").replace("checked","");
			var selected = ele.parents("div[tag=color]").children("div[tag=colorlist]").children("span[ison=1]");
			selected.attr('ison',"0");
			selected.attr("class",selected.attr("val"));
			var tpl=ele.parents("div[tag=color]").children("div[tag=colorlist]").show().children("span[val="+value+"]");
			tpl.attr("ison","1");
			tpl.attr("class",tpl.attr("val")+" checked");
		},
		color_mouseleave:function(e){
			var ele = M.EventEle(e);
			var tag=ele.attr("tag");
			if(tag=="colorlist")
				ele.hide();
		},
		searchorderdetail:function(tpl){
			var oid=tpl.attr("oid");
			var cid=tpl.attr("cid");
			var status=tpl.attr("status");
			var checkindate=tpl.attr("checkindate");
			var daterange=this.transform.getdaterange();
			var inrange=0;
			var celldata={"row":-1,"col":-1,"roomid":'',"gid":'',"setid":'',"cid":''};
			var oid=tpl.attr("oid");
			var cid=tpl.attr("cid");
			if(checkindate<=daterange.enddate&&checkindate>=daterange.fromdate){

				var type="order";
				var id=oid;
				if(!M.isEmpty(cid)&&cid!=0){
					type="checkin";
					id=cid;

				}
				celldata=this.transform.getcelldatabydateandid(checkindate,id,type);
			}else{
				celldata.oid=oid;
				celldata.cid=cid;
			}
			if(status==0){
				this._searcheditorder(tpl,celldata,oid);
			}else if(status==1){
				this._searcheditcheckorder(tpl,celldata,cid);
			}else{
				this._serachdelorder(tpl);
			}
		},
		_serachdelorder:function(tpl){
			this.search_tpl=tpl;
			if(this.canvisitlog==0){
				M.confirmmessage("该订单已被删除",this._cancleseelog.toEventHandler(this),"关闭");
			}else{
				M.confirm("该订单已被删除",this._showorderlog.toEventHandler(this),this._cancleseelog.toEventHandler(this),"查看日志","关闭");
			}

		},
		_showorderlog:function(){
			M.closeMessage();
			this.context.submitlayer.show();
			var uniqid=this.search_tpl.attr("uniqid");
			var status=0;
			var oid=this.search_tpl.attr("oid");
			var cid=this.search_tpl.attr("cid");
			if(!M.isEmpty(cid)&&cid!=0){
				status=1;
			}
			var orderstatus=this.search_tpl.attr("status");
			M._getjson("ajax.php", { "a": "getorderlog", "uniqid": uniqid,"status":status,"orderstatus":orderstatus}, this._showorderlog_finished.toEventHandler(this));
		},
		_showorderlog_finished:function(d){
			$("a[tag=showlog]").removeClass('btn-orderhistory-loading').html('');
			this.context.submitlayer.hide();
			if(d.status=="success"){
				var list=d.list;
				var html='';
				if(list.length==0||M.isEmpty(list)){
					M.error("该订单暂时没有相关历史记录，请进入日志频道查看。");
					return;
				}
				var status=d.req.status;
				var orderlist='';
				var orderstatus=d.req.orderstatus;
				if(!M.isEmpty(orderstatus)&&orderstatus==-1){
					orderlist=d.orderlist;
				}else{
					if(status==0){
						orderlist=this.temporderdetail.orderset.orders;
					}else{
						orderlist=this.tempcheckdetail.checkinset.orders;
					}
				}
				for(var j=0;j<orderlist.length;j++){
					var order=orderlist[j];
					var checkintime=M.strtotime(order.checkindate);
					var checkindate=M.timeformat(checkintime,'m/d');
					html+='<p>'+order.roomname+','+checkindate+'入住,'+order.nights+'晚,¥'+order.totalprice;
					if(order.status==0){
						html+=',[已删除]';
					}else{
						if(status==1){
							html+=',[已入住]';
						}
					}
					html+='</p>';
				}
				this.context.orderlogform.children().find("div[tag=ordermsg]").html(html);
				this.context.orderlogform.children().find("div[tag=log]").remove();
				var tpl=this.context.orderlogform.children().find("div[tag=tpl]");
				for(var i=0;i<list.length;i++){
					var item=list[i];
					var log_tpl=tpl.clone(true).attr("tag","log").show();
					log_tpl.children("div[tag=date]").html(item.date);
					var loglist=item.log;
					for(var k=0;k<loglist.length;k++){
						var log_html=this.context.orderlogform.children("div[tag=logdetail_tpl]").clone(true).show();
						var l=loglist[k];
						log_html.children("div").children("span[tag=date]").html(l.time);
						log_html.children("div").children("span").children("span[tag=username]").html(l.username);
						log_html.children("div").children("span").children("span[tag=ua]").html(l.ua);
						l.detail=l.detail.replace(/\n/ig,"<br/>");
						log_html.children("div[tag=content]").children("p").html(l.detail);
						log_tpl.append(log_html);
					}
					tpl.before(log_tpl);
				}
				M.Popup(this.context.orderlogform,{"hideclass":"modal orderhistory fade","showclass":"modal orderhistory fade in","dragable":true});
			}else{
				var uniqid=d.req.uniqid;
				if(M.isEmpty(uniqid)){
					M.error("该订单暂时没有相关历史记录，请进入日志频道查看。");
				}else{
					M.error("网络错误");
				}

			}

		},
		_cancleseelog:function(){
			M.closeMessage();
		},
		_searcheditorder:function(tpl,celldata,oid){
			/*获取房型id和roomid*/
			var rid=celldata.roomid;
			var cols=celldata.col;
			var row=celldata.row;
			/*


			 /**/
			this.context.e_guestname.children("span").html("");
			this.context.e_guestphone.html("");
			this.context.e_orderinfo.children("span[tag=price]").html("");
			this.context.e_orderinfo.children("h2[tag=roomname]").html("");
			this.context.e_orderinfo.children("p[tag=time]").html("");
			this.context.e_orderinfo.children("p[tag=nights]").html("");
			this.context.idnuminfo.html("");
			this.context.e_remark.html("");
			this.context.e_logo.attr("class","ico-own fl mr10");

			/*加载同类房型*/
			this.context.e_ordercell.attr("oid",oid).attr("cols",cols).attr("rid",rid).attr("row",row).attr("setid","");
			this.context.e_checkinbtn.show();
			this.context.e_orderdetail.children(".modal-footer").children("a[tag=editorder]").show();
			this.context.e_guestphone.parent().children("a[tag=sendmsg]").hide();
			this.temporderdetail=null;
			//panel清空
			this.context.submitlayer.show();
			M._getjson("ajax.php", { "a": "orderdetail", "orderid": oid,"rid":rid}
				, this.odetail_finished.toEventHandler(this));

		},
		_searcheditcheckorder:function(tpl,celldata,gid)
		{
			/*重置状态*/
			this.context.c_guestname.children("span").html("");
			this.context.c_guestname.children("a").hide();
			this.context.c_phone.html("");
			this.context.c_remark.html("");
			this.context.c_needcar.html("");
			this.context.c_checkoutbtn.show().attr("action","");;
			this.context.c_editbtn.show().attr("action","");
			this.context.c_checkoutbtn.html("办理退房").hide();
			this.context.c_phone.parent().children("a[tag=sendmsg]").hide();
			this.context.checkin_idnuminfo.html("");
			var rid=celldata.roomid;
			var cid=celldata.cid;
			var setid=celldata.setid;

			//var room=this._getroom(rid);
			var cols=celldata.col;
			var row=celldata.row;

			this.context.c_hiddencell.attr("rid",rid).attr("gid",gid).attr("cid",cid).attr("cols",cols).attr("row",row).attr("setid",setid);

			/*加载数据*/
			this.context.submitlayer.show();
			M._getjson("ajax.php", { "a": "checkindetail", "gid": gid,"roomid":rid}, this.checkindetail_finished.toEventHandler(this));

		},
		body_click:function(e){

			var ele = M.EventEle(e);
			var style=ele.attr("tag");
			if(M.isEmpty(style)||style!='dropdownlist'){

				var tpl_parents=ele.parents("div[tag=popform]");
				if(tpl_parents.length>0){
					var tpl=ele.parents("div[tag=dropdownlist]");
					if(tpl.length==0){
						tpl_parents.children().find(".droplist_on").removeClass("droplist_on").children("div").hide();
					}
				}

			}

		},
		hidemultiguesttip:function(){
			this.context.multiguesttip.attr("status","0").hide();
		},
		addpaytype_click:function(e){
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t == 'rm_type'){
				var rm_typename = this.context.orderformbody.children("li[tag=paystatus]").find("div[tag=addoption]").children("input[tag=rm_name]").val();
				this.addrm_type(rm_typename);
			}
			if(t == 'dt_type'){
				var dt_typename = this.context.orderformbody.children("li[tag=paystatus]").find("div[tag=addoption]").children("input[tag=dt_name]").val();
				this.addrm_type(dt_typename);
			}
		},
		addrm_type:function(typename){
			if(M.isEmpty(typename))
			{
				alert('支付方式不能为空');
				return;
			}
			M._getjson("/ajaxsetting2.php", { "a": "addpaymethod","payname":typename},this.addnew_finished.toEventHandler(this));
		},
		addnew_finished: function(d){
			if(d.status=="success")
			{
				var paytypecode=d.paytypecode;
				var id=d.id;
				var paytyppname=d.paytyppname;
				var channel_tpl='<div value="${paytypecode}" tag="option"><a  id="${id}" class="" href="javascript:;" tag="option">${paytyppname}</a></div>';
				$.tmpl(channel_tpl,{"id":id,"paytyppname":paytyppname,"paytypecode":paytypecode}).insertBefore(this.context.orderformbody.children("li[tag=paystatus]").find("div[tag=addoption]"));
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			M.emptyVal(this.context.orderformbody.children("li[tag=paystatus]").find("div[tag=addoption]").children("input[tag=rm_name]"));
			M.emptyVal(this.context.orderformbody.children("li[tag=paystatus]").find("div[tag=addoption]").children("input[tag=dt_name]"));
		},
		showroomthumb_click:function(){
			var innid = this.context.page.attr('innid');
			var timerange=this.transform.getdaterange();
			var fromddate=timerange.fromdate;
			var enddate=timerange.enddate;

			var fromdtime=M.strtotime(fromddate);
			var endtime=M.strtotime(enddate);

			this._clearroomstatusthumb();
			var time_tpl=this.context.roomstatustime;
			var now=this.getdatetime();
			var nowstr=M.timeformat(now,'Y-m-d');

			var ft = M.timeformat(fromdtime,'Y-m-d h:i:s');
			var et = M.timeformat(endtime,'Y-m-d h:i:s');
			var nowt = M.timeformat(now,'Y-m-d h:i:s');
			var length=0;
			while(fromdtime<=endtime){
				var datestr=M.timeformat(fromdtime,'Y-m-d');
				var month=M.timeformat(fromdtime,'m');
				var date=M.timeformat(fromdtime,'d');
				if(datestr==nowstr){
					var html='<th i="'+length+'" t="'+datestr+'"><p class="month">今</p><p>天</p></th>'
				}else{
					var html='<th i="'+length+'" t="'+datestr+'"><p class="month">'+month+'月</p><p>'+date+'日</p></th>'
				}
				length++;
				time_tpl.append(html);
				fromdtime.setDate(fromdtime.getDate()+1);
			}
			//this._handleroomstatusthumb(length);
//    	M.Popup(this.context.roomstatusthumb,{"hideclass":"modal setthumb fade","showclass":"modal setthumb fade in"},this._resetroomstatus.toEventHandler(this));
//	    window.location.href = "roomthumb.php?innid="+innid+"&ftime="+ft+"&etime="+et+"&now="+nowt;

			var d=this.context.innhiddendata.attr("d");
			window.open("/roomthumb.php?d="+d);
			//this._resetroomstatus();
		},
		_resetroomstatus:function(){
			var time_sh=this.context.roomstatustime.parents("div[tag=time]").css("width");
			var detail_sh=this.context.roomstatusdetail.css("width");
			var scrollHeight=this.context.roomstatusscroll[0].scrollHeight;
			var clientHeight=this.context.roomstatusscroll[0].clientHeight;
			if(scrollHeight>clientHeight){
				this.context.roomstatustime.parents("div[tag=time]").css("overflow-y","scroll");
			}else{
				this.context.roomstatustime.parents("div[tag=time]").css("overflow-y","hidden");
				this.context.roomstatustime.parent().parent().css("width",time_sh);
			}
		},
		_handleroomstatusthumb:function(length){
			var order_tpl=this.context.roomstatusdetail.children("tbody").children("tr[tag=roomtype]");
			var time_tpl=this.context.roomstatustime;
			var html_arr=new Array();
			var index=0;
			for(var i=0;i<length;i++){
				html_arr.push('<td i="'+i+'"><div class=""></div></td>');
			}
			var html=html_arr.join('');
			order_tpl.each(function(){
				$(this).append(html);
			});
			var fromdate=time_tpl.children("th[i=0]").attr("t");
			var enddate=time_tpl.children("th:last").attr("t");
			M._getjson("ajax2.php", { "a": "getstatus","fromdate":fromdate,"enddate":enddate,"watistics":0},this._getthumbroomstatus_finished.toEventHandler(this));

		},
		_getthumbroomstatus_finished:function(d){
			if(d.status=='success'){
				var order_tpl=this.context.roomstatusdetail.children("tbody").children("tr[tag=roomtype]");
				var time_tpl=this.context.roomstatustime;
				var roomstatusdata=d.roomstatus;
				var length=roomstatusdata.length;
				var startdate=time_tpl.children("th[i=0]").attr("t");
				var starttime=M.strtotime(startdate);
				for(var k=0;k<length;k++){
					var data=roomstatusdata[k];
					var nights=data.nights;
					var roomid=data.roomid;
					var date=data.d;
					var date_i=time_tpl.children("th[t="+date+"]").attr("i");
					if(M.isEmpty(date_i)){
						if(date<startdate){
							var datetime=M.strtotime(date);
							var ts=starttime-datetime;
							var days=Math.floor(ts/(24*3600*1000));
							nights=nights-days;
							date_i=time_tpl.children("th[t="+startdate+"]").attr("i");
						}
					}
					var target_tr=this.context.roomstatusdetail.children("tbody").children("tr[rid="+roomid+"]");
					for(var j=0;j<nights;j++){
						target_tr.children("td[i="+date_i+"]").children("div").addClass("block");
						date_i++;
					}
				}
			}else{
				alert("网络错误");
			}
		},
		_clearroomstatusthumb:function(){
			var time_tpl=this.context.roomstatustime;
			time_tpl.children("th:first").nextAll().remove();
			var order_tpl=this.context.roomstatusdetail.children("tbody").children("tr[tag=roomtype]");
			order_tpl.each(function(){
				var tpl=$(this).children("td:first").nextAll().remove();
				//$(this).empty();
				//$(this).html(tpl);
			});

		},
		warnota_click:function(e){
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t == 'closebtn'){
				this.context.warnota.css("display","none");
			}
		},
		channel_change:function(ele){
			var style = ele.children("a").attr("color");
			if(M.isEmpty(style)){
				style = 'ofreshgreen';
			}
			this.context.ordercell.attr("color",style);
			this.context.editcheck.children(".modal-footer").find("input[type=hidden]").attr("color",style);

			var tpl=ele.parents("ul[tag=orderform]");
			var colorfield=tpl.children("li[tag=ordercolor]").find("div[tag=colorlist]");
			var selected = colorfield.children("span[ison=1]");
			selected.attr('ison',"0");
			selected.attr("class",selected.attr("val"));
			if(style==="ofreshgreen"||style=="ofreshorange"||style=="ogray"){
				var tpl_form=ele.parents("div[tag=popform]");
				var orderstatus=tpl_form.attr("orderstatus");
				if(!M.isEmpty(orderstatus)){
					style=this.defaultcolor[orderstatus];
				}

			}

			var first=colorfield.children("span[val="+style+"]");
			first.attr("ison","1");
			first.attr("class",first.attr("val")+" checked");
			tpl.children("li[tag=ordercolor]").children("div[tag=color]").children("span").attr("class",first.attr("val")+" checked");
		},
		editcheck_change:function(e){
			var style = this.context.inroom.children("option:selected").attr("color");
			this.context.c_hiddencell.attr("color",style);
			var colorfield=this.context.editcheck.children(".modal-body").find('li[tag=ordercolor]');
			var selected = colorfield.children("span[ison=1]");
			selected.attr('ison',"0");
			selected.attr("class",selected.attr("val"));
			if(style == 'ofreshgreen'){
				var first=colorfield.children("span:first");
				var flag=first.is(':visible');
				if(!flag){
					var first=colorfield.children().eq(1);
				}
			}
			else{
				var first=colorfield.children("span[class="+style+"]");
			}
			first.attr("ison","1");
			first.attr("class",first.attr("val")+" checked");

		},
		hightcol:function(e){
			this.transform.hightcol(e);
		},
		hightrow:function(e){
			this.transform.hightrow(e);
		},
		init_datepickerevent:function()
		{
			var highlight=this.context.pickerarea.children("table").find("div");
			highlight.bind("mousemove",this.mousemovechange.toEventHandler(this));
			highlight.bind("mouseleave",this.mouseleavechange.toEventHandler(this));
		},
		main_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t=='datedesc'||t=='yeardesc'||t=='range')
			{
				return;
			}
			var display=this.context.selecttime.css('display');
			if(display=='block')
			{
				this.context.selecttime.hide();
			}
			return;
		},
		onselect:function(a){
			var fromdate=a;
			var enddate=a;
			var formtime=M.strtotime(fromdate);
			this.context.mainpicker.selectday(fromdate,enddate);
			this._pagedesc();
			this._getroomstatus();
			this.init_datepickerevent();
			this.transform.expand_room();
			this.context.selecttime.hide();
			var width=this.transform.gettopwidth();
			var css=this.context.roomlist.children("tbody").children("tr").children("td[tag=watertotal]").css("display");
			this.context.pickerarea.children("table").children("tbody").children("tr").children("td[tag=total]").css("display",css).children("div");
			this.context.pickerarea.children("table").children("tbody").children("tr").children("td[tag=day]").children("div").css("width",width);
			this.jump_order={roomlist:[],daylist:[],datelist:[]};
		},
		mousemovechange:function(e){
			var ele = M.EventEle(e);
			//获取单元格的x.y轴坐标
			var sta=ele.parent().attr("sta");
			this.context.roomtype.children("table").children("tbody").children("tr").children("td").removeClass("on");
			this.context.pickerdate.children("table").children("tbody").children("tr").children("td").removeClass('on');
			if(M.isEmpty(sta)){
				var idx=ele.parent().attr("idx");
				var i=ele.parent().parent().attr("i");
				if(!M.isEmpty(i)&&!M.isEmpty(idx)){
					var room=this.transform.getcellbycoordinate('',idx);
					var date=this.transform.getcellbycoordinate(i,'');
					room.addClass("on");
					date.children().addClass("on");
				}

			}
			var t=ele.parent().attr("tag");
			if(t=='total')
				return;
			//修改对应样式

		},
		mouseleavechange:function(){
			this.context.roomtype.children("table").children("tbody").children("tr").children("td").removeClass("on");
			this.context.pickerdate.children("table").children("tbody").children("tr").children("td").removeClass('on');
		},

		savebtn_click:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if(t=='savetime'){
				this.savebtn();
			}
		},
		savebtn:function(){
			var selecttime=this.context.selectdate.val();
			var startdate= M.strtotime(selecttime);
			startdate.setDate(startdate.getDate()+30);
			startdate=M.timeformat(startdate);
			this.context.mainpicker.currentday(selecttime,startdate);
			this._pagedesc();
			this._getroomstatus();
			M.CloseLast();

		},
		close_click:function(e)
		{
			M.CloseLast();
		},
		newrow:function(newindex)
		{
			this.context.mainpicker.newrow(newindex);
		},
		removerow:function(index)
		{
			this.context.mainpicker.removerow(index);
		},
		nights_change:function(e)
		{
			this.showorderprice(this.contex.orderform);
		},
		convertprice:function(price)
		{
			var nprice=Number(price);
			nprice=nprice.toFixed(2);
			nprice=Number(nprice);
			return nprice;
		},
		_pagedesc:function()
		{
			var btime=this.context.mainpicker.getbegindate();
			var etime=this.context.mainpicker.getenddate();
			var datedesc=this.timeformat(btime, "m/d")+"~"+this.timeformat(etime, "m/d");
			var year=this.timeformat(etime, "Y");

			this.context.page.children("div[tag=range]").children("p[tag=datedesc]").html(datedesc)
				.next().html(year);
		},
		otamsgbox:function(orderlist){
			// var pid=this.context.roomtype.attr("pid");
//     	if(M.isEmpty(pid)){
//     		pid=0;
//     	}
			var innid=this.context.roomtype.attr("innid");
			var otaorderlist=orderlist.orderlist;
			var delorderlist=orderlist.delorderlist;
			var ordersetlist=orderlist.ordersetlist;
			var pid=orderlist.pid;

			if(!M.isEmpty(orderlist)){
				for(var i=0;i<otaorderlist.length;i++){
					var item=otaorderlist[i];
					this._clearitembyset(item.preordersetid,"ordered");
				}
				for(var i=0;i<otaorderlist.length;i++){
					var item=otaorderlist[i];
					var itemdate=this._getitemdate();
					if(innid==item.innid){
						this._showitem(item,itemdate);
					}

				}
				for(s in ordersetlist){
					var item=ordersetlist[s];
					if(item.orderfrom=='elong'){
						if(item.ordertype=='1'){
							this.showotamsg(item);
						}else{
							this.showotaeditmsg(item);
						}
					}else if(item.orderfrom=='wkz'||item.orderfrom=='miot'){
						this.showweixinmsg(item);
					}
				}
				this.context.otamsgbox.show();
			}
			if(!M.isEmpty(delorderlist)){
				for(var j=0;j<delorderlist.length;j++){
					var item=delorderlist[j];
					this.showotadelmsg(item);
					this._clearitembyset(item.ordersetid,"ordered");
					//this.context.pickerarea.children("table").children("tbody").find("tr td[setid="+item.ordersetid+"]").html('<div class="date-day" style="width: 161px;"> </div>');
				}
			}
			this.calc_leftrooms();

		},
		syetemmsgbox:function(systemmsg){
			var tpl=this.context.otamsgbox.children("div[tag=systempush]");
			for(var i=0;i<systemmsg.length;i++){
				var item=systemmsg[i];
				var msg=item.msg;
				var msgtpl=tpl.clone(true).show().attr('tag','otamsg');
				msgtpl.find("p[tag=msg]").html(msg);
				msgtpl.find("a[tag=otanextmsg]").attr("pid",item.id);
				this.context.otamsgbox.append(msgtpl);
			}
			this.context.otamsgbox.show();
		},
		wkzgoodsmsgbox:function(list){
			var tpl=this.context.otamsgbox.children("div[tag=msgtpl]");
			var innname=this.context.footer.find("li.on").children("a").html();
			for(var i=0;i<list.length;i++){
				var item=list[i];
				var msg='';
				msg+=item.goodsname+'，'+item.num+'件，'+item.guestname+'，'+item.guestphone+'，已使用'+item.paytypename+'支付全款'+item.totalprice+'元。'
				var msgtpl=tpl.clone(true).show().attr('tag','otamsg');
				msgtpl.find("p[tag=title]").html('您有来自“'+item.channelname+'-'+innname+'”的其他商品订单，');
				msgtpl.find("p[tag=msg1]").html(msg);
				msgtpl.find("p[tag=msg2]").html('您可以在微客栈设置-其他商品中查看此订单。').show();
				msgtpl.find("a[tag=otanextmsg]").attr("pid",item.pid);
				this.context.otamsgbox.append(msgtpl);
			}
			this.context.otamsgbox.show();
		},
		servicemsgbox:function(servicelist){
			for(var i=0;i<servicelist.length;i++){
				var item=servicelist[i];
				var mytpl=null;
				if(item.data.ordersetid=='1'){
					//成功
					mytpl=this.context.otamsgbox.children("div[tag=ctripservicesuccess]").clone(true).show().attr('tag','otamsg');
				}
				else{
					//失败
					mytpl=this.context.otamsgbox.children("div[tag=ctripservicefail]").clone(true).show().attr('tag','otamsg');
				}
				mytpl.children("p[tag=roominfo]").html(item.content);
				mytpl.find("a[tag=otanextmsg]").attr("pid",item.id);
				this.context.otamsgbox.append(mytpl);
			}
			this.context.otamsgbox.show();
		},
		qunarmsgbox: function (qunarlist) {
			for (var i = 0; i < qunarlist.length; i++) {
				var item = qunarlist[i];
				var mytpl = null;
				if (item.data.ordersetid == '1') {
					// 成功
					mytpl = this.context.otamsgbox.children("div[tag=qunarservicesuccess]").clone(true).show().attr('tag', 'otamsg');
					mytpl.children("p[tag=roominfo]").html(item.content);
				} else if (item.data.ordersetid == '2') {
					// 登陆
					mytpl = this.context.otamsgbox.children("div[tag=qunarservicelogin]").clone(true).show().attr('tag', 'otamsg');
					mytpl.find(".qunarLoginBtn").attr('data-innid', item.data.other);
				} else {
					// 失败
					mytpl = this.context.otamsgbox.children("div[tag=qunarservicefail]").clone(true).show().attr('tag', 'otamsg');
					mytpl.children("p[tag=roominfo]").html(item.content);
				}

				mytpl.find("a[tag=otanextmsg]").attr("pid", item.id);
				this.context.otamsgbox.append(mytpl);
			}
			this.context.otamsgbox.show();
		},
		showweixinmsg:function(item){
			var tpl=this.context.otamsgbox.children("div[tag=otamsg_tmpl]").clone(true).show().attr('tag','otamsg').attr("orderid",item.id);
			var confirmtime=M.strtotime(item.createon);
			confirmdate=M.timeformat(confirmtime,'m/d h:i:s');
			var innname=this._getinnnamebyinnid(item.innid);
			var msg='微客栈';
			if(item.channelcode=='miot'){
				msg='米途';
			}
			tpl.children("p[tag=confirmtime]").html('(确认时间'+confirmdate+')');
			tpl.children("p[tag=hotelinfo]").html('您有来自“'+msg+'-'+innname+'”的新订单，已确认');
			tpl.children("p[tag=roominfo]").html('已为您暂时安排到&lt;'+item.roomtypename+'&gt;'+item.roomname+'，您可以重新安排房间。');
			var msg=$.tmpl(this.tpl_winxinmsg,item);
			tpl.children("p[tag=info]").html(msg);
			tpl.children().find("a[tag=otanextmsg]").attr("pid",item.pid);
			this.context.otamsgbox.append(tpl);
			var id=item.id;
			setTimeout('clealtpl('+id+')',10000);
		},
		ysymsgbox:function(cashierlist,pid){
			for(var i=0;i<cashierlist.length;i++){
				var cashier=cashierlist[i];
				pid=cashier.pid;
				this.context.paymentmsgbox.find("p[tag=success]").hide();
				this.context.paymentmsgbox.find("p[tag=fail]").hide();
				var tpl=this.context.paymentmsgbox.clone(true).show().attr('tag','otamsg').attr("orderid",pid);;

				tpl.find("p[tag=title]").html(cashier.title);
				tpl.find("p[tag=msg]").text(cashier.msg);
				tpl.find("a[tag=otanextmsg]").attr("pid",pid);
				this.context.otamsgbox.show().append(tpl);
				//处理未付款标志
				data=cashier.order;
				this._showitems(data);
				setTimeout('clealtpl('+pid+')',10000);
			}

		},
		shownextotamsg:function(e){
			var ele = M.EventEle(e);
			var pid=ele.attr("pid");
			var tag=ele.attr("tag");
			if(tag!="otanextmsg"){
				return;
			}
			ele.parent().parent("div[tag=otamsg]").slideUp("normal",function(){
				ele.parent().parent("div[tag=otamsg]").remove();
			});
			M._getjson("ajax.php", { "a": "hasreadpush","pid":pid},this.shownextotamsg_finished.toEventHandler(this));
		},
		shownextotamsg_finished:function(d){
			if(M.isEmpty(d)){
				alert("网络错误");
			}

		},
		_getinnnamebyinnid:function(innid){
			return this.context.footer.find("li[innid="+innid+"]").children("a").text();
		},
		getmsginfo:function(data,item){
			if(!M.isEmpty(item.phone)){
				data.phone="，"+item.phone;
			}
			var arrvetime=M.strtotime(data.arrivetimelate);
			var confirmtime=M.strtotime(data.fromdate);
			data.confirmdate=M.timeformat(confirmtime,'m/d');
			data.arrivedate=M.timeformat(arrvetime,'m/d h:i');
			return data;
		},
		showotadelmsg:function(item){
			var tpl=this.context.otamsgbox.children("div[tag=otadelmsg_tmpl]").clone(true).show().attr('tag','otamsg').attr("orderid",item.id);
			var data=item.otaorder;
			var confirmtime=M.strtotime(data.createon);
			confirmdate=M.timeformat(confirmtime,'m/d h:i:s');
			tpl.children("p[tag=confirmtime]").html('(确认时间'+confirmdate+')');
			tpl.children("p[tag=hotelinfo]").html('您有来自“艺龙”&lt;'+data.hotelname+'&gt;的删除订单，已确认');
			data=this.getmsginfo(data, item);
			var msg=$.tmpl(this.tpl_otamsg,data);
			tpl.children("p[tag=info]").html(msg);
			tpl.children().find("a[tag=otanextmsg]").attr("pid",item.pid);
			this.context.otamsgbox.append(tpl);
			var id=item.id;
			setTimeout('clealtpl('+id+')',10000);
		},
		showotamsg:function(item){
			var tpl=this.context.otamsgbox.children("div[tag=otamsg_tmpl]").clone(true).show().attr('tag','otamsg').attr("orderid",item.id);
			var data=item.otaorder;
			var confirmtime=M.strtotime(data.createon);
			confirmdate=M.timeformat(confirmtime,'m/d h:i:s');
			tpl.children("p[tag=confirmtime]").html('(确认时间'+confirmdate+')');
			tpl.children("p[tag=hotelinfo]").html('您有来自“艺龙”&lt;'+data.hotelname+'&gt;的新订单，已确认');
			tpl.children("p[tag=roominfo]").html('已为您暂时安排到&lt;'+item.roomtypename+'&gt;'+item.roomname+'，您可以重新安排房间。');
			data=this.getmsginfo(data, item);
			var msg=$.tmpl(this.tpl_otamsg,data);
			tpl.children("p[tag=info]").html(msg);
			tpl.children().find("a[tag=otanextmsg]").attr("pid",item.pid);
			this.context.otamsgbox.append(tpl);
			var id=item.id;
			setTimeout('clealtpl('+id+')',10000);
		},
		showotaeditmsg:function(item){
			var tpl=this.context.otamsgbox.children("div[tag=otaeditmsg_tmpl]").clone(true).show().attr('tag','otamsg').attr("orderid",item.id);
			var data=item.otaorder;
			var lastdata=item.lastotaorder;
			data=this.getmsginfo(data, item);
			var msg=$.tmpl(this.tpl_otamsg,data);
			tpl.children("p[tag=data]").html(msg);
			lastdata=this.getmsginfo(item.lastotaorder,item);
			var msg=$.tmpl(this.tpl_otamsg,lastdata);
			tpl.children("p[tag=lastdata]").html(msg);
			tpl.children().find("a[tag=otanextmsg]").attr("pid",item.pid);
			this.context.otamsgbox.append(tpl);
			var id=item.id;
			setTimeout('clealtpl('+id+')',10000);
		},
		msgform_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t=="send")
			{
				this.savemsg();
			}
			if(t=="msgrole")
			{
				M.Popup(this.context.msgrole,{"hideclass":"bootbox modal view fade","showclass":"bootbox modal view fade in"});
			}
		},
		
		page_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			switch (t) {
				case "prev":
					this.context.mainpicker.premonth();
					this.init_datepickerevent();
					this._pagedesc();
					this._getroomstatus();

					this.transform.expand_room();

					var date = this.context.mainpicker.getbegindate();
					var datestr=this.timeformat(date,'Y-m-d');
					this.context.selecttime.datepicker("setDate",date);
					this.jump_order={roomlist:[],daylist:[],datelist:[]};
					break;
				case "next":
					this.context.mainpicker.nextmonth();
					this.init_datepickerevent();
					this._pagedesc();
					this._getroomstatus();

					this.transform.expand_room();

					var date = this.context.mainpicker.getbegindate();
					var datestr=this.timeformat(date,'m/d/Y');
					this.context.selecttime.datepicker("setDate",date);
					this.jump_order={roomlist:[],daylist:[],datelist:[]};
					break;
				case "datedesc":
				case "yeardesc":
				case "range":
					var date = this.context.mainpicker.getbegindate();
					var datestr=this.timeformat(date,'m/d/Y');
					this.context.selecttime.datepicker("setDate",date);
					this.context.selecttime.show();
					
					break;
			}
		},
		opaystatus_change:function(e)
		{
			var paystatus=this.context.o_paystatus.val();
			if(paystatus==2)
			{
				/*已付定金*/
				this.context.o_deposit.show();
			}
			else
			{
				this.context.o_deposit.hide();
			}
		},
		orderform_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			var tpl=ele.parents("div[tag=guest]");
			if(tpl.length==0){
				this.context.orderformbody.children().find("div[tag=guestlist]").hide();
			}
			//this.checkmorenights('order');
			switch (t) {
				case "addroom":
					var orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
					this.addroomtpl(orderroomlist);
					break;
				case "removeroom":
					this.removeroomtpl(ele);
					break;
				case "suborder":
					this.submitorder();
					break;
				case "checkin":
					this.orderandcheckin();
					break;
				case "color":
					this.setordercolor(ele);
					break;
				case "multiguest":
					this.addmultiguest(ele,"order");
					break;
				case "close":
					this.colse_form();
					break;
				case "searchguest":
					this.searchguest();
					break;
				case "color":
					this.selectcolor(ele);
					break;
				case "showfindetail":
					this.showfindetail(ele,"order");
					break;
				case "roompay":
					if(ele.val() == "0"){
						ele.select();
					}
					break;
				case "roomdeposit":
					if(ele.val() == "0"){
						ele.select();
					}
					break;
				default:
					if(tpl.length>0){
						this.selectguest(tpl);
					}
					break;
			}
		},
		nightsinputs_keydown:function(e){
			var e = e || window.event;
			if(e.keyCode == 13){
				this.nightsinputs_blur(e);
			}
		},
		nightsinputs_blur:function(e){
			var target = M.EventEle(e);
			var nights=parseInt(M.getVal(target));
			target.parents("div[t=nights]").children("div").hide();
			if(nights==0||M.isEmpty(nights)||isNaN(nights))
				return;
			target.val('');
			var maxnights=target.parents("div[tag=nights]").children("div[tag=option]:last").attr("value");
			var moreniths=parseInt(target.parents("div[tag=nights]").attr("morenights"));
			if(nights>400){
				alert('请输入小于400的数字。');
				return;
			}
			if(moreniths<nights){
				alert('房间房量不足，最多可住'+moreniths+'晚，请重新输入');
				return;
			}
			
			if(maxnights<30){
				return;
			}
			if(maxnights>30&&nights>30){
				target.parents("div[tag=nights]").children("div[tag=option]:last").attr("value",nights).children("a").html(nights+'晚');
			}
			if(maxnights==30){
				target.parents("div[tag=nights]").children("div[tag=option]:last").after('<div value="'+nights+'" tag="option"><a href="javascript:;" tag="option">'+nights+'晚</a></div>');
			}
			var nightstpl=target.parents("div[t=nights]").children("span").attr("value",nights).html(nights+'晚');
			var i=target.parents("div[tag=order]").attr("i");
			var orderroomlist=target.parents("li[tag=orderroomlist]");
			this.showorderprice(orderroomlist,i);
		},
		selectguest:function(tpl){
			var id=tpl.attr("gid");
			var guest=this.searchguestlist[id];
			this.context.o_guestname.val(guest.org_guestname);
			this.context.orderformbody.children().find("input[name=phone]").val(guest.phone);
			if(!M.isEmpty(guest.idnum)){
				this.context.orderformbody.children().find("div[t=idcardform]").children("span").attr("value",guest.idtype).html(guest.typename);
				this.context.orderformbody.children().find("input[name=idcard]").val(guest.idnum);
			}
			this.context.orderformbody.children().find("div[tag=guestlist]").hide();
		},
		searchguest:function(){
			var innid=this.context.roomtype.attr("innid");
			var guestname=this.context.o_guestname.val();
			M._getjson("ajax.php",{"a":"searchguest","innid":innid,"keyword":guestname},this.searchguest_finished.toEventHandler(this));
		},
		searchguest_finished:function(d){
			if(d.status=="success"){
				var list=d.list;
				var target=this.context.orderformbody.children().find("div[tag=guestlist]");
				target.children("div[tag=guest]").remove();
				var target_tpl=target.children("div[tag=tpl]");
				if(!M.isEmpty(list)){
					for(var i=0;i<list.length;i++){
						var guest=list[i];
						var tpl=target_tpl.clone(true).attr("tag","guest").attr("gid",guest.id).show();

						this.searchguestlist[guest.id]=guest;
						var html="";
						html+='<span tag="guestname">'+guest.guestname+'</span>';
						if(!M.isEmpty(guest.phone)){
							html+='，<span tag="phone">'+guest.phone+'</span>';
						}
						if(!M.isEmpty(guest.idnum)){
							html+='，<span tag="phone">'+guest.idnum+'</span>';
						}
						tpl.children("p[tag=guestinfo]").html(html);
						html='共住过'+guest.ordercount+'次，消费'+guest.totalprice+'元，平均单价<strong class="red">'+guest.avgprice+'</strong>元';
						tpl.children("p[tag=orderinfo]").html(html);
						target.append(tpl);
					}
					target.show();
				}else{
					M.error("暂时还没有该用户的住宿记录");
				}

			}else{
				M.error(d.msg);
			}
		},
		guestchange:function(e){
			var evt=e?e:(window.event?window.event:null);
			if (evt.keyCode==13){
				this.searchguest();
			}
			var ele = M.EventEle(e);
			var guestname=ele.val();
			var action=this.context.ordercell.attr("action");
			if(action=="add"||action=="hisadd"){
				if(!M.isEmpty(guestname)){
					ele.parents("li").children("a[tag=searchguest]").show();
				}else{
					ele.parents("li").children("a[tag=searchguest]").hide();
				}
			}else{
				ele.parents("li").children("a[tag=searchguest]").hide();
			}

		},
		colse_form:function(){
			this.context.multiguesttip.attr("status",0).hide();
			this.context.findetailform.hide();
			this._closepopup();
		},
		idtypelist_scroll:function(){
			this.context.idtypelist.hide();
		},
		idtypelist_click:function(e){
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t=='option'){
				var value=ele.parent().attr("value");
				var text=ele.text();
				this.targetidtype.attr("value",value).html(text);
				this.context.idtypelist.hide();
			}
		},
		addmultiguest:function(ele,type){
			this.context.multiguestform.attr("z-index",999);
			this.context.multiguestform.children().find("ul[tag=guest]").children("li").not(":first").remove()
			if(type=='docheckin'){
				var idtype_tpl=this.context.multiguestform.children().find("div[t=idcardform]");
				//idtype_tpl.children("span").attr("value","1").text("身份证");
				//this.droplist.idtype_tpl=M.DropdownList(idtype_tpl,null,{});
				var tpl=ele.parents("li[tag=idcard]");
				var guestname=tpl.children("div").children("input[name=guestname]").val();
				var phone=tpl.children("div").children("input[name=phone]").val();
				var idnum=tpl.children("div").children("input[name=idcard]").val();
				var idtpl=tpl.children("div").children("div[t=idcardform]");
				var idtype=idtpl.children("span").attr("value");
				var idtypetext=idtpl.children("span").text();
			}else{
				this.hidemultiguesttip();
				var parents_tpl=ele.parents("ul[tag=orderform]");
				var guestname=parents_tpl.children("li:first").children("input[name=guestname]").val();
				var phone=parents_tpl.children("li").children("input[name=phone]").val();
				var idtype=parents_tpl.children("li[tag=idcard]").children("div").children("div[t=idcardform]").children("span").attr("value");
				var idtypetext=parents_tpl.children("li[tag=idcard]").children("div").children("div[t=idcardform]").children("span").text();
				var idnum=parents_tpl.children("li[tag=idcard]").children("div").children("input[name=idcard]").val();
				var idtype_tpl=this.context.multiguestform.children().find("div[t=idcardform]").attr("value",idtype);
				idtype_tpl.children("span").attr("value",idtype).text(idtypetext);
			}
			var tpl=this.context.multiguestform.children().find("ul[tag=guest]").children("li:first");
			M.emptyVal(tpl.children("div").children("input[name=guest]"));
			M.emptyVal(tpl.children("div").children("input[name=phone]"));
			M.emptyVal(tpl.children("div").children("input[name=idnum]"));
			if(guestname){
				if(this.multiguest.length==0){
					this.multiguest.push({"guestname":guestname,"phone":phone,"idnum":idnum,"idtype":idtype,"idtypetext":idtypetext});
				}else{
					this.multiguest[0].guestname=guestname;
					this.multiguest[0].phone=phone;
					this.multiguest[0].idnum=idnum;
					this.multiguest[0].idtype=idtype;
					this.multiguest[0].idtypetext=idtypetext;
				}
			}
			this._initmultiguestform();
			this.context.multiguestform.attr("t",type);
			M.Popup(this.context.multiguestform,{"hideclass":"modal w500 fade","showclass":"modal w500 fade in"},function(){
			}.toEventHandler(this));
		},
		_initmultiguestform:function(){
			this.context.multiguestform.children().find("ul[tag=guest]").children("li");
			var guestlist=this.multiguest;
			for(var i=0;i<guestlist.length;i++){
				var guest=guestlist[i];
				this._setguestval(guest);
				this.addgusettpl("init");
			}
			if(guestlist.length==0){
				this.addgusettpl();
			}
		},
		_setguestval:function(guest){
			var tpl=this.context.multiguestform.children().find("ul[tag=guest]").children("li:last");
			guest.guestname&&tpl.children("div").children("input[name=guest]").val(guest.guestname);
			guest.phone&&tpl.children("div").children("input[name=phone]").val(guest.phone);
			guest.idnum&&tpl.children("div").children("input[name=idnum]").val(guest.idnum);
			var idtypename=this.idtypelist[guest.idtype];
			tpl.children("div").children("div[t=idcardform]").children("span").attr("value",guest.idtype).text(idtypename);
		},
		addgusettpl:function(status){
			var tpl=this.context.multiguestform.children().find("ul[tag=guest]");
			var length=tpl.children("li").length;
//    	if(length>=9&&status!='init'){
//    		M.error("最多可添加9个入住人");
//    		return;
//    	}
//    	if(length>=9&&status=='init'){
//    		return;
//    	}
			var tpl_tmp=tpl.children("li:first");
			var guest=tpl_tmp.clone(true).attr("tag","guest");
			M.emptyVal(guest.children("div").children("input[name=guest]"));
			M.emptyVal(guest.children("div").children("input[name=phone]"));
			M.emptyVal(guest.children("div").children("input[name=idnum]"));
			guest.find("div[t=idcardform]").children("span").attr("value","1").text("身份证");

			tpl.append(guest);
			this._resetguesthandle();
		},
		delguesttpl:function(ele){
			ele.parents("li").remove();
			this._resetguesthandle();
		},
		_resetguesthandle:function(){
			var tpl=this.context.multiguestform.children().find("ul[tag=guest]");
			tpl.children("li").children("div").children("a[tag=delguest]").remove();
			tpl.children("li").children("div").children("a[tag=addguest]").remove();
			if(tpl.children("li").length>1){
				tpl.children("li").children("div").append('<a href="javascript:;" tag="delguest" class="del-book mr5" title="删除该入住人"></a>');
				tpl.children("li:last").children("div").append('<a href="javascript:;" tag="addguest" class="add-book" title="添加入住人"></a>');
				tpl.children("li:first").children("div").children("a[tag=delguest]").remove();
			}else{
				tpl.children("li").children("div").append('<a href="javascript:;" tag="addguest" class="add-book" title="添加入住人"></a>');
			}

		},
		multiguestform_click:function(e){
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t!='idtypespan'&&t!='idtype'){
				this.context.idtypelist.hide();
			}
			switch (t) {
				case "addguest":
					var orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
					this.addgusettpl('add');
					break;
				case "delguest":
					this.delguesttpl(ele);
					break;
				case "save":
					this.saveguest();
					break;
				case "idtypespan":
					this.showidtype(ele);
					break;
				case "idtype":
					this.showidtype(ele.children("span"));
					break;
			}
		},
		showidtype:function(ele){
			var selectcount=ele.attr("count");
			if(M.isEmpty(selectcount)||selectcount=='0'){
				this.context.idtypelist.find("div[t=idcardform]").children("span").attr("count",0);
				ele.attr("count",'1');
			}else{
				ele.attr("count",'0');
			}
			this.targetidtype=ele;
			var value=ele.attr("value");
			this.context.idtypelist.find("a[tag=option]").removeClass("on");
			this.context.idtypelist.find("div[value="+value+"]").children("a").addClass("on");
			var top = ele.offset().top+ ele.outerHeight()+ 2;
			var left = ele.offset().left-6;
			if(M.isEmpty(selectcount)||selectcount=='0'){
				this.context.idtypelist.css({"top":top,"left":left,"z-index":1060}).show();

			}else{
				this.context.idtypelist.css({"top":top,"left":left,"z-index":1060}).toggle();
			}
		},
		saveguest:function(){
			var tpl=this.context.multiguestform.children().find("ul[tag=guest]").children("li");
			var guestlist=[];
			var status=true;
			var idstatus=true;
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			tpl.each(function(){
				var guest=M.getVal($(this).children("div").children("input[name=guest]"));
				var phone=M.getVal($(this).children("div").children("input[name=phone]"));
				var idnum=M.getVal($(this).children("div").children("input[name=idnum]"));
				var idtype=$(this).children("div").children("div").children("span").attr("value");
				var idtypetext=$(this).children("div").children("div").children("span").text();
				if(!M.isEmpty(idnum)&&idtype==1&&reg.test(idnum) === false)
				{
					idstatus=false;
				}
				if(guest){
					guestlist.push({"guestname":guest,"phone":phone,"idnum":idnum,"idtype":idtype,"idtypetext":idtypetext});
				}else{
					if(phone||idnum){
						status=false;
					}
				}
			});
			if(idstatus==false){
				M.error("请输入正确的身份证号");
				return;
			}
			if(guestlist.length==0){
				M.error("入住人不能为空");
				return;
			}
			if(status==false){
				M.error("客人姓名不能为空");
				return;
			}else{
				var guest=guestlist[0];
				var type=this.context.multiguestform.attr("t");
				if(type=="order"){
					var tpl_ul=this.context.orderform.children().find("ul[tag=orderform]");
					tpl_ul.children("li").children("input[name=guestname]").val(guest.guestname);
					tpl_ul.children("li").children("input[name=phone]").val(guest.phone);
					tpl_ul.children("li").children("div").children("input[name=idcard]").val(guest.idnum);
					tpl_ul.children("li").children("div").children("div[t=idcardform]").children("span").attr("value",guest.idtype).text(guest.idtypetext);
				}
				if(type=="docheckin"){
					var tpl=this.context.checkin.children().find("li[tag=idcard]");
					tpl.children("div").children("input[name=guestname]").val(guest.guestname);
					tpl.children("div").children("input[name=phone]").val(guest.phone);
					tpl.children("div").children("input[name=idcard]").val(guest.idnum);
					tpl.children("div").children("div[t=idcardform]").children("span").attr("value",guest.idtype).text(guest.idtypetext);
				}
				if(type=="checkin"){
					var tpl_ul=this.context.editcheck.children().find("ul[tag=orderform]");
					tpl_ul.children("li").children("input[name=guestname]").val(guest.guestname);
					tpl_ul.children("li[tag=phone]").children("input").val(guest.phone);
					tpl_ul.children("li").children("div").children("input[name=idcard]").val(guest.idnum);
					tpl_ul.children("li").children("div").children("div[t=idcardform]").children("span").attr("value",guest.idtype).text(guest.idtypetext);
				}
			}
			this.multiguest=guestlist;
			/*var uniqid=this.context.multiguestform.attr("uniqid");
			 var innid=this.context.roomtype.attr("innid");
			 if(!M.isEmpty(uniqid)){
			 var orderstatus=this.context.multiguestform.attr("orderstatus");
			 var data={"a":"savemultiorder","innid":innid,"uniqid":uniqid,"orderstatus":orderstatus};
			 if(guestlist.length>0){
			 for(var i=0;i<guestlist.length;i++){
			 var guest=guestlist[i];
			 data['guestname'+i]=guest.guestname;
			 data['phone'+i] = guest.phone;
			 data['idnum'+i]=guest.idnum;
			 data['idtype'+i]=guest.idtype;
			 } 
			 data.guestlength=guestlist.length;

			 }
			 M._getjson("/ajax.php", data,this.savemultiorder_finished.toEventHandler(this));
			 }else{
			 M.success("已成功登记多个入住人");
			 this.closemultiguestform();
			 }*/
			M.success("已成功登记多个入住人");

			this.closemultiguestform();

		},
		savemultiorder_finished:function(d){
			if(d.status=="success"){
				M.success("已成功登记多个入住人");
				this.closemultiguestform();
			}else{
				M.error("保存多个入住人失败");
			}
		},
		closemultiguestform:function(){
			var tpl=this.context.multiguestform.children().find("ul[tag=guest]").children("li");
			var total=this.multiguest.length;
			var type=this.context.multiguestform.attr("t");
			if(type=="order"){
				total>0&&this.context.orderform.children().find("a[tag=multiguest]").append('<i class="count" tag="count">'+total+'</i>')
			}
			if(type=="checkin"){
				total>0&&this.context.editcheck.children().find("a[tag=multiguest]").append('<i class="count" tag="count">'+total+'</i>')
			}
			if(type=="docheckin"){
				total>0&&this.context.checkin.children().find("a[tag=multiguest]").append('<i class="count" tag="count">'+total+'</i>')
			}
			M.CloseLast();
			this.context.idtypelist.hide();
		},
		orderdetail_click:function(e)
		{
			var ele = M.EventEle(e);

			var t = ele.attr("tag");
			switch (t) {
				case "removeorder":
					this.beforeremoveorder('ordered',this.temporderdetail);
					//this.removeorder(ele);
					break;
				case "checkin":
					this.checkin_option(ele);
					break;
				case "editorder":
					this.editorder(ele);
					break;
				case "sendmsg":
					this.sendmsg(ele,"ordered");
					break;
				case "closebtn":
					this.destroyorderform();
					break;
				case "guesttotal":
					this.showmultiguestinfo("order");
					break;
				case "showlog":
					this._showlog(this.temporderdetail,0);
					break;
			}
		},
		showmultiguestinfo:function(type){
			if(type=='order'){
				var guestlist=this.temporderdetail.guestlist;
			}
			if(type=="checkin"){
				var guestlist=this.tempcheckdetail.guestlist;
			}
			var html='';
			for(var i=0;i<guestlist.length;i++){
				var guest=guestlist[i];
				html+='<p>'+guest.guestname;
				if(!M.isEmpty(guest.phone))
					html+='，'+guest.phone;
				if(!M.isEmpty(guest.idnum))
					html+='，'+guest.idtypename+'：'+guest.idnum;
				html+='</p>';
			}
			this.context.multiguestinfo.children().find("div[tag=info]").html(html);
			M.Popup(this.context.multiguestinfo,{"hideclass":"modal view fade","showclass":"modal view fade in"},function(){
			}.toEventHandler(this));

		},
		editorder_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			switch (t) {
				case "save":
					this.saveorder(e);
					break;
				case "checkin":
					this.saveorderandcheckin(e);
					break;
				case "closebtn":
					this.temporderdetail=null;
					break;
				case "addroom":
					var orderroomlist=this.context.editorder.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
					this.addroomtpl(orderroomlist);
					break;
				case "removeroom":
					this.removeroomtpl(ele);
					break;
			}
		},
		checkinoption_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			switch (t) {
				case "checkout":
					this.docheckout();
					break;
				case "constay":
					this.doconstay();
					break;
				case "addnight":
					this.addnight_click();
					break;
				case "edit":
					this.doeditcheckin(this.context.c_hiddencell,"checkedin");
					break;
				case "delete":
					this.beforeremoveorder('checkin',this.tempcheckdetail);
					//this.checkindelete();
					break;
				case "sendmsg":
					this.sendmsg(ele,"checkedin");
					break;
				case "guesttotal":
					this.showmultiguestinfo("checkin");
					break;
				case "showlog":
					this._showlog(this.tempcheckdetail,1);
					break;
				case "print":
					var status = this.context.c_info.find('p[tag=arrivetime]').children('span:last').html();
					if(status == "[已退房]"){
						this.checkoutprint();
						break;
					}else{
						this.checkinprint();
						break;
					}
			}
		},
		_showlog:function(order,status){
			$("a[tag=showlog]").addClass('btn-orderhistory-loading').html('<i class="loading16 mt5"></i>');
			var uniqid=order.orderuniqid;
			M._getjson("ajax.php", { "a": "getorderlog", "uniqid": uniqid,"status":status}, this._showorderlog_finished.toEventHandler(this));
		},
		checkin_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");

			switch (t) {
				case "checkin":
					this.checkin(ele);
					break;
				case "value":
					this.ktsyt(ele);
					break;
				case "multiguest":
					this.addmultiguest(ele, "docheckin");
					break;
				case "roomratemoney":
					if(ele.val() == 0){
						ele.select();
					}
					break;
				case "depositmoney":
					if(ele.val() == 0){
						ele.select();
					}
					break;
			}
		},
		ktsyt:function(ele){
			//显示收银台开通
			if(ele.parents('div').attr('t')=='roomrate'){
				var showstatus=this.context.syt.css("display");
				if(!M.isEmpty(showstatus)&&showstatus!='none'){
					return;
				}
				var n = $.cookie('cashtipcount');
				if(!M.isEmpty(n)&&n>=3){
					return;
				}
				if(M.isEmpty(n)){
					n=1;
				}else{
					n=parseInt(n)+1;
				}				
				$.cookie('cashtipcount',n,{expires:3600*360*24});
				this.context.syt.show();
			}
		},
		checkoutform_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			switch (t) {
				case "checkout":
					this.checkout();
					break;
				case "orderselect":
					this._toggle(ele,"selected");
					var o=this.tempcheckdetail;
					if(o.checkoutinfo.orderinfo.length!=1){
						this._checkout_dealmoney();
					}
					break;
				case "guesttotal":
					this.showmultiguestinfo("checkin");
					break;
			}
		},
		_toggle:function(ele,style){
			var select=ele.attr("class");
			if(!M.isEmpty(select)&&(select.indexOf(style)>=0||select==style)){
				ele.removeClass(style);
			}else{
				ele.addClass(style);
			}
		},
		orderroom_change:function(ele)
		{
			//var ele = M.EventEle(e);
			//var t = ele.attr("tag");
			/*更新价格*/
			/*计算第一个的日期范围*/
			var orderroomlist=ele.parents("li[tag=orderroomlist]");

			// var orderroom=ele.parent();
// 		var checkindate=orderroom.children("select[tag=checkindate]");
// 		
// 		var fromdate=checkindate.children("option:first").val();
// 		var temp_enddate=checkindate.children("option:last").val();
// 		var enddatetime=M.strtotime(temp_enddate);
//         enddatetime.setDate(enddatetime.getDate()+this.maxnights);
//         var enddate=this.timeformat(enddatetime);

			var rtid=ele.attr("rtid");
			rtid=parseInt(rtid);
			var i=ele.parents("div[tag=order]").attr("i");
			i=M.isEmpty(i)?"":i;

			/*是否已加载*/
			if(!M.isEmpty(this.formatedateprice[rtid]))
			{
				var targetli=ele.parents("div[tag=order]");
				this.showordernights(targetli,i);
				this.showorderprice(orderroomlist,i);
			}
			/*
			 else
			 {	
			 M._getjson("ajax.php", { "a": "getprice", "fromdate": fromdate, "enddate": enddate ,"roomtypeid":rtid,"i":i}, 
			 this.getprice_finished.toEventHandler(this));
			 }
			 */
		},
		ordernight_change:function(ele)
		{
			//var ele = M.EventEle(e);
			// var t = ele.attr("tag");
			/*更新价格*/
			/*计算第一个的日期范围*/
			var orderroomlist=ele.parents("li[tag=orderroomlist]");

			var orderfield=ele.parent();
			var nights=ele.val();
			ele.parents("div[tag=order]").children("div[id=selectNights]").attr("value",nights);
			var i=ele.parents("div[tag=order]").attr("i");
			/*是否已加载*/

			var oid=orderfield.attr("oid");
			var action=this.context.ordercell.attr("action");

			//this.showordernights(targetli,i);
			this.showorderprice(orderroomlist,i);
		},

		input_click:function(){
			var nightselect = this.context.selectNights.find("div[tag=nights]");
//			var selectNights = this.context.editcheck.find('ul').children('li[tag=orderroomlist]').children('div[tag=order]').children('div[id=selectNights]');
//			var nightselect = selectNights.find("div[tag=nights]");
//			this.context.selectNights = selectNights;
//			this.context.rnsBox = selectNights.children('div[id=rnsBox]');


			var keywords = nightselect.children("div[tag=input]").children("input").val();
			if (keywords) {
				keywords = parseInt(keywords);
				nightselect.children("div[tag=input]").remove();

				if(keywords>30){
					var option = '<div value="'+keywords+'"><a href="javascript:;" class="on">'+keywords+'晚</a></div>';
					option += '<div tag="input"><input type="text" style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
				}else{
					option = '<div tag="input"><input type="text" style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
				}

				nightselect.append(option);
				nightselect.children("div[tag=input]").children("input").bind("keydown",this.nightsinput_keydown.toEventHandler(this));
				this.context.rnsBox.hide();
				this.context.selectNights.children('span').attr('value',keywords).text(keywords+'晚');
				var orderroomlist = this.context.orderformbody.children('li[tag=orderroomlist]');
				var i = this.context.orderformbody.children('li[tag=orderroomlist]').children("div[tag=order]").attr("i");
				this.showorderprice(orderroomlist,i);
			}
		},


	
		inputs_click:function(){
//			if(isreverse == 1){
//				var selectNights = this.context.orderform.find('ul').children('li[tag=orderroomlist]').children('div[tag=order]').children('div[id=selectNights]');
//			}else{
//				var selectNights = this.context.editcheck.find('ul').children('li[tag=orderroomlist]').children('div[tag=order]').children('div[id=selectNights]');
//			}
			var selectNights = this.context.orderform.find('ul').children('li[tag=orderroomlist]').children('div[tag=order]').children('div[id=selectNights]');

			var nightselect = selectNights.find("div[tag=nights]");
			this.context.selectNights = selectNights;
			this.context.rnsBox = selectNights.children('div[id=rnsBox]');

			var keywords = nightselect.children("div[tag=input]").children("input").val();
			if (keywords) {
				keywords = parseInt(keywords);
				nightselect.children("div[tag=input]").remove();

				if(keywords>30){
					var option = '<div value="'+keywords+'"><a href="javascript:;" class="on">'+keywords+'晚</a></div>';
					option += '<div tag="input"><input type="text" style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
				}else{
					option = '<div tag="input"><input type="text" style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
				}

				nightselect.append(option);
				nightselect.children("div[tag=input]").children("input").bind("keydown",this.nightsinput_keydown.toEventHandler(this));
				this.context.rnsBox.hide();
				this.context.selectNights.children('span').attr('value',keywords).text(keywords+'晚');
				var orderroomlist = this.context.editcheckbody.children('li[tag=orderroomlist]');
				var i = this.context.editcheckbody.children('li[tag=orderroomlist]').children("div[tag=order]").attr("i");
				this.showorderprice(orderroomlist,i);
			}
		},

		_orderdate_change:function(orderroomlist)
		{
			var checkindates=orderroomlist.children("div[tag=order]").children("div[id=selectDay]");
			var cancheckin=false;
			var arrivedate='';
			for(var i=0;i<checkindates.length;i++)
			{
				var checkinselect=checkindates[i];
				var date=$(checkinselect).children("span").attr("value");
				var datetime=M.strtotime(date);
				if(M.isEmpty(arrivedate)||arrivedate>datetime){
					arrivedate=datetime;

				}
				var cancheckin=this._checkinable(datetime);
				if(cancheckin)
				{
					cancheckin=true;
					break;
				}
			}
			//设置是否可以入住
			var checkinbtn=orderroomlist.parents(".modal-body").next().children("a[tag=checkin]").attr("cancheckin",cancheckin?"1":"0");
			//已付全款才可以直接注入1
			if(this.context.ordercell.attr("action")!='hisadd'){
				if(cancheckin)
				{
					checkinbtn.show();
					orderroomlist.parent().children("li[tag=paytype]").children("div[tag=depositform]").show();
					orderroomlist.parent().children("li[tag=paytype]").find("div[tag=paystatistics]").css("top","top:25px;");
					orderroomlist.parent().children("li[tag=idcard]").show();
					orderroomlist.parent().children("li[tag=paytype]").children().find("div[t=roomrate]").children("span").attr("value","cash").text("现金");
					orderroomlist.parent().children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付房费：");

				}			else
				{
					checkinbtn.hide();
					orderroomlist.parent().children("li[tag=paytype]").children("div[tag=depositform]").hide();
					orderroomlist.parent().children("li[tag=paytype]").find("div[tag=paystatistics]").css("top","");
					orderroomlist.parent().children("li[tag=idcard]").hide();
					this.context.multiguesttip.hide();
					orderroomlist.parent().children("li[tag=paytype]").children().find("div[t=roomrate]").children("span").attr("value","alipay").text("支付宝");
					orderroomlist.parent().children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付定金：");
				}
			}
			//var now=this.getdatetime();
			//var date=M.timeformat(now,'Y-m-d');
			//var arrivedate=M.timeformat(arrivedate,'Y-m-d');
			//if(arrivedate<=date){
			//	orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=dtpayBox]").addClass("ip-right");;
			//orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=rmpayBox]").removeClass("ip-right");;
			//  orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=depositBox]").show();
			//	orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=payments]").children("span").attr("value","cash").text("现金");

			//}else{
			//	orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=dtpayBox]").removeClass("ip-right");;
			//	orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=rmpayBox]").addClass("ip-right");;
			//    orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=depositBox]").hide();
			//	orderroomlist.parent().children("li[tag=paystatus]").children().find("div[id=payments]").children("span").attr("value","alipay").text("支付宝");

			//}
			checkinbtn.attr("cancheckin",cancheckin?"1":"0");
		},
		orderdate_change:function(ele)
		{
			//var ele = M.EventEle(e);
			//var obj = $(e);
			// var t = ele.attr("tag");

			var i=ele.parents("div[tag=order]").attr("i");
			i=M.isEmpty(i)?"":i;
			var fromdate=ele.attr("value");

			/*区分是预定还是入住*/
			var status = this.context.ordercell.attr("status");
			var ordersetid=this.context.ordercell.attr("ordersetid");
			var checkinsetid=this.context.ordercell.attr("checkinsetid");

			var setid="";
			var id="";
			if(status=="addorder"||status=="editorder")
			{
				setid=ordersetid;
				id=ele.parents("div[tag=order]").attr("oid");

				var orderroomlist=ele.parents("li[tag=orderroomlist]");
				//处理是否可以入住
				this._orderdate_change(orderroomlist);
			}
			else if(status=="editcheckin")
			{
				setid=checkinsetid;
				id=ele.parents("div[tag=order]").attr("gid");
			}
			/*是添加还是编辑、及各自setid*/
			this._getavailablerooms(status,fromdate,i,setid,id);
		},
		orderprice_blur:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");

			var i=ele.parent().attr("i");
			i=M.isEmpty(i)?"":i;

			var orderroomlist=ele.parents("li[tag=orderroomlist]");
			this._sumorderprice(orderroomlist);
		},
		editcheck_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");

			var formlist=this.context.editcheck.children(".modal-body").find(".cntlist");
			var paytype=formlist.children("li[tag=paytype]");

			switch (t) {
				case "save":
					this.savechecked(ele);
					break;
				case "addroom":
					var orderroomlist=this.context.editcheck.find("li[tag=orderroomlist]");
					this.addroomtpl(orderroomlist);
					break;
				case "removeroom":
					this.removeroomtpl(ele);
					break;
				case "color":
					this.setordercolor(ele);
					break;

				case "showfindetail":
					this.showfindetail(ele,"checkin");
					break;
				case "multiguest":
					this.addmultiguest(ele,"checkin");
					break;
				case "roomrate":
					if(ele.val()=='0'){
						ele.select();
					}
					break;
				case "deposit":
					if(ele.val()=='0'){
						ele.select();
					}
					break;
			}
		},
		msgtpl_change:function()
		{
			var tplid = this.context.msgtpl.val();
			var tpl =this.context.msgtpl.parent().find("input[type=hidden][tplid="+tplid+"]").val();
			this.context.msgform.children(".modal-body").find(".cntlist").children("li[tag=msg]").children("textarea").val(tpl);
			this.msg_keydown();
		},
		msg_keydown:function(e)
		{
			var msg=M.getVal(this.context.msg);
			var len=msg.length;
			var maxlen=parseInt(this.context.leftwords.attr("val"));
			this.context.leftwords.html(len);
		},
		_getpickercell: function (row,col)
		{
			var target = this.context.pickertbody.children("tr[i="+row+"]").children("td[idx="+col+"]:first");
//			var target = this.context.pickertbody.children("tr:eq("+row+")").children("td:eq("+col+")");
			return $(target);
		},
		_getpickercells: function (setid,type)
		{
			if(type=="checkedin"||type=="checkedout")
			{
				var target = this.context.pickertbody.children("tr").children("td[setid="+setid+"][sta!=ordered]");
				return target;
			}
			else
			{
				var target = this.context.pickertbody.children("tr").children("td[setid="+setid+"][sta=ordered]");
				return target;
			}
		},
		delform_click:function(e)
		{
			var ele = M.EventEle(e);
			var t = ele.attr("tag");
			if(t=='delete')
			{
				var ordertype=this.context.delhidden.attr('ordertype');
				var ownprice=this.context.delform.find('.modal-body').find('.cntlist').children('li[tag=income]').find('input:first').val();

				if(M.isEmpty(ownprice)){
					ownprice=0;
				}
				else
				{
					if(isNaN(ownprice)){
						alert('所得收入输入格式不正确');
						return;
					}
					ownprice=parseInt(ownprice);
				}
				this.delorder_action(ordertype,ownprice);
			}
			if(t=='guesttotal'){
				var orderstatus=ele.attr("orderstatus");
				this.showmultiguestinfo(orderstatus);
			}
		},
		/*********events begin**************************************************************************************************************************************/
		pickervalue:function()
		{
			var date = this.context.mainpicker.getcurrentdate();
			var str = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
			return str;
		},
		_getroomstatus:function()
		{
			var selecttime=this.context.selectdate.val();
			var btime=this.context.mainpicker.getbegindate();
			var etime=this.context.mainpicker.getrealenddate();
			var fromdate=this.timeformat(btime);
			var enddate=this.timeformat(etime);
			var addcolum=this.addcolumn;
			this.context.submitlayer.show();
			M._getjson("ajax2.php", { "a": "getstatus","fromdate":fromdate,"enddate":enddate,"watistics":addcolum},this._getroomstatus_finished.toEventHandler(this));
		},
		_getroomstatus_finished:function(d)
		{
			this.context.submitlayer.hide();
			if(d.status=="success")
			{
				var rstatus=d.roomstatus;
				this.roomstatus=rstatus;
				this.canmoveorder=0;
				this.initpickerstatus();
				if(this.ordermanage==1){
					setTimeout(this.sortorders.toEventHandler(this),10);
					this.canmoveorder=1;
				}else{
					var tpl=this.context.pickerarea.children("table").children("tbody").children("tr");
					tpl.children("td").children("div").children("div").children().removeClass("sortorder");
				}
				if(this.isfirst==0){
					this.context.pickerdate.children().find("td.today").children("b").click();
					this.isfirst=1;
				}

			}
			setTimeout(this.getallrooms.toEventHandler(this),2000);
			//this.getallrooms();
		},
		getallrooms:function(){
			var btime=this.context.mainpicker.getbegindate();
			var etime=this.context.mainpicker.getrealenddate();
			var fromdate=this.timeformat(btime);
			var enddate=this.timeformat(etime);
			var innid=this.context.roomtype.attr("innid");
			if(M.isEmpty(innid)){
				return;
			}
			if(M.isEmpty(fromdate)){
				return;
			}
			if(M.isEmpty(enddate)){
				return;
			}
			M._getjson("ajax2.php", { "a": "getallrooms","innid":innid,"fromdate":fromdate,"enddate":enddate},this._getallrooms_finished.toEventHandler(this));
		},

		_getallrooms_finished:function(d){
			if(d.status=='success'){
				var list=this.context.pickerarea.children("table").children("tbody").children("tr").children("td[tag=day]");
				var that = this;

				list.each(function(){
					var tpl=$(this);
					var target_i = tpl.parent().attr('i');
					var target_idx = tpl.attr("idx");
					var data2 = that.transform.getdata_bycoordinate(target_i,target_idx,null);
					var sta=$(this).attr("sta");
					var rtid = d.roomlist[data2.roomid]['roomtypeid'];
					showmsg = d.roomlist[data2.roomid]['roomtypename']+"-"+d.roomlist[data2.roomid]['roomname']+",¥"+d.pricelist[rtid][data2.date]['price'];
					$(this).attr("msg",showmsg);
					if(M.isEmpty(sta)||sta=="unordered"){
						if(that.inf.ov=='1'&&that.inf.tp=='1'){
							tpl.children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:showmsg,show:{delay:100}});
						}
					}

				});
			}
		},
		print_array:function(arr){
			for(var key in arr){
				if(typeof(arr[key])=='array'||typeof(arr[key])=='object'){//递归调用
					print_array(arr[key]);
				}else{
					document.write(key + ' = ' + arr[key] + '<br>');
				}
			}
		},

		sortorders:function(){
			if(this.ordermanage!=1){
				var tpl=this.context.pickerarea.children("table").children("tbody").children("tr");
				tpl.children("td").children("div").children("div").children().removeClass("sortorder");
				return;
			}
			var tpl=this.context.pickerarea.children("table").children("tbody").children("tr");
			tpl.children("td[sta=checkedout]").children("div").children("div").children().removeClass("sortorder");
			//tpl.children("td").children("div[from=elong]").children("div").children().removeClass("sortorder");
			tpl.children("td[tag=day]").children().sortable({ connectWith: "div",
				handle: ".sortorder",
				tolerance: "pointer",
				disabled:false,
				//revert:true,
				receive:this.receive_handle.toEventHandler(this),
				start:this.start_handle.toEventHandler(this),stop:this.stop_handle.toEventHandler(this)}).disableSelection();

		},
		disablesortorders:function(){
			var tpl=this.context.pickerarea.children("table").children("tbody").children("tr");
			tpl.children("td").children().sortable({ disabled: true });
		},
		//换房
		receive_handle:function(event,ui){
			var target=$(event.target);
			var mappingg = this.context.page.children('div[tag=prev]').attr('val');
			var hotelf = this.context.page.children('div[tag=prev]').attr('hot');

			target.removeClass("date-day").addClass("date-have");
			var pretd_idx=this.sorttable.pretd_idx;
			var pretr_i=this.sorttable.pretr_i;
			var target_sta=target.parent().attr("sta");
			var target_setid=target.parent().attr("setid");
			this.sorttable.target_setid=target_setid;
			this.sorttable.target_sta=target_sta;
			var from=target.attr("from");

			var rid = this.context.roomlist.find('tbody').children('tr').children('td').attr('rid');
//	    var data={"a":"mapping","rid":rid,"hotelf":hotelf};
//	    M._getjson("/ajax.php", data,this.mappingroom.toEventHandler(this));

			if(this.sorttable.sta=='checkedout'||target_sta=='checkedout'){
				if(this.inf.ov=='1'&&this.inf.tp=='1'){
					this.sorttable.pre_tpl.tooltip({ disabled: false });
				}
				M.error("已退房的订单不允许换房");
				this.context.pickerarea.children("table").children("tbody").children("tr").children("td[tag=day]").children().sortable( "cancel" );
			}else{
				canshifted=this.canshifted(target,this.sorttable.pre_rows);
				if(canshifted){
					var length=target.children("div").length;
					if(length>1){
						if(!M.isEmpty(this.sorttable.oid)){
							var tpl=target.children().not("div[oid="+this.sorttable.oid+"]");
						}else{
							var tpl=target.children().not("div[cid="+this.sorttable.cid+"]");
						}
						var rows=target.parent().attr("n");
						this.sorttable.target_rows=rows;
						if(rows>this.sorttable.pre_rows){
							var pre_target=this.context.pickerarea.children("table").children("tbody").children("tr[i="+pretr_i+"]").children("td[idx="+pretd_idx+"]").children("div");
							canshifted=this.canshifted(pre_target,rows);
						}else{
							canshifted=true;
						}
					}
				}
				if(canshifted){
					if(!M.isEmpty(this.sorttable.oid)){
						var tpl=target.children().not("div[oid="+this.sorttable.oid+"]");
						target.children().not("div[oid="+this.sorttable.oid+"]").remove();
					}else{
						var tpl=target.children().not("div[cid="+this.sorttable.cid+"]");
						target.children().not("div[cid="+this.sorttable.cid+"]").remove();
					}
					var pre_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+pretr_i+"]").children("td[idx="+pretd_idx+"]");
					if(!M.isEmpty(target_setid)){
						pre_tpl.children().removeClass("date-day").addClass("date-have").html(tpl);
						this.sorttable.target_tpl=tpl;
						var target_id=tpl.attr("oid");
						if(M.isEmpty(target_id)){
							target_id=tpl.attr("cid");
						}
						this.sorttable.target_id=target_id;
					}
					var target_idx=target.parent().attr("idx");
					var target_i=target.parent().parent().attr("i");
					this.sorttable.target_i=target_i;
					this.sorttable.target_idx=target_idx;
					var msg="是否进行换房";
					M.confirm(msg,this.save_moveorders.toEventHandler(this),this.cancle_moveorders.toEventHandler(this));

				}else{
					if(this.inf.ov=='1'&&this.inf.tp=='1'){
						this.sorttable.pre_tpl.tooltip({ disabled: false });
					}
					this.context.pickerarea.children("table").children("tbody").children("tr").children("td[tag=day]").children().sortable( "cancel" );
					M.error("剩余房间不够");
				}
			}

		},
//	mappingroom:function(d){
//		var aa = d.temp;
//		var roomname = d.roomname;
//		if(aa == 1){
//			M.error('对不起，'+roomname+'已经关联了艺龙/携程/去哪儿，不能删除，请先解除该房间与艺龙/携程/去哪儿的关联，再进行删除操作。');
//		}
//	},
		save_moveorders:function(){
			this.disablesortorders();
			M.closeMessage();
			this.context.submitlayer.show();
			if(M.isEmpty(this.sorttable.oid)){
				var orderid=this.sorttable.cid;
			}else{
				var orderid=this.sorttable.oid;
			}
			var data={"a":"moveorder","orderid":orderid,"ordertype":this.sorttable.sta};
			var target_idx=this.sorttable.target_idx;
			var target_i=this.sorttable.target_i;
			var target_setid=this.sorttable.target_setid;
			var target_tpl=this.sorttable.target_tpl;
			if(!M.isEmpty(target_setid)){
				data.torderid=this.sorttable.target_id;
				data.tordertype=this.sorttable.target_sta;
			}else{
				var coordinatedata=this.transform.getdata_bycoordinate(target_i,target_idx,'');
				var roomid=coordinatedata.roomid;
				var date=coordinatedata.date;
				data.roomid=roomid;
				data.fromdate=date;
			}
			M._getjson("/ajax.php", data,this.shiftedorders_finished.toEventHandler(this));
		},
		cancle_moveorders:function(){
			M.closeMessage();
			this.revert_orders();
			M.success("操作已取消");
			this.sortorders();
		},
		revert_orders:function(){
			var target_id=this.sorttable.target_id;
			if(!M.isEmpty(target_id)){
				var target=this.context.pickerarea.children("table").children("tbody").children("tr[i="+this.sorttable.target_i+"]").children("td[tag=day][idx="+this.sorttable.target_idx+"]");
				target.children("div").html(this.sorttable.target_tpl);
				var target_key=target_id+this.sorttable.target_sta;
				var target_htm=this.tooltipmsg[target_key];
				target.children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:target_htm,show:{duration:100}});
			}
			var pre=this.context.pickerarea.children("table").children("tbody").children("tr[i="+this.sorttable.pretr_i+"]").children("td[tag=day][idx="+this.sorttable.pretd_idx+"]");
			pre.children("div").html(this.sorttable.pre_tpl);
			var id=M.isEmpty(this.sorttable.cid)?this.sorttable.oid:this.sorttable.cid;
			var key=id+this.sorttable.sta;
			var showmsg=this.tooltipmsg[key];
			pre.children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:showmsg,show:{duration:100}});

		},
		shiftedorders_finished:function(d){
			this.context.submitlayer.hide();
			if(d.status=='success'){
				M.success("操作成功");
				var length=this.sorttable.pre_rows;
				if(typeof(this.sorttable.target_rows)!='undefined'&&this.sorttable.target_rows>length){
					length=this.sorttable.target_rows;
				}
				this.clearitem(this.sorttable.target_idx,this.sorttable.target_i,length);
				this.clearitem(this.sorttable.pretd_idx,this.sorttable.pretr_i,length);
				var pre_data=d.before;
				var current_data=d.after;
				var itemdate=this._getitemdate();
				this._showitem(current_data, itemdate);
				if(!M.isEmpty(d.targetbefore)){
					var targetbefor=d.targetbefore;
					var targetafter=d.targetafter;
					this._showitem(targetafter, itemdate);
				}
				this.calc_leftrooms();
			}else{
				if(M.isEmpty(d.msg)){
					d.msg='操作失败';
				}
				M.error(d.msg);
				this.revert_orders();
			}
			this.sortorders();
			this.getallrooms();
			this.transform.win_resize();
		},
		clearitem:function(col,row,length){
			this.transform.clearitem(col,row,length);
			this.init_datepickerevent();
			this.sortorders();

		},
		canshifted:function(ele,rows){
			return this.transform.canshiftedorders(ele,rows,this.sorttable);
		},
		start_handle:function(event){
			this.sorttable={};
			this._clear_jumpselected();
			var tpl=$(event.target);
			this.sorttable.tpl=tpl.children().clone();
			var td_idx=tpl.parent().attr("idx");
			var tr_i=tpl.parent().parent().attr("i");
			var sta=tpl.parent().attr("sta");
			var setid=tpl.parent().attr("setid");
			var oid=tpl.children("div").attr("oid");
			var cid=tpl.children("div").attr("cid");
			var orderfrom=tpl.attr("from");
			var rows=tpl.parent().attr("n");
			this.sorttable.pre_tpl=tpl.children();
			//this.context.pickerarea.children("table").children("tbody").children("tr").children("td").children().children().tooltip({ disabled: true });
			tpl.children().tooltip({ disabled: true });
			this.sorttable.orderfrom=orderfrom;
			this.sorttable.oid=oid;
			this.sorttable.cid=cid;
			this.sorttable.setid=setid;
			this.sorttable.sta=sta;
			this.sorttable.pre_rows=rows;
			this.sorttable.pretd_idx=td_idx;
			this.sorttable.pretr_i=tr_i;

		},
		stop_handle:function(){
			if(M.isEmpty(this.sorttable.target_i)&&M.isEmpty(this.sorttable.target_idx)){
				var pre=this.context.pickerarea.children("table").children("tbody").children("tr[i="+this.sorttable.pretr_i+"]").children("td[idx="+this.sorttable.pretd_idx+"]");
				pre.children("div").children("div").tooltip({ disabled: false });

			}
		},
		getrows:function(ele,type){
			var oneheight=$(".date-day").css("height").replace("px","");
			var height=ele.css("height").replace("px","");
			var rows=Math.ceil(height/oneheight);
			return rows;
		},
		sorttable_receive:function(event){
			var tpl=$(event.target);
		},
		checkmaxi:function(idx,i){
			if(idx==this.sorttable.pretd_idx){
				var maxi=this.sorttable.pre_rows*1+this.sorttable.pretr_i*1-1;
				if(i>maxi){
					return false;
				}else{
					return true;
				}
			}else{

			}return false;

		} ,

		_clearitem:function(row,cols)
		{
			var target=this._getpickercell(row,cols);
			var datehave=target.children(".date-have");
			var n=datehave.attr("n");
			var nights=parseInt(n);

			if(!M.isEmpty(target))
			{
				var datehave=target.children(".date-have");
				if(datehave.length>0)
				{
					var n=datehave.attr("n");
					var nights=parseInt(n);

					var html='<div class="date-day"></div>';
					target.html(html);
					target.attr("sta","").attr("setid","");
					for(var j=0;j<nights-1;j++)
					{
						/*纵向查找*/
						target = target.parent().next().children("td[idx="+cols+"]");
						target.html(html).attr("sta", "");
					}
					this.init_datepickerevent();
				}
			}
			this.sortorders();
		},
		_clearitembyset:function(setid,type)
		{
			if(M.isEmpty(type))type="ordered";
			var targets=this._getpickercells(setid,type);
			this.transform._clearitembyset(targets,type);
			this.sortorders();
			this.init_datepickerevent();
		},
		_showitems:function(items)
		{
			var itemdate=this._getitemdate();
			if(!M.isEmpty(items))
			{
				for(var i=0;i<items.length;i++)
				{
					this._showitem(items[i],itemdate);
				}
			}
		},
		_showitem:function(item,itemdate)
		{
			var statuscss={"checkedin":"date-day-checkedin","checkedout":"date-day-checkedout","ordered":"date-day-ordered"};

			var tpl_divinfo=$.template(null,this.tpl_divinfo);
			var tpl_otherinfo=$.template(null,this.tpl_otherinfo);

			var tpl_nopay=this.tpl_nopay;
			var tpl_car=this.tpl_car;
			var tpl_checkedin=this.tpl_checkedin;

			var type = item.type;
			var d = item.d;

			var roomid = item.roomid;
			var nights=parseInt(item.nights);
			var arrivetime=item.arrivetime;
			if(!M.isEmpty(arrivetime))
			{
				arrivetime=this.arrivetimedata[arrivetime];
			}
			var coordinate=this.transform.getcoordinate_bydata(d,roomid,'');
			var row =  coordinate.date_i;
			var cols = coordinate.roomid_idx;
			var cols=M.isEmpty(cols)?-1:parseInt(cols);



			var d_date=M.strtotime(d);
			var e_date=new Date(d_date.getFullYear(),d_date.getMonth(), d_date.getDate()+parseInt(nights));
			var e_datestr=this.timeformat(e_date);

			var e_date_yes=new Date(d_date.getFullYear(),d_date.getMonth(), d_date.getDate()+parseInt(nights)-1);
			var hidedays=0;

			var isdaybeforeyes=false;
			if(e_datestr==itemdate.pickerbegindatestr&&type=="checkedout")/*昨天退房才显示*/
			{

			}
			if(d_date<itemdate.pickerbegindate)
			{
				if(isdaybeforeyes)
				{
					row=0;
					nights=1;
				}
				else
				{
					if(this.transform.isreverse==1){
						cols=itemdate.pickerbegincolindex;
					}else{
						row=itemdate.pickerbegincolindex;
					}

					var date=M.strtotimeSetDefaultHour(d);
					var ts=itemdate.nowtime-date;
					var days=Math.floor(ts/(24*3600*1000));
					hidedays=days;
					nights=nights-days;
				}
				if(nights<=0)
				{
					return;
				}
			}

			if(e_date_yes>itemdate.pickerenddate)
			{
				//重新计算nights
				//console.log('fromdate:'+this.timeformat(d_date)+',edate-yes:'+this.timeformat(e_date_yes)+',pickerenddate:'+this.timeformat(itemdate.pickerenddate));
				var ts=e_date_yes-itemdate.pickerenddate;
				var days=Math.floor(ts/(24*3600*1000));
				hidedays=days;
				nights=nights-days;
				//console.log('>days:'+hidedays+"=>"+nights);
			}

			if(isNaN(row)||isNaN(cols)){
				return;
			}
			row=parseInt(row);
			cols=parseInt(cols);
			if(row<0||cols<0){
				return;
			}

			var target = this._getpickercell(row, cols);
			if(target.attr('ut')==item.updateon)
			{
				//return;
			}
			if(nights==0)
			{
				return;
			}

			var width=nights*81-6;
			var height=nights*36-5;
			var guestname=item.guestname;
			var channelname=this.channelname[item.channelcode];
			channelname=M.isEmpty(channelname)?item.channelname:channelname;
			var setid=item.setid=="0"?"":item.setid;
			var arrivedate=this.timeformat(d_date,"m/d");

			//var cartype=type=="ordered"?"接":"送";
			var needcar="";
			if(type=="ordered")
			{
				needcar=item.needcar;
			}
			else
			{
				needcar=item.needcar2;
			}

			var oid = type=="ordered"?item.id:"";
			var cid = type=="checkedin"||type=="checkedout"?item.id:"";

			var css=statuscss[type];
			css=M.isEmpty(css)?"date-day-ordered":css;
			if(!M.isEmpty(item.style))
			{
				css+= " "+item.style;
			}
			if(hidedays>0)
			{
				css+=" date-day-exceptive";
			}


			var info={"css":css,"height":height,"width":width,"guestname":guestname,"channel":channelname,"need":needcar,"arrivedate":arrivedate,"nights":parseInt(item.nights)};
			var divinfo=$.tmpl(tpl_divinfo, info);
			if(nights>1)
			{
				//显示日期和几晚
				if(this.transform.isreverse!=1){
					divinfo.children("div").append($.tmpl(tpl_otherinfo,info));
				}
			}
			var amount=parseInt(item.deposit);
			if(!M.isEmpty(item.appendmoney)){
				amount=parseInt(item.appendmoney)+parseInt(item.deposit);
			}
			if(item.paystatus==1){
				amount=item.totalprice;
			}

			//需要车
			if(needcar=="1"&&item.type!="checkedout")
			{
				divinfo.children("div").children(".demand").append($(tpl_car));
			}
			if(amount<=0)
			{
				divinfo.children("div").children(".demand").append($(tpl_nopay));
			}


			//显示日期和几晚
			//if((item.type=="ordered"&&item.paystatus=="0")||(item.type=="checkedin"&&item.appendmoney<=0))
			//{
			//		divinfo.children("div").children(".demand").append($(tpl_nopay));
			// }

			if(item.type=='checkedin'){
				divinfo.children("div").children(".demand").after($(tpl_checkedin));
			}
			tpl_checkedout=this.tpl_checkout;
			if(item.type=='checkedout'){
				divinfo.children("div").children(".demand").after($(tpl_checkedout));
			}

			target.html("").append(divinfo);
			divinfo.attr("sta", type).attr("oid", oid).attr("from",item.orderfrom).attr("cid", cid).attr("gid",item.gid).attr("rid",roomid).attr("n",nights).attr("hidedays",hidedays).attr("setid",setid);
			divinfo.children("div").attr("oid", oid).attr("cid", cid).attr("setid",setid);
			if(this.inf.ov=='1'&&this.inf.tp=='1')
			{
				var showmsg=this._showtip(item);
				var key_tip=item.id+item.type;
				this.tooltipmsg[key_tip]=showmsg;
				divinfo.children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:showmsg,show:{duration:100}});//;			
			}
			target.attr("sta", type);
			target.attr("n",nights);
			target.attr("hidedays",hidedays);
			target.attr("setid",setid);
			this.transform.changeorderstatus_moredays(target,nights,type,cols);
			var orderwidth=this.transform.getorderwidth();
			if(orderwidth!=0&&!M.isEmpty(orderwidth)){
				target.children("div").css("width",orderwidth+'px');
			}
			if(this.canmoveorder==1){
				var move_tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+row+"]").children("td[idx="+cols+"]");
				this.sortorders();
			}
		},
		_showtip:function(item){
			var html='';
			var indatetime= M.strtotime(item.indate);
			var inday=M.timeformat(indatetime,'m/d');
			var roomtype=this.context.roomlist.children("tbody").children("tr").children("td[rid="+item.roomid+"]").children("div").attr('title');
			var amount=parseInt(item.deposit);
			if(!M.isEmpty(item.appendmoney)){
				amount=parseInt(item.appendmoney)+parseInt(item.deposit);
			}
			if(item.type!='ordered'){
				if(!M.isEmpty(item.checkoutappendmoney)){
					amount=amount+parseInt(item.checkoutappendmoney);
				}
				if(!M.isEmpty(item.returnmoney)){
					amount=amount-parseInt(item.returnmoney);
				}
			}
			if(item.paystatus==1){
				if(M.isEmpty(amount)||amount==0){
					amount=item.totalprice;
				}

			}

			if(item.type=='checkedout'){
				html+='<p>'+item.guestname+'&lt;'+item.channelname+'&gt'+item.phone+'<br />';
				indatetime.setDate(indatetime.getDate()+item.nights*1);
				endday=M.timeformat(indatetime,'m/d');
				html+=item.roomname+"("+item.roomtypename+")，";
				if(item.nights=='1'){
					html+=inday+'，住'+item.nights+'晚，已退房<br />';
				}else{
					html+=inday+'-'+endday+'，住'+item.nights+'晚，已退房<br />';
				}
				if(!M.isEmpty(amount)&&amount!=0){
					html+='已收房费¥'+amount;
				}else{
					html+='未付款';
				}
				if(item.paystatus=='3'){
					var vouchmsg="已担保";
				}
				var vouchmsg='';
				if(item.paystatus=='3'){
					vouchmsg="，已担保";
				}
				html+='，订单金额¥'+item.totalprice+vouchmsg+'<br />';
				if(item.remark!=='')
					html+=item.remark;
				html+='</p>';
			}else if(item.type=='checkedin'){
				html+='<p>'+item.guestname+'&lt;'+item.channelname+'&gt;'+item.phone+'<br />';
				html+=item.roomname+"("+item.roomtypename+")，";
				html+=inday+'入住，住'+item.nights+'晚，已入住<br />';
				if(!M.isEmpty(amount)&&amount!=0){
					html+='已收房费¥'+amount;
				}else{
					html+='未付款';
				}
				if(!M.isEmpty(item.realdeposit)){
					html+='，押金¥'+item.realdeposit;
				}
				var vouchmsg='';
				if(item.paystatus=='3'){
					vouchmsg="，已担保";
				}
				html+='，订单金额¥'+item.totalprice+vouchmsg+'<br />';
				if(item.needcar2=='1')
					html+='需要车送<br />';
				if(item.remark!=='')
					html+=item.remark;
				html+='</p>';
			}else if(item.type=='ordered'){
				html+='<p>'+item.guestname+'&lt;'+item.channelname+'&gt;'+item.phone+'<br />';
				html+=item.roomname+"("+item.roomtypename+")，";
				html+=inday+'入住，住'+item.nights+'晚，未入住<br />';
				if(!M.isEmpty(amount)&&amount!=0){
					html+='已收房费¥'+amount;
				}else{
					html+='未付款';
				}
				if(!M.isEmpty(item.realdeposit)&&item.realdeposit!=0){
					html+='，押金¥'+item.realdeposit;
				}
				var vouchmsg='';
				if(item.paystatus=='3'){
					vouchmsg="，已担保";
				}
				html+='，订单金额¥'+item.totalprice+vouchmsg+'<br />';
				if(item.needcar=='1')
					html+='需要车接<br />';
				if(item.remark!=='')
					html+=item.remark;
				html+='</p>';
			}
			return html;

		},
		_getitemdate:function()
		{
			var now_str=this.timeformat(this.getdatetime());
			var now_h=this.getdatetime().getHours();

			var pickerbegindate=this.context.mainpicker.getbegindate();
			var pickerenddate=this.context.mainpicker.getenddate();

			var daybeforeyes=new Date(pickerbegindate.getFullYear(),pickerbegindate.getMonth(), pickerbegindate.getDate()-1);
			var pickerbegindate_str=this.timeformat(pickerbegindate);
			var pickerenddate_str=this.timeformat(pickerenddate);

			var nowtime=M.strtotimeSetDefaultHour(pickerbegindate_str);
			var pickerbegincolindex=this.context.mainpicker.getbeginindex();
			return {"nowstr":now_str,
				"nowh":now_h,
				"pickerbegindate":pickerbegindate,
				"pickerbegindatestr":pickerbegindate_str,
				"pickerenddate":pickerenddate,
				"pickerenddatestr":pickerenddate_str,
				"nowtime":nowtime,
				"daybeforeyes":daybeforeyes,
				"pickerbegincolindex":pickerbegincolindex};
		},
		initpickerstatus:function(){
			if (this.roomstatus == undefined || this.roomstatus == null) return;
			var tempgid = null;
			var tempoid=null;

			var itemdate=this._getitemdate();
			for (var i = 0; i < this.roomstatus.length; i++) {
				var item = this.roomstatus[i];
				this._showitem(item,itemdate);
			}
			this.calc_leftrooms();
			this.transform.win_resize();
		},
		calc_leftrooms:function()
		{
			this.transform.resetroomamount_remain();
		},
		datepicker_headerconverter: function (name)
		{
			return '<div class="week-desc">'+name+'</div>';
		},
		datepicker_convert: function (date)
		{
			if (date==undefined||date == null||true) {
				return '<div class="date-day">&nbsp;</div>';
			}
			var time = "" + date.getFullYear() + "-" + this.zerosize(date.getMonth() + 1+"",2) + "-" +  this.zerosize(date.getDate()+"",2);
			var templ = ' <div class="date-day" time="' + time + '"></div>';
			return templ;
		},

		datepicker_click: function (e) {
			var ele = M.EventEle(e);
			var tdele = ele.parents("td");
			var t = tdele.attr("tag");
			this.transform.selectedreset();

			if (t == "day") {
				var target = tdele.parents("table").find(".tdon");
				var sta = tdele.attr("sta");

				var datehave = tdele.children(".date-have");
				if(datehave.length>0)
				{
					sta=datehave.attr("sta");
				}
				var ov=this.context.roomtype.attr("orderview");
				if(ov!=1){
					this.auth_failed();
					return;
				}
				if (sta == "ordered") {
					if(this.inf.ov!='1')
					{
						this.auth_failed();
						return;
					}
					/*是否可以checkin*/
					this._doeditorder(tdele);
					this._clear_jumpselected();
				}
				else if (sta == "checkedin") {
					if(this.inf.ov!='1')
					{
						this.auth_failed();
						return;
					}
					this._checkinoption(tdele);
					this._clear_jumpselected();
				}
				else if (sta == "checkedout") {
					/*查看订单信息*/
					if(this.inf.ov!='1')
					{
						this.auth_failed();
						return;
					}
					this._checkinoption(tdele);
					this._clear_jumpselected();
				}
				else
				{
					if(this.jumpauth==1){
						var order=ele.attr("order");
						if(order=='1'){
							var om=this.context.roomtype.attr("ordermanage");

							if(om=="1"){
								this._jump_doorder();
							}
						}else{
							this._jump_selected(tdele);
						}
					}else{
						var om=this.context.roomtype.attr("ordermanage");
						/*是否可以下订单*/
						if(om=="1")
						{
							this._doorder(tdele);
						}
					}
				}
			}
			if(t=='c'){
				var rtid=tdele.attr("rtid");
				this.context.roomlist.find("tr[tag=roomtypes]").find("td[tag=roomtype][rtid="+rtid+"]").click();
			}
			if(t=='total'){
				var type=tdele.attr("t");
				if(type=='w'){
					this.waterstaticsdetail(tdele);
				}
				if(type=="f"){
					this.roomratedetail(tdele);
				}
			}
		},
		_clear_jumpselected:function(){
			this.jump_order={roomlist:[],daylist:[],datelist:[]};
			var tpl=this.context.pickerarea.children("table").children("tbody").children().find(".td-selected");
			tpl.removeClass("td-selected");
			tpl.children("div").children("a[class=day-selected]").remove();
			this.context.pickerarea.children("table").children("tbody").children().find("a[class=day-selected]").remove();
		},
		_jump_selected:function(ele){
			var style=ele.attr("class");
			var idx=ele.attr('idx');
			var i=ele.parent().attr("i");

			if(typeof(style)!='undefined'&&style.indexOf('td-selected')>=0){
				ele.removeClass("td-selected");
				var daylist=this.jump_order.daylist;
				this.jump_order.daylist=[];
				for(var k=0;k<daylist.length;k++){
					var data=daylist[k];
					if(data.num!=i||data.idx!=idx){
						if(!this.in_array({"idx":idx,"num":i}, this.jump_order.daylist)){
							this.jump_order.daylist.push(data);
						}

					}
				}
				var order=ele.children("div").children("a").attr("order");
				if(!M.isEmpty(order)){
					if(this.jump_order.daylist.length>0){
						var key=this.jump_order.daylist.length-1;
						var select_i=this.jump_order.daylist[key].num;
						var select_idx=this.jump_order.daylist[key].idx;
						var tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+select_i+"]").children("td[idx="+select_idx+"]");
						tpl.children("div").append('<a order="1" href="javascript:;" class="day-selected" tag="day"></a>');
					}
					ele.children("div").children("a[class=day-selected]").remove();
				}

			}else{
				var checkmaxnights=this.transform.checkmaxnights(idx,i);
//				if(parseInt(checkmaxnights)>=30){
//					M.error("每个房间最多只能定30晚");
//					return false;
//				}
				if(parseInt(checkmaxnights)>=400){
					M.error("每个房间最多只能定400晚");
					return false;
				}
				this.context.pickerarea.children("table").children("tbody").children().find("a[class=day-selected]").remove();
				ele.children("div").append('<a href="javascript:;" order="1" class="day-selected" tag="day"></a>');
				ele.addClass("td-selected");
				if(!this.in_array(idx, this.jump_order.roomlist)){
					this.jump_order.roomlist.push(idx);
				}
				if(!this.in_array(i, this.jump_order.datelist)){
					this.jump_order.datelist.push(i);
				}
				if(!this.in_array({"idx":idx,"num":i}, this.jump_order.daylist)){
					this.jump_order.daylist.push({"idx":idx,"num":i});
				}
			}

		},
		in_array:function(needle, haystack){
			for (key in haystack) {
				if (haystack[key] == needle) {
					return true;
				}
			}
			return false;
		},
		_jump_getdata:function(){
			var orderdata=[];
			var roomlist=this.jump_order.roomlist;
			var datelist=this.jump_order.datelist;
			orderdata=this.transform.getjumpselected_data(roomlist,datelist,orderdata);
			return orderdata;
		},
		_jump_doorder:function(){
			var weekofday = { "0": "周日", "1": "周一", "2": "周二", "3": "周三", "4": "周四", "5": "周五", "6": "周六" };
			this.temporderdetail=null;
			this.tempcheckdetail=null;
			var data=this._jump_getdata();
			this._clearorderform();
			var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");
			var tpl=orderroomlist.children("div[tag=order]:first");

			var earliest_i=0,earliest_idx=0;
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					if(i>0){
						var ordertpl=tpl.clone(true).attr("i",i);

						orderroomlist.children("div[tag=orderinfo]").before(ordertpl);
					}
					var tr_i=data[i].start_i;
					var nights=data[i].nights;
					var idx=data[i].idx;
					if(this.transform.isreverse==1){
						if(idx*1<earliest_idx*1||i==0){
							earliest_i=tr_i;
							earliest_idx=idx;
						}
					}else{
						if(tr_i*1<earliest_i*1||i==0){
							earliest_i=tr_i;
							earliest_idx=idx;
						}
					}
					var coordinate=this.transform.getdata_bycoordinate(tr_i,idx);
					var time=coordinate.date;
					var roomid=coordinate.roomid;
					var arrivedate = M.strtotimeSetDefaultHour(time);
					var arrivedateStr=this.timeformat(arrivedate);
					var dateoptions=this._generateorderdates(arrivedate);
					var order_tpl=orderroomlist.children("div[tag=order][i="+i+"]");
					order_tpl.find("div[tag=room]").attr("roomid",roomid);
					order_tpl.find("div[tag=nights]").attr("nights",nights);
					order_tpl.find("div[id=selectNights]").attr("value",nights);
					order_tpl.find("div[id=selectDay]").attr("value",arrivedateStr);
					order_tpl.find("div[id=selectRoom]").attr("value",roomid).children("span").attr("value",roomid);
					order_tpl.find("div[tag=checkindate]").html(dateoptions.options).val(time);
					this._getavailablerooms("addorder",arrivedateStr,i,"");

				}
				this.orderroomtpl_change(orderroomlist);
			}
			var tdele=this.context.pickerarea.children("table").children("tbody").children("tr[i="+earliest_i+"]").children("td[idx="+earliest_idx+"]");
			var todayrdx = this.context.pickerdate.find("td[class=today]").parent().attr("i");
			if(!todayrdx){
				todayrdx = this.context.pickerdate.find("td[class=today]").attr("i");
			}
			var rdx = tdele.parent().attr("i");
			var ishis=false;
			var datetomorrow=this._gettimetomorrow(tdele);
			var now=this.getdatetime();
			if (now>=datetomorrow) {
				ishis=true;
			}
			var coordinate=this.transform.getdata_bycoordinate(earliest_i,earliest_idx);
			var arrivedate=coordinate.date;
			arrivedate_time=M.strtotime(arrivedate);
			var cancheckin=this._checkinable(arrivedate_time);
			var paytype='alipay';
			var paytype_tpl=this.context.orderformbody.children("li[tag=paytype]");

			if(cancheckin)//2
			{
				var paytype='cash';
				paytype_tpl.find("div[tag=depositform]").show();
				this.context.orderformbody.children("li[tag=idcard]").show();
				this.context.dtpayBox.addClass("ip-right");
				this.context.orderandcheckinbtn.show().attr("cancheckin","1");
				this.context.orderformbody.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付房费：");
			}
			else
			{
				paytype_tpl.find("div[tag=depositform]").hide();
				this.context.multiguesttip.hide();
				this.context.orderformbody.children("li[tag=idcard]").hide();
				this.context.rmpayBox.addClass("ip-right");
				this.context.orderandcheckinbtn.hide().attr("cancheckin","0");
				this.context.orderformbody.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付定金：");
			}

			if(ishis)
			{
				//补录订单
				var paytype='cash';
				this.context.orderandcheckinbtn.hide();

				this.context.dtpayBox.removeClass("").addClass("ip-dropdown ip-right");

				this.context.o_needcar.attr("checked",false).parent().hide();
				//this.context.o_paystatus.hide();

				this.context.ordercell.attr("action","hisadd");
				this.context.orderform.children("div[tag=head]").children("h4").attr("type","bulu").html("补录订单");
				this.context.orderform.children(".modal-footer").children("a[tag=suborder]").html("补录订单").attr("text","补录订单");

				//设置默认订单颜色
				var obj = this.context.orderformbody.children("li[tag=channel]").children().find("div[id=o_channel]").children("div:first").children("a").attr("color");
				if(obj == ''){
					obj = "ofreshgreen";
				}
				this.context.ordercell.attr("color",obj);
				var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
				var selected = colorfield.find("div[tag=colorlist]").children("span[ison=1]");
				selected.attr('ison',"0");
				selected.attr("class",selected.attr("val"));

				var first=colorfield.find("div[tag=colorlist]").children("span[val="+obj+"]");
				first.attr("ison","1");
				first.attr("class",first.attr("val")+" checked");
				colorfield.find("div[tag=color]").children("span").attr("class",first.attr("val")+" checked");
			}
			else
			{
				//添加订单
				//this.context.orderandcheckinbtn.show();
				M.emptyVal(this.context.o_deposit);
				var date=M.timeformat(now,'Y-m-d');

				this.context.o_deposit.show();
				this.context.o_needcar.attr("checked",false).parent().show();
				this.context.o_paystatus.show();

				this.opaystatus_change();
				this.context.ordercell.attr("action","add");
				this.context.orderform.children("div[tag=head]").children("h4").html("预订");
				this.context.orderform.children(".modal-footer").children("a[tag=suborder]").html("提交订单").attr("text","提交订单");
				//设置默认订单颜色
				var obj = this.context.orderformbody.children("li[tag=channel]").children().find("div[id=o_channel]").children("div:first").children("a").attr("color");
				if(obj == ''){
					obj = "ofreshgreen";
				}
				this.context.ordercell.attr("color",obj);
				var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
				var selected = colorfield.find("div[tag=colorlist]").children("span[ison=1]");
				selected.attr('ison',"0");
				selected.attr("class",selected.attr("val"));

				var first=colorfield.find("div[tag=colorlist]").children("span[val="+obj+"]");
				first.attr("ison","1");
				first.attr("class",first.attr("val")+" checked");
				colorfield.find("div[tag=color]").children("span").attr("class",first.attr("val")+" checked");

			}
			// this.jump_order={};
			//下拉菜单
			//客源渠道
			var channel_tpl=this.context.orderformbody.children("li[tag=channel]").children("div");

			this.droplist.order.typedroplist=M.DropdownList(channel_tpl,this.channel_change.toEventHandler(this),{});

			//日期
			var date=coordinate.date;
			var datetime= M.strtotime(date);
			var name=M.timeformat(datetime,'m/d');
			var obj1=this.context.orderformbody.children("li[tag=orderroomlist]").children("div").children("div[id=selectDay]");
			this.droplist.order.daydroplist=M.DropdownList(obj1,this.orderdate_change.toEventHandler(this),{});
			//房费支付方式

			paytype_tpl.children("div[tag=paystatistics]").hide();
			var roomrate_tpl=paytype_tpl.find("div[t=roomrate]");
			roomrate_tpl.attr("value",paytype);
			this.droplist.order.paymentsdroplist=M.DropdownList(roomrate_tpl,null,{});
			//押金支付方式
			var deposit_tpl=paytype_tpl.find("div[t=deposit]");
			deposit_tpl.attr("value","cash");
			this.droplist.order.depositBoxdroplist=M.DropdownList(deposit_tpl,null,{});
			var idcard_tpl=this.context.orderformbody.children("li[tag=idcard]").children("div").children("div[t=idcardform]");
			if(idcard_tpl.length>0){
				this.droplist.order.idcard=M.DropdownList(idcard_tpl,null,{});
			}
			this.context.orderform.attr("orderstatus","order");
			M.Popup(this.context.orderform,{"hideclass":"bootbox modal fade","showclass":"bootbox modal fade in"},function(){
				this.context.o_guestname.focus();
			}.toEventHandler(this));

		},

		dis:function(){
			M.Popup(this.context.cashierdetailBox,{"hideclass":"modal fade","showclass":"modal fade in"});
			this.context.syt.hide();
		},
		_multiguesttip:function(){
			if(this.haspluginid==0){
				return;
			}
			var status=this.context.multiguesttip.attr("status");
			if(status==0){
				return;
			}
			var tip=this.context.orderformbody.children("li[tag=idcard]").children("div").children("a[tag=multiguest]");
			var offset=tip.offset();
			this.context.multiguesttip.show().css("top",offset.top-30).css("left",offset.left);
		},
		room_change:function(e){
			var val=this.context.droplist.val();
		},
		roomratedetail:function(ele){
			var day_i=ele.parent().attr("i");
			var type_i=ele.attr("idx");
			var coordinate=this.transform.getdata_bycoordinate(day_i,type_i);
			var day=coordinate.date;
			var innid=this.context.roomtype.attr("innid");
			var daytime= M.strtotime(day);
			var currentday=M.timeformat(daytime,'m/d');
			var innname=this.context.header.children("div[class=inn-name]").children("h1").text();
			this.context.roomratedetail.children().find("p[tag=title]").html(currentday+" &lt;"+innname+"&gt;");
			M._getjson("/ajax.php", {"a":"getroomratedetail","day":day,"innid":innid},this.roomratedetail_finished.toEventHandler(this));
			M.Popup(this.context.roomratedetail,{"hideclass":"modal sm fade","showclass":"modal sm fade in","dragable":true},function(){}.toEventHandler(this));

		},
		roomratedetail_finished:function(d){
			if(d.status=='success'){
				var day=d.req.day;
				var list=d.d.list;
				var tpl=$.tmpl(this.tpl_roomrate,list);
				this.context.roomratedetail.children().find("tbody[tag=roomratelist] tr:first").nextAll().remove();
				this.context.roomratedetail.children().find("tbody[tag=roomratelist]").append(tpl);

				var roomnum=this.transform.getroomnumbydate(day);
				var isreverse = this.context.page.attr('isreverse');
				if(isreverse==1){
					var length=this.context.roomlist.find("tbody").children("tr[tag=roomtype]").length;
				}else{
					var length=this.context.roomlist.find("tbody").children("tr").children("td[tag=roomtype]").length;
				}
//

				if(roomnum=='满房'){
					roomnum=0;
				}
				var html='订单金额合计'+d.d.total+'元，剩余'+roomnum+'间未订出（共'+length+'间房）';
				this.context.roomratedetail.children().find("p[tag=datastatistics]").html(html);
			}else{
				alert(d.msg);
			}

		},
		waterstaticsform_click:function(e){
			var ele = M.EventEle(e);
			var t=ele.attr("tag");
			if(t=='seltype'){
				this.context.watertypelist.toggle();
				var top = ele.offset().top+ ele.outerHeight()+ 2;
				var left = ele.offset().left;
				this.context.watertypelist.css({"top":top,"left":left,"z-index":1060});
				M.stopevent(e);
			}
			if(t=="closebtn"){
				this.context.watertypelist.css("display","none");
			}
			if(t=='add'){
				this.addwaterstatistic();
			}
		},
		addwaterstatistic:function(){
			var innid=this.context.roomtype.attr("innid");
			var day=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("day");
			var type=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("type");
			var msg='支出';
			if(type=='income'){
				type='1';
				msg='收入';
			}else if(type=='pay'){
				type='2';
			}

			var typeid=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("typeid");
			var typename=this.context.waterstaticsform.children().find("div[tag=seltype]").text();
			var money=M.getVal(this.context.waterstaticsform.children().find("input[name=money]"));
			var remark=M.getVal(this.context.waterstaticsform.children().find("textarea[name=remark]"));
			var data={"a":"addwaterstatistics","innid":innid,"day":day,"typeid":typeid,"type":type,"typename":typename,"money":money,"remark":remark};
			if(M.isEmpty(data.typeid))
			{
				alert("请选择"+msg+"项目");
				return;
			}
			if(isNaN(data.money)||data.money==0)
			{
				alert("请输入"+msg+"金额");
				return;
			}
			data.a='addwaterstatistics';
			M._getjson("/ajaxsetting2.php",data,
				this.savewaterform_finished.toEventHandler(this));
		},
		savewaterform_finished:function(d){
			if(d.status=="success"){
				var req=d.req;
				var day=req.day;
				var type=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("type");
				var coordinate=this.transform.getcoordinate_bydata(day,'',type);
				var i=coordinate.date_i;;
				var idx=coordinate.type_i;
				var tpl=this.context.pickerarea.children("table").children("tbody").children("tr[i="+i+"]").children("td[idx="+idx+"]").children("div");
				var total=tpl.text().replace("￥","").replace("-","");
				total=req.money*1+total*1;
				tpl.html("￥"+total);
				this.context.watertypelist.hide();
				M.CloseLast();
			}else{
				alert(d.msg);
			}
		},

		waterstaticsdetail:function(ele){

			var day_i=ele.parent().attr("i");
			var type_i=ele.attr("idx");
			var total=ele.children("div").html().replace("￥");
			if(M.isEmpty(total)||total=='-'){
				return;
			}
			var coordinatedata=this.transform.getdata_bycoordinate(day_i,type_i);
			var day=coordinatedata.date;
			var type=coordinatedata.type;
			if(type=='income'){
				var msg="收入";
			}else if(type=="pay"){
				msg="支出";
			}
			var daytime= M.strtotime(day);
			var currentday=M.timeformat(daytime,'m/d');
			var innid=this.context.roomtype.attr("innid");
			var innname=this.context.header.children("div[class=inn-name]").children("h1").text();
			//this.clearwaterform(msg);
			this.context.waterstaticsform.children("div").children("h4[tag=title]").html(currentday+" &lt;"+innname+"&gt; - 其他"+msg);
			this.context.waterstaticsform.children().find("span[tag=detail_title]").html("总计：");
			M._getjson("/ajax2.php", {"a":"getwaterstatisticsbytype","day":day,"innid":innid,"type":type},this.waterstaticsdetail_finished.toEventHandler(this));
			M.Popup(this.context.waterstaticsform,{"hideclass":"modal sm fade","showclass":"modal sm fade in","dragable":true,"drag":this.dragwaterstaticsform.toEventHandler(this)},function(){}.toEventHandler(this));
		},
		dragwaterstaticsform:function(){
			var display=this.context.watertypelist.css("display");
			var ele=this.context.waterstaticsform.children().find("div[tag=seltype]");
			if(display=="none"){
				return;
			}
			var top = ele.offset().top+ ele.outerHeight()+ 2;
			var left = ele.offset().left;
			this.context.watertypelist.css({"top":top,"left":left,"z-index":1060}).show() ;
			M.stopevent(ele);
		},
		waterstaticsdetail_finished:function(d){
			if(d.status=='success'){
				var html='';
				var list=d.d.list;
				var total=d.d.total;
				if(list.length>0){
					for(var i=0;i<list.length;i++){
						var item=list[i];
						html+='<li cid="'+item.id+'">'+item.typename+'￥'+item.money+'</li>';
					}
					this.context.waterstaticsform.children().find("ul[tag=waterlist]").html(html);
					var target=this.context.waterstaticsform.children().find("ul[tag=waterlist]");
					for(var k=0;k<list.length;k++){
						var item=list[k];
						if(!M.isEmpty(item.remark)){
							var tipmsg=item.remark;
							target.find("li[cid="+item.id+"]").attr("title", '').tooltip({position: { my: "left+15 top+20", at: "left bottom" }, track: 1, content: tipmsg, show: {duration: 100}});
						}
					}
					this.context.waterstaticsform.children().find("strong[tag=total]").html('￥'+total);
					this.context.waterstaticsform.children().find("div[tag=statisticsdata]").show();
				}else{
					this.context.waterstaticsform.children().find("div[tag=statisticsdata]").hide();
				}

			}
		},
		watertype_click:function(e){
			var ele=M.EventEle(e);
			var typeid=ele.attr("typeid");
			var typename=ele.text();
			this.context.waterstaticsform.children().find("div[tag=seltype]").attr("typeid",typeid).html(typename+'<span class="caret"></span>');
			this.context.watertypelist.hide();
		},
		getorderdate:function(item){
			var date=item['d'];
			if(M.isEmpty(date)){
				date=item['arrivedate'];
			}
			if(M.isEmpty(date)){
				date=item['checkindate'];
			}
			return date;
		},
		clearwaterform:function(msg){
			var day=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("day",'');
			var type=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("type",'');
			var typeid=this.context.waterstaticsform.children().find("div[tag=seltype]").attr("typeid",'');
			var typename=this.context.waterstaticsform.children().find("div[tag=seltype]").html('选择'+msg+'项目<span class="caret"></span>');
			var money=M.emptyVal(this.context.waterstaticsform.children().find("input[name=money]"));
			var remark=M.emptyVal(this.context.waterstaticsform.children().find("textarea[name=remark]"));

		},
		_getroom:function(roomid)
		{
			var ele = this.context.roomlist.children("tbody").find("tr>td[rid="+roomid+"]");
			var roomname=ele.text().trim();
			var rtid=ele.attr("rtid");
			var p=parseFloat(ele.attr("p"));
			var i=ele.attr("i");
			var room={"roomid":roomid,"roomname":roomname,"rtid":rtid,"p":p,"i":i};
			return room;
		},
		_getrooms:function(roomtpyeid)
		{
			var rooms=new Array();
			var roomlist=this.transform.getroomlistbyroomtype(roomtpyeid);
			roomlist.each(
				function(){
					var ele=$(this);
					var roomid=ele.attr("rid");
					var roomname=ele.text().trim();
					var rtid=ele.attr("rtid");
					var p=parseFloat(ele.attr("p"));
					var i=ele.attr("i");
					var room={"roomid":roomid,"roomname":roomname,"rtid":rtid,"p":p,"i":i};
					rooms.push(room);
				});
			return rooms;
		},
		_generateorderdates:function(fromdate)
		{
			/*生成日期5天，后五天*/
			var fromdatestr=this.timeformat(fromdate);
			var nfromdate=new Date(fromdate.getFullYear(),fromdate.getMonth(),fromdate.getDate()-this.orderdays);
			var begindate=this.timeformat(nfromdate);

			var options='<div style="max-height:170px; overflow-y:auto;">';
			for(var i=0;i<this.orderdays*2+1;i++)
			{
				var d=this.timeformat(nfromdate);
				var t=this.timeformat(nfromdate,"m/d");
				if(d==fromdatestr)
				{
					options+="<div value='"+d+"'><a href='javascript:;'>"+t+"入住</a></div>";
				}else{
					options+="<div value='"+d+"'><a href='javascript:;'>"+t+"</a></div>";
				}
				nfromdate.setDate(nfromdate.getDate()+1);
			}
			options+='</div>';
			var enddatestr=this.timeformat(nfromdate);
			return {"options":options,"fromdate":begindate,"enddate":enddatestr};
		},
		_doorder:function (tdele) {
			var weekofday = { "0": "周日", "1": "周一", "2": "周二", "3": "周三", "4": "周四", "5": "周五", "6": "周六" };
			this.temporderdetail=null;
			this.tempcheckdetail=null;
			var todayrdx = this.context.pickerdate.find("td[class=today]").parent().attr("i");
			if(!todayrdx){
				todayrdx = this.context.pickerdate.find("td[class=today]").attr("i");
			}
			var rdx = tdele.parent().attr("i");
			var idx = tdele.attr("idx");
			var coordinatedata=this.transform.getdata_bycoordinate(rdx,idx,'');
			//var timetd = this.context.pickerdate.children("table").children(":first").children()[rdx];
			var time = coordinatedata.date;
			this.context.orderform.attr("time", time);

			var arrivedate = M.strtotimeSetDefaultHour(time);
			var arrivedateStr=this.timeformat(arrivedate);

			//根据所选择日期判断是否选择的是过期日期
			var ishis=false;
			var datetomorrow=this._gettimetomorrow(tdele);
			var now=this.getdatetime();
			if (now>=datetomorrow) {
				ishis=true;
			}
			this._clearorderform();
			this.formatedateprice={};
			this.temporderdetail=null;
			this.tempcheckdetail=null;
			/*选中房间*/
			//var room=this.transform.getcellbycoordinate(rdx,idx);
			var coordinatedata=this.transform.getdata_bycoordinate(rdx,idx,'');
			var rid = coordinatedata.roomid;
			var rtid=coordinatedata.rtid;
			rid=M.isEmpty(rid)?"":rid;
			rtid=M.isEmpty(rtid)?"":rtid;
			/*设置日期选项*/
			var dateoptions=this._generateorderdates(arrivedate);

			this.context.o_channel.attr("disabled",false);
			this.context.o_paystatus.attr("disabled",false);
			var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");
			var firstorder=orderroomlist.children("div");
			var firstroomdates=firstorder.find("div[tag=checkindate]").html(dateoptions.options).attr("disabled",false).val(arrivedateStr);
			firstorder.find("div[tag=room]").attr("roomid",rid).attr("disabled",false);
			firstorder.find("div[id=selectDay]").attr("value",arrivedateStr);
			firstorder.find("div[id=selectRoom]").attr("value",rid);
			firstorder.find("div[id=selectNights]").attr("value",1);
			firstorder.find("div[tag=nights]").attr("disabled",false);
			var paytype_tpl=this.context.orderformbody.children("li[tag=paytype]");


			/*根据arrivedate获取可入住房间*/
			this._getavailablerooms("addorder",arrivedateStr,0,"");

			var today=this.getdatetime();
			var arrivedate_time=M.strtotimeSetDefaultHour(arrivedateStr);
			var cancheckin=this._checkinable(arrivedate_time);
			var paytype='alipay';

			if(cancheckin)
			{
				var paytype='cash';
				paytype_tpl.find("div[tag=depositform]").show();
				this.context.orderformbody.children("li[tag=idcard]").show();
				this.context.dtpayBox.addClass("ip-right");
				this.context.orderandcheckinbtn.show().attr("cancheckin","1");
				//this.context.orderformbody.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付房费：");

			}
			else
			{
				paytype_tpl.find("div[tag=depositform]").hide();
				this.context.orderformbody.children("li[tag=idcard]").hide();
				this.context.multiguesttip.hide();
				this.context.rmpayBox.addClass("ip-right");
				this.context.orderandcheckinbtn.hide().attr("cancheckin","0");
				// this.context.orderformbody.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付定金：");

			}


			this.context.ordercell.attr("row",rdx).attr("col",idx);
			/*获取价格*/
			/*清除缓存的价格*/
			var fromdate=dateoptions.fromdate;
			var enddate_time=M.strtotime(dateoptions.enddate);
			enddate_time.setDate(enddate_time.getDate()+this.maxnights);
			var enddate=this.timeformat(enddate_time);

			this.context.ordercell.attr("fromdate",fromdate).attr("enddate",enddate);
			this.formatedateprice={};
			var i=0;
			//M._getjson("ajax.php", { "a": "getprice", "fromdate": fromdate, "enddate": enddate ,"roomtypeid":rtid,"i":0}, this.getprice_finished.toEventHandler(this));
			//var paytype='alipay';
			if(ishis)
			{
				//补录订单
				this.context.orderandcheckinbtn.hide();
				this.context.dtpayBox.removeClass("").addClass("ip-dropdown ip-right");
				paytype="cash";

				M.emptyVal(this.context.o_deposit);
				this.context.o_deposit.hide();

				this.context.o_needcar.attr("checked",false).parent().hide();
				//this.context.o_paystatus.hide();

				this.context.ordercell.attr("action","hisadd");
				this.context.orderform.children("div[tag=head]").children("h4").attr("type","bulu").html("补录订单");
				this.context.orderform.children(".modal-footer").children("a[tag=suborder]").html("补录订单").attr("text","补录订单");

				//设置默认订单颜色
				var obj = this.context.orderformbody.children("li[tag=channel]").children().find("div[id=o_channel]").children("div:first").children("a").attr("color");
				if(obj == ''){
					obj = "ofreshgreen";
				}
				this.context.ordercell.attr("color",obj);
				var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
				var selected = colorfield.find("div[tag=colorlist]").children("span[ison=1]");
				selected.attr('ison',"0");
				selected.attr("class",selected.attr("val"));

				var first=colorfield.find("div[tag=colorlist]").children("span[val="+obj+"]");
				first.attr("ison","1");
				first.attr("class",first.attr("val")+" checked");
				colorfield.find("div[tag=color]").children("span").attr("class",first.attr("val")+" checked")
			}
			else
			{
				//添加订单
				//this.context.orderandcheckinbtn.show();
				var date=M.timeformat(now,'Y-m-d');

				M.emptyVal(this.context.o_deposit);
				this.context.o_deposit.show();
				this.context.o_needcar.attr("checked",false).parent().show();
				this.context.o_paystatus.show();

				this.opaystatus_change();
				this.context.ordercell.attr("action","add");

				this.context.orderform.children("div[tag=head]").children("h4").html("预订");
				this.context.orderform.children(".modal-footer").children("a[tag=suborder]").html("提交订单").attr("text","提交订单");
				//设置默认订单颜色
				var obj = this.context.orderformbody.children("li[tag=channel]").children().find("div[id=o_channel]").children("div:first").children("a").attr("color");
				if(obj == ''){
					obj = "ofreshgreen";
				}
				this.context.ordercell.attr("color",obj);
				var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
				var selected = colorfield.find("div[tag=colorlist]").children("span[ison=1]");
				selected.attr('ison',"0");
				selected.attr("class",selected.attr("val"));

				var first=colorfield.find("div[tag=colorlist]").children("span[val="+obj+"]");
				first.attr("ison","1");
				first.attr("class",first.attr("val")+" checked");
				colorfield.find("div[tag=color]").children("span").attr("class",first.attr("val")+" checked")

			}
			//下拉菜单
			//客源渠道
			var channel_tpl=this.context.orderformbody.children("li[tag=channel]").children("div");
			this.droplist.order.typedroplist=M.DropdownList(channel_tpl,this.channel_change.toEventHandler(this),{});
			//日期
			var date=coordinatedata.date;
			var datetime= M.strtotime(date);
			var name=M.timeformat(datetime,'m/d');
			var obj1=orderroomlist.children("div").children("div[id=selectDay]");
			this.droplist.order.daydroplist=M.DropdownList(obj1,this.orderdate_change.toEventHandler(this),{});
			this.droplist.order.daydroplist._setval({'value':date,"name":name});

			//身份证下拉框
			this.droplist.order.idtypedroplist=M.DropdownList(this.context.idtypeoption,null,{});

			//房费支付方式
			//房费支付方式

			paytype_tpl.children("div[tag=paystatistics]").hide();
			var roomrate_tpl=paytype_tpl.find("div[t=roomrate]");
			roomrate_tpl.attr("value",paytype);
			this.droplist.order.paymentsdroplist=M.DropdownList(roomrate_tpl,null,{});
			//押金支付方式
			var deposit_tpl=paytype_tpl.find("div[t=deposit]");
			deposit_tpl.attr("value","cash");
			this.droplist.order.depositBoxdroplist=M.DropdownList(deposit_tpl,null,{});
			var idcard_tpl=this.context.orderformbody.children("li[tag=idcard]").children("div").children("div[t=idcardform]");
			if(idcard_tpl.length>0){
				this.droplist.order.idcard=M.DropdownList(idcard_tpl,null,{});
			}
			this.context.orderform.attr("orderstatus","order");
			M.Popup(this.context.orderform,{"hideclass":"bootbox modal fade","showclass":"bootbox modal fade in"},function(){
				this.context.o_guestname.focus();

			}.toEventHandler(this));
		},
		_getavailablerooms:function(status,fromdate,index,setid,oid)
		{
			var data={ "a":"getroomsta","fromdate": fromdate,"i":index,"from":status};
			if(status=="addorder"||status=="editorder")
			{
				data["ordersetid"]=setid;
				data["orderid"]=oid;
				this.context.ordercell.attr("status",status).attr("ordersetid",setid).attr('checkinsetid',"");
				this.context.ordercell.attr("status",status).attr("ordersetid",setid).attr('checkinsetid',"");
			}
			else
			{
				data["checkinsetid"]=setid;
				data["gid"]=oid;
				this.context.ordercell.attr("status",status).attr("ordersetid",'').attr('checkinsetid',setid);
			}
			/*
			 if(status=='editcheckin'){
			 var orderdetail=this.tempcheckdetail;
			 if(!M.isEmpty(orderdetail)){
			 if(orderdetail.orderfrom=='elong'){
			 data.a="getmappingroomsta";
			 var orders=orderdetail.checkinset.orders;
			 for(var j=0;j<orders.length;j++){
			 order=orders[j];
			 if(order.id==oid){
			 data.roomid=order.roomid; 
			 }
			 }
			 }

			 }
			 }else{
			 var orderdetail=this.temporderdetail;
			 if(!M.isEmpty(orderdetail)){
			 if(orderdetail.orderfrom=='elong'){
			 data.a="getmappingroomsta";
			 var orders=orderdetail.orderset.orders;
			 for(var j=0;j<orders.length;j++){
			 order=orders[j];
			 if(order.id==oid){
			 data.roomid=order.roomid; 
			 }
			 }
			 }
			 }
			 }*/
			M._getjson("ajaxsta.php",data, this.getroomlist_finished.toEventHandler(this));
		},
		getroomlist_finished:function(d)
		{
			if (d.status == "success")
			{
				//显示房间和
				var roomlist=d.roomlist;
				var pricelist=d.pricelist;

				//根据参数显示到列表
				/*显示价格到ui*/
				var orderroomlist=null;
				switch(d.req.from)
				{
					case "addorder":
						orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
						break;
					case "editorder":

						orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").find("li[tag=orderroomlist]");
						break;
					case "editcheckin":
						orderroomlist=this.context.editcheck.children(".modal-body").find(".cntlist").find("li[tag=orderroomlist]");
						break;
					default:
						orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
						break;
				}

				for(var p in pricelist)
				{
					var rtprice=pricelist[p];
					var formatedprice = this._formatpricesource(rtprice);
					if(!M.isEmpty(this.formatedateprice[p]))
					{
						//和已有合并
						for(var k in formatedprice)
						{
							this.formatedateprice[p][k]=formatedprice[k];
						}
					}
					else
					{
						this.formatedateprice[p]=formatedprice;
					}

				}
				var oid=d.req.orderid;
				if(!M.isEmpty(oid))
				{
					this.tempavarooms[oid]=roomlist;
				}
				this.showorderrooms(orderroomlist,roomlist,d.req.i);
			}
		},
		getprice_finished:function(d)
		{
			if (d.status == "success")
			{
				/*获取价格*/
				if(!M.isEmpty(d.pricelist))
				{
					if(!M.isEmpty(d.pricelist))
					{
						this.formatedateprice[d.req.roomtypeid]=this._formatpricesource(d.pricelist);
						/*显示价格到ui*/
						var orderroomlist=null;
						switch(d.req.from)
						{
							case "addorder":
								orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
								break;
							case "editorder":
								orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
								break;
							default:
								orderroomlist=this.context.orderform.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
								break;
						}
						this.showorderprice(orderroomlist,d.req.i);
					}
				}
			}
		},
		_formatpricesource:function(pricesource)
		{
			var formated={};
			for(var i=0;i<pricesource.length;i++)
			{
				var item=pricesource[i];
				var d=item.date;
				d=d.substr(0,10);

				var p=item.price;
				formated[d]=p;
			}
			return formated;
		},
		_sumorderprice:function(orderroomlist)
		{
			/*计算订单总价*/
			//var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");

			var sum=0;
			targetli=orderroomlist.children("div[tag=order]").each(function(){
				var price=$(this).children("input[type=text][tag=price]").val();
				if(M.isEmpty(price)||isNaN(price))price=0;
				price=parseInt(price);

				sum+=price;
			});

			orderroomlist.find("strong[tag=totalprice]").html("¥"+sum);
			var tpl=orderroomlist.parents("ul").children("li[tag=paytype]").children("div[tag=paystatistics]");
			var payed=tpl.find("a[tag=showfindetail]").attr("payed");
			var needpay=parseInt(sum);
			if(!M.isEmpty(payed)){
				needpay=parseInt(needpay)-parseInt(payed);
			}

			var orderstatus=orderroomlist.parents("div[tag=popform]").attr("orderstatus");
			if(orderstatus=="checkout"){
				needpay=parseInt(needpay)-this.tempcheckdetail.account.deposit;
			}
			tpl.find("span[tag=needpay]").html("&yen;"+needpay);
		},
		showorderrooms:function(orderroomlist,roomlist,i)
		{
			var targetli=null;
			//var orderroomlist=form.find(".cntlist").children("li[tag=orderroomlist]");
			if(M.isEmpty(i)&&i!=0)
			{
				targetli= orderroomlist.find("div[tag=order]");

			}
			else
			{
				i=parseInt(i);
				if(i==-1)return;
				targetli=orderroomlist.children("div[tag=order][i="+i+"]");
			}

			/*显示可入住的房间*/
			var roomselect=targetli.find("div[tag=room]");
			var options="";
			var roomid=targetli.children("div[id=selectRoom]").attr("roomid");
			var orderdetail=this.temporderdetail;
			if(M.isEmpty(orderdetail)){
				orderdetail=this.tempcheckdetail;
			}
			if(roomlist.length>0){
				roomselect.parents("div[id=selectRoom]").children("span").attr("optionlength",1).attr("style","");

				for(var j=0;j<roomlist.length;j++)
				{

					var r=roomlist[j];
					if(r.id==roomid)
					{

						//roomselect.parent().prev().html(r.roomname);

						options+='<div value="'+r.id+'" rtid="'+r.roomtypeid+'" morenights="'+r.morenights+'" maxnights="'+r.maxnights+'" tag="option" ><a href="javascript:;" class="on">'+r.roomname+'</a></div>';
					}
					else
					{
						options+='<div value="'+r.id+'" rtid="'+r.roomtypeid+'" morenights="'+r.morenights+'" maxnights="'+r.maxnights+'" tag="option"><a href="javascript:;">'+r.roomname+'</a></div>';
					}

				}
			}else{
				roomselect.parents("div[id=selectRoom]").children("span").attr("optionlength",0).attr("style","background:#eeeeee");
				options+='<div value="0" tag="option"><a href="javascript:;">无可用房间</a></div>';
			}

			roomselect.html(options);

			//房间绑定下拉框11111111111111111111111
			var obj2=targetli.children("div[id=selectRoom]");
			this.droplist.order.roomdroplist = M.DropdownList(obj2,this.orderroom_change.toEventHandler(this),{});
			this.showordernights(targetli,i);
			/*显示价格*/
			this.showorderprice(orderroomlist,i);
		},
		showorderprice:function(orderroomlist,i)
		{
			var targetli=null;

			//禁止修改价格
			var orderdetail=this.temporderdetail;
			if(M.isEmpty(orderdetail)){
				orderdetail=this.tempcheckdetail;
			}
			if(M.isEmpty(i)&&i!=0)
			{
				targetli=orderroomlist.children("div[tag=order]");
			}
			else
			{
				i=parseInt(i);
				if(i==-1)return;
				targetli=orderroomlist.children("div[tag=order][i="+i+"]");
			}
			var priceinput=targetli.children("input[type=text][tag=price]");
			if(priceinput.attr("isfirst")=="1")
			{
				priceinput.attr("isfirst","");
				return;
			}

			var value=targetli.children("div[id=selectRoom]").children("span").attr("value");
			var rtid=this._getroomid(targetli.children("div[id=selectRoom]"),value);
			var checkindate=targetli.children("div[id=selectDay]").children("span").attr("value");
			var nights=targetli.children("div[id=selectNights]").children("span").attr("value");

			var n=parseInt(nights);
			var arrivedate = M.strtotimeSetDefaultHour(checkindate);
			var total=0;
			var pricesource=this.formatedateprice[rtid];
			if(M.isEmpty(pricesource)||pricesource.length==0)
			{
				total="";
			}
			else
			{
				for(var i=0;i<n;i++)
				{
					var d=this.timeformat(arrivedate);
					var p=pricesource[d];
					if(M.isEmpty(p))p=0;
					if(isNaN(p))p=0;
					p=parseInt(p);
					total+=p;
					arrivedate.setDate(arrivedate.getDate()+1);
				}
			}
			priceinput.val(total).attr("isfirst","");

			this._sumorderprice(orderroomlist);
		},
		_getroomid:function(target,val){
			var rtid='';
			var tpl=target.children("div").find("div[tag=option]");
			tpl.each(function(){
				var value=$(this).attr("value");
				if(value==val){
					rtid=$(this).attr("rtid");
				}
			});
			return rtid;
		},
		_showordernights:function(targetli)
		{
			var nightselect=targetli.find("div[id=rnsBox]");
			var nightInitVal =targetli.find("div[id=roomnights]");
			var maxnight= this.maxnights;
			if(M.isEmpty(maxnight)||isNaN(maxnight))
			{
				nightselect.html("");
				return;
			}
			maxnight=parseInt(maxnight);
			var nightsval=targetli.attr("nights");
			var options="";
			/*显示住几晚*/
			for(var i=1;i<=maxnight;i++)
			{
				if(!M.isEmpty(nightsval)&&i==nightsval)
				{
					options+='<div value="'+i+'"  tag="option" selected="selected"><a href="javascript:;">'+i+'晚</a></div>';
				}
				else
				{
					options+='<div value="'+i+'" tag="option"><a href="javascript:;"  >'+i+'晚</a></div>';
				}
			}
			
			nightselect.html(options);
			//住几晚
			this.context.nightdroplists=M.DropdownList(nightInitVal,null,{});
			this.context.nightdroplists._setval({'value':nightsval,"name":nightsval+'晚'});
		},
		showordernights:function(targetli,i)
		{
			var value=targetli.children("div[id=selectRoom]").children("span").attr("value");
			var nightselect=targetli.children("div[id=selectNights]").find("div[tag=nights]");
			//var maxnight=roomoption.parent().attr("maxnights");
			var maxnight=targetli.children("div[id=selectRoom]").children("div[id=roomsBox]").children("div[tag=room]").find("div[value="+value+"]").attr("maxnights");
			if(M.isEmpty(maxnight)||isNaN(maxnight))
			{
				nightselect.html("");
				return;
			}
			var morenights=targetli.children("div[id=selectRoom]").children("div[id=roomsBox]").children("div[tag=room]").find("div[value="+value+"]").attr("morenights");
			maxnight=parseInt(maxnight);
			var nightsval=targetli.children("div[id=selectNights]").attr("value");
			//targetli.children("div[id=selectNights]").attr("value",nightsval);
			var options="";
			/*显示住几晚*/
			for(var i=1;i<=maxnight;i++)
			{
				if(!M.isEmpty(nightsval)&&i==nightsval)
				{
					options+='<div value="'+i+'"><a href="javascript:;" class="on">'+i+'晚</a></div>';
				}
				else
				{
					options+='<div value="'+i+'"><a href="javascript:;">'+i+'晚</a></div>';
				}
			}
			if(nightsval>30){
				options+='<div value="'+nightsval+'"  tag="option" selected="selected"><a href="javascript:;">'+nightsval+'晚</a></div>';
			}
			nightselect.html(options).attr("morenights",morenights);
			nightselect.find('div[tag=input]').remove();
			//住几晚
			
			var nights = nightsval;

			var checktype = this.context.checkinoption.attr('checktype');

			this.droplist.order.nightsdroplist=M.DropdownList(targetli.children("div[id=selectNights]"),this.ordernight_change.toEventHandler(this),{});
			var editclass = this.context.orderform.children('div[tag=head]').children('h4').text();
            
			if(editclass == "修改订单"){
				if(nights > 30){
					var selectNights = targetli.children("div[id=selectNights]");
					var nightselect = selectNights.find("div[tag=nights]");
					
					opt = '<div tag="input"><input type="text" tag="morenigths" setplaceholder style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
					nightselect.append(opt);
					nightselect.children("div[tag=input]").children("input").bind("blur",this.nightsinputs_blur.toEventHandler(this));
					nightselect.children("div[tag=input]").children("input").bind("keydown",this.nightsinputs_keydown.toEventHandler(this));

				}else{
					if(maxnight==30){
						option = '<div tag="input"><input type="text" tag="morenigths" setplaceholder style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
						nightselect.append(option);
						nightselect.children("div[tag=input]").children("input").bind("blur",this.nightsinputs_blur.toEventHandler(this));
						nightselect.children("div[tag=input]").children("input").bind("keydown",this.nightsinputs_keydown.toEventHandler(this));
					}
				}
			}else{
				if(maxnight==30){
					option = '<div tag="input"><input type="text" tag="morenigths" setplaceholder style="width: 31px; margin-right: 0; padding-left: 9px;" placeholder="输入"></div>';
					nightselect.append(option);
					nightselect.children("div[tag=input]").children("input").bind("blur",this.nightsinputs_blur.toEventHandler(this));
					nightselect.children("div[tag=input]").children("input").bind("keydown",this.nightsinputs_keydown.toEventHandler(this));
				}
			}
			
		},

		_setval:function(ele,value){
			var list=ele.children("div").find("div[tag=option]");
			var span_tpl=ele.children("span");
			var name='';
			list.each(function(){
				var val=$(this).attr("value");
				if(val==value){
					name=$(this).children("a").text();
				}
			});
			span_tpl.attr("value",value).html(name);
		},
		_gettimetomorrow:function(tdele)
		{
			var cols=tdele.attr("idx");
			var row=tdele.parent().attr("i");
			/*是否可入住*/
			var coordinate=this.transform.getdata_bycoordinate(row,cols);
			//var timetd = this.context.pickerdate.children("table").children(":first").children()[row];
			var time = coordinate.date;
			var date=M.strtotimeSetDefaultHour(time);
			var datetomorrow=new Date(date.getFullYear(),date.getMonth(),date.getDate()+1,6,0,0);
			return datetomorrow;
		},
		_doeditorder:function(tdele){
			/*获取房型id和roomid*/
			var datehave=tdele.children(".date-have");
			var rid=datehave.attr("rid");
			var oid=datehave.attr("oid");
			var cols=tdele.attr("idx");
			var row=tdele.parent().attr("i");

			var datetomorrow=this._gettimetomorrow(tdele);
			var now=this.getdatetime();
			if(now>=datetomorrow)
			{
				/*不能入住了*/
				this.context.e_line.hide();
				this.context.e_checkinbtn.hide();
			}
			else
			{
				/*可以继续入住*/
				this.context.e_line.show();
				this.context.e_checkinbtn.show();
			}

			/**/
			this.context.e_guestname.children("span").html("");
			this.context.e_guestphone.html("");
			this.context.e_orderinfo.children("span[tag=price]").html("");
			this.context.e_orderinfo.children("h2[tag=roomname]").html("");
			this.context.e_orderinfo.children("p[tag=time]").html("");
			this.context.e_orderinfo.children("p[tag=nights]").html("");
			this.context.idnuminfo.html("");
			this.context.e_remark.html("");
			this.context.e_logo.attr("class","ico-own fl mr10");

			/*加载同类房型*/
			this.context.e_ordercell.attr("oid",oid).attr("cols",cols).attr("rid",rid).attr("row",row).attr("setid","");
			this.context.e_checkinbtn.show();
			this.context.e_orderdetail.children(".modal-footer").children("a[tag=editorder]").show();
			this.context.e_guestphone.parent().children("a[tag=sendmsg]").hide();
			this.temporderdetail=null;
			this.context.e_orderdetail.children().find("a[tag=removeorder]").html('删除订单');
			//panel清空
			this.context.submitlayer.show();
			M._getjson("ajax.php", { "a": "orderdetail", "orderid": oid,"rid":rid}
				, this.odetail_finished.toEventHandler(this));


		},
		_checkinable:function(date)
		{
			/*是否可以办理入住*/
			var now=this.getdatetime();
			var cancheckin=true;
			var date_tomorrow6=new Date(date.getFullYear(),date.getMonth(),date.getDate()+1,6,0,0);
			if(date_tomorrow6<now)
			{
				var type=this.context.orderform.children("div[tag=head]").children("h4").attr("type");
				if(type=='bulu'){
					cancheckin=false;
				}

			}
			var date_8hour=new Date(date.getFullYear(),date.getMonth(),date.getDate(),6,0,0);
			if(now<date_8hour)
			{
				cancheckin=false;
			}
			return cancheckin;
		},
		odetail_finished: function (d) {
			this.context.submitlayer.hide();
			if (d.status == "success") {
				var o=d.d;
				this.temporderdetail=o;
				var orderset=o.orderset;
				var orders=orderset.orders;
				this.context.e_ordercell.attr("rid",o.roomid);
				this.context.e_guestname.children("span").html(o.guestname);
				var guestlist=o.guestlist;
				if(guestlist.length>1){
					this.context.e_guestname.children("a").show().html(guestlist.length);
				}else{
					this.context.e_guestname.children("a").hide()
				}

				var phonedesc=o.phone;
				if(!M.isEmpty(o.cityname))
				{
					phonedesc+='<tt>('+o.cityname+')</tt>';
				}
				if(!M.isEmpty(o.idnum)){
					this.context.idnuminfo.html(this.typename[o.idtype]+'：'+o.idnum);
				}
				if(M.isEmpty(phonedesc))
				{
					this.context.e_guestphone.parent().children("a[tag=sendmsg]").hide();
				}
				else
				{
					this.context.e_guestphone.parent().children("a[tag=sendmsg]").show();
				}
				this.context.e_guestphone.html(phonedesc);

				this.multiguest=o.guestlist;
				var pricedesc="￥"+o.totalprice;
				var account=o.account;
				if(o.paystatus==3){
					if(account.payedtotal==0){
						pricedesc+='<b style="">已担保</b>';
					}else{
						pricedesc+='<b style="padding-right:21px;">已担保</b>';
					}
				}
				pricedesc+='<b>已付房费 ¥'+account.payedtotal+'<i class="ico-info" style="display:none" id="info-price"></i></b>';
				if(!M.isEmpty(account.deposit)){
					if(account.payedtotal==0){
						pricedesc+='<b>押金 ¥'+account.deposit+'</b>';
					}else{
						pricedesc+='<b style="padding-right:21px;">押金 ¥'+account.deposit+'</b>';
					}

				}

				this.context.e_orderinfo.children("span[tag=price]").html(pricedesc);
				var tipmsg='';

				//处理已有财务记录
				if (!M.isEmpty(account.appendmoney)) {
					var appendmoney = account.appendmoney;
					for (var i = 0; i < appendmoney.length; i++) {
						if (appendmoney[i].amount != 0) {
							var paystatusStr = '';
							if ('shouyintai' == appendmoney[i].paytypecode) {
								if ('1' == appendmoney[i].paystatus) {
									paystatusStr = ' <span class="green">[已付款]</span>';
								}else if ('2' ==appendmoney[i].paystatus){
									paystatusStr = ' <span>[已关闭]</span>';
								}else{
									paystatusStr= '<span class="red">[待付款]</span><p>';
								}
							}
							tipmsg += '<p>' + appendmoney[i].msg + paystatusStr + '<p>';
						}
					}
				}
				if(tip!=''){
					var tip = this.context.e_orderinfo.children("span[tag=price]").children("b").children("i");
					tip.show().attr("title", '').tooltip({position: { my: "left+15 top+20", at: "left bottom" }, track: 1, content: tipmsg, show: {duration: 100}});
				}

				this.context.e_orderinfo.children("h2[tag=roomname]").html('<span class="ico-roomname16"></span>'+o.roomname+"("+o.roomtypename+")");
				var date=M.strtotimeSetDefaultHour(o.arrivedate);
				var datestr=this.timeformat(date,"m月d日");

				var arrtime=M.isEmpty(o.arrivetime)?"":o.arrivetime;
				this.context.e_orderinfo.children("p[tag=time]").html('<span class="ico-date16"></span>'+datestr+"&nbsp;"+arrtime+"入住");

				var enddatestr=this.timeformat(M.strtotime(o.enddate), "m月d日");
				this.context.e_orderinfo.children("p[tag=nights]").html('<span class="ico-night16"></span>'+enddatestr+"退房，住"+o.nights+"晚");

				this.context.e_needcar.html(o.needcar=="1"?'<span class="ico-car16"></span>需要车接':"");

				var remark2='';
				if(!M.isEmpty(o.remark2))
				{
					var pos=o.remark2.indexOf("订单总额");
					var rep="";
					if(pos<0)
					{
						rep+="订单总额￥"+orderset.totalprice+"，";
					}
					remark2='<p class="pl20"><span class="ico-related16 minus20"></span>'+o.remark2.replace("\n",rep).replace(/‖/g,'<br/>').replace(':',':<br/>')+"</p>";
				}
				this.context.e_remark.html(remark2);
				var remark=M.isEmpty(o.remark)?"":'<p class="pl20"><span class="ico-remark16 minus20"></span>备注：'+o.remark+"</p>";
				this.context.e_remark.parent().children("li[tag=remark2]").html(remark);
				var cancheckin=false;
				if(!M.isEmpty(orderset))
				{
					for(var i=0;i<orders.length;i++)
					{
						var order=orders[i];
						var date=order.arrivedate;
						var datetime=M.strtotime(date);
						var cancheckin=this._checkinable(datetime);
						if(cancheckin)
						{
							cancheckin=true;
							break;
						}
					}
				}
				if(cancheckin)
				{
					this.context.e_checkinbtn.show();
				}
				else
				{
					this.context.e_checkinbtn.hide();
				}
				this.context.e_ordercell.attr("setid",o.ordersetid);
				/*是否可以修改订单*/

				/*设置订单来源样式*/
				var channel=M.isEmpty(o.channelcode)?"":o.channelcode;
				var channelico=this.channelico[channel];
				if(M.isEmpty(channelico))
				{
					this.context.e_logo.attr("class","ico-custom fl mr10").html(o.channelname);
				}
				else
				{
					this.context.e_logo.attr("class",channelico+" fl mr10").html("");
				}
				this.context.e_orderdetail.attr('nights', o.nights);
				M.Popup(this.context.e_orderdetail,{"hideclass":"bootbox modal view fade","showclass":"bootbox modal view fade in","dragable":true},function(){
					this.context.e_idnum.focus();
				}.toEventHandler(this));
			}else{
				if(!M.isEmpty(d.msg)){
					M.error(d.msg);
				}else{
					M.error("请求错误，请刷新页面后重试");
				}
			}
		},
		delorder_action:function(ordertype,ownedprice)
		{
			if(ordertype=='ordered')
			{
				this.removeorder(ownedprice);
			}
			else
			{
				this.checkindelete(ownedprice);
			}
		},
		beforeremoveorder:function(ordertype,order)
		{//this.temporderdetail ordered
			//('checkin',this.tempcheckdetail);
			//this.context.dropdelpay = M.DropdownList(this.context.delform.find('div[tag=payments]'),this.room_change.toEventHandler(this),{});
			this.context.delhidden.attr('ordertype',ordertype);
			if(ordertype=='ordered'||1==1)
			{
				var o=order;
				var temp=ordertype=='ordered'?order.orderset:order.checkinset;
				var orderfrom=temp.orderfrom;
				var account=ordertype=='ordered'?this.temporderdetail.account:this.tempcheckdetail.account;
				var guestlist=ordertype=='ordered'?this.temporderdetail.guestlist:this.tempcheckdetail.guestlist;
				var orderstatus=ordertype=='ordered'?'order':'checkin';
				var arrivetimelate=temp.arrivetimelate;
				if(M.isEmpty(arrivetimelate)){
					arrivetimelate=order.arrivetimelate;
				}
				//if(temp.paystatus==0&&ordertype=='ordered')
				//{
				//	this.delorder_action(ordertype,0);
				//	return;
				//}
				/*显示删除录入表单*/
				var header=this.context.delform.children('div[tag=header]');
				var cntlist=this.context.delform.children('.modal-body').find('.cntlist');
				var descfield=cntlist.children('li[tag=desc]');
				var incomefield=cntlist.children('li[tag=income]').show();
//			incomefield.children("div[tag=roomrate]").children("input[name=amount]").val("0");
//			incomefield.children("div[tag=deposit]").children("input[name=deposit]").val("0");
				incomefield.children("div[tag=roomrate]").children("input[name=amount]").val('');
				incomefield.children("div[tag=deposit]").children("input[name=deposit]").val('');
				var vouchtip_tpl=cntlist.children('li[tag=vouchtip]').hide();
				var vouch_tpl=cntlist.children('li[tag=vouch]').hide();
				vouch_tpl.children("div").children("input[name=ownprice]").val("");
				vouch_tpl.children("div").children("input[name=ownprice]").attr('placeholder','金额');
				var remarkfield=cntlist.children('li[tag=remark]');
				var channellogo=header.children('div[tag=logo]');
				var channel=M.isEmpty(temp.channelcode)?"":temp.channelcode;
				var channelico=this.channelico[channel];
				if(M.isEmpty(channelico))
				{
					channellogo.attr("class","ico-custom fl mr10").html(temp.channelname);
				}
				else
				{
					channellogo.attr("class",channelico+" fl mr10").html("");
				}
				var info=temp.guestname;
				var guest_tpl=this.context.delform.children().find("h3[tag=userinfo]");
				guest_tpl.children("b[tag=guestname]").children("span").html(guestlist[0].guestname);
				guest_tpl.children("span[tag=phone]").html(guestlist[0].phone);
				guest_tpl.children("p[tag=idnum]").html(guestlist[0].idnum);
				guest_tpl.children("b[tag=guestname]").children("a").attr("orderstatus",orderstatus).html(guestlist.length).hide();
				if(guestlist.length>1){
					guest_tpl.children("b[tag=guestname]").children("a").html(guestlist.length).show();
				}

				var appendmoney=account.payedtotal;
				if(ordertype=='ordered'&&appendmoney==0&&temp.paystatus==3){
					incomefield.hide();
					vouch_tpl.show();
					vouchtip_tpl.show();
					this.context.delform.attr("ischeckout",1);
					var fromdate=ordertype=='ordered'?o.arrivedate:o.checkindate;
					var t=M.strtotime(fromdate);
					var ft=this.timeformat(t,'m/d');
					var desc="<p>"+o.roomname+"，"+ft+"入住，住"+o.nights+"晚，订单总额<span class='t16 red'>¥"+order.totalprice+"</span></p>";
					descfield.html(desc);
					var payedprice=ordertype=='ordered'?0:o.payedprice;
					//incomefield.find('input').val(payedprice);//delxin
					incomefield.find('input').val("");
				}else{
					if(temp.orders.length>1){
						var desc="该订单含有多个子订单，已付<span class='t16 red'>¥"+account.payedtotal+"</span>房费";
						if(!M.isEmpty(account.deposit)){
							desc+='及￥'+account.deposit+'押金，删除该子订单后，该房费及押金将在最后结算。';
						}else{
							desc+="，删除该子订单后，该房费将在最后结算。";
						}
						this.context.delform.attr("ischeckout",0);
						descfield.html(desc);
						incomefield.hide();
					}else{
						this.context.delform.attr("ischeckout",1);
						var desc="该订单已付<span class='t16 red'>¥"+account.payedtotal+"</span>房费";
						if(!M.isEmpty(account.deposit)){
							desc+='及￥'+account.deposit+'押金';
						}
						desc+="，删除订单可能会导致账目不准确。<br />请核算删除该订单需退还给客人的房款。";
						descfield.html(desc);
//					incomefield.children("div[tag=roomrate]").children("input").val(account.payedtotal).attr("t","needreturn");
//					incomefield.children("div[tag=deposit]").children("input").val(account.deposit);
						if(account.payedtotal==0){
							incomefield.children("div[tag=roomrate]").children("input").val(0).attr("t","needreturn");
						}else{
							incomefield.children("div[tag=roomrate]").children("input").val("").attr("placeholder","金额");
							incomefield.children("div[tag=roomrate]").children("input").val("").attr("t","needreturn");
						}
						if(account.deposit==0){
							incomefield.children("div[tag=deposit]").children("input").val(0);
						}else{
							incomefield.children("div[tag=deposit]").children("input").val("").attr("placeholder","金额");
							incomefield.children("div[tag=deposit]").children("input").val("");
						}

					}
				}

				var tpl=vouch_tpl.children("div").children("div[t=vouch]").attr("value","alipay");
				this.droplist.del.roomrate=M.DropdownList(tpl,null,{});
				var roomratepaytype="alipay";
				if(order.type=="checkedin"){
					roomratepaytype="cash";
				}
				var tpl=incomefield.children("div[tag=roomrate]").children("div[t=paytype]").attr("value",roomratepaytype);
				this.droplist.del.roomrate=M.DropdownList(tpl,null,{});
				var tpl=incomefield.children("div[tag=deposit]").children("div[t=paytype]").attr("value","cash");
				this.droplist.del.deposit= M.DropdownList(tpl,null,{});
				if(!M.isEmpty(temp.remark)){
					remarkfield.find('textarea').val(temp.remark);
				}else{
					M.emptyVal(remarkfield.find('textarea'));
				}

			}
			else
			{

			}

			M.CloseLast();
			M.Popup(this.context.delform,{"hideclass":"modal view fade","showclass":"modal view fade in"});
		},
		removeorder:function(ownedprice)
		{
			var temp=this.temporderdetail.orderset;
			var orderfrom=temp.orderfrom;
			var arrivetimelate=temp.arrivetimelate;
			var account = this.temporderdetail.account;

			if(account.unpaid>0){
				M.error("订单未支付，不能删除");
				return false;
			}
			if(M.isEmpty(arrivetimelate)){
				arrivetimelate=this.temporderdetail.arrivetimelate;
			}

			//若不是关联订单
			if(temp.orders.length<=1){
				if(temp.paystatus != 3){
					var paymoney=this.context.delform.children().find("input[name=amount]").val();
					var deposit=this.context.delform.children().find("input[name=deposit]").val();

					if(M.isEmpty(paymoney))
					{
						alert("请输入需退房费");
						return;
					}
					if(M.isEmpty(deposit))
					{
						alert("请输入需退押金");
						return;
					}
				}else{
					if(account.payedtotal !=0){
						var paymoney=this.context.delform.children().find("input[name=amount]").val();
						var deposit=this.context.delform.children().find("input[name=deposit]").val();
						if(M.isEmpty(paymoney))
						{
							alert("请输入需退房费");
							return;
						}
						if(M.isEmpty(deposit))
						{
							alert("请输入需退押金");
							return;
						}
					}else{
						var ownprice=this.context.delform.children().find("input[name=ownprice]").val();
						if(M.isEmpty(ownprice)){
							alert('请输入所得收入');
							return;
						}
					}
				}
			}
			//关联订单
			if(temp.orders.length>1 && temp.paystatus == 3&&this.temporderdetail.account.payedtotal==0){
				var ownprice=this.context.delform.children().find("input[name=ownprice]").val();
				if(M.isEmpty(ownprice)){
					alert('请输入所得收入');
					return;
				}

			}
			var res=confirm("确认删除吗");
			if(!res){
				return;
			}
			var remark=M.getVal(this.context.delform.children('.modal-body').find('textarea'));
			/*删除订单*/
			var oid=this.context.e_ordercell.attr("oid");
			if(M.isEmpty(oid))
			{
				return;
			}
			oid=parseInt(oid);
			var data={ "a": "delorder", "orderid": oid,'remark':remark};
			//xins需要退的房费
			var paymoney_tpl=this.context.delform.children().find("input[name=amount]");
			var t=paymoney_tpl.attr("t");
			var paymoney=paymoney_tpl.val();

			var rm_paytype=this.droplist.del.roomrate._getval();
			var rm_paytypename=this.context.delform.children().find("div[tag=roomrate]").children("div").children("span").text();
			data.rm_paytypename=rm_paytypename;
			paymoney=M.isEmpty(paymoney)?0:paymoney;

			if(isNaN(paymoney))
			{
				alert('房费金额输入格式不正确');
				return;
			}

			if(t=='needreturn'){
				data.needappend=2;
				data.returnmoney=paymoney;
			}else{
				data.needappend=1;
				data.appendmoney=paymoney;
			}
			data.rm_paytype=rm_paytype;
			//需要退的押金
			var deposit_tpl=this.context.delform.children().find("input[name=deposit]");
			var dt_paytypename=this.context.delform.children().find("div[tag=deposit]").children("div").children("span").text();
			data.dt_paytypename=dt_paytypename;
			var dt_paytype=this.droplist.del.deposit._getval();
			var deposit=deposit_tpl.val();
			deposit=M.isEmpty(deposit)?0:deposit;
			if(isNaN(deposit))
			{
				alert('押金金额输入格式不正确');
				return;
			}
			data.deposit=deposit;
			data.dt_paytype=dt_paytype;

			var vouch_tpl=this.context.delform.children().find("div[t=vouch]");
			var vouch_paytype=vouch_tpl.children("span").attr("value");
			var vouch_paytypename=vouch_tpl.children("span").text();
			var vouch_amount=this.context.delform.children().find("input[name=ownprice]").val();
			data.vouch_paytype=vouch_paytype
			data.vouch_amount=vouch_amount;
			data.vouch_paytypename=vouch_paytypename;

			//请求开始
			var btn=this.context.e_orderdetail.children(".modal-footer").children("a[tag=removeorder]");
			data.ischeckout=this.context.delform.attr("ischeckout");
			if(!this.req_before(btn)){return;}
			M._getjson("ajax.php", data, this.delorder_finished.toEventHandler(this));
		},
		_getcoordedatabyorderid:function(orderid){
			var target=this.context.pickerarea.find("div[oid="+orderid+"]");
			var cols=target.parents("td").attr("idx");
			var row=target.parents("tr").attr("i");
			return {"row":row,"cols":cols}
			
		},
		delorder_finished:function(d)
		{
			if(d.status=="success")
			{
				/*update ui*/
				var orderid=d.req.orderid;
				var row=this.context.e_ordercell.attr("row");
				var cols=this.context.e_ordercell.attr("cols");
				if(M.isEmpty(row)||M.isEmpty(cols)){
					var coordata=this._getcoordedatabyorderid(orderid);
					row=coordata.row;
					cols=coordata.cols;
				}
				var target=this._getpickercell(row,cols);
				this._clearitembycoordinate(cols,row);
				var olddata=d.olddata;
				this.calc_leftrooms();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			this.temporderdetail=null;
			this.sortorders();
			//this.getallrooms();
			//请求结束
			var btn=this.context.e_orderdetail.children(".modal-footer").children("a[tag=removeorder]");
			this.req_end(btn);
		},
		_clearitembycoordinate:function(col,row){
			var night=this.context.pickerarea.children("table").children("tbody").children("tr[i="+row+"]").children("td[idx="+col+"]").attr("n");
			this.transform.clearitem(col,row,night);
		},
		_getorderformdata:function()
		{

			var hiddencell=this.context.ordercell;
			//var roomid =this.NoUndefined(hiddencell.attr("roomid"));
			//var roomname = this.NoUndefined(hiddencell.attr("roomname"));
			//var time =this.NoUndefined(hiddencell.attr("begintime"));

			var roomnum = 1;
			var guestname =M.getVal(this.context.o_guestname);
			var phone = M.getVal(this.context.o_phone);
			var channel=M.getVal(this.context.o_channel);
			var channelname=this.context.o_channel.children("div").children("a[class=on]").text();
			var remark=this.NoUndefined(M.getVal(this.context.o_remark));
			var idnum="";
			var paystatus=this.context.o_paystatus.is(':checked');
			var deposit=M.getVal(this.context.o_deposit);
			var needcar=this.context.o_needcar.attr("checked");
			needcar=needcar=="checked"?1:0;
			var needcar2=this.context.o_needcar2.attr("checked");
			needcar2=needcar2=="checked"?1:0;
			var idnum=M.getVal(this.context.idnum);
			var idtype=M.getVal(this.context.idtype);
			//房费押金
			var roomcost=M.getVal(this.context.roomcost);
			var depositcost=M.getVal(this.context.depositcost);

			var roompaytype =this.droplist.order.paymentsdroplist._getval();
			var depositpaytype=this.droplist.order.depositBoxdroplist._getval();

			var rmpayname = this.context.roompaytype.text();
			var dtpayname = this.context.depositpaytype.text();

			var cols = hiddencell.attr("col");
			var rows = hiddencell.attr("row");
			//是否是担保订单
			if(paystatus){
				paystatus = 3;
			}else{
				paystatus = 4;
			}

			var orderdata={
				"guestname": guestname,
				"phone": phone,
				"remark":remark,
				"channel":channel,
				"channelname":channelname,
				"rows":rows,
				"cols":cols,
				"idnum":idnum,
				"paystatus":paystatus,
				"deposit":deposit,
				"needcar":needcar,
				"needcar2":needcar2,
				"idnum":idnum,
				"idtype":idtype,
				"appendmoney":roomcost,
				"rm_paytype":roompaytype,
				"rm_payname":rmpayname,
				"deposit":depositcost,
				"dt_paytype":depositpaytype,
				"dt_payname":dtpayname
			};

			/*订单颜色*/
			var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
			var style=colorfield.children("span[ison=1]").attr("val");
			if(M.isEmpty(style)){
				orderdata["style"]=hiddencell.attr("color");
			}else{
				orderdata["style"]=style;
			}


			/*获取房间信息*/
			var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");
			var i=0;
			var valid=true;
			var totalprice=0;
			orderroomlist.children("div[tag=order]").each(function(){
				i++;
				var roomfield=$(this).children("div[id=selectRoom]");
				var roomid=roomfield.find("a[class=on]").parent().parent().attr("roomid");
				var roomname=roomfield.find("a[class=on]").text().trim();
				var checkindate=this.context._daydroplist;
				var nights=$(this).children("div[id=selectNights]").find("a[class=on]").parent().attr("value");
				var price=$(this).children("input[type=text][tag=price]").val();
				var oid=$(this).attr("oid");
				/*价格输入验证*/
				if(M.isEmpty(price))
				{
					alert("价格不能为空");
					valid=false;
					return;
				}
				if(isNaN(price))
				{
					alert("价格格式不正确");
					valid=false;
					return;
				}
				price=parseInt(price);
				totalprice+=price;
				orderdata["roomid"+i]=roomid;
				orderdata["roomname"+i]=roomname;
				orderdata["nights"+i]=nights;
				orderdata["price"+i]=price;
				orderdata["checkindate"+i]=checkindate;
				orderdata["oid"+i]=oid;
			});
			orderdata["totalprice"]=totalprice;
			orderdata["orderlength"]=i;
			orderdata["valid"]=valid;

			return orderdata;
		},
		_getorderform:function()
		{
			var hiddencell=this.context.ordercell;

			//var roomid =this.NoUndefined(hiddencell.attr("roomid"));
			//var roomname = this.NoUndefined(hiddencell.attr("roomname"));
			//var time =this.NoUndefined(hiddencell.attr("begintime"));

			var roomnum = 1;

			var tpl_channel=this.context.orderformbody.children("li[tag=channel]").children("div").children("span");
			var channel=tpl_channel.attr("value");
			var channelname=tpl_channel.text();
			var remark=this.NoUndefined(M.getVal(this.context.o_remark));
			var idnum="";
			var paystatus=this.context.o_paystatus.is(':checked');
			var deposit=M.getVal(this.context.o_deposit);
			var needcar=this.context.o_needcar.attr("checked");
			needcar=needcar=="checked"?1:0;
			var needcar2=this.context.o_needcar2.attr("checked");
			needcar2=needcar2=="checked"?1:0;

			//房费押金
			var paytype=this.context.orderformbody.children("li[tag=paytype]");
			var roomcost=paytype.find("input[name=roomrate]").val();//支付房费

			var depositcost=paytype.find("input[name=deposit]").val();//押金

			var roompaytype =M.getDroplistVal(paytype.find("div[t=roomrate]"));
			var depositpaytype=M.getDroplistVal(paytype.find("div[t=deposit]"));

			var rmpayname = paytype.find("div[t=roomrate]").children("span").text();
			var dtpayname = paytype.find("div[t=deposit]").children("span").text();
			var cols = hiddencell.attr("col");
			var rows = hiddencell.attr("row");
			//是否是担保订单
			if(paystatus){
				paystatus = 3;
			}else{
				paystatus = 4;
			}
			if(!channel){
				channel = 'self';
			}
			if(!channelname){
				channelname = '自来客';
			}
			var orderdata={
				"remark":remark,
				"channel":channel,
				"channelname":channelname,
				"rows":rows,
				"cols":cols,
				"paystatus":paystatus,
				"deposit":deposit,
				"needcar":needcar,
				"needcar2":needcar2,
				"appendmoney":roomcost,
				"rm_paytype":roompaytype,
				"rm_payname":rmpayname,
				"deposit":depositcost,
				"dt_paytype":depositpaytype,
				"dt_payname":dtpayname
			};
			var guestlist=this.multiguest;
			orderdata.guestname=M.getVal(this.context.o_guestname);
			orderdata.phone = M.getVal(this.context.o_phone);
			if(this.haspluginid==1){
				idcard_tpl=this.context.orderformbody.children("li[tag=idcard]");
				orderdata.idnum=idcard_tpl.children().find("input[name=idcard]").val();
				orderdata.idtype=idcard_tpl.children("div").children("div[t=idcardform]").children("span").attr("value");
			}else{
				if(!M.isEmpty(guestlist)&&guestlist.length>0){
					orderdata['idnum']=guestlist[0].idnum;
					orderdata['idtype']=guestlist[0].idtype;
				}

			}
			orderdata['guestlength']=1;
			if(this.multiguest.length>1){
				orderdata['guestlength']=this.multiguest.length;
				for(var i=1;i<guestlist.length;i++){
					var guest=guestlist[i];
					orderdata['guestname'+i]=guest.guestname;
					orderdata['phone'+i] = guest.phone;
					orderdata['idnum'+i]=guest.idnum;
					orderdata['idtype'+i]=guest.idtype;
				}
			}

			/*订单颜色*/
			var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
			var style=colorfield.find("div[tag=colorlist]").children("span[ison=1]").attr("val");
			if(M.isEmpty(style)){
				orderdata["style"]=hiddencell.attr("color");
				//if(M.isEmpty(style)){
				//	orderdata["style"]=this.context.orderformbody.children("li[tag=channel]").children().find("div[value="+channel+"]").children("a").attr("color");
				//}
			}else{
				orderdata["style"]=style;
			}


			/*获取房间信息*/
			var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");
			var i=0;
			var valid=true;
			var totalprice=0;
			orderroomlist.children("div[tag=order]").each(function(){
				i++;
				var room_tpl=$(this).children("div[id=selectRoom]").children("span");
				var roomid=room_tpl.attr("value");
				var roomname=room_tpl.text().trim();
				var checkindate=$(this).children("div[id=selectDay]").children("span").attr("value");
				var nights=$(this).children("div[id=selectNights]").children("span").attr("value");
				var price=$(this).children("input[type=text][tag=price]").val();
				var oid=$(this).attr("oid");
				/*价格输入验证*/
				if(M.isEmpty(price))
				{
					alert("价格不能为空");
					valid=false;
					return;
				}
				if(isNaN(price))
				{
					alert("价格格式不正确");
					valid=false;
					return;
				}
				if(roomid==0||room_tpl.length==0){
					var arrivatetime= M.strtotime(checkindate);
					var arrivatedate= M.timeformat(arrivatetime,'m/d');
					alert("对不起，"+arrivatedate+"日没有可预订的房间，请重新选择其它日期。");
					valid=false;
					return;
				}
				price=parseInt(price);
				totalprice+=price;
				orderdata["roomid"+i]=roomid;
				orderdata["roomname"+i]=roomname;
				orderdata["nights"+i]=nights;
				orderdata["price"+i]=price;
				orderdata["checkindate"+i]=checkindate;
				orderdata["oid"+i]=oid;
			});
			orderdata["totalprice"]=totalprice;
			orderdata["orderlength"]=i;
			orderdata["valid"]=valid;
			return orderdata;
		},
		orderandcheckin:function()
		{
			var orderdata=this._getorderform();
			if (M.isEmpty(orderdata.guestname)) {
				alert("请输入姓名");
				return;
			}
			if (M.isEmpty(orderdata.rm_paytype)) {
				alert("请选择房费支付方式");
				return;
			}
			if (M.isEmpty(orderdata.dt_paytype)) {
				alert("请选择押金支付方式");
				return;
			}
			if(M.isEmpty(orderdata.paystatus))
			{
				alert("请选择付款状态");
				return;
			}
			/*
			 if(orderdata.paystatus!="1")
			 {
			 alert("只有付款状态为已付全款时才能直接入住");
			 return;
			 }*/
			var action=this.context.ordercell.attr("action");
			if(action=="add")
			{
				orderdata["a"]="orderandcheckin";
			}
			else if(action=="edit")
			{
				orderdata["a"]="saveorderandcheckin";
				var setid=this.context.ordercell.attr("setid");
				var oid=this.context.ordercell.attr("oid");
				orderdata["setid"]=setid;
				orderdata["orderid"]=oid;
			}
			this.context.multiguesttip.hide();
			//请求开始
			var btn=this.context.orderform.children(".modal-footer").children("a[tag=checkin]");
			if(!this.req_before(btn)){return;}

			M._getjson("ajax.php",orderdata,
				this.orderandcheckin_finished.toEventHandler(this));
		},
		orderandcheckin_finished:function(d)
		{
			if (d.status == "success") {
				var cols=this.context.ordercell.attr("col");
				var row=this.context.ordercell.attr("row");

				if(d.req.a=="orderandcheckin")
				{
					if(!M.isEmpty(row)||!M.isEmpty(cols)){
						this._clearitem(row, cols);
					}

				}
				else
				{
					this._clearitembyset(d.req.setid,"ordered");
				}

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var items = d.data;
				this._showitems(items);
				this._clear_jumpselected();
				this.calc_leftrooms();
				this._closepopup();
				var payname = d.payname;
				var action = d.req.a;
				payname.action = action;
				payname.a = "getpayinfo";
				this.orderdetail={"a":action,"items":items,"paydetail":payname};
				this.cashier();
				var printcheckinset=this.printset.checkin;
				if(printcheckinset==1&&(d.req.a=="orderandcheckin"||d.req.a=="saveorderandcheckin")){
					this.context.printform.attr("operate","checkin").attr("unqid",items[0].orderuniqid);
					this.print();
					//M.Popup(this.context.printform,{"hideclass":"modal sm fade","showclass":"modal sm fade in"});
				}
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}

			//请求结束
			var btn=this.context.orderform.children(".modal-footer").children("a[tag=checkin]");
			this.req_end(btn);
		},
		_geteditform:function()
		{
			var hiddencell=this.context.ed_hiddencell;
			var oid=hiddencell.attr("oid");
			var roomid=M.getVal(this.context.ed_room);
			var roomname=this.context.ed_room.children(":selected").text().trim();

			var checkindate=M.getVal(this.context.ed_checkindate);
			var nights=M.getVal(this.context.ed_nights);
			var totalprice=M.getVal(this.context.ed_totalprice);
			var paystatus=M.getVal(this.context.ed_paystatus);
			var deposit=M.getVal(this.context.ed_deposit);
			var guestname=M.getVal(this.context.ed_guestname);
			var phone=M.getVal(this.context.ed_phone);
			var channel=M.getVal(this.context.ed_channel);
			var needcar=this.context.ed_needcar.attr("checked");
			needcar=needcar=="checked"?1:0;
			var needcar2=this.context.ed_needcar2.attr("checked");
			needcar2=needcar2=="checked"?1:0;

			var remark=M.getVal(this.context.ed_remark);

			var cols = hiddencell.attr("cols");
			var rows = hiddencell.attr("row");

			nights=parseInt(nights);
			var orderdata={
				//"a":"saveorder",
				"orderid":oid,
				"roomid": roomid,
				"roomname": roomname,
				"totalprice": totalprice,
				"guestname": guestname,
				"n": nights,
				"phone": phone,
				"date": checkindate,
				"arrivetime":"",
				"remark":remark,
				"channel":channel,
				"rows": rows,
				"cols":cols,
				"idnum":"",
				"paystatus":paystatus,
				"deposit":deposit,
				"needcar":needcar,
				"needcar2":needcar2
			};
			return orderdata;
		},
		saveorder:function()
		{
			var orderdata=this._geteditform();
			if (M.isEmpty(orderdata.guestname)) {
				alert("请输入姓名");
				return;
			}
//        if (M.isEmpty(orderdata.phone)) {
//            alert("请输入手机号");
//            return;
//        }
			if(M.isEmpty(orderdata.paystatus))
			{
				alert("请选择付款状态");
				return;
			}
			orderdata["a"]="saveorder";

			//请求开始
			var btn=this.context.editorder.children(".modal-footer").children("a[tag=save]");
			if(!this.req_before(btn)){return;}

			M._getjson("ajax.php", orderdata, this.saveorder_finished.toEventHandler(this));
		},
		saveorder_finished:function(d)
		{
			if(d.status=="success")
			{
				/*重置原有*/
				var row=this.context.ed_hiddencell.attr("row");
				var cols=this.context.ed_hiddencell.attr("cols");

				var detail=d.data;
				this._clearitem(row, cols);

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var item = d.data;

				this._showitem(item,itemdate);

				this.calc_leftrooms();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			this.temporderdetail=null;
			//请求结束
			var btn=this.context.editorder.children(".modal-footer").children("a[tag=save]");
			this.req_end(btn);
		},
		saveorderandcheckin:function()
		{
			var orderdata=this._geteditform();
			if (M.isEmpty(orderdata.guestname)) {
				alert("请输入姓名");
				return;
			}
			if(M.isEmpty(orderdata.paystatus))
			{
				alert("请选择付款状态");
				return;
			}
			orderdata["a"]="saveorderandcheckin";

			//请求开始
			var btn=this.context.editorder.children(".modal-footer").children("a[tag=checkin]");
			if(!this.req_before(btn)){return;}
			this.temporderdetail=null;
			M._getjson("ajax.php", orderdata, this.saveorderandcheckin_finished.toEventHandler(this));
		},
		saveorderandcheckin_finished:function(d)
		{
			if(d.status=="success")
			{
				/*重置原有*/
				var row=this.context.ed_hiddencell.attr("row");
				var cols=this.context.ed_hiddencell.attr("cols");

				var detail=d.data;
				var payname=d.payname;
				var action = d.req.a;
				payname.action = action;
				payname.a = "getpayinfo";
				this._clearitem(row, cols);

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var item = d.data;

				this._showitem(item,itemdate);
				this.orderdetail={"a":action,"items":item,"paydetail":payname};
				this.cashier();
				this.calc_leftrooms();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}

			//请求结束
			var btn=this.context.editorder.children(".modal-footer").children("a[tag=checkin]");
			this.req_end(btn);
		},
		_clearorderform:function()
		{
			this.context.orderformbody.children().find("div[tag=guestlist]").hide();
			this.context.o_nights.val(1);
			this.multiguest=[];
			M.emptyVal(this.context.o_guestname);
			M.emptyVal(this.context.o_phone);
			M.emptyVal(this.context.o_totalprice);
			this.context.o_totalprice.attr("price","");
			M.emptyVal(this.context.o_arrivetime);
			this.context.o_channel.val('self').attr("disabled",false);
			M.emptyVal(this.context.roomcost);
			M.emptyVal(this.context.depositcost);
			M.emptyVal(this.context.o_remark);
			this.context.rmpayBox.removeClass("ip-right").addClass("ip-dropdown");
			this.context.dtpayBox.removeClass("ip-right").addClass("ip-dropdown");
			var orderfields=this.context.orderform.children(".modal-body").find(".cntlist");
			//orderfields.children("li[tag=paystatus]").children().find("div[t=account]").remove();
			//orderfields.children("li[tag=paystatus]").children().find("div[tag=accountlist]").html('');
			//orderfields.children("li[tag=paystatus]").children().find("span[tag=roomratetipe]").text("支付房费");
			orderfields.children("li[tag=idcard]").children().find("a[tag=multiguest]").html("");
			/*是否可以入住*/
			this.context.orderandcheckinbtn.hide();
			this.context.o_paystatus.attr("checked",false);
			M.emptyVal(this.context.o_deposit);
			this.context.o_needcar.attr("checked",false);
			this.context.o_needcar2.attr("checked",false);
			this.opaystatus_change();
			this.context.ordercell
				.attr("row","")
				.attr("col","");

			this.context.ordercell
				.attr("fromdate","")
				.attr("enddate","");

			this.context.ordercell.attr("status","").attr("ordersetid","").attr('checkinsetid',"");
			this.context.ordercell.attr("color","");
			/*清除*/
			var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");
			var i=0;
			this.droplist.order={};
			orderroomlist.children("div[tag=order]").each(function(){
				if(i>0)
				{
					$(this).children("div[tag=room]").unbind("change");
					$(this).children("div[tag=checkindate]").unbind("change");
					$(this).children("div[tag=nights]").unbind("change");
					$(this).children("p[tag=order][tag=price]").unbind("blur");
					$(this).remove();
				}else{
					$(this).attr("i",0);
				}
				i++;
			});
			orderroomlist.children("div[tag=order]").children("a[tag=removeroom]").attr("class","add-book").attr("tag","addroom");
			var orderinfo=orderroomlist.children("p[tag=orderinfo]");
			var length=orderinfo.children("a[tag=addroom]").length;
			this.context.orderform.children("div[tag=head]").children("h4").attr("type","");
			var orderindex=orderinfo.attr("maxi","0");
			orderinfo.children("b").children("span[tag=totalprice]").html();
			var orderfield=orderroomlist.children("div[tag=order]:first");
			var orderinfo=orderfield.attr("i","0").attr("oid","");
			orderfield.find("div[id=selectDay]").attr("value","").children("span").attr("value",'');
			orderfield.find("input[tag=price]").attr("disabled",false);
			orderfield.find("div[tag=selectRoom]").attr("value","").children("span").attr("value",'');
			orderfield.find("div[tag=selectNights]").attr("value","").children("span").attr("value",'');
			this.context.orderformbody.children("li[tag=channel]").children("div").attr("value","").children("span").attr("value",'');
			var length=orderfield.find("a[tag=removeroom]").length;
			orderfield.find("a[tag=removeroom]").hide();
			this.context.idnum.val("");
			this.context.idtype.val("1");
			this.context.orderformbody.children("li[tag=ordercolor]").children("div[tag=color]").show();
			var colorfield=this.context.orderformbody.children("li[tag=ordercolor]");
			var selected = colorfield.find("div[tag=colorlist]").children("span[ison=1]");
			selected.attr('ison',"0");
			selected.attr("class",selected.attr("val"));

			var first=colorfield.find("div[tag=colorlist]").children("span:first");
			first.attr("ison","1");
			first.attr("class",first.attr("val")+" checked");
			colorfield.children("div[tag=color]").children("span").attr("class",first.attr("val")+" checked");

			this.formatedateprice={};
			//this.context.orderandcheckinbtn.show();
			this.context.o_deposit.show();
			this.context.o_needcar.attr("checked",false).parent().show();
			this.context.o_paystatus.show().attr("disabled",false);
			var orderfields=this.context.orderform.children(".modal-body").find(".cntlist");
			//xinr补交房费
			orderfields.children("li[tag=paytype]").children().find("input[name=roomrate]").val('0');
			orderfields.children("li[tag=paytype]").children().find("div[t=deposit]").show();
			//押金
			orderfields.children("li[tag=paytype]").children().find("input[name=deposit]").val('0');

//		var myDate = new Date();
//		var date1 = myDate.toLocaleDateString();
//		var today = M.strtotime(date1);
//		var arrivedate = '';
//		var date=$(checkinselect).children("span").attr("value");
//		var datetime=M.strtotime(date);
//		if(M.isEmpty(arrivedate)||arrivedate>datetime){
//			arrivedate=datetime;}
//		if(today<arrivedate){
//		orderfields.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("支付定金：");
//		}
		},
		_clearcheckinform:function()
		{
			/*初始化*/
			var formlist=this.context.editcheck.children(".modal-body").find(".cntlist");
			var guestnameinput=formlist.children("li[tag=guestname]").find("input[type=text]");
			var phoneinput=formlist.children("li[tag=phone]").find("input[type=text]");

			//var channelcodeinput=formlist.children("li[tag=channelcode]").find("select");
			var needcarli = formlist.children("li[tag=needcar]");
			needcarli.find("input[type=checkbox][tag=needcar2]").attr("checked",false);
			needcarli.show();
			//var paystatusinput=formlist.children("li[tag=paystatus]").find("select");
			var depositinput=formlist.children("li[tag=paystatus]").find("input[type=text][tag=deposit]");
			var remarkinput = formlist.children("li[tag=remark]").find("textarea");
			//formlist.children("li[tag=paystatus]").children().find("span[tag=roomratetip]").text("支付定金");
			formlist.children("li[tag=paystatus]").children().find("span[tag=roomratetip]").text("支付房费");
			var hiddencell = this.context.editcheck.children(".modal-footer").find("input[type=hidden]");
			formlist.children("li[tag=paytype]").children().find("input[name=roomrate]").val('0');
			formlist.children("li[tag=idcard]").children().find("a[tag=multiguest]").html('');
			this.context.c_paystatus.attr("checked",false);
			M.emptyVal(formlist.children("li[tag=remark]").find("textarea"));
			hiddencell.attr("gid","");
			hiddencell.attr("rid","");
			hiddencell.attr("row","");
			hiddencell.attr("cols","");
			hiddencell.attr("setid","");
			hiddencell.attr("color","");

			M.emptyVal(guestnameinput);
			M.emptyVal(phoneinput);
			//M.emptyVal(channelcodeinput);
			M.emptyVal(remarkinput);

			/*是否可以入住*/
			//M.emptyVal(paystatusinput);
			M.emptyVal(depositinput);
			depositinput.hide();
			/*清除*/
			var orderroomlist=formlist.children("li[tag=orderroomlist]");
			var i=0;
			orderroomlist.children("div[tag=order]").each(function(){
				if(i>0)
				{
					$(this).remove();
				}
				i++;
			});
			var orderinfo=orderroomlist.children("div[tag=orderinfo]");
			var orderindex=orderinfo.attr("maxi","0");
			var orderinfo=orderroomlist.children("div[tag=order]:first").attr("i","0").attr("gid","");
			this.formatedateprice={};

			var colorfield=formlist.children("li[tag=ordercolor]").children("div");

			var selected = colorfield.children("span[ison=1]");
			selected.attr('ison',"0");
			selected.attr("class",selected.attr("val"));

			colorfield.children("span[for=checkedin]").hide();
			colorfield.children("span[for=checkedout]").hide();

			this.context.ordercell.attr("status","").attr("ordersetid","").attr('checkinsetid',"");
		},
		orderroomtpl_change:function(orderroomlist)
		{
			//var orderroomlist=this.context.orderformbody.children("li[tag=orderroomlist]");
			var orderrooms=orderroomlist.children("div[tag=order]");
			if(orderrooms.length>1)
			{
				orderroomlist.children("div[tag=order]").children("a[tag=addroom]").remove();
				orderroomlist.children("div[tag=order]").children("a[tag=removeroom]").remove();
				orderroomlist.children("div[tag=order]").append('<a title="删除该预订" class="del-book mr5 mt5" href="javascript:;" tag="removeroom"></a>');
				orderroomlist.children("div[tag=order]:last").append('<a title="添加预订" class="add-book mt5" href="javascript:;" tag="addroom"></a>');

			}
			else
			{
				orderroomlist.children("div[tag=order]").children("a[tag=addroom]").remove();
				orderroomlist.children("div[tag=order]").children("a[tag=removeroom]").remove();
				orderroomlist.children("div[tag=order]:last").append('<a title="添加预订" class="add-book mt5" href="javascript:;" tag="addroom"></a>');
			}
			/*计算订单总价*/
			this._sumorderprice(orderroomlist);
		},
		addroomtpl:function(orderroomlist)
		{
			/*添加房间模版*/
			//var orderroomlist=form.find(".cntlist").children("li[tag=orderroomlist]");
			var orderinfo=orderroomlist.children("div[tag=orderinfo]");
			var orderindex=orderinfo.attr("maxi");
			orderindex=M.isEmpty(orderindex)?0:parseInt(orderindex);
			orderindex++;
			orderinfo.attr("maxi",orderindex);
			var tpl=orderroomlist.children("div[tag=order]:last");

			/*处理日期选择框*/
			var newtpl=tpl.clone(true);
			newtpl.attr("i",orderindex);
			newtpl.insertBefore(orderinfo);
			newtpl.children("a[class=del-book]").show();
			var checkindate=tpl.children("div[id=selectDay]").children("span").attr("value");
			var roomid=tpl.children("div[id=selectRoom]").children("span").attr("value");
			newtpl.children("div[id=selectDay]").attr("value",checkindate);
			newtpl.children("div[id=selectRoom]").attr("value",roomid);
			newtpl.children("div[id=selectNights]").attr("value",1);
			newtpl.attr("oid","").attr("gid","");
			/*显示新添加的项的价格*/
			this.showorderprice(orderroomlist,orderindex);
			this.orderroomtpl_change(orderroomlist);
		},
		removeroomtpl:function(ele)
		{
			var orderroomlist=ele.parents("li[tag=orderroomlist]");
			ele.parent().remove();
			var date=this._getcheckindate(orderroomlist);
			arrivedate_time=M.strtotime(date);
			var cancheckin=this._checkinable(arrivedate_time);
			if(cancheckin)
			{
				this.context.orderandcheckinbtn.show().attr("cancheckin","1");
			}
			else
			{
				this.context.orderandcheckinbtn.hide().attr("cancheckin","0");
			}
			this.orderroomtpl_change(orderroomlist);
			this._orderdate_change(orderroomlist);
		},
		_getcheckindate:function(ele){
			var tpl=ele.children("div[tag=order]").children("div[id=selectDay]");
			var date='';
			tpl.each(function(){
				var select_date=$(this).children("span").attr("value");
				if(select_date<date||date==''){
					date=select_date;
				}
			});
			return date;

		},
		submitorder:function()
		{
			var orderdata=this._getorderform();
			var orderdetailtmp=this.temporderdetail;

			if(!M.isEmpty(orderdetailtmp)&&orderdetailtmp.orderfrom=='elong'){
				orderdata.style='oota';
			}
			if(!orderdata.valid)
			{
				return;
			}
			if (M.isEmpty(orderdata.guestname)) {
				alert("请输入姓名");
				return;
			}
			if (M.isEmpty(orderdata.rm_paytype)) {
				alert("请选择房费支付方式");
				return;
			}
			if (M.isEmpty(orderdata.dt_paytype)) {
				alert("请选择押金支付方式");
				return;
			}
			if(orderdata.idnum!=""&&orderdata.idtype=="1"){
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(reg.test(orderdata.idnum) === false)
				{
					alert("请输入正确的身份证号");
					return;
				}
			}
			//收银台金额不能为0
			if(orderdata.rm_paytype == "shouyintai" && orderdata.appendmoney == 0){
				alert("房费不能为0，请输入正确的房费金额。");
				return;
			}
			var action=this.context.ordercell.attr("action");

			if(action=="add")
			{
				orderdata["a"]="submitorder";
			}
			else if(action=="edit")
			{
				orderdata["a"]="saveorder";
				var setid=this.context.ordercell.attr("setid");
				var oid=this.context.ordercell.attr("oid");
				orderdata["setid"]=setid;
				orderdata["orderid"]=oid;
			}
			else if(action=="hisadd")
			{
				orderdata["a"]="hisadd";
			}
			this.context.multiguesttip.hide();
			//请求开始
			var btn=this.context.orderform.children(".modal-footer").children("a[tag=suborder]");
			if(!this.req_before(btn)){return;}

			M._getjson("ajax.php",orderdata,this.order_finished.toEventHandler(this));

		},
		order_finished: function (d) {
			if (d.status == "success") {
				var type="ordered";
				var row=d.req.rows;
				var cols=d.req.cols;

				var detail=d.data;
				var items = d.data;
				//短信通知收款链接框
				var payname = d.payname;
				var action = d.req.a;
				payname.action = action;
				payname.a = "getpayinfo";

				this.orderdetail={"a":action,"items":items,"paydetail":payname};
				if(!M.isEmpty(d.req.setid)){
					this._clearitembyset(d.req.setid,"ordered");
				}
				if(d.req.a=="saveorder"){
//                if(payname.rm_paytype == "shouyintai"){
//                    this.showMsgpops(payname);
//                    //请求接口
//                    this.context.payinfo.attr("oid",payname.accountid);
//                    var desc = this.context.cashierPop.find("input[tag=desc]").val();
//                    var innname = this.context.header.children("div[class=inn-name]").children("h1").text();
//                    payname.desc = desc;
//                    payname.innname = innname;
//                    M._getjson("ajax.php", payname,this.getpayMsg_finished.toEventHandler(this));
//                    this._resultinfo(payname);
//                }
					var olddata=d.olddata.orders;
				}
				/*重新显示最新*/
				var itemdate=this._getitemdate();

				this._showitems(items);
				this._clear_jumpselected();
				this.calc_leftrooms();
				this._closepopup();
				this._clearorderform();
				this.cashier();

			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}

			//请求结束
			var btn=this.context.orderform.children(".modal-footer").children("a[tag=suborder]");
			this.req_end(btn);
		},
		_resultinfo:function(payname){
			this.context.cashierPop.find("div[tag=result]").find("span[tag=sguestname]").text(payname.guestname);
			this.context.cashierPop.find("div[tag=result]").find("span[tag=eguestname]").text(payname.guestname);
			if(payname.action == "submitorder" || payname.action == "hisadd"){
//            var appenddesc = "支付定金";
				var appenddesc = "支付房费";
			}else{
				var appenddesc = "补交房费";
			}
			this.context.cashierResult.find("span[tag=desc]").text(payname.roomname+"("+payname.roomtypename+"),"+appenddesc);
		},

		getpayBox_finished:function(d){
			if(d.status=="success"){
				var info = d.info;
				var data = info.data;
				//支付结果默认隐藏
				this.context.cashierPop.find("div[tag=step]").show();
				this.context.cashierPop.find("div[tag=result]").hide().find("div[tag=success]").hide().find("div[tag=fail]").hide();

				this.context.cashierPop.find("img[tag=qrcode]").attr("src",data.pay_qr);
				this.context.payinfo.attr("outid",data.trade_no);
				this.context.cashierPop.find("div[tag=qrcodeinfo]").show();
				this.context.cashierPop.find("div[tag=qrcodedesc]").show();
				this.context.cashierPop.find("div[tag=boxpayinfo]").hide();
				this.context.cashierPop.find("li[tag=qrcode]").attr("class","checked");
				this.context.cashierPop.find("li[tag=boxpay]").attr("class","");
				M.Popup(this.context.cashierPop,{"hideclass":"modal cashier cashier-s fade","showclass":"modal cashier cashier-s fade in"});
				this.qrOpened = true;
				this._longPolling();
			}else{
				M.error(d.msg);
			}
		},
		showMsgpops:function(msgpop){
			var payinfo = msgpop.paydata;
			var innname=this.context.header.children("div[class=inn-name]").children("h1").text();
			this.context.cashiermsgPop.find("a[tag=innname]").html(innname);
			this.context.cashiermsgPop.find("span[tag=totalprice]").html("&yen;"+msgpop.appendmoney);
			this.context.cashiermsgPop.find("a[tag=descprice]").html(msgpop.appendmoney);
			this.context.cashiermsgPop.find("input[tag=phone]").attr("guestname",msgpop.guestname);
			this.context.cashiermsgPop.find("input[tag=phone]").attr("uniqid",msgpop.orderuniqid);
			var phone = msgpop.phone;
			if(!M.isEmpty(phone)){
				this.context.cashiermsgPop.find("input[tag=phone]").attr("hasphone",1).val(phone);
			}else{
				this.context.cashiermsgPop.find("input[tag=phone]").attr("hasphone",0).val(phone);
			}
			//房型
			/*
			 var descroomname = "";
			 for(var i=0;i<payinfo.length;i++){
			 var obj = payinfo[i];
			 descroomname+=obj.roomtypename;
			 if(i!=payinfo.length-1){
			 descroomname+="，";
			 }
			 }
			 */
			var descroomname = msgpop.roomtypename;
			this.context.cashiermsgPop.find("a[tag=descroomname]").html(descroomname);
			var guestname = msgpop.guestname;
			var orderinfo = this._showCsahierDesc(payinfo,guestname,"msg");
			//flag==hisadd需显示支付房费
			var flag = msgpop.action;
			if(flag == "submitorder"){
//            orderinfo+="，"+"支付定金";
				orderinfo+="，"+"支付房费";
			}
			if(flag == "saveorder"){
				orderinfo+="，"+"补交房费";
			}
			target = this.context.cashiermsgPop;
			target.find("span[tag=desc]").html(orderinfo);
			this._showCashierTip(payinfo,"msg");
		},
		showBoxpops:function(msgpop,flag){
			var payinfo = msgpop.paydata;
			this.context.cashierPop.find("span[tag=totalprice]").html("&yen;"+msgpop.appendmoney);

			var guestname = msgpop.guestname;
			var orderinfo = this._showCsahierDesc(payinfo,guestname,"box");
			//flag==hisadd需显示支付房费
			if(flag == "hisadd" || flag=="orderandcheckin"){
//            orderinfo+="，"+"支付定金";
				orderinfo+="，"+"支付房费";
			}else{
				orderinfo+="，"+"补交房费";
			}
			target = this.context.cashierPop;
			target.find("span[tag=desc]").html(orderinfo);
			this._showCashierTip(payinfo,"box");
		},
		_showCsahierDesc:function(payinfo,guestname,flag){
			var objdata = payinfo[0];
			var indatestr= M.strtotime(objdata.indate);
			var indate= M.timeformat(indatestr,'m/d');
			var orderinfo = "";
			orderinfo=objdata.roomname+"("+objdata.roomtypename+"),"+indate+"入住，住"+objdata.nights+"晚";
			if(payinfo.length>1){
				orderinfo+="...<i class='ico-question' tag='desctip'></i>";
			}
			orderinfo+="</br>"+guestname;
			return orderinfo;
		},
		_showCashierTip:function(payinfo,flag){
			var tip = "";
			var ysydesc = "";
			for(var j=0;j<payinfo.length;j++){
				var data = payinfo[j];
				var indatestr= M.strtotime(data.indate);
				var indate= M.timeformat(indatestr,'m/d');
				tip+=data.roomname+"("+data.roomtypename+")，"+indate+"入住，住"+data.nights+"晚</br>";
				ysydesc+=data.roomtypename+"，"+indate+"入住，住"+data.nights+"晚</br>";
			}
			if(flag=="msg"){
				target = this.context.cashiermsgPop;
			}
			if(flag=="box"){
				target = this.context.cashierPop;
			}
			this.context.cashierPop.find("input[tag=desc]").val(ysydesc);
			target.find("i[tag=desctip]").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:tip,show:{duration:100}});
		},
		_handletooltip:function(type,tpl,orderlist,account){
			var appendmoney=account.payedtotal;
			tpl.each(function(){
				var id='';
				if(type=="order"){
					id=$(this).children("div").children("div").attr("oid");
				}else{
					id=$(this).children("div").children("div").attr("cid");
				}
				var title='';
				for(var i=0;i<orderlist.length;i++){
					var order=orderlist[i];
					if(order.id==id){
						order.appendmoney=appendmoney;
						if(type=="order"){
							order.indate=order.arrivedate;
							order.type="ordered";
						}else{
							order.indate=order.arrivedate;
							if(order.groupstatus==1){
								order.type="checkedin";
							}else{
								order.type="checkedout";
							}
						}

						title=pickeraction._showtip(order);
						var key_tip=order.id+order.type;
						pickeraction.tooltipmsg[key_tip]=title;
					}
				}
				$(this).children("div").children("div").attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:title,show:{duration:100}});

			});

		},

		_handleaccountdetail:function(account){
			this.context.findetailform.children().find("div[tag=findetaillist]").find("div[t=account]").remove();
			var html='';
			var tpllist=this.context.findetailform.children().find("div[tag=findetaillist]");
			tpllist.find("div[tag=tpl_detail]").hide();
			tpllist.find("div[tag=tpl_editform]").hide();
			if(!M.isEmpty(account.flag)&&account.flag==1){
				this.context.canPopDetail = account.appendmoney.length;
				if (this.caneditaccount == 1) {
					var account_tpl = tpllist.find("div[tag=tpl_editform]");
					for (var i = 0; i < account.appendmoney.length; i++) {
						var a = account.appendmoney[i];
						if ('1' == a.isedit) {
							var account_t = account_tpl.clone(true).attr("t", "account").show();
							account_t.attr("aid", a.id);
							account_t.children("div[tag=d]").children("span").html(a.msg);
							var editform = account_t.children("div[tag=editform]");
							editform.children("span").html(a.edittitle);
							editform.children("input[name=money]").val(a.amount);
							editform.children("div[t=editaccount]").attr("value", a.paytypecode);
							this.droplist.order.editaccount = M.DropdownList(editform.children("div[t=editaccount]"), null, {});
							account_tpl.before(account_t);
						} else {
							var paystatusStr = '';
							if ('shouyintai' == a.paytypecode) {
								if ('1' == a.paystatus) {
									paystatusStr = ' <span class="green">[已付款]</span>';
								} else if ('2' == a.paystatus) {
									paystatusStr = ' <span>[已关闭]</span>';
								} else {
									var tpl = a.remark;
									paystatusStr ='<div style="display:none" tag="remark">'+tpl+'</div> <span id='+ a.id +' total_fee = '+ a.amount+' tradingcode='+ a.tradingcode+' class="red">[待付款</span>--<a tag="paysyt" href="#?">点击重新支付</a>]';
								}
							}
							var payitem= M.isEmpty(a.detaillist)?'':a.detaillist.payitem;
							if(M.isEmpty(payitem)){payitem='';}
							var payitemtype= M.isEmpty(a.detaillist)?'':a.detaillist.payitemtype;
							if(M.isEmpty(payitemtype)){payitemtype='';}
							var item = '<div t="account" operate="'+payitem+'" operatetype="'+payitemtype+'" tag="re">' + a.msg + paystatusStr + '</div>';
							account_tpl.before(item);
						}
					}
				} else {
					var account_tpl = tpllist.find("div[tag=tpl_detail]");
					for (var i = 0; i < account.appendmoney.length; i++) {
						var paystatusStr = '';
						if ('shouyintai' == account.appendmoney[i].paytypecode) {
							if ('1' == account.appendmoney[i].paystatus) {
								paystatusStr = ' <span class="green">[已付款]</span>';
							} else if ('2' == account.appendmoney[i].paystatus) {
								paystatusStr = ' <span>[已关闭]</span>';
							} else {
								paystatusStr = ' <span class="red">[待付款]</span>';
							}
						}

						html += '<div>' + account.appendmoney[i].msg + paystatusStr + '</div>';
					}
					account_tpl.html(html).show();
				}
			} else {
				if (account.payedtotal != 0 && !M.isEmpty(account.payedtotal)) {
					var account_tpl = tpllist.find("div[tag=tpl_detail]");
					html += '<div>已交房费：¥' + account.payedtotal + '</div>';
					account_tpl.html(html).show();
				}

			}
		},
		editorder:function(ele)
		{
			this.tempavarooms={};
			var temp=this.temporderdetail;
			var account=temp.account;
			var uniqid=temp.orderuniqid;
			this.context.multiguestform.attr("uniqid",uniqid).attr("orderstatus","order");
			//入住日期
			var date=M.strtotime(temp.arrivedate);
			var disable=false;

			this._clearorderform();
			this.formatedateprice={};

			var orderfields=this.context.orderform.children(".modal-body").find(".cntlist");
			var orderroomlist=orderfields.children("li[tag=orderroomlist]");
			var orderinfo=orderroomlist.children("div[tag=orderinfo]");
			var tpl_chanle=orderfields.children("li").children("div[id=droplist]").attr("value",temp.channelcode);
			this.droplist.order.dr_chanle=M.DropdownList(tpl_chanle,this.channel_change.toEventHandler(this),{});
			orderfields.children("li[tag=paystatus]").children().find("div[tag=accountlist]").html('');
			var needpayed=parseInt(temp.orderset.totalprice)-parseInt(account.payedtotal);
			orderfields.children("li[tag=paytype]").children("div[tag=paystatistics]").show().find("span[tag=needpay]").html("&yen;"+needpayed);
			orderfields.children("li[tag=paytype]").children("div[tag=paystatistics]").show().find("a[tag=showfindetail]").attr("payed",account.payedtotal).html("&yen;"+account.payedtotal)
				.attr("title","").tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:"查看/修改房费",show:{duration:100}});
			this._handleaccountdetail(account);
			var idcard_tpl=this.context.orderformbody.children("li[tag=idcard]").children("div").children("div[t=idcardform]");
			if(idcard_tpl.length>0){
				idcard_tpl.attr("value",temp.idtype);
				this.context.orderformbody.children("li[tag=idcard]").children().find("input[name=idcard]").val(temp.idnum);
				this.droplist.order.idcard=M.DropdownList(idcard_tpl,null,{});
			}
			var orderindex=0;
			var tpl=orderroomlist.children("div[tag=order]:first");
			var orderset=temp.orderset;
			/*生成房间数据*/
			var orders=orderset.orders;
			this.context.o_channel.attr("disabled",disable);
			this.context.o_paystatus.attr("disabled",disable);
			if(temp.paystatus==3){
				this.context.o_paystatus.attr("checked",true);
			}
			if(orders.length>0)
			{
				var order=orders[0];
				var arrivedate=M.strtotime(order.arrivedate);
				var dateoptions=this._generateorderdates(arrivedate);

				var firstorder=orderroomlist.children("div[tag=order]:first");
				firstorder.children("div[id=selectDay]").attr("value",order.arrivedate).children("div[tag=checkindate]").html(dateoptions.options).attr("disabled",disable);//.val(order.arrivedate);
				firstorder.children("div[id=selectRoom]").attr("value",order.roomid).attr("roomid",order.roomid).children("span").attr("value",order.roomid).text(order.roomname);
				firstorder.children("div[id=selectNights]").attr("value",order.nights).attr("nights",order.nights).attr("disabled",disable);
				firstorder.children("input[type=text][tag=price]").val(order.totalprice).attr("disabled",disable).attr("isfirst",1);
				firstorder.attr("i",orderindex);
				firstorder.attr("oid",order.id);
				this.droplist.order.dr_orderdate=M.DropdownList(firstorder.children("div[id=selectDay]"),this.orderdate_change.toEventHandler(this),{});
				//this.droplist.order.dr_orderdate._setval({'value':order.arrivedate});
				//订单颜色
				if(temp.orderfrom!='elong')
				{

					var colorfield=orderfields.children("li[tag=ordercolor]").children("div[tag=color]").show();
					var coloritem=colorfield.find("div[tag=colorlist]").children("span[val="+orderset.orders[0].style+"]");
					this.setordercolor(coloritem);
				}else{
					orderfields.children("li[tag=ordercolor]").children("div[tag=color]").hide();
				}
				/*根据arrivedate获取可入住房间*/
				var i=0;
				this._getavailablerooms("editorder",order.arrivedate,i,orderset.id,order.id);

				for(var j=1;j<orders.length;j++)
				{
					order=orders[j];
					orderindex++;
					arrivedate=M.strtotime(order.arrivedate);
					dateoptions=this._generateorderdates(arrivedate);

					var ordertpl=tpl.clone(true);
					ordertpl.insertBefore(orderinfo);
					ordertpl.attr("i",orderindex);
					ordertpl.attr("oid",order.id);

					ordertpl.children("a[tag=removeroom]").show();
					ordertpl.children("div[id=selectDay]").attr("value",order.arrivedate).children("div[tag=checkindate]").html(dateoptions.options).attr("disabled",disable);
					ordertpl.children("div[id=selectRoom]").attr("value",order.roomid).attr("roomid",order.roomid).children("span").attr("value",order.roomid).text(order.roomname);
					ordertpl.children("div[id=selectNights]").attr("value",order.nights).attr("nights",order.nights).attr("disabled",disable);
					ordertpl.children("input[type=text][tag=price]").val(order.totalprice).attr("disabled",disable).attr("isfirst",1);

					this.droplist.order.dr_orderdate=M.DropdownList(ordertpl.children("div[id=selectDay]"),this.orderdate_change.toEventHandler(this),{});
					//this.droplist.order.dr_orderdate._setval({'value':order.arrivedate});
					/*获取房型价格*/
					var fromdate=dateoptions.fromdate;
					var enddate_time=M.strtotime(dateoptions.enddate);
					enddate_time.setDate(enddate_time.getDate()+this.maxnights);
					var enddate=this.timeformat(enddate_time);
					var i=0;

					this._getavailablerooms("editorder",order.arrivedate,orderindex,orderset.id,order.id);
				}
				orderinfo.attr("maxi",orderindex);
				this.orderroomtpl_change(orderroomlist);
			}
			//补交房费
			orderfields.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("补交房费：");
			var roomrate=orderfields.children("li[tag=paytype]").find("div[t=roomrate]").attr("value","cash");
			this.droplist.order.paymentsdroplist=M.DropdownList(roomrate,null,{});
			if(M.isEmpty(account.pt_deposit)){
				account.pt_deposit='cash';
			}
			var deposit_tpl=orderfields.children("li[tag=paytype]").find("div[t=deposit]").attr("value",account.pt_deposit);
			this.droplist.order.depositBoxdroplist=M.DropdownList(deposit_tpl,null,{});
			orderfields.children("li[tag=paytype]").find("input[name=deposit]").val(temp.account.deposit);


			this.droplist.order.dt_paytype=M.DropdownList(deposit_tpl,null,{});
			orderinfo.find("span[tag=totalprice]").html("¥"+orderset.totalprice);
			orderset.guestname=orderset.guestname.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			this.context.o_guestname.val(orderset.guestname);
			this.context.o_phone.val(orderset.phone);
			this.context.o_paystatus.val(orderset.paystatus);
			this.context.o_deposit.val(orderset.deposit=="0"?"":orderset.deposit);
			this.context.o_channel.val(orderset.channelcode);
			this.context.o_needcar.attr("checked",orderset.needcar=="1");
			this.context.o_needcar2.attr("checked",orderset.needcar2=="1");
			if(!M.isEmpty(orderset.remark)){
				this.context.o_remark.val(orderset.remark);
			}else{
				M.emptyVal(this.context.o_remark);
			}

			this.multiguest=temp.guestlist;
			if(this.multiguest.length==0){
				this.multiguest.length=1;
			}
			if(this.multiguest.length!=1){
				orderfields.children("li[tag=idcard]").children().find("a[tag=multiguest]").html('<i class="count" tag="count">'+this.multiguest.length+'</i>');
			}

			this.opaystatus_change();
			this._orderdate_change(orderroomlist);

			var oid=this.context.e_ordercell.attr("oid");
			var cols=this.context.e_ordercell.attr("cols");
			var row=this.context.e_ordercell.attr("row");
			var rid=this.context.e_ordercell.attr("rid");
			this.context.ordercell.attr("setid",orderset.id).attr("oid",oid).attr("color",temp.style).attr("from",temp.orderfrom).attr("cols",cols).attr("rid",rid).attr("row",row).attr("n",temp.nights);
			orderroomlist.children("p").children("a[tag=removeroom]").remove();
			orderinfo.children("a").remove();
//		if(temp.orderfrom!='elong'){
//    		orderroomlist.children("p[tag=order]").append('<a title="删除该预订" class="del-book" style="" tag="removeroom" href="#?"></a>');
//    		if(orderroomlist.children("p[tag=order]").length==1){
//    			orderroomlist.children("p").children("a[tag=removeroom]").hide();
//    		}
//    	}
			//this.eddate_change();
			this._closepopup();
			//补交房费
			orderfields.children("li[tag=paytype]").find("div[tag=roomrateform]").children("span").text("补交房费：");
			this.context.orderform.children("div[tag=head]").children("h4").html("修改订单");
			this.context.ordercell.attr("action","edit");
			this.context.orderform.attr("orderstatus","order");
			this.context.orderform.children(".modal-footer").children("a[tag=suborder]").html("确认修改").attr("text","确认修改");
			M.Popup(this.context.orderform,{"hideclass":"bootbox modal fade","showclass":"bootbox modal fade in"});
		},
		checkin_option:function(ele)
		{
			/*显示当前订单信息*/
			if(M.isEmpty(this.temporderdetail))return;
			var payform=this.context.ck_info.children("li[tag=orderinfo]").children().find("div[tag=payform]");
			payform.children("div[tag=roomrate]").children("input[name=roomrate]").attr('tag','roomratemoney');
			payform.children("div[tag=deposit]").children("input[name=deposit]").attr('tag','depositmoney');
			var account=this.temporderdetail.account;
			var orderset=this.temporderdetail.orderset;
			var uniqid=this.temporderdetail.orderuniqid;
			this.context.multiguestform.attr("uniqid",uniqid).attr("orderstatus","order");
			var orders=orderset.orders;
			var guestlist=this.temporderdetail.guestlist;

			this.context.ck_appendmoney.val("");
			/*设置订单来源样式*/
			var channel=M.isEmpty(this.temporderdetail.channelcode)?"self":this.temporderdetail.channelcode;
			var channelico=this.channelico[channel];
			this.context.ck_logo.attr("class",channelico+" fl mr10");
			this.context.ck_guestname.html(this.temporderdetail.guestname);
			if(!M.isEmpty(this.temporderdetail.idnum)){
				this.context.ck_info.children().find("div[class=select-input]").parent().css("display","none");
				this.context.checkin.children().find("p[tag=idnuminfo]").html(this.typename[this.temporderdetail.idtype]+'：'+this.temporderdetail.idnum);
			}
			this.context.checkin_idtype.val(this.temporderdetail.idtype);
			this.context.checkin_idnum.val(this.temporderdetail.idnum);
			var phonedesc=this.temporderdetail.phone;
			if(!M.isEmpty(this.temporderdetail.cityname))
			{
				phonedesc+='<tt>('+this.temporderdetail.cityname+')</tt>'
			}

			this.context.ck_phone.html(phonedesc);
			if(!M.isEmpty(this.temporderdetail.remark)){
				this.context.ck_remark.val(this.temporderdetail.remark);
			}else{
				M.emptyVal(this.context.ck_remark);
			}


			var roomrate=this.context.ck_info.children("li[tag=orderinfo]").children().find("div[tag=roomrateform]");
			roomrate.children("div").children("b[tag=payed]").html('已收房费： ¥'+account.payedtotal);
			var append=0;
			if(parseInt(orderset.totalprice)>parseInt(account.payedtotal)){
				append=parseInt(orderset.totalprice)-parseInt(account.payedtotal);
			}

			roomrate.children("div").children("b[tag=needpay]").html('还需收： <span class="red">¥'+append+'</span>');



			var payform=this.context.ck_info.children("li[tag=orderinfo]").children().find("div[tag=payform]");
			if(M.isEmpty(orderset.realdeposit)){
				orderset.realdeposit=0;
			}
			payform.children("div[tag=deposit]").children("input[name=deposit]").val(orderset.realdeposit);
			//押金
//	    payform.children("div[tag=deposit]").children("input[name=deposit]").val("");
			var drop_deposit=payform.children("div[tag=deposit]").children("div[t=deposit]").attr("value","cash");;
			this.droplist.checkin.deposit=M.DropdownList(drop_deposit,null,{});
			//补交房费
			payform.children("div[tag=roomrate]").children("input[name=roomrate]").val(0);
//	    payform.children("div[tag=roomrate]").children("input[name=roomrate]").val("");
			var drop_roomrate=payform.children("div[tag=roomrate]").children("div[t=roomrate]").attr("value","cash");
			this.droplist.checkin.roomrate=M.DropdownList(drop_roomrate,null,{});
			var idcard_tpl=this.context.ck_info.children("li[tag=idcard]").children("div").children("div[t=idcardform]");
			if(idcard_tpl.length>0){
				idcard_tpl.attr("value",this.temporderdetail.idtype);
				this.context.ck_info.children("li[tag=idcard]").children("div").children("input").val(this.temporderdetail.idnum);
				this.droplist.order.idcard=M.DropdownList(idcard_tpl,null,{});
				this.context.ck_info.children("li[tag=idcard]").children("div").children("input[name=guestname]").val(guestlist[0].guestname);
				this.context.ck_info.children("li[tag=idcard]").children("div").children("input[name=phone]").val(guestlist[0].phone);
				this.context.ck_info.children("li[tag=idcard]").children("div").children("input[name=idcard]").val(guestlist[0].idnum);
				if(guestlist.length>1){
					this.context.ck_info.children("li[tag=idcard]").children("div").find("a[tag=multiguest]").html('<i class="count">'+guestlist.length+'</i>');
				}

			}

			this.multiguest=guestlist;
			this.context.ck_info.children("li[tag=orderdesc]").children("div").children("div[tag=order]").remove();
			if(!M.isEmpty(orders))
			{
				var html='<b class="tprice">订单总额：<span>¥'+orderset.totalprice+'</span></b>';
				for(var i=0;i<orders.length;i++)
				{
					var o=orders[i];
					var fromdate=o.arrivedate;
					var fromtime=fromdate.substring(5,fromdate.length).replace("-","/");
					var odesc=o.roomname+", "+fromtime+"入住, "+o.nights+"晚"+", ¥"+o.totalprice;
					html+='<div tag="order" title="'+odesc+'">'+odesc+'</div>'
				}
				this.context.ck_info.children("li[tag=orderdesc]").children("div").html(html);
			}
			this._closepopup();
			M.Popup(this.context.checkin,{"hideclass":"modal view fade","showclass":"modal view fade in"});
		},
		checkin:function(ele)
		{
			this.context.syt.css("display","none");
			var payform=this.context.ck_info.children("li[tag=orderinfo]").children().find("div[tag=payform]");
			var roompaymoney = payform.children("div[tag=roomrate]").children("input[name=roomrate]").val();
			var payformmoney = payform.children("div[tag=deposit]").children("input[name=deposit]").val();
//	    if(M.isEmpty(roompaymoney))
//	    {
//		    alert("请输入补交房费");
//		    return;
//	    }
//	    if(M.isEmpty(payformmoney))
//	    {
//		    alert("请输入押金");
//		    return;
//	    }
			var oid=this.context.e_ordercell.attr("oid");
			if(M.isEmpty(oid))
			{
				return;
			}
			oid=parseInt(oid);
			var roomid=this.context.e_ordercell.attr("rid");
			var roomid=M.isEmpty(roomid)?"":roomid;
			var roomname="";
			var idnum='';
			var idtype='';

			var payform=this.context.ck_info.children("li[tag=orderinfo]").children().find("div[tag=payform]");
			//补交房费 输入框
			var roomrate=payform.children("div[tag=roomrate]").children("input[name=roomrate]").val();
			var rm_paytype=this.droplist.checkin.roomrate._getval();
			//押金 输入框
			var deposit=payform.children("div[tag=deposit]").children("input[name=deposit]").val();
			var dt_paytype=this.droplist.checkin.deposit._getval();
			if(isNaN(roomrate))
			{
				alert('房费金额输入格式不正确');
				return;
			}
			if(isNaN(deposit))
			{
				alert('押金金额输入格式不正确');
				return;
			}
			/*验证*/
			var remark=M.getVal(this.context.ck_remark);
			var appendmoney=M.getVal(this.context.ck_appendmoney);
			var paystatus=this.temporderdetail.paystatus;

			var setid=this.context.e_ordercell.attr("setid");
			//请求开始
			var btn=this.context.checkin.children(".modal-footer").children("a[tag=checkin]");
			if(!this.req_before(btn)){return;}
			var data={ "a": "checkin", "orderid": oid,"setid":setid,"roomid":roomid,"roomname":roomname,"remark":remark,"idnum":idnum};
			var guestlist=this.multiguest;
			var idcard_tpl=this.context.ck_info.children("li[tag=idcard]").children("div");
			data['guestname']=idcard_tpl.children("input[name=guestname]").val();
			data['phone']=idcard_tpl.children("input[name=phone]").val();
			data['idnum']=idcard_tpl.children("input[name=idcard]").val();
			data['idtype']=idcard_tpl.children("div[t=idcardform]").children("span").attr("value");
			data.guestlength=1;
			if(this.haspluginid==0){
				data['guestname']=guestlist[0].guestname;
				data['phone']=guestlist[0].phone;
				data['idnum']=guestlist[0].idnum;
				data['idtype']=guestlist[0].idtype;
			}
			if(guestlist.length>1){
				for(var i=1;i<guestlist.length;i++){
					var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
					if(!M.isEmpty(idnum)&&reg.test(guest.idnum) === false)
					{
						alert("请输入正确的身份证号");
						return;
					}
					var guest=guestlist[i];
					data['guestname'+i]=guest.guestname;
					data['phone'+i]=guest.phone;
					data['idtype'+i]=guest.idtype;
					data['idnum'+i]=guest.idnum;
				}
				data.guestlength=guestlist.length;
			}

			data.appendmoney=roomrate;
			data.rm_paytype=rm_paytype;
			data.deposit=deposit;
			data.dt_paytype=dt_paytype;
			M._getjson("ajax.php", data,
				this.checkin_finished.toEventHandler(this));
		},
		checkin_finished:function(d)
		{
			if (d.status == "success") {
				var oid = d.req.orderid;
				var o_rid=this.context.e_ordercell.attr("rid");
				var s_rid=d.req.roomid;
				var cols=this.context.e_ordercell.attr("cols");
				var row=this.context.e_ordercell.attr("row");

				//this._clearitem(row, cols);
				this._clearitembyset(d.req.setid,"ordered");

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var items = d.data;
				var payname = d.payname;
				var action = d.req.a;
				payname.action = action;
				payname.a = "getpayinfo";
				this._showitems(items);

				this.calc_leftrooms();
				this._closepopup();
				this.orderdetail={"a":action,"items":items,"paydetail":payname};
				//收银台

				this.cashier();
				if(this.printset.checkin==1){
					this.context.printform.attr("operate","checkin").attr("unqid",d.uniqid);
					this.print();
					//M.Popup(this.context.printform,{"hideclass":"modal sm fade","showclass":"modal sm fade in"});
				}
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}

			var btn=this.context.checkin.children(".modal-footer").children("a[tag=checkin]");
			this.req_end(btn);
		},

		checkinprint:function(){
			var oid=this.context.checkinoption.attr("oid");
			var setid = this.context.checkinoption.attr("setid");
			var uniqid = this.context.checkinoption.attr("uniqid");
			this.context.printform.attr("operate","checkin").attr("unqid",uniqid);
			this.printcheckinout();
		},
		printcheckinout:function(){
			var operate=this.context.printform.attr("operate");
			var unqid=this.context.printform.attr("unqid");
			var innid=this.context.roomtype.attr("innid");
			var cidstr=this.context.printform.attr("cidstr");
			if(M.isEmpty(cidstr)){
				cidstr='';
			}
			M.CloseLast();
			var href="/print.php?innid="+innid+"&operate="+operate+"&unqid="+unqid+"&cidstr="+cidstr;
			this.context.opennewurl.attr("href",href);
			window.open(href);
		},
		_constaynights:function(tdele)
		{
			var datehave=tdele.children(".date-have");
			var n=datehave.attr("n");
			var nights=parseInt(n);

			var cols=tdele.attr("idx");
			var row=tdele.parent().attr("i");
			row=parseInt(row);

			row+=nights;

			var target=this._getpickercell(row, cols);

			var days=0;
			for(var j=0;j<this.constaynights;j++)
			{
				var dateday=target.children(".date-day");
				if(dateday.length<=0)
				{
					break;
				}
				days++;
				target=target.parent().next().children("td[idx="+cols+"]");
			}
			return {"nights":nights,"days":days};
		},
		_checkinoption:function(tdele)
		{
			/*重置状态*/
			this.context.c_guestname.children("span").html("");
			this.context.c_guestname.children("a").hide();
			this.context.c_phone.html("");
			this.context.c_remark.html("");
			this.context.c_needcar.html("");
			this.context.c_checkoutbtn.show().attr("action","");;
			this.context.c_editbtn.show().attr("action","");
			this.context.c_checkoutbtn.html("办理退房").hide();
			this.context.c_phone.parent().children("a[tag=sendmsg]").hide();
			this.context.checkin_idnuminfo.html("");
			var datehave=tdele.children(".date-have");
			var rid=datehave.attr("rid");
			var gid=datehave.attr("gid");
			var cid=datehave.attr("cid");
			var setid=datehave.attr("setid");
			var innid=this.context.roomtype.attr("innid");

			var room=this._getroom(rid);
			var cols=tdele.attr("idx");
			var row=tdele.parent().attr("i");
			this.context.checkinoption.children().find("a[tag=delete]").html('删除订单');
			this.context.c_hiddencell.attr("rid",rid).attr("gid",gid).attr("cid",cid).attr("cols",cols).attr("row",row).attr("setid",setid);

			/*加载数据*/
			this.context.submitlayer.show();
			M._getjson("ajax.php", { "a": "checkindetail", "innid":innid,"gid": gid,"roomid":rid}, this.checkindetail_finished.toEventHandler(this));

		},
		constayprice_finished:function(d)
		{
			if(d.status=="success")
			{
				if(!M.isEmpty(d.pricelist))
				{
					var prices =this._formatpricesource(d.pricelist);
					var days=d.req.days;
					var fromdate=d.req.fromdate;
					var fromtime=M.strtotimeSetDefaultHour(fromdate);


					var tpl_staydays = '<label class="transverse-check"><input tag="addnight" name="addnight" value="{value}" price="{price}" type="radio">{index}晚</label>';
					var html='续住几晚：';
					var p=0;
					for(var i=0;i<days;i++)
					{
						var dt=this.timeformat(fromtime,"Y-m-d");
						p+=parseInt(prices[dt]);
						html+=tpl_staydays.replace("{index}",i+1).replace("{value}",i+1).replace("{price}",p);

						fromtime.setDate(fromtime.getDate()+1);
					}
					this.context.c_staynight.html(html);
				}
			}
		},
		checkindetail_finished:function(d)
		{
			this.context.submitlayer.hide();
			var c=d.d;
			if(d.status=="success")
			{
				//缓存
				this.tempcheckdetail=c;
				var orderset=c.checkinset;
				var uniqid=c.orderuniqid;
				this.context.c_hiddencell.attr("rid",c.roomid);
				this.context.multiguestform.attr("uniqid",uniqid).attr("orderstatus","checkin");
				/*设置订单来源样式*/

				var channel=M.isEmpty(c.channelcode)?"":c.channelcode;
				var channelico=this.channelico[channel];
				if(M.isEmpty(channelico))
				{
					this.context.c_logo.attr("class","ico-custom fl mr10").html(c.channelname);
				}
				else
				{
					this.context.c_logo.attr("class",channelico+" fl mr10").html("");
				}
				if(!M.isEmpty(c.idnum)){
					this.context.checkin_idnuminfo.html(this.typename[c.idtype]+'：'+c.idnum);
				}

				this.context.c_guestname.children("a[tag=guesttotal]").hide()
				this.context.c_guestname.children("span").html(c.guestname);
				if(d.d.guestlist.length>1){
					this.context.c_guestname.children("a[tag=guesttotal]").html(d.d.guestlist.length).show();
				}
				var phonedesc=c.phone;
				if(!M.isEmpty(c.cityname))
				{
					phonedesc+='<tt>('+c.cityname+')</tt>'
				}
				if(M.isEmpty(phonedesc))
				{
					this.context.c_phone.parent().children("a[tag=sendmsg]").hide();
				}
				else
				{
					this.context.c_phone.parent().children("a[tag=sendmsg]").show();
				}
				this.context.c_phone.html(phonedesc);

				var remark2="";
				if(!M.isEmpty(c.remark2))
				{
					var pos=c.remark2.indexOf("订单总额");
					var rep="";
					if(pos<0)
					{
						rep+="订单总额￥"+orderset.totalprice+"，";
					}
					remark2='<p class="pl20"><span class="ico-related16 minus20"></span>'+c.remark2.replace("\n",rep).replace(/‖/g,'<br/>').replace(':',':<br/>')+"</p>";
				}
				this.context.c_remark.show().html(remark2);
				var remark=M.isEmpty(c.remark)?"":'<p class="pl20"><span class="ico-remark16 minus20"></span>备注：'+c.remark+"</p>";
				this.context.c_remark.parent().children("li[tag=remark2]").html(remark);

				this.context.c_needcar.show().html(c.needcar2=="1"?'<span class="ico-car16"></span>需要车送':'');
				this.context.c_hiddencell.attr("setid",c.checkinsetid);

				var date=M.strtotimeSetDefaultHour(c.checkindate);
				var datestr=this.timeformat(date,"m月d日");
				var arrtime=M.isEmpty(c.arrivetime)?"":c.arrivetime;

				var pricedesc="￥"+c.totalprice;
				var account=c.account;
				if(c.paystatus==3){
					if(M.isEmpty(account.payedtotal)||account.payedtotal==0){
						pricedesc+='<b >已担保</b>';
						pricedesc+='<b >已付房费 ¥'+account.payedtotal+'<i class="ico-info" style="display:none" id="info-price"></i></b>';
						if(account.deposit!=0){
							pricedesc+='<b>押金 ¥'+account.deposit+'</b>';
						}
					}else{
						pricedesc+='<b style="padding-right:21px;">已担保</b>';
						pricedesc+='<b>已付房费 ¥'+account.payedtotal+'<i class="ico-info" style="display:none" id="info-price"></i></b>';
						if(account.deposit!=0){
							pricedesc+='<b style="padding-right:21px;">押金 ¥'+account.deposit+'</b>';
						}
					}



				}else{
					pricedesc+='<b>已付房费 ¥'+account.payedtotal+'<i class="ico-info" style="display:none" id="info-price"></i></b>';
					if(!M.isEmpty(account.deposit)){
						if(account.payedtotal==0){
							pricedesc+='<b>押金 ¥'+account.deposit+'</b>';
						}else{
							pricedesc+='<b style="padding-right:21px;">押金 ¥'+account.deposit+'</b>';
						}
					}
				}

				this.context.c_info.children("span[tag=totalprice]").html(pricedesc);
				var tipmsg='';

				if(!M.isEmpty(account.appendmoney)){
					var appendmoney = account.appendmoney;
					for (var i = 0; i < appendmoney.length; i++) {
						if (appendmoney[i].amount != 0) {
							var paystatusStr = '';
							if ('shouyintai' == appendmoney[i].paytypecode) {
								if ('1' == appendmoney[i].paystatus) {
									paystatusStr = ' <span class="green">[已付款]</span>';
								} else if ('2' == appendmoney[i].paystatus){
									paystatusStr = ' <span>[已关闭]</span>';
								}else{
									paystatusStr = ' <span class="red">[待付款]</span>';
								}
							}
							tipmsg += '<p>' + appendmoney[i].msg + paystatusStr + '<p>';
						}
					}


				}
				if(tipmsg!=''){
					var tip=this.context.c_info.children("span[tag=totalprice]").children("b").children("i");
					tip.show().attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:tipmsg,show:{duration:100}});
				}
				var checkinmsg='<span style="color:blue">[已入住]</span>';
				if(c.groupstatus==2){
					checkinmsg='<span style="color:blue">[已退房]</span>';
				}
				this.context.checkinoption.attr('checktype','已入住');
				if(c.groupstatus==2){
					this.context.checkinoption.attr('checktype','已退房');
				}
				this.context.c_info.children("h2[tag=roomname]").html('<span class="ico-roomname16"></span>'+c.roomname+'('+c.roomtypename+')');
				this.context.c_info.children("p[tag=arrivetime]").html('<span class="ico-date16"></span>'+c.checkintimestr+"入住"+checkinmsg);

				var enddate=M.strtotime(c.enddate);
				this.context.c_info.children("p[tag=nights]").html('<span class="ico-night16"></span>'+this.timeformat(enddate,"m月d日")+"退房"+"，住"+c.nights+"晚");

				var needcar=c.needcar2;
				//this.context.c_editneedcar.attr("checked",needcar=="1");
				if(c.cancheckout=="1"&&c.groupstatus=="1")
				{
					this.context.c_checkoutbtn.attr("action","checkout");
					this.context.c_checkoutbtn.show();
				}
				else
				{
					this.context.c_checkoutbtn.attr("action","");
					this.context.c_checkoutbtn.hide();
				}

				if(this.printset.checkout==1 || this.printset.checkin==1){
					this.context.checkinoption.children('div').children('a[tag=print]').css('display',"block").attr('title','打印');
				}
				this.context.checkinoption.attr('cid', c.ogid);
				this.context.checkinoption.attr("oid", c.orderid);
				this.context.checkinoption.attr("setid", c.checkinsetid);
				this.context.checkinoption.attr("uniqid", c.orderuniqid);
				this.context.checkinoption.attr("nights", c.nights);
				M.Popup(this.context.checkinoption,{"hideclass":"bootbox modal view fade","showclass":"bootbox modal view fade in"});
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
		},
		addnight_click:function()
		{
			var price=this.context.c_staynight.find("input[name=addnight]:checked").attr("price");
			if(M.isEmpty(price))
			{
				price="";
			}
			if(isNaN(price))
			{
				price="";
			}
			this.context.c_naddprice.html('¥'+price);
			this.context.c_stayaddprice.val(price);
		},
		doconstay:function()
		{
			var display=this.context.c_constay.css("display");
			if(display=="none")
			{
				this.context.c_staynight.find("input[name=addnight]:first").attr("checked","checked");
				this.addnight_click();
				this.context.c_constay.show();
				this.context.c_checkoutbtn.hide();
				this.context.c_editbtn.hide();
			}
			else
			{
				var gid=this.context.c_hiddencell.attr("gid");
				var rid=this.context.c_hiddencell.attr("rid");
				var days=this.context.c_staynight.find("input[name=addnight]:checked").val();
				var price=M.getVal(this.context.c_stayaddprice);

				if(M.isEmpty(gid)||M.isEmpty(rid)||M.isEmpty(days))
				{
					return;
				}
				if(isNaN(days))
				{
					days=1;
				}
				if(isNaN(price))
				{
					alert("加收房费输入无效");
					return;
				}

				//请求开始
				var btn=this.context.checkinoption.children(".modal-footer").children("a[tag=constay]");
				if(!this.req_before(btn)){return;}

				M._getjson("ajax2.php", { "a": "constay", "gid": gid,"rid":rid,"days":days,"price":price}, this.constay_finished.toEventHandler(this));
			}
		},
		constay_finished:function(d)
		{
			if(d.status=="success")
			{

				/*更新ui*/
				var cols=this.context.c_hiddencell.attr("cols");
				var row=this.context.c_hiddencell.attr("row");

				var detail=d.data;
				this._clearitem(row, cols);

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var item = d.data;
				item.type="checkedin";

				this._showitem(item,itemdate);

				this.calc_leftrooms();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			//请求结束
			var btn=this.context.checkinoption.children(".modal-footer").children("a[tag=constay]");
			this.req_end(btn);
		},
		_getCheckinAvailableNights:function(checkindate,nights,row,cols)
		{
			var target=this._getpickercell(row, cols);

			var nights=parseInt(nights);
			var checkindate=M.strtotime(checkindate);

			var timenow=this.getdatetime();
			var today = new Date(timenow.getFullYear(), timenow.getMonth(), timenow.getDate());
			var minNights=1;// parseInt(Math.abs(today - checkindate) / 1000 / 60 / 60 / 24);
			var nohour=timenow.getHours();
			if(nohour>6)
			{
				//minNights++;
			}

			/*判断向下连续是否可以有maxnights天*/
			var availablenights=0;
			var maxnight=0;
			var testele=target;
			var testoptions="";
			for(var i=0;i<nights;i++)
			{
				if(i+1>=minNights)
				{
					availablenights++;
					testoptions+='<option value="'+(i+1)+'">'+(i+1)+'晚</option>';
					maxnight=i+1;
				}
				testele=testele.parent().next().children("[idx="+cols+"]");
			}
			for(var i=nights;i<this.maxnights;i++)
			{
				if(testele.children(".date-day").length>0)
				{
					availablenights++;
					testoptions+='<option value="'+(i+1)+'">'+(i+1)+'晚</option>';
					maxnight=i+1;
				}
				else
				{
					break;
				}
				testele=testele.parent().next().children("[idx="+cols+"]");
			}
			var enddate=new Date(checkindate.getFullYear(), checkindate.getMonth(), checkindate.getDate());
			enddate.setDate(enddate.getDate()+maxnight-1);

			return {"nights":availablenights,"optionshtml":testoptions,"fromdate":checkindate,"enddate":enddate};

		},
		_getCheckOutAvailableNights:function(checkindate,nights,row,cols)
		{
			var target=this._getpickercell(row, cols);
			var hidedays=target.attr("hidedays");
			if(M.isEmpty(hidedays))
			{
				hidedays=0;
			}
			else
			{
				hidedays=parseInt(hidedays);
			}
			var nights=parseInt(nights);
			//nights-=hidedays;
			testoptions="<option value='"+nights+"'>"+nights+"晚</option>";
			var checkindate=M.strtotime(checkindate);
			var enddate=new Date(checkindate.getFullYear(), checkindate.getMonth(), checkindate.getDate());
			enddate.setDate(enddate.getDate()+nights);
			return {"nights":nights,"optionshtml":testoptions,"fromdate":checkindate,"enddate":enddate};
		},
		doeditcheckin:function(hiddencell,type)
		{
			var detail=this.tempcheckdetail;
			var orderset=detail.checkinset;
			var orders=orderset.orders;
			if(detail.groupstatus==1){
				this.context.editcheck.attr("orderstatus","checkin");
			}else{
				this.context.editcheck.attr("orderstatus","checkout");
			}
			if(M.isEmpty(detail))
			{
				/*load data*/
				return;
			}
			this._closepopup();
			this._clearcheckinform();
			var disable=false;
			var account=detail.account;

			var gid=hiddencell.attr("gid");
			var rid=hiddencell.attr("rid");
			var cols=hiddencell.attr("cols");
			var row=hiddencell.attr("row");
			hiddencell.attr("color",detail.style).attr("from",detail.from);

			/*初始化*/

			var formlist=this.context.editcheck.children(".modal-body").find(".cntlist");
			formlist.children("li[tag=paytype]").children().find("div[tag=roomrateform]").children("span").text("补交房费：");
			var tpl_chanle=formlist.children("li[tag=channelcode]").children("div[id=droplist]").attr("value",detail.channelcode);;
			this.droplist.checkin.dr_chanle=M.DropdownList(tpl_chanle,this.channel_change.toEventHandler(this),{});
			var roomrate=formlist.children("li[tag=paytype]").find("div[t=roomrate]").attr("value","cash");
			this.droplist.checkin.paymentsdroplist=M.DropdownList(roomrate,null,{});
			if(M.isEmpty(account.pt_deposit)){
				account.pt_deposit='cash';
			}
			var deposit_tpl=formlist.children("li[tag=paytype]").find("div[t=deposit]").attr("value",account.pt_deposit);
			this.droplist.checkin.depositBoxdroplist=M.DropdownList(deposit_tpl,null,{});
			formlist.children("li[tag=paytype]").find("input[name=deposit]").val(account.deposit);
			formlist.children("li[tag=paystatus]").children().find("div[t=account]").remove();
			this._handleaccountdetail(account);
			var idcard_tpl=formlist.children("li[tag=idcard]").children("div").children("div[t=idcardform]");
			if(idcard_tpl.length>0){
				idcard_tpl.attr("value",detail.idtype);
				formlist.children("li[tag=idcard]").children().find("input[name=idcard]").val(detail.idnum);
				this.droplist.order.idcard=M.DropdownList(idcard_tpl,null,{});
			}

			formlist.children("li[tag=guestname]").find("input[type=text]").val(detail.guestname);
			formlist.children("li[tag=phone]").find("input[type=text]").val(detail.phone);

			formlist.children("li[tag=totalprice]").find("input[type=text]").val(detail.totalprice).attr("isfirst","1");
			var needcarli = formlist.children("li[tag=ordercolor]");
			var needcarinput = needcarli.find("input[type=checkbox][tag=needcar2]").attr("checked",detail.needcar2=="1");
			this.multiguest=detail.guestlist;
			if(this.multiguest.length==0){
				this.multiguest.length=1;
			}
			if(this.multiguest.length>1){
				formlist.children("li[tag=idcard]").children().find("a[tag=multiguest]").html('<i class="count" tag="count">'+this.multiguest.length+'</i>');
			}

			var isdisable=orderset.groupstatus=="";
			formlist.children("li[tag=orderroomlist]").find("input[id=o_paystatus]").val(orderset.paystatus);
			if(orderset.paystatus==3){
				formlist.children("li[tag=orderroomlist]").find("input[id=o_paystatus]").attr("checked",true);
			}
			if(!M.isEmpty(detail.remark)){
				formlist.children("li[tag=remark]").find("textarea").val(detail.remark);
			}

			var depositinput=formlist.children("li[tag=paystatus]").find("input[type=text][tag=deposit]").val(orderset.deposit);
			var hiddencell = this.context.editcheck.children(".modal-footer").find("input[type=hidden]");
			hiddencell.attr("gid",gid);
			hiddencell.attr("rid",rid);
			hiddencell.attr("row",row);
			hiddencell.attr("cols",cols);
			hiddencell.attr("color",orderset.style);
			hiddencell.attr("setid",detail.checkinsetid);
			this.context.editcheck.children().find("select[name=editcheckin_idtype]").val(detail.idtype);
			this.context.editcheck.children().find("input[name=editcheck_idnum]").val(detail.idnum);

			/*-----------------------------------------------------------------------------------------------------------------*/
			//var date=M.strtotime(temp.arrivedate);

			var orderroomlist=this.context.editcheck.children(".modal-body").find(".cntlist").children("li[tag=orderroomlist]");
			var orderinfo=orderroomlist.children("div[tag=orderinfo]");

			var orderindex=0;
			var tpl=orderroomlist.children("div[tag=order]:first");

			if(orders.length>0)
			{
				var order=orders[0];
				var arrivedate=M.strtotime(order.checkindate);
				var dateoptions=this._generateorderdates(arrivedate);

				var firstorder=orderroomlist.children("div[tag=order]:first");
				firstorder.children("div[id=selectDay]").attr("value",order.checkindate).children("div[tag=checkindate]").html(dateoptions.options).attr("disabled",disable);
				firstorder.children("div[id=selectRoom]").attr("value",order.roomid).attr("roomid",order.roomid);
				firstorder.children("div[id=selectNights]").attr("value",order.nights).attr("nights",order.nights).attr("disabled",disable);
				firstorder.children("input[type=text][tag=price]").val(order.totalprice).attr("disabled",disable).attr("isfirst",1);
				firstorder.attr("i",orderindex);
				firstorder.attr("gid",order.id);
				this.droplist.order.dr_orderdate=M.DropdownList(firstorder.children("div[id=selectDay]"),this.orderdate_change.toEventHandler(this),{});
				var colorfield=formlist.children("li[tag=ordercolor]").children("div");
				if(orderset.groupstatus=="1")
				{
					var coloritem=colorfield.find("div[tag=colorlist]").children("span[for=checkedin]").show();
					colorfield.find("div[tag=colorlist]").children("span[for=checkedout]").hide();
					if(M.isEmpty(orderset.style)) this.setordercolor(coloritem);
				}
				else if(orderset.groupstatus==2)
				{
					colorfield.find("div[tag=colorlist]").children("span[for=checkedin]").hide();
					var coloritem = colorfield.find("div[tag=colorlist]").children("span[for=checkedout]").show();
					if(M.isEmpty(orderset.style)) this.setordercolor(coloritem);
				}

				//订单颜色
				if(detail.orderfrom!='elong')
				{
					var coloritem=colorfield.show().find("div[tag=colorlist]").children("span[val="+orderset.style+"]");
					this.setordercolor(coloritem);
				}else{
					colorfield.hide();
				}
				/*获取价格*/
				/*获取房型价格*/
				var fromdate=dateoptions.fromdate;
				var enddate_time=M.strtotime(dateoptions.enddate);
				enddate_time.setDate(enddate_time.getDate()+this.maxnights);
				var enddate=this.timeformat(enddate_time);
				var i=0;
				/*M._getjson("ajax.php", { "a": "getprice","from":"editorder","fromdate": fromdate, "enddate": enddate ,"roomtypeid":order.roomtypeid,"i":-1}, this.getprice_finished.toEventHandler(this));*/

				this._getavailablerooms("editcheckin",order.checkindate,i,orderset.id,order.id);

				for(var j=1;j<orders.length;j++)
				{
					order=orders[j];
					orderindex++;
					arrivedate=M.strtotime(order.checkindate);
					dateoptions=this._generateorderdates(arrivedate);

					var ordertpl=tpl.clone(true);
					ordertpl.insertBefore(orderinfo);
					ordertpl.attr("i",orderindex);
					ordertpl.attr("gid",order.id);

					ordertpl.children("a[tag=removeroom]").show();
					ordertpl.children("div[id=selectDay]").attr("value",order.arrivedate).children("div[tag=checkindate]").html(dateoptions.options).attr("disabled",disable);
					ordertpl.children("div[id=selectRoom]").attr("value",order.roomid).attr("roomid",order.roomid);
					ordertpl.children("div[id=selectNights]").attr("value",order.nights).attr("nights",order.nights).attr("disabled",disable);
					ordertpl.children("input[type=text][tag=price]").val(order.totalprice).attr("disabled",disable).attr("isfirst",1);
					this.droplist.checkin.dr_orderdate=M.DropdownList(ordertpl.children("div[id=selectDay]"),this.orderdate_change.toEventHandler(this),{});
					/*获取房型价格*/
					//var fromdate=dateoptions.fromdate;
					//var enddate_time=M.strtotime(dateoptions.enddate);
					// enddate_time.setDate(enddate_time.getDate()+this.maxnights);
					//var enddate=this.timeformat(enddate_time);

					var i=0;
					//M._getjson("ajax.php", { "a": "getprice","from":"editorder","fromdate": fromdate, "enddate": enddate ,"roomtypeid":order.roomtypeid,"i":-1}, this.getprice_finished.toEventHandler(this));

					this._getavailablerooms("editcheckin",order.checkindate,orderindex,orderset.id,order.id);
				}
				orderinfo.attr("maxi",orderindex);
				this.orderroomtpl_change(orderroomlist);
			}
			var moneyinfo=this.context.editcheck.find("div[tag=paystatistics]");
			moneyinfo.find("a[tag=showfindetail]").attr("payed",account.payedtotal).html("&yen;"+account.payedtotal).attr("title","").tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:"查看/修改房费",show:{duration:100}});;
			var needpay=parseInt(orderset.totalprice)-parseInt(account.payedtotal);
			if(detail.groupstatus!=1){
				needpay=parseInt(needpay)-parseInt(account.deposit);
			}
			moneyinfo.find("span[tag=needpay]").html("&yen;"+needpay);
			this._orderdate_change(orderroomlist);
			if(detail.paystatus==3){
				this.context.c_paystatus.attr("checked",true);
			}
			//this._closepopup();
			//补交房费
			formlist.children("li[tag=paytype]").children().find("div[tag=roomrateform]").children("span").text("补交房费：");
			var nights = this.context.checkinoption.attr("nights");
			this.context.editcheck.attr('nights',nights);
			this.context.selectNights.children('span').text(nights+'晚');

			M.Popup(this.context.editcheck,{"hideclass":"bootbox modal fade","showclass":"bootbox modal fade in"});
		},
		editcheckin_pricefinished:function(d)
		{
			if (d.status == "success")
			{
				/*获取价格*/
				if(!M.isEmpty(d.pricelist))
				{
					if(!M.isEmpty(d.pricelist))
					{
						this.formatedateprice=this._formatpricesource(d.pricelist);

						/*显示价格到ui*/
						this.showcheckinprice();
					}
				}
			}
		},
		showcheckinprice:function()
		{
			var formlist=this.context.editcheck.children(".modal-body").find(".cntlist");
			var nightselect=formlist.children("li[tag=nights]").find("select");
			var totalpriceinput=formlist.children("li[tag=totalprice]").find("input[type=text]:first");

			var hiddencell = this.context.editcheck.children(".modal-footer").find("input[type=hidden]");


			if(M.isEmpty(this.formatedateprice))
			{
				if(totalpriceinput.attr("isfirst")=="1")
				{
					totalpriceinput.attr("isfirst","");
				}
				else
				{
					totalpriceinput.val(0);
				}
				return;
			}

			var n=M.getVal(nightselect);
			var time=hiddencell.attr("begintime");
			var arrivedate = M.strtotimeSetDefaultHour(time);
			var total=0;
			for(var i=0;i<n;i++)
			{
				var d=this.timeformat(arrivedate);
				var p=this.formatedateprice[d];
				if(isNaN(p))p=0;
				p=parseInt(p);
				total+=p;
				arrivedate.setDate(arrivedate.getDate()+1);
			}

			if(totalpriceinput.attr("isfirst")=="1")
			{
				totalpriceinput.attr("isfirst","");
			}
			else
			{
				totalpriceinput.val(total);
			}
		},
		editcheckin_finished:function(d)
		{
			if(d.status=="success")
			{
				/*重新显示是否车送*/
				var row=this.context.c_hiddencell.attr("row");
				var cols=this.context.c_hiddencell.attr("cols");

				var detail=d.data;
				this._clearitem(row, cols);

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var item = d.data;
				item.type="checkedin";

				this._showitem(item,itemdate);

				this.calc_leftrooms();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}

			//请求结束
			var btn=this.context.checkinoption.children(".modal-footer").children("a[tag=edit]");
			this.req_end(btn);
		},
		_getselectorders:function(length){
			var tpl=this.context.checkoutform.children().find("li[tag=orderdetail]");
			var tpl_order=tpl.children().find("div.selected");
			var tpl_checkout=tpl.children().find("div.checkout");
			var order=[];
			tpl_order.each(function(){
				var cid=$(this).attr("cid");
				order.push(cid);
			});
			tpl_checkout.each(function(){
				var ischeckout=$(this).attr("ischeckout");
				if(ischeckout==0){
					var cid=$(this).attr("cid");
					order.push(cid);
				}

			});
			if(length==1){
				var cid=tpl.children().find("div[tag=orderselect]").attr("cid");
				order.push(cid);
			}
			return order;
		},
		//处理关联订单退房费用
		_checkout_dealmoney:function(){
			var o=this.tempcheckdetail;
			var account=o.account;
			var realpricedetail=o.checkoutinfo.realpricedetail;

			var orderlist=this._getselectorders(o.checkoutinfo.orderinfo.length);
			var split=0;
			var checkoutlength=this.context.checkoutform.children().find("li[tag=orderdetail]").children().find("div.checkout[ischeckout=1]").length;
			var orderlength=o.checkoutinfo.orderinfo.length;
			if(orderlength==(orderlist.length+checkoutlength)||o.checkoutinfo.orderinfo.length==1){
				this.context.ot_body.children('li[tag=paydetail]').children().find("span[tag=splittip]").hide();
			}else{
				split=1;
				this.context.ot_body.children('li[tag=paydetail]').children().find("span[tag=splittip]").show();
			}
			var payedprice=0,deposit=0,allprice=0;
			for(var i in realpricedetail){
				var cid=realpricedetail[i].id;
				var ischeckout=realpricedetail[i].ischeckout;
				var has=0;
				for(var k=0;k<orderlist.length;k++){
					var o_cid=orderlist[k];
					if(o_cid==cid){
						has=1;
					}
				}
				if(has==1){
					if(ischeckout!=1){
						allprice+=parseInt(realpricedetail[i].realtotalprice);
					}
				}
			}
			this.context.ot_body.children('li[tag=orderdetail]').children("div").children("b").children("span").html('¥'+allprice);
			var deposit=account.deposit;
			var payedmoney=account.availabletotal;
			var payedall=payedmoney*1
			//退还房费
			var paymoney_tpl=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("input[name=paymoney]");
			//退还押金
			var deposit_tpl=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=depositform]").children("input[name=returndeposit]");

			if(split==0){
				payedall+=deposit*1;
				deposit_tpl.val('0');
				paymoney_tpl.val('0');
			}
			deposit_tpl.val('0');
			paymoney_tpl.val('0');
			var paydetail=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=padeddetail]");
			this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("input[name=paymoney]").val("");
			this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("input[name=paymoney]").attr('placeholder','金额');
			if(allprice>=payedall){
				var needappend=allprice-payedall;
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("span").html('补交房费');
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("div").find("div[value=shouyintai]").show();
				paymoney_tpl.attr("t","needappend");
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=tip]").html('需补交房费：');
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=amount]").html('¥'+needappend);
				if(needappend==0){
					paymoney_tpl.val(0);
				}
				//paymoney_tpl.val(needappend);
			}else{
				var returnmoeny=payedall-allprice;
				var msg='需退还房费及押金共计：';
				if(split==1){
					msg='房费结余：';
					this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("span").html('补交房费');
					paymoney_tpl.attr("t","needappend");
				}else{
					if(returnmoeny>deposit){
						returnappenmoney=returnmoeny-deposit;
					}else{
						deposit=returnmoeny;
						returnappenmoney=0;
						paymoney_tpl.val(returnappenmoney);
					}
					deposit_tpl.val(deposit);

					this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("span").html('退还房费');
					this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("div").find("div[value=shouyintai]").hide();
					paymoney_tpl.attr("t","needreturn");
				}
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=tip]").html(msg);
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=amount]").html('¥'+returnmoeny);
				if(returnmoeny==0){
					paymoney_tpl.val(0);
				}

			}
			var payedtip='';
			var deposttip='';
			if(orderlength==1){
				payedtip="已收房费";
				deposttip="已收押金";
			}else{
				var checkoutlength=this.context.checkoutform.children().find("li[tag=orderdetail]").children().find("div.checkout").length;
				if(split==1){
					//拆分退房
					if(checkoutlength>0){
						payedtip="剩余可扣房费";
						deposttip="剩余押金";
					}else{
						payedtip="已收房费";
						deposttip="已收押金";
					}
				}else{
					if(checkoutlength>0){
						payedtip="剩余可扣房费";
						deposttip="剩余押金";
					}else{
						payedtip="已收房费";
						deposttip="已收押金";
					}
				}

			}
			paydetail.children("div").children("b[tag=payed]").children("span[tag=tip]").html(payedtip);
			paydetail.children("div").children("b[tag=depost]").children("span[tag=tip]").html(deposttip);

			if(M.isEmpty(deposit)){
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=depositform]").children("input[name=returndeposit]").val(0);
			}else{
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=depositform]").children("input[name=returndeposit]").val("");
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=depositform]").children("input[name=returndeposit]").attr('placeholder','金额');
			}

//		return;
		},
		docheckout:function(){
			/*判断是否提前退房*/
			var action=this.context.c_checkoutbtn.attr("action");
			var returnmoney=0;
			if(action!="checkout")
			{
				return;
			}

			//显示需要补缴或需要退还的金额
			var gid=this.context.c_hiddencell.attr("gid");
			var rid=this.context.c_hiddencell.attr("rid");
			var setid=this.context.c_hiddencell.attr("setid");
			if(M.isEmpty(gid)||M.isEmpty(rid))
			{
				return;
			}
			setid=M.isEmpty(setid)?"":setid;

			var o=this.tempcheckdetail;
			var account=o.account;
			var checkoutinfo=o.checkoutinfo;
			var orderset=o.checkinset;
			var orders=orderset.orders;
			var guestlist=o.guestlist;
			if(!M.isEmpty(o.idnum)){
				this.context.checkoutform.children().find("p[tag=idnuminfo]").text(this.typename[o.idtype]+'：'+o.idnum);
			}


			this.context.ot_guestname.children("span").html(o.guestname);
			this.context.ot_guestname.children("a[tag=guesttotal]").html('1').hide();
			if(guestlist.length>1){
				this.context.ot_guestname.children("a[tag=guesttotal]").html(guestlist.length).show();
			}
			var phonedesc=o.phone;
			if(!M.isEmpty(o.cityname))
			{
				phonedesc+='<tt>('+o.cityname+')</tt>';
			}
			this.context.ot_phone.html(phonedesc);

			var channel=M.isEmpty(o.channelcode)?"":o.channelcode;
			var channelico=this.channelico[channel];
			if(M.isEmpty(channelico))
			{
				this.context.ot_logo.attr("class","ico-custom fl mr10").html(o.channelname);
			}
			else
			{
				this.context.ot_logo.attr("class",channelico+" fl mr10").html("");
			}

			var cid=this.context.c_hiddencell.attr("cid");
			//显示订单实际入住详情
			var orderinfo=checkoutinfo.orderinfo;
			var infostr='';
			var checkoutlength=0;
			for(var i=0;i<orderinfo.length;i++)
			{
				var style="";
				var enddate='';
				var ischeckout='';
				var title='';
				if(orderinfo.length>1&&(cid==orderinfo[i].id||orderinfo[i].cancheckout==1)){
					style="selected";
				}
				if(orderinfo[i].groupstatus==1){
					style='checkout';
					checkoutlength++;
					enddate='[已退房:'+orderinfo[i].checkoutdate+']';
					if(orderinfo[i].ischeckout==0){
						title=orderinfo[i].desc+'[未结算]';
						ischeckout='<span style="color:red">[未结算]</span>';
					}else{
						title=orderinfo[i].desc+'[已结算]';
						ischeckout='<span style="color:green">[已结算]</span>';
					}
				}
				if((orderinfo.length-i)==1){
					style+=' last';
				}
				infostr+='<div title="'+title+'" ischeckout="'+orderinfo[i].ischeckout+'" class="'+style+'" cid="'+orderinfo[i].id+'" tag="orderselect">'+enddate+orderinfo[i].desc+ischeckout+'</div>';
			}
			this.context.ot_body.children('li[tag=orderdetail]').children("div").children("div").remove();
			this.context.ot_body.children('li[tag=orderdetail]').children("div").children("b").children("span").html('¥'+checkoutinfo.payinfo.totalprice);
			this.context.ot_body.children('li[tag=orderdetail]').children("div").append(infostr);
			var paydetail=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=padeddetail]");
			var style='';
			if(checkoutlength>0){
				if(account.hascheckoutlist.length>0){
					style="padding-right:21px;";
					var hascheckoutlist=account.hascheckoutlist;
					var tip="已付房费：¥"+account.payedtotal;
					for(var i=0;i<hascheckoutlist.length;i++){
						tip+='<p>'+hascheckoutlist[i]+'</p>';
					}
					var tpl_tip=paydetail.children("div").children("b[tag=payed]").children("i[tag=tip]");
					tpl_tip.show().attr("title",'').tooltip({position:{ my: "left+15 top+20", at: "left bottom" },track:1,content:tip,show:{duration:100}});
				}
				paydetail.children("div").children("b[tag=payed]").children("span[tag=amount]").html('：¥'+account.availabletotal);
				paydetail.children("div").children("b[tag=depost]").children("span[tag=amount]").attr("style",style).html('： ¥'+account.deposit);
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=amount]").attr("style",style);
			}else{
				paydetail.children("div").children("b[tag=payed]").children("i[tag=tip]").hide();
				paydetail.children("div").children("b[tag=payed]").children("span[tag=amount]").html('： ¥'+account.availabletotal);
				paydetail.children("div").children("b[tag=depost]").children("span[tag=amount]").attr("style",style).html('： ¥'+account.deposit);
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=amount]").attr("style",style);
			}

			if(checkoutinfo.payinfo.needreturn==1){
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("span").html('退还房费');
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=amount]").html('¥'+checkoutinfo.payinfo.returnmoney);
			}else{
				this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("span").html('补交房费');
				paydetail.children("div").children("b[tag=needpay]").children("span[tag=amount]").html('¥'+checkoutinfo.payinfo.appendmoney);
			}

			var tpl_pay=this.context.ot_body.children('li[tag=paydetail]').children().find("div[t=paytypelist]").attr("value","cash");
			this.droplist.checkout.drop_paydeposit=M.DropdownList(tpl_pay,null,{});
			var tpl_pay2=this.context.ot_body.children('li[tag=paydetail]').children().find("div[t=payments]").attr("value","cash");
			this.droplist.checkout.drop_payroom=M.DropdownList(tpl_pay2,null,{});
			if(orderinfo.length>1){
				this.context.ot_body.children('li[tag=orderdetail]').children("div").addClass("pop-orderlist");
				this.context.ot_body.children('li[tag=mulitorder]').show();
			}else{
				this.context.ot_body.children('li[tag=mulitorder]').hide();
				this.context.ot_body.children('li[tag=orderdetail]').children("div").removeClass("pop-orderlist");
			}
			this._checkout_dealmoney();
			this.context.ot_hidden.attr("setid",setid);
			if(M.isEmpty(o.remark)){
				M.emptyVal(this.context.ot_body.children('li[tag=remark]').children("textarea[name=remark]"));
			}else{
				this.context.ot_body.children('li[tag=remark]').children("textarea[name=remark]").val(o.remark);
			}

			this._closepopup();
			M.Popup(this.context.checkoutform,{"hideclass":"modal view fade","showclass":"modal view fade in"},function(){
				this.context.ot_body.children('li[tag=paydetail]').find("div[tag=needpayform]").find("input[name=paymoney]").focus();
			}.toEventHandler(this));
			return;
		},
		checkout:function()
		{
			var rmtype=this.droplist.checkout.drop_payroom._getval();
			var paymoney_tpl=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("input[name=paymoney]");
			var deposit_tpl=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=depositform]").children("input[name=returndeposit]");
			var html = this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("span").html();

			if(M.isEmpty(paymoney_tpl.val())){
				alert('请输入'+html+"的金额");
				return;
			}
			if(M.isEmpty(deposit_tpl.val())){
				alert('请输入退还押金的金额');
				return;
			}

			if(rmtype !="shouyintai"){
				if(!confirm("确认退房吗"))
				{
					return;
				}
			}

			var setid=this.context.ot_hidden.attr("setid");
			var action=this.context.ot_hidden.attr("action");
			var o=this.tempcheckdetail;
			if(o.checkoutinfo.orderinfo.length>1){
				var selectorder=this._getselectorders().toString();
			}else{
				var selectorder=o.checkoutinfo.orderinfo[0].id;
			}
			if(M.isEmpty(selectorder)){
				alert('请选择要退房的订单');
				return;
			}
//		deposit_tpl.val(' ');
//		paymoney_tpl.val(' ');

			var data={"a":'checkout','setid':setid,'needreturn':0,"needappend":0,"selectorder":selectorder};
			//退还房费 输入框
			var paymoney_tpl=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=needpayform]").children("input[name=paymoney]");
			var t=paymoney_tpl.attr("t");
			var paymoney=paymoney_tpl.val();

			//备注信息
			var remark=M.getVal(this.context.ot_body.children('li[tag=remark]').children("textarea[name=remark]"));
			data.remark=remark;
			var rm_paytype=this.droplist.checkout.drop_payroom._getval();
			paymoney=M.isEmpty(paymoney)?0:paymoney;//房费金额
			if(isNaN(paymoney))
			{
				alert('房费金额输入格式不正确');
				return;
			}

			if(t=='needreturn'){
				data.needappend=2;
				data.returnmoney=paymoney;
			}else{
				data.needappend=1;
				data.appendmoney=paymoney;
			}
			data.rm_paytype=rm_paytype;

			var deposit_tpl=this.context.ot_body.children('li[tag=paydetail]').children().find("div[tag=depositform]").children("input[name=returndeposit]");
			var dt_paytype=this.droplist.checkout.drop_paydeposit._getval();
			var deposit=deposit_tpl.val();
			//alert(deposit);return;
			deposit=M.isEmpty(deposit)?0:deposit;//退还的押金金额
			if(isNaN(deposit))
			{
				alert('押金金额输入格式不正确');
				return;
			}
			var checkdeposit=this.tempcheckdetail.account.deposit;//已收押金金额
			if(parseInt(deposit)>parseInt(checkdeposit))
			{
				alert('退还押金不能大于已收押金');
				return;
			}
			data.deposit=deposit;
			data.dt_paytype=dt_paytype;
			//执行退房

			var btn=this.context.checkoutform.children(".modal-footer").children("a[tag=checkout]");
			if(!this.req_before(btn)){return;}
			M._getjson("ajax2.php", data, this.checkout_finished.toEventHandler(this));
		},
		checkout_finished:function(d){
			if(d.status=="success")
			{
				/*更新ui*/
				var cols=this.context.c_hiddencell.attr("cols");
				var row=this.context.c_hiddencell.attr("row");
				//this._clearitem(row, cols);
				this._clearitembyset(d.req.setid,"checkedout");
				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var items = d.data;
				var payname = d.payname;
				var action = d.req.a;
				payname.action = action;
				payname.a = "getpayinfo";
				var checkindata=d.checkindadta.orders;
				this._showitems(items);
				var o=this.tempcheckdetail;
				if(o.checkoutinfo.orderinfo.length>1){
					var orderlisttpl=this.context.ot_body.find("li[tag=orderdetail]").find("div.selected");
					var cidstr=this._getselectedcid(orderlisttpl);
				}else{
					var cidstr=o.checkoutinfo.orderinfo[0].id;
				}

				this.calc_leftrooms();
				this._closepopup();
				this.orderdetail={"a":action,"items":items,"paydetail":payname};
				this.cashier();
				if(this.printset.checkout==1){
					this.context.printform.attr("operate","checkout").attr("unqid",d.uniqid).attr("cidstr",cidstr);
					this.print();
				}
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}

			//请求结束
			var btn=this.context.checkoutform.children(".modal-footer").children("a[tag=checkout]");
			this.req_end(btn);
		},
		checkoutprint:function(){
			var innid=this.context.roomtype.attr("innid");
			var uniqid = this.context.checkinoption.attr("uniqid");
			var cidstr = this.context.checkinoption.attr("cid");
			this.context.printform.attr("operate","checkout").attr("unqid",uniqid).attr("cidstr",cidstr);
			this.printcheckinout();
		},
		_getselectedcid:function(tpl){
			var data=[];
			tpl.each(function(){
				var cid=$(this).attr("cid");
				data.push(cid);
			});
			return data;
		},
		checkindelete:function(ownprice)
		{
			/**/
			var form=this.context.checkinoption;
			var account = this.tempcheckdetail.account;
			if(account.unpaid>0){
				M.error("订单未支付，不能删除");
				return false;
			}

			var paymoney=this.context.delform.children().find("input[name=amount]").val();
			var deposit=this.context.delform.children().find("input[name=deposit]").val();
			var temp=this.tempcheckdetail.checkinset;
			//若不是关联订单
			if(temp.orders.length<=1){

				if(M.isEmpty(paymoney))
				{
					alert("请输入需退房费");
					return;
				}

				if(M.isEmpty(deposit))
				{
					alert("请输入需退押金");
					return;
				}
			}


			var footer=form.children(".modal-footer");
			var hiddencell=footer.find("input[type=hidden]:first");
			var gid=hiddencell.attr("gid");
			var rid=hiddencell.attr("rid");
			var row=hiddencell.attr("row");
			var cols=hiddencell.attr("cols");
			var setid=hiddencell.attr("setid");
			setid=M.isEmpty(setid)?"":setid;
			if(M.isEmpty(gid)||M.isEmpty(setid))
			{
				return;
			}
			var r=confirm("确认删除吗");
			var data={ "a": "checkindelete", "gid": gid,"rid":rid,"setid":setid,'remark':remark}
			var rm_paytypename=this.context.delform.children().find("div[tag=roomrate]").children("div").children("span").text();
			data.rm_paytypename=rm_paytypename;
			var paymoney_tpl=this.context.delform.children().find("input[name=amount]");
			var t=paymoney_tpl.attr("t");
			var paymoney=paymoney_tpl.val();
			var rm_paytype=this.droplist.del.roomrate._getval();
			paymoney=M.isEmpty(paymoney)?0:paymoney;
			if(isNaN(paymoney))
			{
				alert('房费金额输入格式不正确');
				return;
			}
			if(t=='needreturn'){
				data.needappend=2;
				data.returnmoney=paymoney;
			}else{
				data.needappend=1;
				data.appendmoney=paymoney;
			}
			data.rm_paytype=rm_paytype;
			var dt_paytypename=this.context.delform.children().find("div[tag=deposit]").children("div").children("span").text();
			data.dt_paytypename=dt_paytypename;
			var deposit_tpl=this.context.delform.children().find("input[name=deposit]");
			var dt_paytype=this.droplist.del.deposit._getval();
			var deposit=deposit_tpl.val();
			deposit=M.isEmpty(deposit)?0:deposit;
			if(isNaN(deposit))
			{
				alert('押金金额输入格式不正确');
				return;
			}
			data.deposit=deposit;
			data.dt_paytype=dt_paytype;
			if(!r){return;}
			var remark=M.getVal(this.context.delform.children().find("li[tag=remark]").children('textarea'));
			data.remark=remark;
			//请求开始
			data.ischeckout=this.context.delform.attr("ischeckout");
			var btn=this.context.checkinoption.children(".modal-footer").children("a[tag=delete]");
			if(!this.req_before(btn)){return;}

			M._getjson("ajax2.php",data , this.checkindelete_finished.toEventHandler(this));
		},
		_getcoordedatabygid:function(gid){
			var target=this.context.pickerarea.find("div[cid="+gid+"]");
			var cols=target.parents("td").attr("idx");
			var row=target.parents("tr").attr("i");
			return {"row":row,"cols":cols}
			
		},
		checkindelete_finished:function(d)
		{
			if(d.status=="success")
			{
				/*删除成功*/
				var gid=d.req.gid;
				
				var row=this.context.c_hiddencell.attr("row");
				var cols=this.context.c_hiddencell.attr("cols");
				if(M.isEmpty(row)||M.isEmpty(cols)){
					var coordata=this._getcoordedatabygid(gid);
					row=coordata.row;
					cols=coordata.cols;
				}
				this._clearitembycoordinate(cols,row);
				var olddata=d.olddata;
				this.calc_leftrooms();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			this.sortorders();
			//this.getallrooms();
			//请求结束
			var btn=this.context.checkinoption.children(".modal-footer").children("a[tag=delete]");
			this.req_end(btn);
		},
		checkoutedit:function()
		{
			this.doeditcheckin(this.context.i_hiddencell,"checkedout");
		},
		_getcheckedform:function()
		{
			var hiddencell=this.context.editcheck.children(".modal-footer").find("input[type=hidden]");
			var rows=hiddencell.attr("row");
			var cols=hiddencell.attr("cols");
			var formlist=this.context.editcheck.children(".modal-body").find(".cntlist");

			var guestname = formlist.children("li[tag=guestname]").find("input[type=text]").val().trim();
			var phone=formlist.children("li[tag=phone]").find("input[type=text]").val().trim();
			var channelfield=formlist.children("li[tag=channelcode]").children("div").children("span");
			var channelcode= channelfield.attr("value");
			var channelname=channelfield.text();
			var needcar2=formlist.children("li[tag=ordercolor]").find("input[type=checkbox][tag=needcar2]").attr("checked");
			needcar2=needcar2=="checked"?"1":"0";
			var remark=M.getVal(formlist.find("li[tag=remark]").find("textarea"));
			var paystatus=4;
			var paystatus_checked=this.context.c_paystatus.attr("checked");
			if(paystatus_checked=="checked"){
				paystatus=3;
			}
			var paystatusfield=formlist.find("li[tag=paystatus]");


			var idcard_tpl=formlist.children("li[tag=idcard]").children("div").children("div[t=idcardform]");
			var idtype=idcard_tpl.children("span").attr("value");
			var idnum=formlist.children("li[tag=idcard]").children().find("input[name=idcard]").val();

			var paytype=formlist.children("li[tag=paytype]");
			var roompaytype =paytype.children().find("div[t=roomrate]").children("span").attr("value");
			var depositpaytype=paytype.children().find("div[t=deposit]").children("span").attr("value");
			var appendmoney=paytype.children().find("input[name=roomrate]").val();
			var deposit=paytype.children().find("input[name=deposit]").val();
			deposit=isNaN(deposit)?0:parseInt(deposit);

			var gid = hiddencell.attr("gid");
			var setid=hiddencell.attr("setid");
			setid=M.isEmpty(setid)?"":setid;
			var orderdata={
				"a":"",
				"gid":gid,
				"setid":setid,
				"guestname": guestname,
				"phone": phone,
				"remark":remark,
				"channelcode":channelcode,
				"channelname":channelname,
				"rows": rows,
				"cols":cols,
				"paystatus":paystatus,
				"needcar2":needcar2,
				"idtype":idtype,
				"idnum":idnum,
				"appendmoney":appendmoney,
				"rm_paytype":roompaytype,
				"dt_paytype":depositpaytype,
				"deposit":deposit,
			};
			var guestlist=this.multiguest;
			if(this.haspluginid==0){
				orderdata['idnum']=guestlist[0].idnum;
				orderdata['idtype']=guestlist[0].idtype;
			}
			orderdata['guestlength']=1;
			if(this.multiguest.length>1){
				orderdata['guestlength']=this.multiguest.length;

				for(var i=1;i<guestlist.length;i++){
					var guest=guestlist[i];
					orderdata['guestname'+i]=guest.guestname;
					orderdata['phone'+i] = guest.phone;
					orderdata['idnum'+i]=guest.idnum;
					orderdata['idtype'+i]=guest.idtype;
				}
			}
			/*订单颜色*/
			var colorfield=formlist.children("li[tag=ordercolor]");
			var style=colorfield.find("div[tag=colorlist]").children("span[ison=1]").attr("val");
			if(M.isEmpty(style)){
				orderdata["style"]=hiddencell.attr("color");
				//if(M.isEmpty(style)){
				//	orderdata["style"]=formlist.children("li[tag=channelcode]").children().find("div[value="+channelcode+"]").children("a").attr("color");
				//}
			}else{
				orderdata["style"]=style;
			}
			/*获取房间信息*/
			var orderroomlist=formlist.children("li[tag=orderroomlist]");
			var i=0;
			var valid=true;
			var totalprice=0;
			orderroomlist.children("div[tag=order]").each(function(){
				i++;
				var roomfield=$(this).children("div[id=selectRoom]").children("span");
				var roomid=roomfield.attr("value");
				var roomname=roomfield.text().trim();
				var checkindate=$(this).children("div[id=selectDay]").children("span").attr("value");
				var nights=$(this).children("div[id=selectNights]").children("span").attr("value");
				var price=$(this).children("input[type=text][tag=price]").val();
				var oid=$(this).attr("gid");
				/*价格输入验证*/
				if(M.isEmpty(price))
				{
					alert("价格不能为空");
					valid=false;
					return;
				}
				if(isNaN(price))
				{
					alert("价格格式不正确");
					valid=false;
					return;
				}
				if(roomid==0||roomfield.length==0){
					var arrivatetime= M.strtotime(checkindate);
					var arrivatedate= M.timeformat(arrivatetime,'m/d');
					alert("对不起，"+arrivatedate+"日没有可预订的房间，请重新选择其它日期。");
					valid=false;
					return;
				}
				price=parseInt(price);
				totalprice+=price;
				orderdata["roomid"+i]=roomid;
				orderdata["roomname"+i]=roomname;
				orderdata["nights"+i]=nights;
				orderdata["price"+i]=price;
				orderdata["checkindate"+i]=checkindate;
				orderdata["gid"+i]=oid;
			});
			orderdata["totalprice"]=totalprice;
			orderdata["orderlength"]=i;
			orderdata["valid"]=valid;
			return orderdata;
		},
		savechecked:function()
		{
			var data=this._getcheckedform();
			if(M.isEmpty(data))return;
			if(M.isEmpty(data.guestname))
			{
				alert("请输入姓名");
				return;
			}
			if(data.idnum!=""&&data.idtype=="1"){
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(reg.test(data.idnum) === false)
				{
					alert("请输入正确的身份证号");
					return;
				}
			}
			data.a="editcheckin";

			var btn=this.context.editcheck.children(".modal-footer").children("a[tag=save]");
			if(!this.req_before(btn)){return;}
			M._getjson("ajax2.php",data,this.savecheck_finished.toEventHandler(this));
		},
		savecheck_finished:function(d)
		{
			if(d.status=="success")
			{
				/*删除成功*/

				/*更新ui*/
				var detail=d.data;
				var cols=d.req.cols;
				var row=d.req.row;

				var payname=d.payname;
				var action = d.req.a;
				payname.action = action;
				payname.a = "getpayinfo";

				this._clearitem(row, cols);
				this._clearitembyset(d.req.setid,"checkedin");

				/*重新显示最新*/
				var itemdate=this._getitemdate();
				var items = d.data;
				var olddata=d.olddata;
				this._showitems(items);
				this.orderdetail={"a":action,"items":items,"paydetail":payname};
				this.calc_leftrooms();
				this.cashier();
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			//请求结束
			var btn=this.context.editcheck.children(".modal-footer").children("a[tag=save]");
			this.req_end(btn);
		},
		sendmsg:function(ele,type)
		{
			var gname="";
			var phone="";
			var roomname="";
			var cityname="";
			if(type=="ordered")
			{
				gname=this.temporderdetail.guestname;
				phone=this.temporderdetail.phone;
				roomname=this.temporderdetail.roomname;
				roomtypename=this.temporderdetail.roomtypename;
				cityname=this.temporderdetail.cityname;
			}
			if(type=="checkedin")
			{
				gname=this.tempcheckdetail.guestname;
				phone=this.tempcheckdetail.phone;
				roomtypename=this.tempcheckdetail.roomtypename;
				roomname=this.tempcheckdetail.roomname;
				cityname=this.tempcheckdetail.cityname;
			}
			//从ele获取手机号和姓名
			if(M.isEmpty(phone))return;
			this._closepopup();

			var header=this.context.msgform.children(".modal-header").children("h4").html("发送短信给："+gname);
			this.context.msg_hidden.attr("guestname",gname).attr("phone",phone).attr("roomname",roomname).attr("roomtypename",roomtypename);
			var cntlist=this.context.msgform.children(".modal-body").find(".cntlist");
			var phoneele=cntlist.children("li[tag=phone]");
			phoneele.find("span[tag=phone]").html(M.isEmpty(cityname)?phone:phone+"("+cityname+")");
			phoneele.find("span[tag=hisinfo]:first").attr("title","").tooltip({position:{ my: "left top+5", at: "left bottom" } });//

			//清空选项
			cntlist.children("li[tag=tmpl]").children("select").val("");
			M.emptyVal(this.context.msg);
			this.context.leftwords.html(0);//this.context.leftwords.attr("val")

			M._getjson("/ajaxmsg.php",{"a":"gethis","phone":phone},this.msghis_finished.toEventHandler(this),"get");
			M.Popup(this.context.msgform,{"hideclass":"bootbox modal view fade","showclass":"bootbox modal view fade in"},function(){
			}.toEventHandler(this));
		},
		msghis_finished:function(d)
		{
			if(d.status=="success")
			{
				var cntlist=this.context.msgform.children(".modal-body").find(".cntlist");
				var phoneele=cntlist.children("li[tag=phone]");
				phoneele.find("span[tag=hisinfo]").attr("title",d.record);
			}
		},
		savemsg:function()
		{
			var phone=this.context.msg_hidden.attr("phone");
			var guestname=this.context.msg_hidden.attr("guestname");
			var roomname=this.context.msg_hidden.attr("roomname");
			var roomtypename=this.context.msg_hidden.attr("roomtypename");

			var cntlist=this.context.msgform.children(".modal-body").find(".cntlist");
			var msgfield=cntlist.children("li[tag=msg]").children("textarea");
			var msg=M.getVal(msgfield);
			if(M.isEmpty(msg))
			{
				alert("短信内容不能为空");
				return;
			}
			var inf1=roomtypename+'('+roomname+')';
			var innid=this.context.roomtype.attr("innid");
			var data={"a":"sendmsg","len":"1","msg":msg,"innid":innid,"p1":phone,"n1":guestname,"inf1":inf1};
			var btn=cntlist.children("li[tag=save]").children("a[tag=send]");
			if(!this.req_before(btn)){return;}
			M._getjson("/ajaxmsg.php", data,this.sendmsg_finished.toEventHandler(this),"get");
		},
		sendmsg_finished:function(d)
		{
			if(d.status=="success")
			{
				//alert(d.senddesc);
				M.success(d.senddesc);
				this._closepopup();
			}
			else
			{
				if(!M.isEmpty(d.msg))
				{
					alert(d.msg);
				}
			}
			//请求结束
			var cntlist=this.context.msgform.children(".modal-body").find(".cntlist");
			var btn=cntlist.children("li[tag=save]").children("a[tag=send]");
			this.req_end(btn);
		},
		auth_failed:function()
		{
			alert('对不起，您没有该权限，请联系客栈管理员');
			return;
		},
		destroyorderform:function()
		{
			this._clearorderform();
			this.formatedateprice={};
			this.tempavarooms=null;
			this.temporderdetail=null;
		},
		setordercolor:function(ele)
		{
			var selected = ele.parent().children("span[ison=1]");
			selected.attr('ison',"0");
			selected.attr("class",selected.attr("val"));
			ele.attr("class",ele.attr("val")+" checked").attr("ison","1");
			var value=ele.attr("val");
			ele.parents("div[tag=color]").children("span").attr("class",value+" checked");
			ele.parents("div[tag=colorlist]").hide();
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
		_closepopup:function()
		{
			M.ClosePopup();
		},
		_initdateprice:function()
		{
			return;

		},
		destroy: function () {

		}
	});
function clealtpl(id){return;
	$("#otamsgbox").children("div[tag=otamsg][orderid="+id+"]").remove();
}
