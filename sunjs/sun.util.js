var sun = sun || {};
sun.util = sun.util || {};

/**
 * format number
 * e.g. 12000 => 1,2000
 * @param amtStr number
 * @return string
 */
sun.util.formatIntNum = function (amtStr) {
    var isInt = function (num) {
        return (num % 1 === 0)
    };
    var amtStr = (isInt(amtStr)) ? amtStr : Number(amtStr).toFixed(0);
    amtStr = "" + amtStr;
    var a, renum = '';
    var j = 0;
    var a1 = '', a2 = '', a3 = '';
    var tes = /^-/;
    var isCurrency = (typeof (isCurrency) != 'undefined') ? isCurrency : true;

    a = amtStr.replace(/,/g, "");
    a = a.replace(/[^-\.,0-9]/g, "");
    a = a.replace(/(^\s*)|(\s*$)/g, "");
    if (tes.test(a))
        a1 = '-';
    else
        a1 = '';
    a = a.replace(/-/g, "");
    if (a != "0" && a.substr(0, 2) != "0.")
        a = a.replace(/^0*/g, "");
    j = a.indexOf('.');
    if (j < 0)
        j = a.length;
    a2 = a.substr(0, j);
    a3 = a.substr(j);
    j = 0;
    for (i = a2.length; i > 3; i = i - 3) {
        renum = "," + a2.substr(i - 3, 3) + renum;
        j++;
    }

    renum = a1 + a2.substr(0, a2.length - j * 3) + renum + a3;

    return renum;
}

/**
 * format number of money.
 * e.g. 12000.235 => 12,000.24
 * @param amtStr number
 * @return string
 */
sun.util.formatFloat = function (amtStr, isCurrency) {
    var isInt = function (num) {
        return (num % 1 === 0);
    };
    var amtStr = (isInt(amtStr)) ? amtStr : Number(amtStr).toFixed(2);
    amtStr = "" + amtStr;
    var a, renum = '';
    var j = 0;
    var a1 = '', a2 = '', a3 = '';
    var tes = /^-/;
    var isCurrency = (typeof (isCurrency) != 'undefined') ? isCurrency : true;
    var subfix = (isInt(amtStr) && isCurrency) ? '.00' : '';
    a = amtStr.replace(/,/g, "");
    a = a.replace(/[^-\.,0-9]/g, "");
    a = a.replace(/(^\s*)|(\s*$)/g, "");
    if (tes.test(a))
        a1 = '-';
    else
        a1 = '';
    a = a.replace(/-/g, "");
    if (a != "0" && a.substr(0, 2) != "0.")
        a = a.replace(/^0*/g, "");
    j = a.indexOf('.');
    if (j < 0)
        j = a.length;
    a2 = a.substr(0, j);
    a3 = a.substr(j);
    j = 0;
    for (i = a2.length; i > 3; i = i - 3) {
        renum = "," + a2.substr(i - 3, 3) + renum;
        j++;
    }

    renum = a1 + a2.substr(0, a2.length - j * 3) + renum + a3 + subfix;

    return renum;
}


sun.util.transforTime = function (time) {
    var date = parseInt(time);
    var weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var result = "";
    result += weekdays[new Date(date).getDay()];
    result += " ";
    result += months[new Date(date).getMonth()];
    result += " ";
    result += new Date(date).getDate();
    result += " ";
    result += new Date(date).getFullYear();
    result += " ";
    result += new Date(date).getHours();
    result += ":";
    result += new Date(date).getMinutes();
    return result;
}


/**
 * enhance replace
 * @param oString string
 * @param AFindText string
 * @param ARepText string
 * @return string
 */
sun.util.replaceAll = function (oString, AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return oString.replace(raRegExp, ARepText);
};

/**
 * @param => ('best {0} for {1}', 'wish', 'you')
 * return 'best wish for you'
 */
sun.util.stringFormat = function(txt) {
    var arg = arguments,
        matchResult,
        matLength,
        str = txt,
        reg = /\{\d+?\}/gmi,
        i;

    matchResult = str.match(reg);
    if (matchResult) {
        matLength = matchResult.length;
        if (arg.length >= matLength) {
            for (i = 0; i < matLength; i++) {
                str = str.replace(matchResult[i], arg[i + 1]);
            }
        }
    }

    return str;
};