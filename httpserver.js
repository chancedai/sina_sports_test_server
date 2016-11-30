var conf = {

    Root : '', //文件的根路径
    IndexEnable : true, //开启目录功能
    IndexFile : '_index.html', //目录欢迎文件
    DynamicExt : /^\.njs$/ig, //动态页面后缀（需要.）
    ServerName : 'nodeJS', //服务器名字
    FileCache : { //文件（内存）缓存
        MaxSingleSize : 1024 * 1024, //单个文件最大尺寸
        MaxTotalSize : 30 * 1024 * 1024 //整个文件Cache最大尺寸
    },
    Expires : { //浏览器缓存
        FileMatch : /gif|jpg|png|js|css|ico/ig, //匹配的文件格式
        // MaxAge : 3600 * 24 * 365 //最大缓存时间 一年
        MaxAge : 60 //最大缓存时间 60秒
    },
    Compress : { //编码压缩
        FileMatch : /css|js|html/ig//匹配的文件格式
    },
    MIME : {
        'hqx':'application/mac-binhex40',
        'cpt':'application/mac-compactpro',
        'csv':'text/x-comma-separated-values',
        'bin':'application/macbinary',
        'dms':'application/octet-stream',
        'lha':'application/octet-stream',
        'lzh':'application/octet-stream',
        'exe':'application/octet-stream',
        'class':'application/octet-stream',
        'psd':'application/x-photoshop',
        'so':'application/octet-stream',
        'sea':'application/octet-stream',
        'dll':'application/octet-stream',
        'oda':'application/oda',
        'pdf':'application/pdf',
        'ai':'application/postscript',
        'eps':'application/postscript',
        'ps':'application/postscript',
        'smi':'application/smil',
        'smil':'application/smil',
        'mif':'application/vnd.mif',
        'xls':'application/excel',
        'ppt':'application/powerpoint',
        'wbxml':'application/wbxml',
        'wmlc':'application/wmlc',
        'dcr':'application/x-director',
        'dir':'application/x-director',
        'dxr':'application/x-director',
        'dvi':'application/x-dvi',
        'gtar':'application/x-gtar',
        'gz':'application/x-gzip',
        'php':'application/x-httpd-php',
        'php4':'application/x-httpd-php',
        'php3':'application/x-httpd-php',
        'phtml':'application/x-httpd-php',
        'phps':'application/x-httpd-php-source',
        'js':'application/x-javascript',
        'swf':'application/x-shockwave-flash',
        'sit':'application/x-stuffit',
        'tar':'application/x-tar',
        'tgz':'application/x-tar',
        'xhtml':'application/xhtml+xml',
        'xht':'application/xhtml+xml',
        'zip':'application/x-zip',
        'mid':'audio/midi',
        'midi':'audio/midi',
        'mpga':'audio/mpeg',
        'mp2':'audio/mpeg',
        'mp3':'audio/mpeg',
        'aif':'audio/x-aiff',
        'aiff':'audio/x-aiff',
        'aifc':'audio/x-aiff',
        'ram':'audio/x-pn-realaudio',
        'rm':'audio/x-pn-realaudio',
        'rpm':'audio/x-pn-realaudio-plugin',
        'ra':'audio/x-realaudio',
        'rv':'video/vnd.rn-realvideo',
        'wav':'audio/x-wav',
        'bmp':'image/bmp',
        'gif':'image/gif',
        'jpeg':'image/jpeg',
        'jpg':'image/jpeg',
        'jpe':'image/jpeg',
        'png':'image/png',
        'tiff':'image/tiff',
        'tif':'image/tiff',
        'css':'text/css',
        'html':'text/html',
        'htm':'text/html',
        'shtml':'text/html',
        'txt':'text/plain',
        'text':'text/plain',
        'log':'text/plain',
        'rtx':'text/richtext',
        'rtf':'text/rtf',
        'xml':'text/xml',
        'xsl':'text/xml',
        'mpeg':'video/mpeg',
        'mpg':'video/mpeg',
        'mpe':'video/mpeg',
        'qt':'video/quicktime',
        'mov':'video/quicktime',
        'avi':'video/x-msvideo',
        'movie':'video/x-sgi-movie',
        'doc':'application/msword',
        'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'word':'application/msword',
        'xl':'application/excel',
        'eml':'message/rfc822',
        'json':'application/json',
        'ttf':'application/x-font-ttf',
        'svg':'image/svg+xml',
        'eot':'application/vnd.ms-fontobject',
        'woff':'application/font-woff',
        'map':'text/plain',
        'cur':'application/octet-stream',
        'apk':'application/vnd.android'

    }
};

