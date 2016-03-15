---
layout: post
title:  "interview"
date:   2016-3-8 11:13:00 +0800
categories: skill
tags: mysql
---


>DML:Data manipulation language

<!-- more -->

### 1. mysql(5.7)

#### A. 存储引擎以及特性
`MyISAM` :  5.5版本之前作为默认存储引擎。单纯读写性能很强，不支持事物，锁粒度为表级别，只支持 B-tree index，读写操作具有串行特性。
    
    特点
    1. 数据值优先以低字节形式存储，这使得数据库和操作系统相互独立。
    2. 所有的数字键的值存储在高字节允许更好的索引压缩。
    3. 单表最多允许2^32行数据
    4. 每张MyISAM表的最大索引数为64个,单列最大索引数为16
    5. 混合写入操作(增删改)对变长列所产生的碎片的影响非常小，这是因为它会自动合并被删除的或被扩展的数据块
    6. 可以将数据文件和索引文件放在不同的物理设备上以提升其速度
    7. BLOB和TEXT列可以被索引
    8. NULL值现在可以现在可以存放在索引列了，但是会占0到1个字节
    9. 每列可以定义自己的字符集
    10. 在索引文件里有个标记表示此表是否正常关闭，mysqld启动命令 `--myisam-recover-options`如果在MyISAM数据表被不正确的关闭，此选项可以在启动数据库时对MyISAM表进行自动检查修复，
    11. myisamchk 命令用法: `--update-state` 把无问题的myisam数据表标记为已检查 `--fast` 只会检查没有被标记的myisam数据表
    12. 

`Innodb` :  5.5版本开始作为默认存储引擎。支持事物,单纯读写能力较MyISAM弱,锁粒度为行级锁，ACID标准，支持外键。

科普

    A:atomicity 原子性：一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。
    事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
    C:consistency 一致性：在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，
    这包含资料的精确度、串联性以及后续数据库可以自发性地完成预定的工作。
    I:isolation 隔离性：当两个或者多个事务并发访问（此处访问指查询和修改的操作）数据库的同一数据时所表现出的相互关系。
    事务隔离分为不同级别，包括读未提交（Read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（Serializable）
    D:durability 持久性：在事务完成以后，该事务对数据库所作的更改便持久地保存在数据库之中，并且是完全的。

特点
    
    1. 数据操作遵循ACID模式，使事物具有提交，回滚，闪回的特点，这样更好的保证数据安全
    2. 行级锁和oracle形式的一致性读，增加了并发性能
    3. 基于主键的查询优化,整理你的数据
    4. 保证数据的一致性，该引擎支持外键约束，有了外键约束，就可以避免增删改操作而导致的数据不一致
    5. 你可以在同一个数据库中自由的混合使用存储引擎
    6. 当处理大量数据时会让CPU发挥最大性能
Innodb在内存中拥有自己的独有的缓冲池来缓存数据和索引，innodb_file_per_table默认值是enabled。这意味着每张新的Innodb数据表和他的联合索引被存储在单独的文件。
当innodb_file_per_table设置成disabled innodb会把表和索引存放在一个由几个文件组成的()单独的系统表空间，5.7.6，数据和索引也可被存储在一般表空间，也就是可以存储多个数据表的共享表空间。
innodb可以处理大量的数据即使在数据文件限制在2GB的操作系统

