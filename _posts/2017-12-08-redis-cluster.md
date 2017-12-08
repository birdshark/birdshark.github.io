---
layout: post
title: "搭建redis-cluster"
date: 2017-12-8
categories: database
tags: redis
---


>记得年方二八时候，数数还是数得过来的，如今年逾二十八，数都数不清了，前几天在狗东哪里整了《算法导论》、《概率导论》两本教科书
看看学学，也好在研究机器学习的时候有解惑的根本。redis-cluster正好成功的引起了我的兴趣，就当着等书之前的休闲折腾

<!-- more -->

redis早前没有现成的集群模块，如今流行起来了，功能也越来越强大了，下面我就来部署一下，当然这中间也会遇到很多问题的。不过没关系，有问题咱们解决即可

 根据官网介绍，手动部署集群需要进行一下操作

    cd /usr/local/redis
    mkdir -p cluster/7000
    cp ./etc/redis.conf  cluster/7000
    vi cluster/7000/redis.conf

 这里我们针对关键的地方修改即可，具体情况如下

    port 7000
    cluster-enabled yes
    cluster-config-file nodes-7000.conf
    cluster-node-timeout 5000
    appendonly yes

 修改完成后，复制

    cp -r cluster/7000 cluster/7001
    cp -r cluster/7000 cluster/7002
    cp -r cluster/7000 cluster/7003
    cp -r cluster/7000 cluster/7004
    cp -r cluster/7000 cluster/7005

 然后依次修改每个节点配置文件的端口号，修改好配置，最后启动所有的节点

    redis-server cluster/7000/redis.conf
    redis-server cluster/7001/redis.conf
    redis-server cluster/7002/redis.conf
    redis-server cluster/7003/redis.conf
    redis-server cluster/7004/redis.conf
    redis-server cluster/7005/redis.conf

 这个时候虽然所有节点启动了,但是还不能称之为集群。下面我们要使用ruby的辅助工具`redis-trib`来将所有的节点联系起来,这个工具就是我们的redis安装源文件的src目录下的`redis-trib.rb`文件，但是这个文件运行需要ruby版redis的驱动
    
    yum install ruby
    gem install redis

 安装失败，redis依赖的ruby版本必须要大于2.2.0，下面我们来手动安装ruby2.4.2
 先清理yum安装的ruby

    yum remove ruby

下面通过RVM（Ruby Version Manager）来安装ruby

    gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E37D2BAF1CF37B13E2069D6956105BD0E739499BDB
    curl -sSL https://get.rvm.io | bash -s stable
    rvm install 2.4.2
    gem install redis

 安装成功后
 
    ./src/redis-trib.rb create --replicas 1 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005

 以上是手动创建集群的方法，下面还有自动启动节点，创建集群，停止集群的服务，文件在redis安装目录下，为`utils/create-cluster/create-cluster`
    
    cp utils/create-cluster/create-cluster /etc/init.d/create-cluster
    vi /etc/init.d/create-cluster

 修改PROT并添加ROOT=/usr/local/redis

    #!/bin/bash
    # Settings
    PORT=6999
    TIMEOUT=2000
    NODES=6
    REPLICAS=1
    ROOT=/usr/local/redis
    # You may want to put the above config parameters into config.sh in order to
    # override the defaults without modifying this script.

    if [ -a config.sh ]
    then
        source "config.sh"
    fi

    # Computed vars
    ENDPORT=$((PORT+NODES))

    if [ "$1" == "start" ]
    then
        while [ $((PORT < ENDPORT)) != "0" ]; do
            PORT=$((PORT+1))
            echo "Starting $PORT"
            $ROOT/bin/redis-server --port $PORT --cluster-enabled yes --cluster-config-file nodes-${PORT}.conf --cluster-node-timeout $TIMEOUT --appendonly yes --appendfilename appendonly-${PORT}.aof --dbfilename dump-${PORT}.rdb --logfile ${PORT}.log --daemonize yes
        done
        exit 0
    fi

    if [ "$1" == "create" ]
    then
        HOSTS=""
        while [ $((PORT < ENDPORT)) != "0" ]; do
            PORT=$((PORT+1))
            HOSTS="$HOSTS 127.0.0.1:$PORT"
        done
        $ROOT/src/redis-trib.rb create --replicas $REPLICAS $HOSTS
        exit 0
    fi

    if [ "$1" == "stop" ]
    then
        while [ $((PORT < ENDPORT)) != "0" ]; do
            PORT=$((PORT+1))
            echo "Stopping $PORT"
            $ROOT/bin/redis-cli -p $PORT shutdown nosave
        done
        exit 0
    fi

    if [ "$1" == "watch" ]
    then
        PORT=$((PORT+1))
        while [ 1 ]; do
            clear
            date
            $ROOT/bin/redis-cli -p $PORT cluster nodes | head -30
            sleep 1
        done
        exit 0
    fi

    if [ "$1" == "tail" ]
    then
        INSTANCE=$2
        PORT=$((PORT+INSTANCE))
        tail -f ${PORT}.log
        exit 0
    fi

    if [ "$1" == "call" ]
    then
        while [ $((PORT < ENDPORT)) != "0" ]; do
            PORT=$((PORT+1))
            $ROOT/bin/redis-cli -p $PORT $2 $3 $4 $5 $6 $7 $8 $9
        done
        exit 0
    fi

    if [ "$1" == "clean" ]
    then
        rm -rf *.log
        rm -rf appendonly*.aof
        rm -rf dump*.rdb
        rm -rf nodes*.conf
        exit 0
    fi

    if [ "$1" == "clean-logs" ]
    then
        rm -rf *.log
        exit 0
    fi

    echo "Usage: $0 [start|create|stop|watch|tail|clean]"
    echo "start       -- Launch Redis Cluster instances."
    echo "create      -- Create a cluster using redis-trib create."
    echo "stop        -- Stop Redis Cluster instances."
    echo "watch       -- Show CLUSTER NODES output (first 30 lines) of first node."
    echo "tail <id>   -- Run tail -f of instance at base port + ID."
    echo "clean       -- Remove all instances data, logs, configs."
    echo "clean-logs  -- Remove just instances logs."

 启动节点，创建集群就可以用一下命令来实现了

    service create-cluster start
    service create-cluster create

停止集群

    service create-cluster stop

还有`watch`、`tail`、`clean`、`clean-logs`命令，这里就不一一说明了，这个教程就写到这吧