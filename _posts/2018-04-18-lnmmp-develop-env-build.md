---
layout: post
title: "搭建nginx+mysql+memcached+php开发环境"
date: 2017-12-8
categories: web
tags: linux
---



### centos 7 编译安装php7.2.4

#### 1. 安装必要的库和头文件
    yum install libxml-devel culr curl-devel gd-devel icu libicu-devel gcc gcc-c++ libxslt-devel libzip libzip-devel libatomic_ops-devel GeoIP-devel perl-ExtUtils-Embed dpkg libevent libevent-devel zlib

#### 2. 安装cmake
    wget https://cmake.org/files/v3.11/cmake-3.11.0.tar.gz
    tar -zxvf cmake-3.11.0.tar.gz
    cd cmake-3.11.0
    ./bootstrap && make && make install

#### 3. 安装libzip
    wget  https://libzip.org/download/libzip-1.5.1.tar.gz
    tar -zxvf libzip-1.5.1.tar.gz
    cd libzip-1.5.1
    mkdir build
    cd build
    /usr/local/bin/cmake ..
    make
    make install

#### 4. 安装php
    ./configure --prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc --with-config-file-scan-dir=/usr/local/php/etc/php.d --with-fpm-user=nginx --with-fpm-group=nginx --enable-fpm --enable-opcache --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql --with-iconv --with-freetype-dir --with-jpeg-dir --with-png-dir --with-libzip --with-libxml-dir --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-exif --enable-sysvsem --enable-inline-optimization --with-curl --enable-mbregex --enable-mbstring --with-gd --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-ftp --enable-intl --with-xsl --with-gettext --enable-zip --enable-soap --disable-debug
    make
    make install
    cp /downloads/php-7.2.4/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
    chmod +x /etc/init.d/php-fpm
    cd /usr/local/php/etc/php-fpm.d/
    cp www.conf.default www.conf
    service php-fpm start
    

### 设置虚拟机共享目录
    1. 加载vbox增强功能镜像
    2. 选择VBoxGuestAdditions.iso，此文件一般在VBox安装目录
    3. 挂载光驱，不然直接看不到镜像里面的具体内容
    4. mkdir /mnt/VirtualCD
    5. mount /dev/cdrom /mnt/VirtualCD
    6. cd /mnt/VirtualCD
    7. ./VBoxLinuxAdditions.run
    8. 仔细看提示，如果有提示失败，就运行 yum install kernel-devel-2.6.32-696.23.1.el6.x86_64
    9. 设置共享文件夹
    10. mount -t vboxsf work /data/website/
    
### 安装nginx
    wget https://ftp.openssl.org/source/old/1.0.2/openssl-1.0.2k.tar.gz
    tar -zxf openssl-1.0.2k.tar.gz
    wget http://zlib.net/fossils/zlib-1.2.7.tar.gz
    tar -zxf zlib-1.2.7.tar.gz
    wget https://jaist.dl.sourceforge.net/project/pcre/pcre/8.32/pcre-8.32.tar.gz
    tar -zxf pcre-8.32.tar.gz
    ./configure --prefix=/usr/local/nginx --sbin-path=/usr/sbin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --user=nginx --group=nginx --with-select_module --with-poll_module --with-threads --with-file-aio --with-http_ssl_module --with-http_v2_module --with-http_realip_module --with-http_xslt_module --with-http_image_filter_module --with-http_geoip_module --with-http_gunzip_module --with-http_gzip_static_module  --with-http_auth_request_module --with-http_random_index_module --with-http_secure_link_module --with-http_degradation_module --with-http_slice_module --with-http_stub_status_module --with-http_perl_module --with-stream --with-mail --with-cpp_test_module --with-compat --with-pcre=/downloads/pcre-8.32 --with-zlib=/downloads/zlib-1.2.7 --with-libatomic --with-openssl=/downloads/openssl-1.0.2k --with-debug
    make && make install


