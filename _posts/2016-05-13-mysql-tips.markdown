---
layout: post
title:  "mysql-tips"
date:   2016-5-11 17:21:00 +0800
categories: skill
tags: mysql
---

>有些时候，你在操作MYSQL数据库当口遇到了些问题，那么记录下来以作后师


外键关联表数据删除限制
`SET FOREIGN_KEY_CHECKS = 0;`
`TRUNCATE TABLE table_name;`
当然操作完成后还是得将设置还原
`SET FOREIGN_KEY_CHECKS = 1;`

mysql多主模式情况下,当有一台主机down机,重启后可能会发生主键冲突，若是以自增长做主键，
可以考虑设定规则，使得各主机之间的生产主键的规律各不相同
若是对主键没有太多要求可以使用unique函数生成id