新特性:
    
    1.安全性提升 - 
        A更换了密码加密机制 
        B增加了过期密码 
        C增加了用户锁定 
        D启动时自动生成SSL and RSA 证书
        Emysqld --initialize作为mysql安装部署命令
    2.SQL模式改变
    3.在线修改表结构
    4.支持中文，日文和韩文的全文索引插件
    5.Innodb存储引擎优化
        A在线修改可变长字符串的长度 `ALTER TABLE table_name ALGORITHM = [COPY|INPLACE|DEFAULT] ,CHANGE COLUMN old_column new_column VARCHAR(int);`
        注意: new_column 可以与 old_column 相同 当int 大于当前设置数值  用INPLACE 否则用COPY 
        B优化 `CREATE TABLE`, `DROP TABLE`, `TRUNCATE TABLE`, and `ALTER TABLE` 语句,来提升Innodb的临时表性能
        C临时表数据元不再存储在系统表里面，而是存储于INNODB_TEMP_TABLE_INFO该表存在数据库information_schema,为用户提供了活动的临时表快照，
        此表包含的所有用户和系统创建的临时表的数据元和报表是活跃在一个给定的Innodb实例，这些表是在第一次运行Select语句是被创建
        DInnodb现在支持mysql内建的空间数据类型，此前发布的mysql版本中空间数据会被存储为二进制块类型。BLOB仍然作为底层的数据类型，
        但是空间数据类型已经被划分到Innodb的新内置的数据类型 `DATA_GEOMETRY`
        E无压缩的Innodb临时表现在可以存放在一个单独表空间，这个表空间会在服务启动时重建。默认是存放在DATADIR，你可以通过新加的配置项`innodb_temp_data_file_path`,
        来指定临时表空间的数据路径
        F innochecksum新加了操作项，功能更强大
            工具介绍：此工具是用来验证Innodb文件的校验和，他可以读取Innodb表空间
            计算每页的校验和跟存好的校验和作比较，并报告损坏页的错配信息。它原先是设计用来加速检查断电时
            表空间文件的完整性的，现在也可以用于文件复制。因为检测到不匹配的话会引起Innodb服务
            关闭。你可以自由控制使用这个命令，而不用等待在服务器在使用过程中遇到坏的页面。此命令支持检查大于2GB的文件，以前版本的innochecksum最大只支持2GB
            他不可用在表空间已经被打开的服务上。对于此类文件，你应该用CHECK_TABLE来检查表。如果你用innochecksum来检查已经被打开的表空间，服务器会返回'Unable to lock file'的错误信息
            如果校验和不匹配被检测到了，你最好对表空间做个备份，或者尝试启动服务使用mysqldump来给表和表空间做个备份
        G为正常临时表和压缩临时表以及位于表空间的相关对象新增了非重做撤销日志。创建临时表 create temporary table table_name ( name datatype(length) null | not null);
        
        关于非重做撤销日志现在现在被用于多版本控制
            
            
        H
        
    

#### B. 锁类型及其影响

`Table-level locking`: 表级锁 : 开销小，加锁快。不会出现死锁，锁定粒度大，并发度最低，发生锁冲突的概率最高(跟锁粒度成正比)。应用于`MYISAM`存储引擎  
model-1 Shared locks 表共享锁  
model-2 Exclusive locks 表独占锁  
`读锁`: 发生在读取时，锁模式为共享锁，读的时候允许其他用户读,但是不允许任何用户写 `lock table table_name read [local]`  
`写锁`: 发生在写入时，锁模式为独占锁，写的时候，允许当前用户读写，但是不允许其他用户读和写  `lock table table_name write [local]`
`READ LOCAL和READ之间的区别是，READ LOCAL允许在锁定被保持时，执行非冲突性INSERT语句（同时插入）。
但是，如果您正打算在MySQL外面操作数据库文件，同时您保持锁定，则不能使用READ LOCAL`   
MYISAM引擎读写有串行性，但是在一定的条件下，也支持读写并行  
`show global variables like 'concurrent%'`查看当前读写并行支持
参数:

    0(never) : 不支持读写并行
    1(auto default) : 支持读写并行，前提是表无空洞(即是数据都是连续的中间没有被删除的数据),如果有被删除的行，则需要等到读锁释放，写锁载入才能进行插入
    2(always):不管表中又没有空洞，总是支持在表尾并行插入  
     
调度：  
两个进程分别请求读写，MySQL优先调度写，不仅如此，即使读请求先到锁等待队列，写请求后到，写锁也会插到读锁请求之前！
这就是为什么Mysql不太适合有大量更新操作和查询操作，因为大量更新会使查询操作很难获得锁，因而发生阻塞。这是比较致命的。我们可以通过一些设置来调度读写优先权
    
    1.通过启动参数low-priority-updates,使MyISAM引擎给读操作以优先权
    2.通过执行命令SET LOW_PRIORITY_UPDATES = 1,使该连接发出的更新请求优先级降低
    3.通过指定INSERT UPDATE DELETE 语句的LOW_PRIORITY_UPDATES属性,降低该语句的优先级

