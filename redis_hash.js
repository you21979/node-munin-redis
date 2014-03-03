#!/usr/bin/env node
var redis = require('redis');
var munin = require('munin-plugin');

var filename = __filename.replace(__dirname+'/', '').replace('.js','');
var jsonfile = '/opt/node-munin-redis/munin-redis.json';

var modelmap = {
    'default': munin.Model.Default,
    'counter': munin.Model.Counter,
    'temperature': munin.Model.Temperature,
    'rate': munin.Model.Rate,
};

var model_select = function(opt){
    var Model = munin.Model.Default;
    if(opt in modelmap){
         Model = modelmap[opt];
    }
    return Model;
}

var render = function(g){
    g.sortLabel();
    munin.create(g);
}
var main = function(config){
    var g = new munin.Graph(config['title'],config['label'],config['category']);
    var rcl = redis.createClient(config['port'],config['host']);
    var Model = model_select(config['graph']);
    rcl.hgetall(config['key'], function(err, val){
        if(err){
            return;
        }
        for(var key in val){
            g.add(new Model(key).setValue(parseFloat(val[key])));
        }
    });
    rcl.quit(function(err){
        render(g);
    });
}
munin.jsonFileRead(jsonfile, function(err, val){
    if(!err){
        main(val[filename]);
    }
});
