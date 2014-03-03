node-munin-redis
================

# install
install to /opt/munin-node-redis

```
git clone https://github.com/you21979/node-munin-redis.git
sudo cp -rp node-munin-redis /opt
cd /opt/munin-node-redis
sudo npm install
```

# usage


```
redis-cli
redis 127.0.0.1:6379> hset room_temp room1 10
redis 127.0.0.1:6379> hset room_temp room2 11
redis 127.0.0.1:6379> hset room_temp room3 60

sudo ln -s /opt/node-munin-redis/redis_hash.js /etc/munin/plugins/room_temp
```

/opt/node-munin-redis/munin-redis.json

```
{
 "room_temp":{
  "host":"localhost",
  "port":6379,
  "graph":"temperature",
  "title":"room temp",
  "label":"temp",
  "category":"room",
  "key":"room_temp"
 }
}
```