#### nginx配置
    user nginx nginx;
    worker_processes auto;
    
    error_log /var/log/nginx/error_nginx.log crit;
    pid /var/run/nginx.pid;
    worker_rlimit_nofile 51200;
    
    events {
      use epoll;
      worker_connections 51200;
      multi_accept on;
    }
    
    http {
      include mime.types;
      default_type application/octet-stream;
      server_names_hash_bucket_size 128;
      client_header_buffer_size 32k;
      large_client_header_buffers 4 32k;
      client_max_body_size 1024m;
      client_body_buffer_size 10m;
      sendfile on;
      tcp_nopush on;
      keepalive_timeout 120;
      server_tokens off;
      tcp_nodelay on;
    
      fastcgi_connect_timeout 300;
      fastcgi_send_timeout 300;
      fastcgi_read_timeout 300;
      fastcgi_buffer_size 64k;
      fastcgi_buffers 4 64k;
      fastcgi_busy_buffers_size 128k;
      fastcgi_temp_file_write_size 128k;
      fastcgi_intercept_errors on;
    
      #Gzip Compression
      gzip on;
      gzip_buffers 16 8k;
      gzip_comp_level 6;
      gzip_http_version 1.1;
      gzip_min_length 256;
      gzip_proxied any;
      gzip_vary on;
      gzip_types
        text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
        text/javascript application/javascript application/x-javascript
        text/x-json application/json application/x-web-app-manifest+json
        text/css text/plain text/x-component
        font/opentype application/x-font-ttf application/vnd.ms-fontobject
        image/x-icon;
      gzip_disable "MSIE [1-6]\.(?!.*SV1)";
    
      #If you have a lot of static files to serve through Nginx then caching of the files' metadata (not the actual files' contents) can save some latency.
      open_file_cache max=1000 inactive=20s;
      open_file_cache_valid 30s;
      open_file_cache_min_uses 2;
      open_file_cache_errors on;
    
    log_format  main  '[$time_local] $remote_addr $server_name "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" '
                      '$upstream_addr $request_time $upstream_response_time' ;
    
    #################### default #######################
      server {
        listen 80;
        server_name _;
        access_log /var/log/nginx/access_nginx.log main;
        root /data/website/default;
        index index.html index.htm index.php;
        #error_page 404 /404.html;
        #error_page 502 /502.html;
        location /nginx_status {
          stub_status on;
          access_log off;
          allow 127.0.0.1;
          deny all;
        }
        location ~ [^/]\.php(/|$) {
          #fastcgi_pass remote_php_ip:9000;
          fastcgi_pass unix:/dev/shm/php-cgi.sock;
          fastcgi_index index.php;
          include fastcgi.conf;
        }
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
          expires 30d;
          access_log off;
        }
        location ~ .*\.(js|css)?$ {
          expires 7d;
          access_log off;
        }
        location ~ /\.ht {
          deny all;
        }
      }
    ##################### sites-enabled ########################
      include sites-enabled/*.conf;
    }


### 安装mysql5.7.21
#### 1. glibc版(免编译，适合centos6,centos7)

    wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.21-linux-glibc2.12-x86_64.tar.gz
    tar -zxf mysql-5.7.21-linux-glibc2.12-x86_64.tar.gz
    cp -fR mysql-5.7.21-linux-glibc2.12-x86_64/* /usr/local/mysql
    cp mysql.server /etc/init.d/mysqld
    chmod +x /etc/init.d/mysqld

#### 2. 编辑服务文件

    vi /etc/init.d/mysqld
    
    ...
    basedir=
    datadir=
    conf=/usr/local/mysql/my.cnf
    ...
        $bindir/mysqld_safe --defaults-file="$conf" --datadir="$datadir" --pid-file="$mysqld_pid_file_path" $other_args >/dev/null &

#### 3.  添加mysql启动配置文件

    vi /etc/my.cnf

    [mysqld]
    datadir=/mnt/sda3/data
    socket=/var/lib/mysql/mysql.sock
    user=mysql
    # Disabling symbolic-links is recommended to prevent assorted security risks
    symbolic-links=0
    
    [mysqld_safe]
    log-error=/var/log/mysqld.log
    pid-file=/usr/local/mysql/data/minios.pid

#### 4. 添加mysq参数配置文件

    vi /usr/local/mysql/my.cnf

    [mysqld]
    sql_mode='NO_ENGINE_SUBSTITUTION'
    explicit_defaults_for_timestamp=1


### 安装memcached1.5.7
#### 1. 安装
       wget http://www.memcached.org/files/memcached-1.5.7.tar.gz
       tar -zxf memcached-1.5.7.tar.gz
       cd memcached-1.5.7/
       ./configure --prefix=/usr/local/memcached
       make && make install
       cd scripts/
       cp memcached-init /etc/init.d/memcached
       cp -R scripts/ /usr/local/memcached/
       chmod +x /usr/local/memcached/scripts/start-memcached
    
#### 2. 编辑服务

       vi /etc/init.d/memcached
       DAEMON=/usr/local/memcached/bin/memcached
       DAEMONNAME=memcached
       DAEMONBOOTSTRAP=/usr/local/memcached/scripts/start-memcached
    
#### 3. 编辑配置

       vi /etc/memcached_server1.conf
       -c 256
       -m 256
       -u root
       -p 11211
       -d
#### 4. 启动脚本

       vi /usr/local/memcached/scripts/start-memcached
       my $memcached = "/usr/local/memcached/bin/memcached";
        
### 补充说明
1. 首先安装基础软件和头文件
2. 为相应的软件分配相应的用户
3. 若要使用`sock`做fastcgi代理，请修改`www.conf`
4. centos 7防火墙关闭的方法`service firewalld stop`
5. centos 6防火墙关闭的方法`service iptables stop`

