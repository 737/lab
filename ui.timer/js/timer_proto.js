!function () {
    "use strict";
    var a = cs,
    b = a.$,
    c = a.String,
    d = a.Selector,
    e = 'input[data-picker="timer"]',
    f = a.Timer = function (a) {
        d.prototype.constructor.call(this, a)
    };
    a.extend(f.prototype, d.prototype, {
        type : "timer",
        constructor : f,
        minutes : "0,10,20,30,40,50",
        minHour : 0,
        maxHour : 23,
        invalidHours : "",
        invalidMinutes : "",
        referWidth : !0,
        initComponent : function () {
            var b,
            e,
            a,
            f,
            g;
            for (d.prototype.initComponent.call(this), a = [], a.push('<table cellpadding="0" cellspacing="0">', '<tr><th class="hour-head" align="center">Ê±</th><th class="minute-head" align="center">·Ö</th></tr>', '<tr><td class="hour-body" valign="top"><div>'), f = 0; 24 > f; f++)
                b = c.leftPad("" + f, 2, "0"), a.push('<a href="javascript:void(0);" class="hour" data-hour="', b, '">', b, "</a>");
            for (a.push('</div></td><td class="minute-body" valign="top"><div>'), g = this.get("minutes").split(","), f = 0; f < g.length; f++)
                e = g[f], b = c.leftPad(e, 2, "0"), a.push('<a href="javascript:void(0);" data-minute="', b, '" class="minute">', b, "</a>");
            a.push("</div></td></tr>", '<tr><td colspan="2" align="center" class="tool-part"><button data-tag="close" class="ui-button btn-rounded btn-primary btn-tiny">¹Ø±Õ</button></td></tr></table>'),
            this.$el.html(a.join(""))
        },
        render : function () {
            this.draw()
        },
        draw : function (a) {
            var i,
            l,
            m,
            n,
            o,
            p,
            d = this.get("context").val(),
            g = (this.get("minHour"), this.get("maxHour"), this.get("invalidHours").split(",")),
            h = this.get("invalidMinutes").split(","),
            j = "",
            k = "";
            d && (i = d.split(":"), j = i[0], k = i[1]),
            l = this.$el.find("[data-hour]"),
            m = this.$el.find("[data-minute]"),
            n = l.filter(function () {
                    return c.leftPad("" + b(this).data("hour"), 2, "0") == j
                }),
            n.addClass("selected").siblings().removeClass("selected"),
            m.filter(function () {
                return c.leftPad("" + b(this).data("minute"), 2, "0") == k
            }).addClass("selected").siblings().removeClass("selected"),
            l.filter(function () {
                return -1 != b.inArray(c.leftPad("" + b(this).data("hour"), 2, "0"), g)
            }).addClass("disabled").removeClass("selected"),
            m.filter(function () {
                return -1 != b.inArray(c.leftPad("" + b(this).data("minute"), 2, "0"), h)
            }).addClass("disabled").removeClass("selected"),
            a && (o = l.index(n), p = o * n.outerHeight(), n.parent().scrollTop(p))
        },
        initEvents : function () {
            d.prototype.initEvents.call(this),
            this.on(this.$el, "click", b.proxy(this.hourClick, this), ".hour"),
            this.on(this.$el, "click", b.proxy(this.minuteClick, this), ".minute"),
            this.on(this.$el, "click", b.proxy(this.bodyClick, this)),
            this.on(this.$el, "click", b.proxy(this.hide, this), '[data-tag="close"]')
        },
        itemClick : function (a, b) {
            var f,
            g,
            h,
            c = this.get("context"),
            d = "",
            e = c.val();
            e && (f = e.split(":"), g = f[0], h = f[1]),
            a = a || g || "00",
            b = b || h || "00",
            d = a + ":" + b,
            d != e && (c.val(d), c.trigger("change", d)),
            this.draw(),
            this.hourSelected && this.minuteSelected && this.hide()
        },
        show : function () {
            d.prototype.show.call(this),
            this.draw(!0),
            this.hourSelected = !1,
            this.minuteSelected = !1
        },
        hourClick : function (a) {
            var c = b(a.target).closest(".hour");
            c.is(".disabled, :disabled") || (this.hourSelected = !0, this.itemClick(c.data("hour"), void 0))
        },
        minuteClick : function (a) {
            var c = b(a.target).closest(".minute");
            c.is(".disabled, :disabled") || (this.minuteSelected = !0, this.itemClick(void 0, c.data("minute")))
        },
        bodyClick : function (a) {
            a.stopPropagation()
        },
        onSelected : a.emptyFn
    }),
    b(document).on("focus.timer.data", e, function () {
        b(this).attr("readonly", "readonly")
    }),
    b(document).on("click.timer.data", e, function (c) {
        var g,
        d = b(this),
        e = d.data(),
        h = a.copyConfig({
                context : d
            }, e, "timer");
        d.is(".disabled, :disabled") || (g = d.data("m-timer"), g || d.data("m-timer", g = new f(h)), g.show(), c.preventDefault(), c.stopPropagation())
    }),
    b(document).on("keypress.timer.data keydown.timer.data", e, function (a) {
        if (9 != a.keyCode)
            a.preventDefault();
        else {
            var c = b(this).data("m-timer");
            c && c.hide()
        }
    })
}()
