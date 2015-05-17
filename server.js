var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var counter = 1;
var complete_data = [];
var url = 'https://www.python.org/'; // hardcoded URL

/*
 * Scrap funciton which crawl links
 * @param {type} url
 * @param {type} callback
 * @returns {undefined}
 */
var scrap = function (url, callback) {
    //console.log("Debuging : " + counter++);
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var json = [];

            $('a').filter(function () {
                var data = $(this);
                //console.log(data.attr('href'));
                var obj = {};
                obj.link = data.attr('href');
                obj.base_url = url;
                obj.parsed = false;
                json.push(obj);
            });
            callback(json)
        }
    })
};

/*
 * Wriing parsed linked into repository
 * @param {type} json
 * @param {type} data
 * @param {type} callback
 * @returns {undefined}
 */
var writeParsedData = function (json, data, callback) {
    var new_data = data.concat(json);
    fs.writeFile('output.json', JSON.stringify(new_data, null, 4), function (err) {
        console.log(new_data.length + ' total links present in repository.');
        callbackWrite();
    });
};

/*
 * Reading parsed link from repository
 * @param {type} callback
 * @returns {undefined}
 */
var readParsedData = function (callback) {
    var next_url = '';
    fs.readFile('output.json', 'utf8', function (err, data) {
        if (err)
            throw err;
        if (data) {
            var test = JSON.parse(data);
            for (var i = 0; i < test.length; i++) {
                elem = test[i];
                base_url = elem.base_url;
                /*
                 * Ignoring links having `javascript`
                 */
                if (!elem.parsed && elem.link.match(/^((?!javascript).)*$/) != null) {
                    temp_url = (base_url.substring(base_url.length - 1, base_url.length) === '/') ? base_url.substring(0, base_url.length - 1) : base_url;
                    test[i].parsed = true;
                    if (elem.link.match(/^(http|https):\/\//) != null)
                        temp_url = elem.link;
                    else
                        temp_url += elem.link;
                    next_url = temp_url;
                    break;
                }
            }
            callback(next_url, test);
        }
    });
}
/*
 * Callback function of reading respository
 * @param {type} next_url
 * @param {type} complete
 * @returns {undefined}
 */
var callbackRead = function (next_url, complete) {
    complete_data = complete;
    url = next_url;
    scrap(url, callbackScrap)
};L
/*
 * Callback function of scraping
 * @param {type} json
 * @returns {undefined}
 */
var callbackScrap = function (json) {
    writeParsedData(json, complete_data, callbackWrite);
};
/*
 * Callback function of writing links into repository 
 * @returns {undefined}
 */
var callbackWrite = function () {
    readParsedData(callbackRead);
};

/*
 * Starting of scraping
 */
scrap(url, callbackScrap);


app.listen('8081');
exports = module.exports = app; 	