以上3种方法都是降低写操作的优先级，来给读操作更多的取锁机会。还有一点,通过限制`max_lock_write_count`值来调度写操作的优先级。


>注意：尽量避免出现长时间运行的查询操作，不要总想用一条SELECT语句来解决问题，因为这种看似巧妙的SQL语句，往往比较复杂，执行时间较长，在可能的情况下可以通过使用中间表等措施对SQL语句做一定的“分解”，使每一步查询都能在较短时间完成，从而减少锁冲突。如果复杂查询不可避免，应尽量安排在数据库空闲时段执行，比如一些定期统计可以安排在夜间执行。
    

`Row-level locking`: 行级锁 : 开销大,加锁慢。会出现死锁，锁定粒度小，并发最高，发生锁冲突的概率最低。应用于`Innodb`存储引擎

    `共享锁`:  select * from table_name where ..... lock in share mode;
    `排他锁`:  select * from table_name where ..... for update;


共享锁案例参见<http://dev.mysql.com/doc/refman/5.7/en/innodb-lock-modes.html>
给行加上共享锁后其他用户也可获取改行的共享锁,没有读取限制，当两个用户同时对同一行申请共享锁，先进行的写操作会阻塞，
后进行的写操作会抛出死锁错误，此用户申请的共享锁解除，另一个用户获得写锁，继而更新数据




排它锁
当关闭自动提交时 即当前session执行`set autocommit = 0`
当前session申请排它锁后，其他用户要想申请排它锁则需要等待获得锁，当等待时间超时会中断事物
当前session执行更新操作并且commit后，当前排它锁会释放，其他用户可以申请获得锁


Innodb行锁实现方式
Innodb的行锁是通过给索引上的索引项加锁实现，这一点Mysql和Oracle不同。后者是通过在数据块中对应行数据加锁实现的
Innodb的行锁实现特点意味着，只有通过索引条件检索数据，Innodb才使用行锁，否则只用表级锁

由于MySQL的行锁是针对索引加的锁，不是针对记录加的锁，所以虽然是访问不同行的记录，但是如果是使用相同的索引键，是会出现锁冲突的。
例如

    select * from dcba where test = 1007 and test2 = 'jajajaja' for update;
    select * from dcba where test = 1005 and test2 = 'jajajaja' for update;  

这两个排它锁之间会产生锁等待。因为  
虽然查询条件不一样，但是由于查询条件中test是主键索引，而test2没有索引，总的来说索引项是相同的实际上就是相当于  

    select * from dcba where test = 1007 for update;
    select * from dcba where test = 1005 for update;  

当表有多个索引项时，我们可以组合索引项来达到事物隔离，不论是主键索引，唯一索引，还是普通索引，Innodb都是以行锁来对数据加锁
特殊情况下，即使在表中添加了索引字段，但是否使用索引来检索数据还是由mysql通过判断不同执行计划的代价来决定的。如果mysql认为全表扫描效率更高。比如数据量很小的。
那么它就不会使用索引，这种情况下使用的是表锁，而不是行锁，因此分析锁冲突时，要分析sql的执行计划，explain select 语句来确认是否是用了索引

间隙锁

    我们用范围条件而不是相等条件检索数据，并请求共享或排他锁时，InnoDB会给符合条件的已有数据记录的索引项加锁；
    对于键值在条件范围内但并不存在的记录，叫做“间隙（GAP)”，InnoDB也会对这个“间隙”加锁，这种锁机制就是所谓的间隙锁（Next-Key锁）。

作用:一方面可以防止幻读。另一方面，用作复制和恢复


参考手册上讲:  
`InnoDB使用行锁定，BDB使用页锁定。对于这两种存储引擎，都可能存在死锁。这是因为，在SQL语句处理期间，InnoDB自动获得行锁定和BDB获得页锁定，而不是在事务启动时获得。`






`Page-level locking`: 页级锁：各项性能介于表级锁和行级锁之间  




#### C. 事物隔离级别及其特点