/* 计算长度（中文算2个长度） */
String.prototype.len = function () {
    return this.replace(/[^\x00-\xff]/g, '**').length;
};
/* 填充（长度，字符串，填充到左边？） */
String.prototype.pad = function (len, filler, isLeft) {
    var bArr = len.toString(2).split('');
    var ret = '';
    var step = filler;
    for (var i = bArr.length - 1; i >= 0; i--) {
        if (bArr[i] == '1')
            ret += step;
        step += step;
    }
    if (!isLeft)
        return this + ret;
    else
        return ret + this;
};

/* 获取Http时间（2012-12-21 19:30形式） */
Date.prototype.getHttpTime = function () {
    return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes();
};

/* 缓存类（maxSize 最大字节数） */
function Cache(maxSize) {
    this.maxSize = maxSize; //最大尺寸
    this.curSize = 0; //当前尺寸
    this._bufs = {}; //缓存Map
    this._accessCount = 0; //访问计数器
    this._lastClearCount = 0; //上次清理的计数器
}
Cache.prototype.put = function (key, buf) {
    buf.access = this._accessCount++;
    var obuf = this._bufs[key];
    if (obuf)
        this.curSize -= obuf.length;
    this._bufs[key] = buf;
    this.curSize += buf.length;
    while (this.curSize > this.maxSize) {
        this._clear();
    }
};
Cache.prototype.get = function (key) {
    var buf = this._bufs[key];
    if (buf)
        buf.access = this._accessCount++;
    return buf;
};
Cache.prototype.del = function (key) {
    var buf = this._bufs[key];
    if (buf) {
        this.curSize -= buf.length;
        delete this._bufs[key];
    }
};
Cache.prototype._clear = function () {
    var clearCount = (this._lastClearCount + this._accessCount) / 2;
    for (var e in this._bufs) {
        var buf = this._bufs[e];
        if (buf.access <= clearCount) {
            this.curSize -= buf.length;
            delete this._bufs[e];
        }
    }
    this._lastClearCount = clearCount;
};

/* HTTP缓存类（mtime不可更改） */
function HttpCache(mtime, obuf, gbuf, dbuf) {
    this.mtime = mtime; //修改时间
    this.obuf = obuf; //原始数据
    this.gbuf = gbuf; //gzip数据
    this.dbuf = dbuf; //deflate数据
    this.length = (obuf ? obuf.length : 0) + (dbuf ? dbuf.length : 0) + (gbuf ? gbuf.length : 0);
}
HttpCache.prototype.setGbuf = function (gbuf) {
    this.length += gbuf.length - (this.gbuf ? this.gbuf.length : 0);
    this.gbuf = gbuf;
};
HttpCache.prototype.setDbuf = function (dbuf) {
    this.length += dbuf.length - (this.dbuf ? this.dbuf.length : 0);
    this.dbuf = dbuf;
};

var http = require('http'),
https = require('https'),
url = require('url'),
path = require('path'),
fs = require('fs'),
zlib = require('zlib');
var net = require('net');

/* 路径状态查询（自带文件名封装） */
fs.statWithFN = function (dirpath, filename, callback) {
    fs.stat(path.join(dirpath, filename), function (err, stats) {
        callback(err, stats, filename);
    });
};

