#!/usr/bin/env node
var redis = require('redis');
var munin = require('munin-plugin');

var main = function(host, port, sources){
    var rcl = redis.createClient(port, host);
    var graphs = [];
    sources.forEach(function(config){
        var g = new munin.Graph(config['title'],config['label'],config['category']);
        var Model = munin.selectModel(config['graph']);
        rcl.hgetall(config['key'], function(err, val){
            if(err){
                return;
            }
            for(var key in val){
                g.add(new Model(key).setValue(parseFloat(val[key])));
            }
            g.sortLabel();
        });
        graphs.push(g);
    });
    rcl.quit(function(err){
        munin.create(graphs);
    });
}
var dir = __filename.split('/');
dir.length = dir.length - 1;
var path = dir.join('/');
var jsonfile = path + '/' + munin.getScriptName() + ".json";
munin.jsonFileRead(jsonfile, function(err, val){
    if(!err){
        main(val.host, val.port, val.sources);
    }
});
