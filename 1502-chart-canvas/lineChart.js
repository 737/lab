define([], function () {
    var helpers = {
        getPointsWithValues: function (labels, data, options) {
            var points = [];

            for (var i = 0; i < data.length; i++) {
                points.push({
                    x: Math.round(helpers.calculateX(labels, i, options)),
                    y: helpers.calculateY(data, i, options),
                    value: data[i],
                    index: i
                });
            }
            window.points = points;
            return points;
        },
        retinaScale: function(chart){
            var cxt = chart.cxt,
                options = chart.getOptions(),
                width = options.width,
                height = options.height;

            if (window.devicePixelRatio) {
                cxt.canvas.style.width = width + "px";
                cxt.canvas.style.height = height + "px";
                cxt.canvas.height = height * window.devicePixelRatio;
                cxt.canvas.width = width * window.devicePixelRatio;
                cxt.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        },
        calculateX: function (labels, index, options) {
            var paddings = options.paddings,
                contentWidth = options.width - (paddings.left + paddings.right),
                distanceX = contentWidth / (labels.length - 1);

            return paddings.left + index * distanceX;
        },
        calculateY: function (values, index, options) {
            var paddings = options.paddings,
                contentHeight = options.height - (paddings.top + paddings.bottom),
                distanceY = contentHeight / options.stepsY,
                minValue = Math.min.apply(Math, values),
                maxValue = Math.max.apply(Math, values),
                minY = minValue,
                maxY = maxValue;

            if (minY == maxY) {
                minY = 0;
            }

            return paddings.top + (1 - ((values[index] - minY) / (maxY - minY))) * contentHeight;
        },
        getYLabels: function (minValue, maxValue, stepsY) {
            var yLabels = [],
                deltaValue = parseInt((maxValue - minValue) / stepsY);

            for (var i = 0; i < stepsY - 1; i++) {
                if (i === 0) {
                    yLabels.push(minValue);
                    continue;
                }
                yLabels.push(yLabels[i - 1] + deltaValue);
            } 

            yLabels.push(maxValue);   

            return yLabels;
        },
        hasValue: function(item){
            return item.value !== null;
        },
        findNextWhere: function(arrayToSearch, filterCallback, startIndex){
            // Default to start of the array
            if (!startIndex){
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)){
                    return currentItem;
                }
            };
        },
        findPreviousWhere: function(arrayToSearch, filterCallback, startIndex){
            // Default to end of the array
            if (!startIndex){
                startIndex = arrayToSearch.length;
            }
            for (var i = startIndex - 1; i >= 0; i--) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)){
                    return currentItem;
                }
            }
        },
        nextPoint: function(point, collection, index){
            return helpers.findNextWhere(collection,  helpers.hasValue, index) || point;
        },
        previousPoint: function(point, collection, index){
            return helpers.findPreviousWhere(collection, helpers.hasValue, index) || point;
        },
        splineCurve: function(FirstPoint,MiddlePoint,AfterPoint,t){
            //Props to Rob Spencer at scaled innovation for his post on splining between points
            //http://scaledinnovation.com/analytics/splines/aboutSplines.html
            var d01=Math.sqrt(Math.pow(MiddlePoint.x-FirstPoint.x,2)+Math.pow(MiddlePoint.y-FirstPoint.y,2)),
                d12=Math.sqrt(Math.pow(AfterPoint.x-MiddlePoint.x,2)+Math.pow(AfterPoint.y-MiddlePoint.y,2)),
                fa=t*d01/(d01+d12),// scaling factor for triangle Ta
                fb=t*d12/(d01+d12);
            return {
                inner : {
                    x : MiddlePoint.x-fa*(AfterPoint.x-FirstPoint.x),
                    y : MiddlePoint.y-fa*(AfterPoint.y-FirstPoint.y)
                },
                outer : {
                    x: MiddlePoint.x+fb*(AfterPoint.x-FirstPoint.x),
                    y : MiddlePoint.y+fb*(AfterPoint.y-FirstPoint.y)
                }
            };
        },
        each: function(loopable,callback,self){
            var additionalArgs = Array.prototype.slice.call(arguments, 3);
            // Check to see if null or undefined firstly.
            if (loopable){
                if (loopable.length === +loopable.length){
                    var i;
                    for (i=0; i<loopable.length; i++){
                        callback.apply(self,[loopable[i], i].concat(additionalArgs));
                    }
                }
                else{
                    for (var item in loopable){
                        callback.apply(self,[loopable[item],item].concat(additionalArgs));
                    }
                }
            }
        },
    };

    var LineChart = function (cxt, data, options) {
        this.cxt = cxt;
        this.data = data;
        this.options = options;
        this.pixelRatio = 1;//window.devicePixelRatio || 1;
        helpers.retinaScale(this);
    };

    LineChart.prototype.setData = function (data) {
        this.data = data;
        return this;
    };

    LineChart.prototype.setOptions = function (options) {
        this.options = options;
        return this;
    };

    LineChart.prototype.getData = function (data) {
        return this.data;
    };

    LineChart.prototype.getOptions = function (options) {
        return this.options || {};
    };

    LineChart.prototype.findPointByPosX = function (x, direction) {
        var point = null,
            deltas = [],
            min = 0;

        this.pointsWithValues.forEach(function (item, i, points) {
            if (direction) {
                deltas.push(item.x - x);
            } else {
                deltas.push(x - item.x);
            }
        });

        for (var i = 0; i < deltas.length; i++) {
            if (deltas[i] >= 0) {
                if (min == 0) {
                    min = deltas[i];
                } else {
                    min = Math.min(min, deltas[i]);
                }
            }
        }
        // min = Math.min.apply(Math, deltas);
        //值为0的点不停留
        var index = deltas.indexOf(min),
            i = index,
            point = this.pointsWithValues[index];

        if (+point.value != 0) {
            return point;
        } else {
            if (direction) {
                while (i < this.pointsWithValues.length) {
                    if (+this.pointsWithValues[i].value > 0) {
                        point = this.pointsWithValues[i];
                        break;
                    }
                    i++;
                }
                if (+point.value == 0) {
                    i = index;
                    while (i >= 0) {
                        if (+this.pointsWithValues[i].value > 0) {
                            point = this.pointsWithValues[i];
                            break;
                        }
                        i--;
                    }
                }
            } else {
                while (i >= 0) {
                    if (+this.pointsWithValues[i].value > 0) {
                        point = this.pointsWithValues[i];
                        break;
                    }
                    i--;
                }

                if (+point.value == 0) {
                    i = index;
                    while (i < this.pointsWithValues.length) {
                        if (+this.pointsWithValues[i].value > 0) {
                            point = this.pointsWithValues[i];
                            break;
                        }
                        i++;
                    }
                }
            }
        }

        return point;
    };

    LineChart.prototype.draw = function (data, options, callback, isClear) {
        var context = this.cxt,
            pointsWithValues = [],
            minValue = -1,
            maxValue = -1;

        helpers.retinaScale(this);

        data = data || this.data;
        options = options || this.options;

        isClear = typeof isClear === 'undefined' ? true : isClear;
        isClear ? context.clearRect(0, 0, options.width * window.devicePixelRatio, options.height * window.devicePixelRatio) : '';

        for (var i = 0; i < data.datasets.length; i++) {
            minValue = i == 0 ? Math.min.apply(Math, data.datasets[i].data) : Math.min(minValue, Math.min.apply(Math, data.datasets[i].data));
            maxValue = i == 0 ? Math.max.apply(Math, data.datasets[i].data) : Math.max(maxValue, Math.max.apply(Math, data.datasets[i].data));
            minValue = minValue == maxValue ? 0 : minValue;

            pointsWithValues = helpers.getPointsWithValues(data.labels, data.datasets[i].data, options);
        
            helpers.each(pointsWithValues, function(point, index){
                var tension = (index > 0 && index < pointsWithValues.length - 1) ? 0.4 : 0;
                point.controlPoints = helpers.splineCurve(
                    helpers.previousPoint(point, pointsWithValues, index),
                    point,
                    helpers.nextPoint(point, pointsWithValues, index),
                    tension
                );

                // Prevent the bezier going outside of the bounds of the graph

                //Cap puter bezier handles to the upper/lower scale bounds
                if (point.controlPoints.outer.y > options.endPoint){
                    point.controlPoints.outer.y = options.endPoint;
                } else if (point.controlPoints.outer.y < options.startPoint){
                    point.controlPoints.outer.y = options.startPoint;
                }

                // Cap inner bezier handles to the upper/lower scale bounds
                if (point.controlPoints.inner.y > options.endPoint){
                    point.controlPoints.inner.y = options.endPoint;
                } else if (point.controlPoints.inner.y < options.startPoint){
                    point.controlPoints.inner.y = options.startPoint;
                }
            }, this);
            
            this.drawLine(data.datasets[i], pointsWithValues);
            this.pointsWithValues = pointsWithValues;
        }

        this.drawXLabels(data.labels, pointsWithValues);
        this.drawYLabels(data.yLabels || helpers.getYLabels(minValue, maxValue, options.stepsY), pointsWithValues);
        callback && callback(pointsWithValues);
    };

    LineChart.prototype.drawLine = function (dataset, pointsWithValues) {
        var context = this.cxt,
            options = this.options;

        context.lineWidth = dataset.strokeWidth;
        context.strokeStyle  = dataset.strokeColor;
        context.fillStyle = dataset.fillColor;

        context.moveTo(options.paddings.left, options.paddings.top);
        context.beginPath();
        for (var j = 0; j < pointsWithValues.length; j++) {
            if (j === 0) {
                context.moveTo(pointsWithValues[0].x, pointsWithValues[0].y);
            } else if (dataset.bezierCurve /*options.bezierCurve*/) {
                var previous = helpers.previousPoint(pointsWithValues[j], pointsWithValues, j);

                context.bezierCurveTo(
                    previous.controlPoints.outer.x,
                    previous.controlPoints.outer.y,
                    pointsWithValues[j].controlPoints.inner.x,
                    pointsWithValues[j].controlPoints.inner.y,
                    pointsWithValues[j].x,
                    pointsWithValues[j].y
                );
            } else {
                context.lineTo(pointsWithValues[j].x, pointsWithValues[j].y);
            }

            // TODO point settings
            if (dataset.drawPoint) {
                context.arc(pointsWithValues[j].x, pointsWithValues[j].y, 5, 0, Math.PI * 2);
            }
        }
        context.stroke();
        
        if (options.datasetFill && pointsWithValues.length > 0){
            //Round off the line by going to the base of the chart, back to the start, then fill.
            context.lineTo(pointsWithValues[pointsWithValues.length - 1].x, options.height - options.paddings.bottom);
            context.lineTo(pointsWithValues[0].x, options.height - options.paddings.bottom);
            context.lineTo(pointsWithValues[0].x, pointsWithValues[0].y);
            context.closePath();
            context.fill();
        }
    };

    LineChart.prototype.drawXLabels = function (labels, pointsWithValues) {
        var that = this,
            context = this.cxt,
            options = this.options,
            setting = options.xLabelSetting;

        labels.forEach(function (label, i, labels) {
            if (label) {
                context.font = setting.weight + ' ' + setting.size + 'px ' + setting.family;
                context.textAlign = setting.align;
                context.fillStyle = setting.color; 
                context.fillText(label, (i === labels.length - 1) ? (pointsWithValues[i].x - context.measureText(label).width) : pointsWithValues[i].x, options.height - options.paddings.bottom * 0.5);
            }
        });
    };

    LineChart.prototype.drawYLabels = function (labels, points) {
        var that = this,
            context = this.cxt,
            options = this.options,
            setting = options.yLabelSetting,
            distanceY = (options.height - options.paddings.top - options.paddings.bottom) / (labels.length - 1),
            posY = 0;

        (labels || []).forEach(function (label, i, labels) {
            if (label != null && typeof label !== 'undefined') {
                posY = (options.height - options.paddings.bottom - distanceY * i);
                context.font = setting.weight + ' ' + setting.size + 'px ' + setting.family;
                context.textAlign = setting.align;
                context.fillStyle = setting.color; 
                context.fillText('￥' + label, setting.offsetX, posY);
                // context.beginPath();
                // context.strokeColor = 'rgba(0,0,0,1)';
                // context.lineWidth = 0.5;
                // context.moveTo(0, posY);
                // context.lineTo(options.width - options.padding, posY);
                // context.stroke();
                // context.closePath();
            }
        });
    };

    return LineChart;
});
