function Cipher()
{
   
}

Cipher.str2HexStr=function(str)
{
    if(str === "")
　　　　return "";
　　var hexCharCode = [];
　　for(var i = 0; i < str.length; i++) {
　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
　　}
　　return hexCharCode.join("").toUpperCase();
}

Cipher.hexStr2Str=function(hexCharCodeStr)
{
    var rawStr = hexCharCodeStr.trim();
　　var len = rawStr.length;
　　if(len % 2 !== 0) {
        console.log("Illegal Format ASCII Code!");
        return "";
　　}
　　var curCharCode;
　　var resultStr = [];
　　for(var i = 0; i < len;i = i + 2) {
　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16);
　　　　resultStr.push(String.fromCharCode(curCharCode));
　　}
　　return resultStr.join("");
}

Cipher.randomString=function(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
    var i = 0;
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

Cipher.urlencode=function(str) {
    var strArr = [];
    var output = '';
    strArr = Array.from(str);
    for (var v of strArr) {
        var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        output += v.match(regRule) ? encodeURIComponent(v) : this.encodeNoEmoji(v);
    }
    return output;
}
    
Cipher.encodeNoEmoji=function(str) {
    var output = '';
    var x = 0;
    str = this.utf16to8(str.toString());
    var regex = /(^[a-zA-Z0-9-_.]*)/;
    while (x < str.length) {
        var match = regex.exec(str.substr(x));
        if (match !== null && match.length > 1 && match[1] !== '') {
            output += match[1];
            x += match[1].length;
        } else {
            if (str[x] === ' ')
                output += '+';
            else {
                var charCode = str.charCodeAt(x);
                var hexVal = charCode.toString(16);
                output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
            }
            x++;
        }
    }
    return output;
}
    
Cipher.utf16to8=function(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

// 主入口
function fetch() {

}

fetch.abc = function() {
    console.log("abc");
}

fetch.getArray = function(api, workerName, params, ret)
{

    return this.sendRequest(api, workerName, params, function (data) {
        var jObject = JSON.parse(data)
        if (jObject.type == 'array') {
            if (ret) {
                ret(jObject.data)
            }
        } else {
            console.log("type check error, 'array' expected but "
            + jObject["type"] + " provided," + data);
        }
    })
}

fetch.getObject = function (api, workerName, params, ret)
{
    return this.sendRequest(api, workerName, params, function (data) {
        var jObject = JSON.parse(data)
        if (jObject.type == 'object') {
            if (ret) {
                ret(jObject.data)
            }
        } else {
            console.log("type check error, 'object' expected but "
            + jObject["type"] + " provided," + data);
        }
    })
}


fetch.getDouble = function(api, workerName, params, ret)
{
    return this.sendRequest(api, workerName, params, function (data) {
        var jObject = JSON.parse(data)
        // console.log(jObject.type);
        if (jObject.type == 'float') {
            if (ret) {
                ret(jObject.data);
            }
        } else {
            console.log("type check error, 'float' expected but "
            + jObject["type"] + " provided," + data);
        }
    })
}

fetch.getFloat= function (api, workerName, params, ret)
{
    return this.getDouble(api, workerName, params, ret);
}

fetch.getBool = function(api, workerName, params, ret)
{
    return this.sendRequest(api, workerName, params, function (data) {
        var jObject = JSON.parse(data)
        if (jObject.type == 'bool') {
            if (ret) {
                ret(jObject.data)
            }
        } else {
            console.log("type check error, 'bool' expected but "
            + jObject["type"] + " provided," + data);
        }
    })
}
fetch.getInt = function(api, workerName, params, ret)
{
    return this.sendRequest(api, workerName, params, function (data) {
        var jObject = JSON.parse(data)
        if (jObject.type == 'int') {
            if (ret) {
                ret(jObject.data)
            }
        } else {
            console.log("type check error, 'int' expected but "
            + jObject["type"] + " provided," + data);
        }
    })
}

fetch.sendRequest=function(api, workerName, params, ret)
{
    var dataMap = {}
    dataMap.type = "array"

    var authSign = {}

    var config = this.config

    authSign.AUTH_SERVER_OPKEY = config.AUTH_SERVER_OPKEY
    authSign.USER_AUTH_KEY = config.USER_AUTH_KEY
    console.log("record k:", authSign.USER_AUTH_KEY)
    authSign.USER_ACCESS_TOKEN = config.USER_ACCESS_TOKEN

    var map = {}
    map.class = api
    map.method = workerName

    if (params && params.length > 0) {
        map.param = JSON.stringify(params)
    } else {
        map.param = "[\"\"]"
    }

    map.authSign = authSign
    map.CLIENT_SERVER = "GETCODER-NODEJS-SDK-20191108";

    dataMap.data = map
    
    var sendJsonString = JSON.stringify(dataMap)
    sendJsonString = Cipher.urlencode(sendJsonString)
    // console.log(sendJsonString)
    var ws = Cipher.str2HexStr(sendJsonString)

    return this.getResponse(ws, function(data) {
        if (ret) {
            ret(data)
        }
    })
}

fetch.getResponse=function(ws, ret)
{
    var config = this.config
    var ajax = new XMLHttpRequest();
    ajax.open("post", config.SERVER_ADDRESS, true);
    var data = new FormData();
    data.append("ws", ws);
    ajax.send(data);

    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 && ajax.status==200) {
            var body = ajax.responseText;
            // console.log(body);
            if (body.length > 0) {
                var find_sep_index = body.indexOf(config.SERVER_RESPONSE_TAG)
                if (find_sep_index >= 0) {
                    var retstring = body.substring(find_sep_index + config.SERVER_RESPONSE_TAG.length)
                    retstring = Cipher.hexStr2Str(retstring)
                    //console.log(retstring);
                    ret(retstring)
                } else {
                    console.log("err data:" + body)
                }
            } else {
                console.log("return empty");
                var a = '{"type":"array","data":[]}'
                ret(a)
            }
    　　} else {
            console.log('request调用失败');
        }
    }
}

fetch.config = {
    SERVER_ADDRESS:"https://arws.ip:port",
    AUTH_SERVER_OPKEY:"seraagaldnialaldshgadl12312lasdfaaa",
    USER_ACCESS_TOKEN:"default_acc_key",
    SERVER_RESPONSE_TAG:"___SERVICE_STD_OUT_SEP___"
}

fetch.test = function() {
    // Cipher.str2HexStr("aaaa");

    // cipher.str2HexStr('aaaaa')
    console.log(Cipher.str2HexStr("aaaa"))
    console.log(this.config)
}