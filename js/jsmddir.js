/**
 * Created by bird on 2016-3-4.
 */

(function($,win){
    $.bird = {}||null;
    $.bird.directory = {
        setting :{
            li : '<li><a href="#__ID__">__TEXT__</a></li>'
        },
        make:function(){
            this.find($('.post'));
        },
        find:function(html){
            $h1 = html.find('h2,h3,h4');
            $length = $h1.length;
            $targetLevel = 2;
            $sub = $("#abcd");
            $h1.each(function(index, domEle){
                var $_li = null;
                if($length <=1){
                    return ;
                }
                $hn = $(domEle).parent('.post-content');
                if($hn.length){
                    $text = $(domEle).text();
                    $id = $(domEle).attr('id');
                    $name = domEle.tagName;
                    $_tl = parseInt($name.slice(1));
                    $li = $.bird.directory.template($.bird.directory.setting.li,/__([A-Z]+)__/g,function(word){
                        $aa = word.toLowerCase().replace(/__/g,"");
                        return  eval('$' + $aa);
                    });
                    if($targetLevel == $_tl ){
                        $sub.append($li);
                    }
                    else if($_tl > $targetLevel){
                        $sul = new $('<ul></ul>');
                        $_li = $sul.append($li);
                        $sub.append($_li);
                        $sub = $_li;
                    }
                    else if($_tl < $targetLevel){
                        if($_tl == 2){
                            $("#abcd").append($li);
                            $sub = $("#abcd");
                        }else{
                            $sub.parent('ul').append($li);
                            $sub = $sub.parent('ul');
                        }
                    }
                    $targetLevel = $_tl;
                }
            });
        },
        template:function(temp,flag,value){
            return temp.replace(flag,value);
        }
    }
    $.bird.directory.make();
})(jQuery,window);

$(window).scroll(function () {
    $(window).scrollTop() > 50 ? $('.scroll').show():$('.scroll').hide();
});