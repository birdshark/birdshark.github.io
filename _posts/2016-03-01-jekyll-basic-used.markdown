---
layout: post
title:  "jekyll基本使用方法"
date:   2016-3-1 17:30:00
categories: jekyll
tags: jekyll liquid
published: true
---


>本地jekyll环境搭好之后，现在要做的是如何去使用它，这篇文章将讲解如何去使用jekyll和一些模板语言的使用

## jekyll的使用方法 ##

首先，你可以右键Git Bash here,前提是你安装了Git。如果没安装也没关系，使用命令提示符也可。创建一个jekyll项目`jekyll new '目录'`这个目录可以是`相对路径`也可以是`绝对路径`。
如果'目录'里面还有其他的文件时，会提示创建失败，那么再加上--force,即`jekyll
new '目录' --force`强制创建
<!-- more -->
创建成功后你会发现目录下面有
{% highlight ruby %}
├── _config.yml
├── _includes
   ├── footer.html
   └── header.html
   ...
├── _layouts
   ├── default.html
   └── post.html
   ...
├── _posts
   └── 2016-03-01-welcome-to-jekyll.markdown
├── .gitignore
├── _config.yml
├── about.md
├── feed.xml
└── index.html
{% endhighlight %}
接着我们可以启动服务`jekyll serve`
你会发现项目根目录下面多了一个`_site`目录，这个目录是编译后生成的文件，编译主要有完成的工作有:

1. scss -> css
2. *.markdown -> html
3. xml(Liquid标签) -> xml (纯粹)

启动服务成功后他会提示你`Server address: http://127.0.0.1:4000/`。
在浏览器中地址栏中输入localhost:4000即可访问demo的首页

>

## Liquid标签 ##

### 1. assign - 赋值标签###  

{% raw %}
>  {% assign post_title = post.title %}  
{{ post_title }}  
{% assign post_title = 'birdshark' | upcase %}  
{{ post_title }}

{% endraw %}

### 2. capture - 解析代码块，将结果赋值给一个变量###  

这个标签跟ThinkPhP里边的fetch方法类似，解析标签后获取的模板内容

{% raw %}
>{% assign i = 1 %}  
{% capture attribute_name %}  
{{ post.title | handleize }}-{{ i }}-color  
{% endcapture %}  
{{ attribute_name }}

{% endraw %}

### 3. case - 开关标签###  

`switch case` 与 `case when`相比,后者不用break断开开关了  

{%raw%}
>{% case condition %}  
{% when 1 %}  
hit 1  
{% when 2 or 3 %}  
hit 2 or 3  
{% else %}  
... else ...  
{% endcase %}  

>{% assign template = 'yellowblue'%}  
{% case template %}  
{% when 'red' %}  
red  
{% when 'black' %}  
black  
{% else %}  
yellowblue  
{% endcase %}

{%endraw%}

### 4. comment - 注释标签###

{% raw %}
>We made 1 million dollars  
{% comment %}  
you can not see me in the html  
{% endcomment %}  
this year

{% endraw %}

### 5. cycle - 交替循环###

单组交替循环  

{% raw %}
>{%cycle 'you','me','him'%}  
{%cycle 'you','me','him'%}  
{%cycle 'you','me','him'%}

多组交替循环
>{% cycle '1' : 'you','me','him'%}  
{% cycle '1' : 'you','me','him'%}  
{% cycle '1' : 'you','me','him'%}  
{% cycle '2' : 'you','me','her'%}  
{% cycle '2' : 'you','me','her'%}  
{% cycle '2' : 'you','me','her'%}  

{% endraw %}

### 6. for - for循环###

{% raw %}
>{% for item in array %}  
{{ item }}
  
{%endfor%}

找了下，Liquid没有提供在此类模板中定义数组的方法，不过还有一个方法可行。那就是在根目录创建_data文件夹，支持`.yml`,`.yaml`,`.json`,'csv'4种文件格式。要用的时候呢`site.data.'filename'`,如果我在_data目录下面创建了一个letters.csv,那么site.data.letters就可获取到数组
csv内容如下:

>i,v  
0,a  
1,b  
2,c  
3,d  
4,e  
5,f  
6,g  


>{%for a in site.data.letters%}  
{{ a.i }}  
{%endfor%}  

{% endraw %}
### 7. break - 中断for循环###

{%raw%}
>{%for a in site.data.letters%}  
{%if a.i == '4' %}  
{%break%}  
{%endif%}  
{{a.i}}  
{%endfor%}  

{%endraw%}

### 8. continue 中断当前循环跳到下一次循环

{%raw%}
>{%for a in site.data.letters%}  
{%if a.i == '4' %}  
{%continue%}  
{%endif%}  
{{a.i}}  
{%endfor%}  

{%endraw%}


### 9. if - 条件判断###

操作符可以是 `>`,`<`,`=`,`!=`,`contains`,连接操作符 `and`,`or`

{%raw%}
>{%if condition%}  
{%elsif condition%}  
...  
{%else%}  
{%endif%}

{%endraw%}

### 10. include - 引入文件###

{%raw%}
>{%include xxx.html%}

{%endraw%}

### 11. raw - 暂时禁用标签处理.###  

