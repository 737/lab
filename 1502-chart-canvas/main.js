require.config({
    waitSeconds: 20,
    baseUrl: '',
    paths: {
        'underscore': '/lib/underscore.v1.4.4',
        'jquery': '/lib/jQuery.v1.11.0-beta3',
        'text': '/lib/require.text',
        'sun': '/sun/src/sun'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'sun': {
            exports: 'sun'
        }
    }
});

require(['lineChart', 'text!lineChart.html', 'underscore', 'jquery', 'sun'], function(LineChart, tmpHtml) {
    
    var chart = {
        $el: $('#chart-wrap'),
        render: function () {
            this.$el.append(tmpHtml);
            this.els = {
                dragEl: this.$el.find('#j_dragTargetTendency'),
                circle: this.$el.find('#circle'),
                cursor: this.$el.find('#cursor'),
                cursorLine: this.$el.find('#cursor-line'),
                pointValue: this.$el.find('#pointValue'), 
                transitionEls: this.$el.find('[data-role="transition"]'),
                chartContainer: this.$el.find('#chart-container'),
                canvas: this.$el.find('#chartCanvas'),
                trobbingPriceList_box: this.$el.find('#j_trobbingPirceList_box'),
                trobbingPriceList_tpl: this.$el.find('#j_trobbingPirceList_tpl'),
                noDataBox: this.$el.find('#j_noDataTendency_box')
            };
            
            this.trobbingPriceListFun = _.template(this.els.trobbingPriceList_tpl.html());
        },
        // 获得LineChart配置
        generateChartOptions: function () {
            var paddings = {
                left: 40,
                top: 40,
                right: 10,
                bottom: 40
            };
            var height = parseInt((window.innerWidth / 320) * 220);
            var width = window.innerWidth;
            var cursorCenterOffset = 75;
            var circleRadius = 5;
            var options = {
                width: width,
                height: height,
                paddings: paddings,
                startX: paddings.left,
                startY: height - paddings.bottom, 
                stepsY: 4,
                startPoint: paddings.top,
                endPoint: height - paddings.top, //options.height - options.padding
                bezierCurve: true,
                datasetFill: true,
                xLabelSetting: {
                    size: 15,
                    weight: 'normal',
                    color: '#099fde', //rgba(85,186,230,1)',
                    family: 'Arial',
                    align: 'left',
                    offsetX: 0,
                    offsetY: 0
                },
                yLabelSetting: {
                    size: 14,
                    weight: 'normal',
                    color: 'rgba(102,102,102,.8)', //rgba(85,186,230,1)',
                    family: 'Arial',
                    align: 'left',
                    offsetX: 0,
                    offsetY: 0
                }
            };

            return options;
        }
    };
    
    chart.render();
    
    var context = $('#chartCanvas')[0].getContext('2d');
    var options = chart.generateChartOptions();
    
    this.lineChart = new LineChart(context, {}, options);
    
    console.log('start');
    
});




