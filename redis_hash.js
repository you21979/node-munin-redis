#!/usr/bin/env node
var redis = require('redis');
var munin = require('munin-plugin');

var filename = __filename.replace(__dirname+'/', '').replace('.js','');
var jsonfile = '/opt/node-munin-redis/munin-redis.json';

var select = function(opt){
    var Model = munin.Model.Default;
    switch(opt){
    case 'counter':
        Model = munin.Model.Counter;
        break;
    case 'temperature':
        Model = munin.Model.Temperature;
        break;
    case 'rate':
        Model = munin.Model.Rate;
        break;
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
    var Model = select(config['graph']);
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