以下代码需要用`{/ raw /} {/ endraw /}`包起来才不会被执行，当然为了能看到这端代码 ，我只得用`/`代替`%`了

{%raw%}
>{%for a in site.data.letters%}  
{%if a.i == '4' %}  
{%continue%}  
{%endif%}  
{{a.i}}  
{%endfor%}  

{%endraw%}

### 12. unless - if的镜像方法###

{%raw%}
>{%unless condition%}  
{%else%}  
something  
{%endunless%}
{%endraw%}

### 13. 标准过滤器 ###

`date` - 日期函数  
`capitalize` - 首字母大写  
`downcase` - 小写转化  
`upcase` - 大写转化  
`first` - 获取数组里的第一个元素  
`last` - 获取数组里的最后一个元素  
`join` - 将数组用字符连接成字符串  
`sort` - 数组排序   
`reverse` - 倒序  
`map` - 从数组中获取给定键的值  
`size` - 返回字符串长度或者数组长度  
`uniq` - 数组去重  
`escape` - html编码
`escape_once` - html编码不影响实体(ps: 跟上面的没啥区别) 
`url_encode` - url编码  
`strip` - 去空格  
`lstrip` - 只去头部的空格  
`rstrip` - 只去尾部的空格  
`strip_html` - 剔除html标签  
`strip_newlines` - 剔除文本换行  
`newline_to_br` - 将问本换行转化为html的换行  
`replace` - 替换所有指定字符串  
`replace_first` - 替换第一次出现的指定字符串   
`remove` - 移除所有指定的字符串  
`remove_first` - 移除第一次出现的指定的字符串  
`truncate` - 截取指定长度的字符串，并用指定字符代替他  
`prepend` - 在头部添加字符
`pluralize` - (ps:测过，不起作用，可能还需要安装[额外的库](https://github.com/bdesham/pluralize))  
`append` - 拼接字符    
`slice` - 字符串截取    
`split` - 用符号将字符分割    
`minus` - 减法    
`plus` - 加法    
`times` - 乘法    
`divided_by` - 除法    
`modulo` - 模运算    
`round` - 约数运算    
`floor` - 向下取整运算    
`ceil` - 向上取整    
`default` - 默认值  
以上标准过滤器用例皆可[在这里](http://docs.shopify.com/themes/liquid-documentation/filters/additional-filters#date)找到。
好了关于Liquid的部分就介绍到这里

>

## post页面定义 ##

### 头部参数###  

	`layout` 文章模板,对应_layouts文件夹下的同名文件  
	`title`  文章标题,对应`'yyyy-mm-dd-filename.markdown'`中的`filename`  
	`date`   文章创建时间。这个随便写，但是要理智  
	`categories`  文章分类  
	`tags`  文章标签，可以是多个值，中间以空格隔开  
	`published`  是否发布 `true` or `false`  
	`permalink` 相当于url的rewrite  
当然你也可定制一些其他的参数,只要你觉得合适  

### 内容赋值###  
	了解了那么多，那么当一个post被创建有哪些参数可以供给我们使用呢？  
	A. site  
site一般是定义在_config.yml里面的参数，像`site.title`，`site.username`等，但是还有些比较有用的,像`site.categories`代表所有的分类,`site.tags`代表所有的标签，`site.posts`代表所有的文章  
	B. page  
page这是页面级别的元素了，头部参数存放在page数组里面


### 摘录配置###  

一般来说，首页不会将文章的全部都放出来，而是取一部分出来，那怎么做到这样的效果呢，jekyll很人性化，不要你去写什么额外的函数只需要在`_config.yml`里添加一行
{% highlight ruby %}
{%raw%}
excerpt_separator: <!-- more -->
{%endraw%}
{% endhighlight %}
然后在post中适当的位置加上 `<!-- more -->`就可以获取文章的摘要了

### 分页配置###  

`_config.yml`中加入一下参数
{%highlight ruby%}
gems: [jekyll-paginate]
paginate: 5
paginate_path: "/blog/page/:num"
{% endhighlight %}
post中使用
{%highlight ruby%}
{%raw%}
<!-- This loops through the paginated posts -->
{% for post in paginator.posts %}
  <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
  <p class="author">
    <span class="date">{{ post.date }}</span>
  </p>
  <div class="content">
    {{ post.content }}
  </div>
{% endfor %}

<!-- Pagination links -->
<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path }}" class="previous">Previous</a>
  {% else %}
    <span class="previous">Previous</span>
  {% endif %}
  <span class="page_number ">Page: {{ paginator.page }} of {{ paginator.total_pages }}</span>
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path }}" class="next">Next</a>
  {% else %}
    <span class="next ">Next</span>
  {% endif %}
</div>
{%endraw%}
{% endhighlight %}

>

## 结语##  

此篇文章粗略的介绍了一下jekyll和liquid的用法，以及相关的参数，多少都是有些帮助吧，要想了解更多的知识还请移步以下参考链接。

>

参考链接  
[https://jekyllrb.com/](https://jekyllrb.com/)  
[https://github.com/Shopify/liquid/wiki/Liquid-for-Designers](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)  
[https://docs.shopify.com/themes/liquid/filters/additional-filters](https://docs.shopify.com/themes/liquid/filters/additional-filters)





