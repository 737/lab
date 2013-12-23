var Utils={};



Utils.$E=function(id){

    return document.getElementById(id);

};



Utils.$C=function(tagName){

    return document.createElement(tagName);

};



Utils.getIntervalRandom=function(min,max){

    return parseInt(Math.random()*(max-min)+min);

};



Utils.INTERVAL_SPEED=30;

if(navigator.appName.toLowerCase().indexOf("netscape")!=-1)

{

    Utils.INTERVAL_SPEED=Utils.INTERVAL_SPEED+(Utils.INTERVAL_SPEED/6);

}



String.prototype.padLeft=function(sLen,padChar){

    var result=this;

    for(i=this.length;i<sLen;i++){

        result=padChar+result;

    }

    return result;

};





var Firework=function(x,shotHeight,radius,particleCount,color,speed){

    this.shotHeight=shotHeight || 200;

    this.radius=radius || 100;

    this.particleCount=particleCount || 10;

    this.color=color || "#FF0000";

    this.parentElement=document.body;

    this.x=x;

    this.shottingSpeed=speed || 3;

    this.isShoted=false;

    this.isFlash=true;

    

    this._particles=[];

    this._particleShape=unescape("%u25CF");

    this._shottingShape="|";

    this._depth=3;

    this._shotting=Utils.$C("div");

    this._flashing=Utils.$C("div");

    this._disposeCount=0;

    

    var _this=this;

    

    void function initialize(){

        for(var i=0;i<_this.particleCount;i++){

            _this._particles[i]=Utils.$C("div");

            _this._particles[i].style.position="absolute";

            _this._particles[i].style.left=_this.x+"px";

            _this._particles[i].style.top=_this.shotHeight+"px";

            _this._particles[i].style.zIndex=100;

            _this._particles[i].style.color=_this.color;

            _this._particles[i].style.display="none";

            _this._particles[i].innerHTML=_this._particleShape;

            _this._particles[i].distance=Utils.getIntervalRandom(1,_this.radius-parseInt((i%_this._depth)*(_this.radius/_this._depth)));

            _this._particles[i].speed=Utils.getIntervalRandom(1,4)*_this._particles[i].distance*0.06;

            _this.parentElement.appendChild(_this._particles[i]);

            _this._setSize(_this._particles[i],5);

        }

        

        _this._shotting.speed=_this.shottingSpeed;

        _this._shotting.innerHTML=_this._shottingShape;

        _this._shotting.style.position="absolute";

        _this._shotting.style.fontWeight="900";

        _this._shotting.style.left=_this.x+"px";

        //_this._shotting.style.top=_this.parentElement.offsetTop+_this.parentElement.offsetHeight-_this._shotting.offsetHeight+"px";

        _this._shotting.style.top="700px";

        _this._shotting.style.zIndex=100;

        _this._shotting.style.color=_this.color;

        _this._setSize(_this._shotting,15);

        _this.parentElement.appendChild(_this._shotting);

        

        _this._flashing.style.width="100%";

        _this._flashing.style.height="100%";

        _this._flashing.style.left="0";

        _this._flashing.style.top="0";

        _this._flashing.style.backgroundColor="#ffffee";

        _this._flashing.style.position="absolute";

        _this._flashing.style.zIndex=200;

        _this._flashing.style.display="none";

        _this._flashing.style.MozOpacity=0.5;

        _this._flashing.style.filter="alpha(opacity=50)";

        _this.parentElement.appendChild(_this._flashing);

        

    }();

};



Firework.prototype.shot=function(){

    var _this=this;

    _this.isShoted=true;

    var shotInterval=window.setInterval(function(){

        if(parseInt(_this._shotting.style.top)>_this.shotHeight){

            _this._shotting.style.top=parseInt(_this._shotting.style.top)-_this._shotting.speed+"px";

        }

        else{

            window.clearInterval(shotInterval);

            _this.parentElement.removeChild(_this._shotting);

            _this.bomb();

            _this._shotting=null;

        }    

    },Utils.INTERVAL_SPEED);

};



Firework.prototype.bomb=function(){

    var _this=this;

    if(_this.isFlash){

        _this._flashing.style.display="";

        var flashTimeout=window.setTimeout(function(){

            _this.parentElement.removeChild(_this._flashing);

            window.clearTimeout(flashTimeout);

        },10);

    }

    else{

        _this.parentElement.removeChild(_this._flashing);

    }

    

    for (var i = 0; i <_this._particles.length; i++) {

        _this._moveParticle(_this._particles[i], Utils.getIntervalRandom(0,360));

    }

};



Firework.prototype._setSize=function(obj,value){

    obj.style.fontSize=parseInt(value)+"px";

};



Firework.prototype._moveParticle=function(particle,angle){

    var _this=this;

    var initX=parseInt(particle.style.left);

    var initY=parseInt(particle.style.top);

    var currentDistance=0;

    var currentX=initX;

    var currentY=initY;

    particle.style.display="";

    

    particle.intervalId=window.setInterval(function(){

        if(currentDistance<particle.distance){

            var newX,newY;

            var xAngle=angle*(2*Math.PI/360);

            var xDirection=Math.abs(Math.cos(xAngle))/Math.cos(xAngle);

            var yDirection=Math.abs(Math.sin(xAngle))/Math.sin(xAngle);

    

            if(Math.abs(Math.tan(xAngle))<=1){

                var deltaX=Math.abs(particle.speed*Math.cos(xAngle))*xDirection;

                newX=currentX+deltaX;

                newY=-(newX-initX)*Math.tan(xAngle)+initY;

                currentDistance+=Math.abs(deltaX);

            }

            else{

                var deltaY=Math.abs(particle.speed*Math.sin(xAngle))*yDirection;

                newY=currentY-deltaY;

                newX=-(newY-initY)/Math.tan(xAngle)+initX;

                currentDistance+=Math.abs(deltaY);

            }

            currentX=newX;

            currentY=newY;

            particle.style.left=currentX+"px";

            particle.style.top=currentY+"px";

        }

        else{

            window.clearInterval(particle.intervalId);

            _this.parentElement.removeChild(particle);

            particle=null;

            if(++_this._disposeCount==_this.particleCount){

                _this._particles.length=0;

                _this.parentElement=null;

                _this=null;

            }

        }

    },Utils.INTERVAL_SPEED);


};