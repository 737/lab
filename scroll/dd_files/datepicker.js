/*
Author:johnny
Date:2013-03-16
Desc:datepicker
Requires:jquery 1.4.2+,Miot.js jquerytemplate
*/

/*
1.整体日期框结构为table
2.用户定义日期模板和样式 ；内部事件接受参数
3.显示连续某月日期
4.当前日期接受参数
5.暂不支持文本框漂浮日期样式
*/

var PROP_NAME = "datepicker";
M.Controls.DatePicker = M.createClass();
M.extend(M.Controls.DatePicker.prototype,
{
    options: {
    	fromdate:null,
    	enddate:null,
        todayindex:0,
        weekendindex:{},
        rows:0,
        hidedays:0,
        days: 30,
        column:2,
        difmonth:1,
        isfold:0,
        roomlist:{},
        tdwidth: "100px",
        headerorder:["mon","tus","wed","thu","fri","sat","sun"],/*排序*/
        weektext: {"1":"一","2":"二","3":"三","4":"四","5":"五","6":"六","0":"日"}
    },
    
    transform:null,
    isreverse:0,
    curentdate: null,
    fromdate: null,
    enddate:null,
    _created:false,
    _headertbl:null,
    _contenttbl: null,
    _picker: null,
    _dateconverter: null,
    _headerconverter: null,
    _contentClickHandler:null,
    
    _renderday:function(date,index)
    {
        if (this._dateconverter == undefined || this._dateconverter == null) {

        }
        else {
            return this._dateconverter.call(this._dateconverter.content, date);
        }
    },
    create: function (headerele,contentele) {
        //生成内容
        if (this.curentdate == null) {
            this.curentdate = new Date();
        }

        var header = $('<table cellpadding="0" cellspacing="0" border="0"></table>').attr("t", "pickerheader");
        var content = $('<table cellpadding="0" cellspacing="0" border="0"></table>').attr("t", "content");
       
        this._headertbl = header;
        this._contenttbl = content;

        headerele.prepend(header);
        contentele.prepend(content);
        this._generatepickerheader();
        this._contenttbl.bind("click", this.content_click.toEventHandler(this));
    },
    setOptions:function(options)
    {	
        this.transform=options.transform;
        this.isreverse=options.isreverse;
    	this.options.fromdate=new Date(options.fromdate.getFullYear(), options.fromdate.getMonth(), options.fromdate.getDate());
    	this.options.enddate=new Date(options.enddate.getFullYear(), options.enddate.getMonth(), options.enddate.getDate()-1);
    	this.curentdate=options.now;
    },
    setDateConverter: function (converter) {
        this._dateconverter = converter;
    },
    setHeaderConverter:function(converter){
        this._headerconverter = converter;
    },
    scroll_handler:function(){
        //判断datepicker是否出现滚动条
        var obj = this._contenttbl.parent()[0];

//        $('#pickerdate').css('overflow-y','hidden');
    },
    _generatepicker: function () {
    	this.options.weekendindex={};
    	this.options.todayindex=0;
        this._generatepickerheader();
    },
    _generatepickerheader: function () {
        var today = new Date(this.curentdate.getFullYear(), this.curentdate.getMonth(), this.curentdate.getDate());
        var month = today.getMonth();
        var year = today.getYear();
        var dayofweek = today.getDay();
        if(M.isEmpty(this.options.fromdate))
        {
	        var sdate = today;
	        var daycount = 0;
	        if (dayofweek > 0) {
	            daycount = dayofweek-1;
	        }
	        else {
	            daycount = 0;
	        }
	        sdate.setDate(sdate.getDate()-1-daycount);
	        this.fromdate=sdate;
	        this.options.fromdate=sdate;
	    }
        if(M.isEmpty(this.options.enddate))
        {
        	var enddate = new Date(this.curentdate.getFullYear(), this.curentdate.getMonth()+1, this.curentdate.getDate());
            this.enddate=enddate;
            this.options.enddate=enddate;
        }
        
        var sdate=new Date(this.options.fromdate.getFullYear(), this.options.fromdate.getMonth(),this.options.fromdate.getDate());
        this.fromdate = new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
        
        /*为了显示前天退房的订单,在table隐藏一列,其实日期减1*/
        var enddate=this.options.enddate;
        this.options.days = parseInt(Math.abs(enddate - sdate) / 1000 / 60 / 60 / 24);
        this.options.rows=this.options.days+1+this.options.hidedays;
		
        var todayname = this.timeformat(this.curentdate);
        var yesname=this.timeformat(new Date(this.curentdate.getFullYear(), this.curentdate.getMonth(), this.curentdate.getDate()-1));
        var headhtml = "";
        var weekhtml = "";
        for (var i = 0; i < this.options.rows; i++) {
            var newdate = sdate;
            var datestr=M.timeformat(sdate,"Y-m-d");
            var holiday=M.Holiday();
        	var holidaystr=holiday.getholiday(datestr);
            var wkod = newdate.getDay();
            var weekendclass="";
            if(this.isreverse==1){
            	weekendclass=wkod == 1 ? "weekend" : "";
            }
            else{
            	weekendclass=wkod == 0 ? "weekend" : "";
            }
            
            var weekendclasshtml = weekendclass == "" ? "" : " class='" + weekendclass + "'";
            if(weekendclass!="")
            {
            	this.options.weekendindex["col"+i]=1;
            }
            var weekname = this.options.weektext[wkod];
            var name = this.timeformat(newdate);
            var todayclass = "";
			var desc = (newdate.getMonth() + 1) + "/" + newdate.getDate();
            if (todayname == name) {
                this.options.todayindex = i;
                todayclass = "today";
                weekendclasshtml = " class='today'";
				desc="今天";
            }
            else if(yesname==name)
            {
            	//desc="昨天";
            }
            
            var dis="";
            if(i>this.options.days)
            {
            	dis="style='display:none'";
            }	
            weekhtml += "<td " + weekendclasshtml + ">" + weekname + "</td>";
            var holidayclass=""
            if(!M.isEmpty(holidaystr)){
            	holidayclass="class='holiday'";
            	weekname=holidaystr;
            }
            if(this.isreverse!=1){
            	headhtml += "<tr i='" + i + "' time='" + name + "' "+dis+"><td "+weekendclasshtml+"><i></i><b "+holidayclass+">"+desc+"<tt>"+weekname+"</tt></b></td></tr>";	
            }
            else
            {
            	headhtml += "<td  i='" + i + "' time='" + name + "'  "+weekendclasshtml+"><b "+holidayclass+">"+desc+"<tt>"+weekname+"</tt></b><i></i></td>";
            }
            
            sdate.setDate(sdate.getDate() + 1);
            if(i==this.options.days)
            {

            }
        }
        
        if(this.isreverse==1){
        	headhtml="<tr>"+headhtml+"</tr>";
        }
        
        this.enddate =enddate;
        this._headertbl.html(headhtml);
    },
    _generatecontent:function()
    {
        return;
    },
    _changemonth: function (newmonth) {
        this._generatepicker();
        this._contenttbl.children("tbody").children().remove();
        this.resetrows(this.options.roomlist);
//        this.setrows();
//	    var rows = this.context.roomlist.find("tr[fold=1]").length;
    },
    _changeday: function (newdate) {
        this.curentdate.setDate(newdate);
        this._generatepicker();
    },
    newrow: function (index) {
    	var dis="";
        var html = "<tr i='"+index+"' "+dis+">";
	    var html1 = "<tr i='"+index+"' "+dis+" style='display:none;' collapse='1'>";
        var settotal=false;
        if(this.isreverse==1&&index>=this.options.rows)
        {
        	settotal=true;
        	var html = "<tr i='"+index+"' "+dis+" tag='total' show='1'>";
        }
        
        var tag="day";
        var t='f';
        for (var i = 0; i < this.options.column; i++) {
        	var colindex=this.isreverse==1?i:index;
        	
        	if(this.isreverse==1&&index>this.options.rows){
        		t='w';
        	}
        	if(settotal){tag='total';}
        	var showstr=settotal?" show='1' ":"";
            if(false)
            {
                html += "<td t='"+t+"' tag='"+tag+"' sta='unordered' "+showstr+" idx='" + i + "' class='today'>" + this._renderday(null, i) + "</td>";
                html1 += "<td idx='" + i + "' class='today'>" + this._renderday(null, i) + "</td>";
            }
            else {
            	/*是否是周末*/
            	if(this.options.weekendindex["col"+colindex]==1)
            	{
            		html += "<td t='"+t+"' tag='"+tag+"' sta='unordered' "+showstr+"  idx='" + i + "' class='weekend'>" + this._renderday(null, i) + "</td>";
            		html1 += "<td idx='" + i + "' class='weekend'>" + this._renderday(null, i) + "</td>";
            	}
            	else
            	{
            		html += "<td t='"+t+"' tag='"+tag+"' sta='unordered' "+showstr+"  idx='" + i + "'>" + this._renderday(null, i) + "</td>";
            		html1 += "<td idx='" + i + "'>" + this._renderday(null, i) + "</td>";
            	}
            }
        }
        html += "</tr>";
        html1 += "</tr>";
        this._contenttbl.append($(html));
		this._contenttbl.append($(html1));
        this.scroll_handler();
    },
    resetrows:function(rows){
    	 this.options.roomlist=rows;
    	 if(this.isreverse==1){
    		 this.reversesetrow(rows);
    	 }else{    		
    		 if(this.options.isfold==1){
    			 this.setrow(rows);
    		 }else{
    			 this.reversesetrow(rows);
    		 }
    		
    	 }
    },
    setrows:function(rows){
    	 this.options.roomlist=rows;
    	 if(this.isreverse==1){
    		 this.reversesetrow(rows);
    	 }else{
    		 this.options.isfold=rows.isfold;
    		 if(this.options.isfold==1){
    			 this.options.roomlist=rows.list;
    			 this.setrow(rows.list);
    		 }else{
    			 this.options.roomlist=rows.roomlength;
    			 this.reversesetrow(rows.roomlength);
    		 }
    		
    	 }
    },
    setrow:function(rows){
    	var html='';
    	 for (var index = 0; index < this.options.rows; index++) {
    		 html+='<tr i="'+index+'">';
    		 var colindex=0;
        	 for (var i in rows) {
              	var rtid=rows[i].rtid;
              	html+='<td rtid="'+rtid+'" tag="c" style="display:none">';
            	html+='<div style="width: 141px;" class="date-have">1</div>';
              	html+='</td>';
              	var rooms=rows[i].list;
              	for(var k in rooms){
              		var tag="day";
                    var t='f';
                    var room=rooms[k];
                    if(this.options.weekendindex["col"+index]==1)
                	{
                    	html+='<td sta="unordered" rtid="'+room.rtid+'" t="'+t+'" tag="'+tag+'"  idx="' + colindex + '" class="weekend">' + this._renderday(null, colindex) + '</td>';
                	}
                	else
                	{
                		html += '<td sta="unordered" rtid="'+room.rtid+'" t="'+t+'" tag="'+tag+'"  idx="' + colindex + '">' + this._renderday(null, colindex) + '</td>';
                	}
                    colindex++;
              		
              	}            
              }
        	 html+='</tr>';
    	 }
    	  this._contenttbl.append($(html));
    	
    },
    reversesetrow: function (n) {
        if(this.isreverse==1){
        	var temp=this.options.rows;
			this.options.rows=n;
			this.options.column=temp;
        }
        else
        {
			this.options.column = n;
        }

        for (var i = 0; i < this.options.rows; i++) {
            this.newrow(i);
        }
        
        if(this.isreverse==1){
        	var temp=this.options.rows;
			this.options.rows=this.options.column;
			this.options.column=temp;
        }
    },
    removerow:function(rowindex){
        var trlist = this._contenttbl.children("tbody").children();
        $(trlist[rowindex]).remove();
        this.scroll_handler();
    },
    /**/
    nextmonth:function()
    {	
    	this.options.fromdate.setMonth(this.options.fromdate.getMonth()+this.options.difmonth);
    	var fdate=new Date(this.options.fromdate.getFullYear(),this.options.fromdate.getMonth()+1,this.options.fromdate.getDate()-1);
     	this.options.enddate=new Date(fdate.getFullYear(),fdate.getMonth(),fdate.getDate());
        this._changemonth();
    },
    premonth: function () { 
        this.options.fromdate.setMonth(this.options.fromdate.getMonth()-this.options.difmonth);
        var fdate=new Date(this.options.fromdate.getFullYear(),this.options.fromdate.getMonth()+1,this.options.fromdate.getDate()-1);
     	this.options.enddate=new Date(fdate.getFullYear(),fdate.getMonth(),fdate.getDate());
        this._changemonth(0);
    },
	StringToDate:function(DateStr) {
	    if (typeof DateStr == "undefined") return new Date();
	    if (typeof DateStr == "date") return DateStr;
	    var converted = Date.parse(DateStr);
	    var myDate = new Date(converted);
	    if (isNaN(myDate)) {
	        DateStr = DateStr.replace(/:/g, "-");//支持 2013:10:17
	        DateStr = DateStr.replace(" ", "-"); //支持 2013 10 17
	        DateStr = DateStr.replace(".", "-"); //支持 2013.10.17
	        var arys = DateStr.split("-");   //支持2013-10-17
	        switch (arys.length) {
	          case 7://2013-10-17-13-56-33-22 格式
	            myDate = new Date(arys[0], --arys[1], arys[2], arys[3], arys[4], arys[5], arys[6]);
	            break;
	 
	          case 6: //2013-10-17-13-56-33 格式
	            myDate = new Date(arys[0], --arys[1], arys[2], arys[3], arys[4], arys[5]);
	            break;
	 
	          default://2013-10-17 格式
	            myDate = new Date(arys[0], --arys[1], arys[2]);
	            break;
	        }
	    }
	    return myDate;
	},
    selectday:function(startday,enday){
    	var fdate=this.StringToDate(startday);
    	this.options.fromdate=new Date(fdate.getFullYear(),fdate.getMonth(),fdate.getDate());
    	
    	var sdate=new Date(this.options.fromdate.getFullYear(),this.options.fromdate.getMonth()+1,this.options.fromdate.getDate()-1);    	
    	this.options.enddate=sdate;
    	this._changemonth(0);
    },
    nextweek: function () {
        var date = this.curentdate.getDate();
        this._changeday(date + 7);
    },
    preweek: function () {
        var date = this.curentdate.getDate();
        this._changeday(date - 7);
    },
    getcurrentdate:function()
    {
        return this.curentdate;
    },
    getpickerele:function()
    {
        return this._contenttbl;
    },
    getcontentele:function()
    {
        return this._contenttbl;
    },
    getbegindate:function()
    {
    	return this.fromdate;
    },
    getbeginindex:function()
    {	
    	return 0;
    },
    getenddate:function()
    {
    	return this.enddate;
    },
    getrealenddate:function()
    {
    	var enddate=this.enddate;
    	var enddatetime=new Date(enddate.getFullYear(),enddate.getMonth(),enddate.getDate()+this.options.hidedays);
    	return enddatetime;
    },
    setcontent_clickhandler:function(handler){
        this._contentClickHandler = handler;
    },
    content_click:function(e)
    {
        if (this._contentClickHandler != undefined && this._contentClickHandler != null) {
            this._contentClickHandler.call(this._contentClickHandler.content, e);
        }
    },
    timeformat: function (date) {
        var time = "" + date.getFullYear() + "-" + this.zerosize(date.getMonth() + 1 + "", 2) + "-" + this.zerosize(date.getDate() + "", 2);
        return time;
    },
    zerosize: function (value, length) {
        if (!length) length = 2;
        value = String(value);

        for (var i = 0, zeros = ''; i < (length - value.length) ; i++) {
            zeros += '0';
        }
        return zeros + value;
    },
    _destroy: function () {

    }
});



M.extend(M, {
    DatePicker: function (header,content, options, _dateconverter,_headerconverter) {
        var control = new M.Controls.DatePicker();
        control.setDateConverter(_dateconverter);
        control.setHeaderConverter(_headerconverter);
        control.setOptions(options);
        control.create(header,content);
        return control;
    }
});

    