var Com = {
    fileCache : new Cache(conf.FileCache.MaxTotalSize),
    ifModifiedSince : 'If-Modified-Since'.toLowerCase(),
    parseRange : function (str, size) { //范围解析（HTTP Range字段）
        if (str.indexOf(",") != -1) //不支持多段请求
            return;
        var strs = str.split("=");
        str = strs[1] || '';
        var range = str.split("-"),
        start = parseInt(range[0], 10),
        end = parseInt(range[1], 10);
        // Case: -100
        if (isNaN(start)) {
            start = size - end;
            end = size - 1;
        }
        // Case: 100-
        else if (isNaN(end)) {
            end = size - 1;
        }
        // Invalid
        if (isNaN(start) || isNaN(end) || start > end || end > size)
            return;
        return {
            start : start,
            end : end
        };
    },
    error : function (response, id, err) { //返回错误
        response.writeHeader(id, {
            'Content-Type' : 'text/html'
        });
        var txt;
        switch (id) {
        case 404:
            txt = '<h3>404: Not Found</h3>';
            break;
        case 403:
            txt = '<h3>403: Forbidden</h3>';
            break;
        case 416:
            txt = '<h3>416: Requested Range not satisfiable</h3>';
            break;
        case 500:
            txt = '<h3>500: Internal Server Error</h3>';
            break;
        }
        if (err)
            txt += err;
        response.end(txt);
    },
    cache : function (response, lastModified, ext) { //写客户端Cache
        response.setHeader('Last-Modified', lastModified);
        if (ext && ext.search(conf.Expires.FileMatch) != -1) {
            var expires = new Date();
            expires.setTime(expires.getTime() + conf.Expires.MaxAge * 1000);
            response.setHeader('Expires', expires.toUTCString());
            response.setHeader('Cache-Control', 'max-age=' + conf.Expires.MaxAge);
        }
    },
    compressHandle : function (request, response, raw, ext, contentType, statusCode) { //流压缩处理
        var stream = raw;
        var acceptEncoding = request.headers['accept-encoding'] || '';
        var matched = ext.match(conf.Compress.match);
        if (matched && acceptEncoding.match(/\bgzip\b/)) {
            response.setHeader('Content-Encoding', 'gzip');
            stream = raw.pipe(zlib.createGzip());
        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
            response.setHeader('Content-Encoding', 'deflate');
            stream = raw.pipe(zlib.createDeflate());
        }
        response.setHeader('Content-Type', contentType);
        response.writeHead(statusCode);
        stream.pipe(response);
    },
    flush : function (request, response, cache, ext, contentType) { //Cache输出
        var acceptEncoding = request.headers['accept-encoding'] || "";
        var matched = ext.match(conf.Compress.FileMatch);
        if (matched && acceptEncoding.match(/\bgzip\b/)) {
            if (cache.gbuf) {
                response.writeHead(200, {
                    'Content-Encoding' : 'gzip',
                    'Content-Type' : contentType
                });
                response.end(cache.gbuf);
            } else {
                zlib.gzip(cache.obuf, function (err, buf) {
                    if (err)
                        Com.error(response, 500, '<h4>Error : ' + err + '</h4>');
                    else {
                        response.writeHead(200, {
                            'Content-Encoding' : 'gzip',
                            'Content-Type' : contentType
                        });
                        response.end(buf);
                        cache.setGbuf(buf);
                    }
                });
            }
        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
            if (cache.dbuf) {
                response.writeHead(200, {
                    'Content-Encoding' : 'deflate',
                    'Content-Type' : contentType
                });
                response.end(cache.dbuf);
            } else {
                zlib.deflate(cache.obuf, function (err, buf) {
                    if (err)
                        Com.error(response, 500, '<h4>Error : ' + err + '</h4>');
                    else {
                        response.writeHead(200, {
                            'Content-Encoding' : 'deflate',
                            'Content-Type' : contentType
                        });
                        response.end(buf);
                        cache.setDbuf(buf);
                    }
                });
            }
        } else {
            response.writeHead(200, {
                'Content-Type' : contentType
            });
            response.end(cache.obuf);
        }
    },
    pathHandle : function (request, response, realpath, httppath, dirmtime) {
        fs.stat(realpath, function (err, stats) {
            if (err) {
                if (dirmtime) {
                    var dirPath = path.dirname(realpath);
                    fs.readdir(dirPath, function (err, files) {
                        if (err)
                            Com.error(response, 404);
                        else {
                            var httpP = httppath.replace(/\\/g, '/');
                            var txt = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no"/><title>Index of ' + httpP + '</title></head><body><h1>Index of ' + httpP + '</h1><hr ><pre>';
                            if (httpP != '/')
                                txt += '<a href="' + path.dirname(httppath).replace(/\\/g, '/') + '">../</a>\n';
                            if (files.length == 0) { //空目录
                                txt += '</pre><hr ><h3>Powered by ' + conf.ServerName + '</h3></body></html>';
                                var cache = new HttpCache(dirmtime.getTime(), new Buffer(txt));
                                Com.cache(response, dirmtime.toUTCString(), 'html');
                                Com.flush(request, response, cache, 'html', 'text/html');
                                Com.fileCache.put(dirPath + '\\', cache);
                                return;
                            }
                            var fileI = 0;
                            var fileInfos = [];
                            var fsCallback = function (err, stats, filename) {
                                if (!err)
                                    fileInfos.push([stats, filename]);
                                fileI++;
                                if (fileI == files.length) {
                                    fileInfos.sort(function (a, b) {
                                        if (a[0].isDirectory() == b[0].isDirectory())
                                            return a[1].localeCompare(b[1]);
                                        return b[0].isDirectory() - a[0].isDirectory();
                                    });
                                    for (var i = 0; i < fileInfos.length; i++) {
                                        if (fileInfos[i][0].isDirectory())
                                            fileInfos[i][1] += '/';
                                        var sf = fileInfos[i][1];
                                        var st = fileInfos[i][0].mtime.getHttpTime();
                                        var ss = fileInfos[i][0].isDirectory() ? '-' : fileInfos[i][0].size.toString();
                                        txt += '<a href="' + path.join(httppath, sf).replace(/\\/g, '/') + '">' + sf + '</a>' + ''.pad(50 - sf.len(), ' ') + st + ''.pad(35 - st.len() - ss.length, ' ') + ss + '\n'
                                    }
                                    txt += '</pre><hr ><h3>Powered by ' + conf.ServerName + '</h3></body></html>';
                                    var cache = new HttpCache(dirmtime.getTime(), new Buffer(txt));
                                    Com.cache(response, dirmtime.toUTCString(), 'html');
                                    Com.flush(request, response, cache, 'html', 'text/html');
                                    Com.fileCache.put(dirPath + '\\', cache);
                                }
                            };
                            for (var i = 0; i < files.length; i++)
                                fs.statWithFN(dirPath, files[i], fsCallback);
                        }
                    });
                } else {
                    Com.fileCache.del(realpath);
                    Com.error(response, 404);
                }
            } else {
                var lastModified = stats.mtime.toUTCString();
                //304 客户端有Cache，且木有改动
                if (request.headers[Com.ifModifiedSince] && lastModified == request.headers[Com.ifModifiedSince]) {
                    response.writeHead(304);
                    response.end();
                    return;
                }
                var ext = path.extname(realpath);
                ext = ext ? ext.slice(1) : 'unknown';
                ext = stats.isDirectory() ? 'html' : ext;
                var contentType = conf.MIME[ext];
                var cache = Com.fileCache.get(realpath);
                //服务端有Cache，且木有改动
                if (cache && cache.mtime == stats.mtime.getTime()) {
                    Com.cache(response, lastModified, ext);
                    Com.flush(request, response, cache, ext, contentType);
                    Com.fileCache.put(realpath, cache);
                    return;
                }
                if (stats.isDirectory()) {
                    realpath = path.join(realpath, conf.IndexFile);
                    Com.pathHandle(request, response, realpath, httppath, conf.IndexEnable ? stats.mtime : 0);
                } else {
                    //不合法的MIME
                    if (!contentType) {
                        Com.error(response, 403);
                        return;
                    }
                    Com.cache(response, lastModified, ext);
                    //文件太大，服务端不Cache
                    if (stats.size > conf.FileCache.MaxSingleSize) {
                        if (request.headers['range']) {
                            var range = Com.parseRange(request.headers['range'], stats.size);
                            if (range) {
                                response.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + stats.size);
                                response.setHeader('Content-Length', (range.end - range.start + 1));
                                var raw = fs.createReadStream(realpath, {
                                        'start' : range.start,
                                        'end' : range.end
                                    });
                                Com.compressHandle(request, response, raw, ext, contentType, 206);
                            } else
                                Com.error(response, 416);
                        } else {
                            var raw = fs.createReadStream(realpath);
                            Com.compressHandle(request, response, raw, ext, contentType, 200);
                        }
                    } else {
                        fs.readFile(realpath, function (err, data) {
                            if (err)
                                Com.error(response, 500, '<h4>Error : ' + err + '</h4>');
                            else {
                                var buf = new HttpCache(stats.mtime.getTime(), data);
                                Com.flush(request, response, buf, ext, contentType);
                                Com.fileCache.put(realpath, buf);
                            }
                        });
                    }
                }
            }
        });
    }
};