Serialize 序列化 隔离级别最高，串行性是事务中所请求的读写锁在事物结束时被释放。对并发影响大。
Repeatable Read 重复读  大多数是应为新增数据而造成的结果。为什么不可重复，因为数据已经被其他事务做了修改(写入)
Read Committed 读提交(授权读) 不会发生脏读，因为在请求数据之前，所有事物均被提交，但是可能会发生幻读和不重复读
Read UnCommitted 读不提交(未授权读) 这种隔离级别，幻读，脏读，不可重复读

`幻读`:两次相同的查询操作，返回的结果不一样，出现的原因是没有对条件加上范围锁

例子:

    /* Query 1 */
    SELECT * FROM users WHERE age BETWEEN 10 AND 30;
    /* Query 2 */
    INSERT INTO users(id,name,age) VALUES ( 3, 'Bob', 27 );
    COMMIT;
    /* Query 1 */
    SELECT * FROM users WHERE age BETWEEN 10 AND 30; 
    COMMIT;
    
`脏读`:脏读就是事务性读取一行已经被修改但是尚未被提交的数据  
例子:

    /* Query 1 */
    SELECT age FROM users WHERE id = 1;
    /* will read 20 */
    
    /* Query 2 */
    UPDATE users SET age = 21 WHERE id = 1;
    /* No commit here */
    
    /* Query 1 */
    SELECT age FROM users WHERE id = 1;
    /* will read 21 */
    
    /* Query 2 */
    ROLLBACK; 
    /* lock-based DIRTY READ */
    
`不可重复读`: 不可重复读发生在事物期间，相同的查询执行两次但是返回的结果不一样  
例子:

    /* Query 1 */
    SELECT * FROM users WHERE id = 1;
    /* Query 2 */
    UPDATE users SET age = 21 WHERE id = 1;
    COMMIT; 
    /* in multiversion concurrency control, or lock-based READ COMMITTED */
    /* Query 1 */
    SELECT * FROM users WHERE id = 1;
    COMMIT; 
    /* lock-based REPEATABLE READ */
    
在上例中，两事务提交成功，意味着修改将变得可见。在会话1中我们可以看出来两次查询结果之间的差异，
在序列化(Serialize)和重复读(Repeatable Read)的事物隔离级别内，DBMS必返回老数据。在读提交(Read Committed)和读未提交(Read Uncommitted)的事物隔离级别下
DBMS必返回已更新的数据，这就是不可以重复读


    （1）在应用中，如果不同的程序会并发存取多个表，应尽量约定以相同的顺序来访问表，这样可以大大降低产生死锁的机会。
    （2）在程序以批量方式处理数据的时候，如果事先对数据排序，保证每个线程按固定的顺序来处理记录，也可以大大降低出现死锁的可能。
    （3）在事务中，如果要更新记录，应该直接申请足够级别的锁，即排他锁，而不应先申请共享锁，更新时再申请排他锁，因为当用户申请排他锁时，其他事务可能又已经获得了相同记录的共享锁，从而造成锁冲突，甚至死锁
    （4）前面讲过，在REPEATABLE-READ隔离级别下，如果两个线程同时对相同条件记录用SELECT...FOR UPDATE加排他锁，在没有符合该条件记录情况下，两个线程都会加锁成功。程序发现记录尚不存在，就试图插入一条新记录，如果两个线程都这么做，就会出现死锁。这种情况下，将隔离级别改成READ COMMITTED，就可避免问题
    （5）当隔离级别为READ COMMITTED时，如果两个线程都先执行SELECT...FOR UPDATE，判断是否存在符合条件的记录，如果没有，就插入记录。此时，只有一个线程能插入成功，另一个线程会出现锁等待，当第1个线程提交后，第2个线程会因主键重出错，但虽然这个线程出错了，却会获得一个排他锁！这时如果有第3个线程又来申请排他锁，也会出现死锁。

#### D. 索引类型及其特点
`B-tree`: 平衡多叉树，有个纵向索引
很多文件系统都是以此类数据结构来设计存储类型
`B+tree`: 平衡多叉树，不仅有纵向索引还有横向索引,Mysql的MyISAM和Innodb的主键索引都是支持B+tree索引的

