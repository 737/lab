/*!
 * jQuery.Transition v1.0
 * (c)2012 wǒ_is神仙, http://MrZhang.me/
 *
 * Source: https://github.com/jsw0528/Transition
 * Demos: http://MrZhang.me/blog/jquery-transition.html
 * Date: 2012-04-16 14:37
 * MIT Licensed.
 */
(function () {
    "use strict";
    if (this._)
        return;
    var a = {},
    b = Array.prototype,
    c = Object.prototype,
    d = b.slice,
    e = c.toString,
    f = c.hasOwnProperty,
    g = b.forEach,
    h = b.map,
    i = b.some,
    j = Object.keys,
    k = this._ = {},
    l = k.each = function (b, c, d) {
        if (b == null)
            return;
        if (g && b.forEach === g)
            b.forEach(c, d);
        else if (b.length === +b.length) {
            for (var e = 0, f = b.length; e < f; e++)
                if (e in b && c.call(d, b[e], e, b) === a)
                    return
        } else
            for (var h in b)
                if (k.has(b, h) && c.call(d, b[h], h, b) === a)
                    return
    };
    k.map = function (a, b, c) {
        var d = [];
        return a == null ? d : h && a.map === h ? a.map(b, c) : (l(a, function (a, e, f) {
                d[d.length] = b.call(c, a, e, f)
            }), a.length === +a.length && (d.length = a.length), d)
    },
    k.find = function (a, b, c) {
        var d;
        return k.any(a, function (a, e, f) {
            if (b.call(c, a, e, f))
                return d = a, !0
        }),
        d
    },
    k.any = function (b, c, d) {
        c || (c = k.identity);
        var e = !1;
        return b == null ? e : i && b.some === i ? b.some(c, d) : (l(b, function (b, f, g) {
                if (e || (e = c.call(d, b, f, g)))
                    return a
            }), !!e)
    },
    k.keys = j || function (a) {
        if (a !== Object(a))
            throw new TypeError("Invalid object");
        var b = [];
        for (var c in a)
            k.has(a, c) && b.push(c);
        return b
    },
    k.extend = function (a) {
        return l(d.call(arguments, 1), function (b) {
            for (var c in b)
                a[c] = b[c]
        }),
        a
    },
    k.defaults = function (a) {
        return l(d.call(arguments, 1), function (b) {
            for (var c in b)
                a[c] == null && (a[c] = b[c])
        }),
        a
    },
    k.isFunction = function (a) {
        return e.call(a) == "[object Function]"
    },
    k.has = function (a, b) {
        return f.call(a, b)
    },
    k.identity = function (a) {
        return a
    }
}).call(this), function (a) {
    "use strict";
    var b = "transition",
    c = "transform",
    d = " ",
    e = {},
    f = {},
    g = {},
    h = document.documentElement,
    i = h.style,
    j = function (a) {
        return a.charAt(0).toUpperCase() + a.substr(1)
    },
    k = {
        WebkitTransition : "webkitTransitionEnd",
        MozTransition : "transitionend",
        OTransition : "oTransitionEnd",
        msTransition : "MSTransitionEnd",
        transition : "transitionend"
    },
    l,
    m,
    n = function () {
        this.init.apply(this, arguments).run()
    };
    n.prototype = {
        constructor : n,
        init : function (c, f, h) {
            var i = this,
            j = _.keys(f),
            k = [],
            l = d + h.duration + d + h.easing + d + h.delay;
            return _.each(j, function (b) {
                g[b] ? b = g[b] : (b = a.camelCase(b), b = e[b] || b, b = b.replace(/^(ms)/, function () {
                                return "Ms"
                            }).replace(/([A-Z])/g, function (a) {
                                return "-" + a.toLowerCase()
                            }), g[b] = b),
                k.push(b + l)
            }),
            f[e[b]] = k.join(","),
            i.elem = c,
            i.$elem = a(c),
            i.props = f,
            i.cfg = h,
            i.tps = j,
            i
        },
        run : function () {
            var a = this,
            b = a.cfg.queue;
            b ? a.$elem.queue(b, function (b) {
                a._runNative(b)
            }) : a._runNative()
        },
        _runNative : function (a) {
            var c = this,
            d = c.$elem,
            f = c.elem,
            g = c.cfg.complete,
            h = e[b],
            i = e.transitionEnd;
            setTimeout(function () {
                d.css(c.props).on(i, function () {
                    d.off(i),
                    h === "OTransition" ? (f.style[h + "Property"] = "", f.style[h + "Duration"] = "", f.style[h + "TimingFunction"] = "", f.style[h + "Delay"] = "") : f.style[h] = "",
                    _.isFunction(g) && g.call(f),
                    _.isFunction(a) && a()
                })
            }, 1)
        },
        stop : function (c, d, f) {
            var g = this,
            h = {};
            typeof c != "string" && (f = d),
            !f && _.each(g.tps, function (b) {
                h[b] = a.css(g.elem, b)
            }),
            h[e[b] + "Property"] = "none",
            g.$elem.css(h).off(e.transitionEnd)
        }
    },
    _.each([b, c, "transformOrigin", "transformStyle", "perspective", "perspectiveOrigin", "backfaceVisibility"], function (b) {
        b in i ? e[b] = b : (m = j(b), l = _.find(["Webkit", "Moz", "O", "ms"], function (a) {
                        return a + m in i
                    }), e[b] = !!l && l + m),
        e[b] && (f[b] = {
                get : function (c, d) {
                    return d ? a.css(c, e[b]) : c.style[e[b]]
                },
                set : function (a, c) {
                    a.style[e[b]] = c
                }
            })
    }),
    e.transitionEnd = k[e[b]] || !1,
    h = null,
    _.extend(a.support, e),
    _.extend(a.cssHooks, f),
    a.fn.transition = function (c, d, e, f, g) {
        var h = a.fn.transition.defaults,
        i = a.isPlainObject(d) ? _.extend({}, d) : {
            complete : g || _.isFunction(f) && f || _.isFunction(e) && e || _.isFunction(d) && d,
            delay : !_.isFunction(f) && f || null,
            duration : !_.isFunction(d) && d || null,
            easing : !_.isFunction(e) && e || null
        };
        return _.defaults(i, {
            delay : h.delay,
            duration : h.duration,
            easing : "_default",
            queue : h.queue
        }),
        a.fx.off === !0 && (i.duration = "0s"),
        i.queue === !0 && (i.queue = "fx"),
        i.easing = h.easing[i.easing] || i.easing,
        c = _.extend({}, c),
        this.each(function () {
            a.data(this, b, new n(this, c, i))
        })
    },
    a.fn.transition.defaults = {
        delay : "0s",
        duration : "0.5s",
        easing : {
            _default : "cubic-bezier(0.1, 0.5, 0.1, 1)"
        },
        queue : !0
    },
    a.fn.transition.constructor = n;
    if (e[b]) {
        var o = a.fn.stop;
        a.fn.stop = function () {
            var c = this,
            d = arguments,
            e;
            c.each(function () {
                e = a.data(this, b),
                e instanceof n && e.stop.apply(e, d)
            }),
            o.apply(c, d)
        }
    }
}
(window.jQuery), function (a) {
    "use strict";
    var b = a.fn.transition,
    c = b.constructor,
    d = "cubic-bezier(",
    e = ")",
    f = function (a) {
        return ( + /ms$/.test(a) || 1e3) * parseFloat(a)
    },
    g = {
        init : function (b, c, d) {
            var e = this;
            return d.delay = f(d.delay),
            d.duration = f(d.duration),
            d.easing = function () {
                var b = d.easing,
                c = _.map(b.substring(13, b.length - 1).split(","), function (a) {
                        return parseFloat(a)
                    }),
                f = [],
                g = 101,
                h = 0;
                b = "cubic-bezier-" + c.join("-");
                if (!a.easing[b]) {
                    for (; h <= g; h++)
                        f[h] = e.cubicBezier(c, h / g);
                    a.easing[b] = function (a) {
                        var b = g * a,
                        c = Math.floor(b),
                        d = f[c],
                        e = f[c + 1];
                        return d + (e - d) * (b - c)
                    }
                }
                return b
            }
            (),
            e.elem = b,
            e.$elem = a(b),
            e.props = c,
            e.cfg = d,
            e
        },
        run : function () {
            var a = this,
            b = a.cfg;
            a.$elem.delay(b.delay).animate(a.props, b)
        },
        cubicBezier : function (a, b) {
            var c = a[0],
            d = a[1],
            e = a[2],
            f = a[3],
            g = 3 * c,
            h = 3 * (e - c) - g,
            i = 1 - g - h,
            j = 3 * d,
            k = 3 * (f - d) - j,
            l = 1 - j - k;
            return b = function (a) {
                var b = a,
                c,
                d,
                e = 0;
                for (; e < 8; e++) {
                    c = ((i * a + h) * a + g) * a - b;
                    if (Math.abs(c) < .001)
                        return a;
                    d = (3 * i * a + 2 * h) * a + g;
                    if (Math.abs(d) < 1e-6)
                        break;
                    a -= c / d
                }
                return a
            }
            (b),
            ((l * b + k) * b + j) * b
        },
        stop : _.identity
    };
    a.support.transition || (_.extend(c.prototype, g), _.extend(b.defaults.easing, {
            ease : d + "0.25, 0.1, 0.25, 1" + e,
            linear : d + "0, 0, 1, 1" + e,
            "ease-in" : d + "0.42, 0, 1, 1" + e,
            "ease-out" : d + "0, 0, 0.58, 1" + e,
            "ease-in-out" : d + "0.42, 0, 0.58, 1" + e
        }))
}
(window.jQuery);