/* 对外的接口 */
exports.create = function (port, dynamicCallBack) {
    if (!port)
        port = 80;
    var httpsPort = 443;
    var app = http.createServer(function (req, res) {
        if (conf.ServerName)
            res.setHeader('Server', conf.ServerName);
        var httppath = '/';
        try {
            httppath = path.normalize(decodeURI(url.parse(req.url).pathname.replace(/\.\./g, '')));
        } catch (err) {
            httppath = path.normalize(url.parse(req.url).pathname.replace(/\.\./g, ''));
        }
        var realpath = path.join(conf.Root, httppath);
        var ext = path.extname(realpath);
        if (ext.search(conf.DynamicExt) != -1) {
            if (typeof dynamicCallBack === 'function')
                dynamicCallBack(req, res, httppath, realpath);
            else
                Com.error(res, 500, "<h4>Error : Can't find the dynamic page callback function!</h4>");
        } else
            Com.pathHandle(req, res, realpath, httppath);
    });

    var options = {
        key: fs.readFileSync('./privatekey.pem'),
        cert: fs.readFileSync('./certificate.pem')
    };


    var httpsApp = https.createServer(options, function (req, res) {
        if (conf.ServerName)
            res.setHeader('Server', conf.ServerName);
        var httppath = '/';
        try {
            httppath = path.normalize(decodeURI(url.parse(req.url).pathname.replace(/\.\./g, '')));
        } catch (err) {
            httppath = path.normalize(url.parse(req.url).pathname.replace(/\.\./g, ''));
        }
        var realpath = path.join(conf.Root, httppath);
        var ext = path.extname(realpath);
        if (ext.search(conf.DynamicExt) != -1) {
            if (typeof dynamicCallBack === 'function')
                dynamicCallBack(req, res, httppath, realpath);
            else
                Com.error(res, 500, "<h4>Error : Can't find the dynamic page callback function!</h4>");
        } else
            Com.pathHandle(req, res, realpath, httppath);
    });


    net.createServer(function(socket){
        socket.once('data', function(buf){
            console.log(buf[0]);
            // https数据流的第一位是十六进制“16”，转换成十进制就是22
            var address = buf[0] === 22 ? httpsPort : httpPort;
            //创建一个指向https或http服务器的链接
            var proxy = net.createConnection(address, function() {
                proxy.write(buf);
                //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
                socket.pipe(proxy).pipe(socket);
            });


            proxy.on('error', function(err) {
                console.log(err);
            });
        });

        socket.on('error', function(err) {
            console.log(err);
        });
    }).listen(3344);


    app.listen(port);

    httpsApp.listen(httpsPort);
};