其区别是MyIsam索引数据里存储的是数据的地址，所以MysqlISAM的数据文件和索引文件是隔离的
Innodb的主键索引，都是包含了整行数据的完整记录的这种索引叫做聚集索引。因为InnoDB的数据文件本身要按主键聚集，所以InnoDB要求表必须有主键（MyISAM可以没有），如果没有显式指定，则MySQL系统会自动选择一个可以唯一标识数据记录的列作为主键，如果不存在这种列，则MySQL自动为InnoDB表生成一个隐含字段作为主键，这个字段长度为6个字节，类型为长整形。

这两者的关系参见<http://blog.csdn.net/hguisu/article/details/7786014>

mysql使用B-tree索引查找条件:

1. like的参数是常量并且不以通配符开头
2. =,>,>=,<,<=,between这些操作符都会用到索引,前提是你得使用索引字段查询
3. 索引不能跨逻辑操作符共享
4. IS NULL查询不使用索引
5. 查询参数数据类型需要跟列定义数据类型一致,让mysql做转化后，不走索引
6. 两点确定一条直线，若是单纯使用列查找 即 OR 逻辑操作则不使用索引
7. mysql认为全表扫描要快的话，则不会使用索引


参考<https://dev.mysql.com/doc/refman/5.7/en/index-btree-hash.html>


`Hash`:哈希索引

1. hash索引通常使用 = 或者 <=> 来比较查找数据，而不使用范围比较来查找数据。因为hash索引只是单纯的键值对存储模式
2. 不适合用Order By操作来对数据进行排序
3. 不适合用Between查找范围内数据
4. 查找应该用完全键名，不支持模糊查询

参考<https://dev.mysql.com/doc/refman/5.7/en/index-btree-hash.html>

`T-tree`:T树索引  

`Inverted`:倒排索引，以文档中的字或词作为关键字索引，表项记录了该字或词在文档中出现的位置信息。

没有引用到mysql搜索引擎，在Lucence，sphinx全文搜索引擎中使用

`Platoon`:正排索引,以文档的编号作为关键字索引，记录文档中每一个出现的位置信息。查找时需要扫描全表，只到找出所有符合条件的数据  

### 2. SOA

{% highlight ruby%}
SOA `Service-Oriented Architecture` 面相服务的体系结构
DCOM `distributed component object model` 分布组件对象模型  
CORBA `common objects request borker architecture`  通用对象请求代理体系  
WSDL `web services description language` 网络服务描述语言基于XML的描述语言，用于描述与服务交互所需的服务的公共接口，协议绑定，消息格式。  
UDDI `Universal Description Discovery and Integration` 通用描述，发现整合标准 基于XML的注册协议，用于发布WSDL并允许第三方发现这些服务。 
SOAP 有个时期代表简单对象访问协议，但是自SOAP 1.2版本后就没有特别的意思了  在计算机网络上交换基于XML的消息的协议，通常是用HTTP。
{% endhighlight %}

	1. 包含认证信息的加密请求头 
	2. 包含消息的主体(WSDL标准,主要为xml)

![soap][1]  


SOAP的工作流程图如下  

![soap-message][2]

REST `Representation State Transfer`  
REST吸引更多的开发者，因为它的形式于SOAP相比更加简单更加好用，在交互中更简洁，体积小，其工作流程如下图
![rest-messages][3]

RESTful和REST-style的特点是

	1. 状态和功能被分割成分布式资源
	2. 每个资源都用最小的命令集唯一定位(具有代表性的有GET,PUT,POST,PUT,DELETE)
	3. 此协议是C/S架构，无状态，分层的，且支持缓存



JSON `javascript object notation`

工作流程如下图

![json-messages][4]


参考资料

<http://www.service-architecture.com/articles/web-services/web_services_definition.html>
<https://zh.wikipedia.org/wiki/REST>

### 3. SSO
Single sign-on 单点登陆
目前web service用的是安全断言标记语言






<https://en.wikipedia.org/wiki/Single_sign-on>
<https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language>

























[1]: /images/soap-structure.jpg  "soap"
[2]: /images/soap_messages.jpg  "soap-message"
[3]: /images/rest_messages.jpg "rest-message"
[4]: /images/json_messages.jpg "json-message"