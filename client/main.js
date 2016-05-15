import angular from 'angular';

import { Meteor } from 'meteor/meteor';

import { name as Socially } from '../imports/ui/components/socially/socially';

function onReady() {
  angular.bootstrap(document, [
    Socially
  ], {
    strictDi: true
  });

  var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
  (function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/5731a99b3b1e550b03d09a21/default';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
  })();


  (function($) {

        // jQuery marquee
        $.fn.textWidth = function(){
             var calc = '<span style="display:none">' + $(this).text() + '</span>';
             $('body').append(calc);
             var width = $('body').find('span:last').width();
             $('body').find('span:last').remove();
            return width;
        };

        $.fn.marquee = function(args) {
            var that = $(this);
            var textWidth = that.textWidth(),
                offset = that.width(),
                width = offset,
                css = {
                    'text-indent' : that.css('text-indent'),
                    'overflow' : that.css('overflow'),
                    'white-space' : that.css('white-space')
                },
                marqueeCss = {
                    'text-indent' : width,
                    'overflow' : 'hidden',
                    'white-space' : 'nowrap'
                },
                args = $.extend(true, { count: -1, speed: 1e1, leftToRight: false }, args),
                i = 0,
                stop = textWidth*-1,
                dfd = $.Deferred();

            function go() {
                if(that.css('overflow')!="hidden") {
                    that.css('text-indent', width + 'px');
                    return false;
                }
                if(!that.length) return dfd.reject();
                if(width == stop) {
                    i++;
                    if(i == args.count) {
                        that.css(css);
                        return dfd.resolve();
                    }
                    if(args.leftToRight) {
                        width = textWidth*-1;
                    } else {
                        width = offset;
                    }
                }
                that.css('text-indent', width + 'px');
                if(args.leftToRight) {
                    width++;
                } else {
                    width--;
                }
                setTimeout(go, args.speed);
            };

            if(args.leftToRight) {
                width = textWidth*-1;
                width++;
                stop = offset;
            } else {
                width--;
            }
            that.css(marqueeCss);
            go();
            return dfd.promise();
        };  //end Jquery marquee

    $(".mqtext").marquee();
    //   $(".mqtext").mouseover(function () {
    //       $(this).removeAttr("style");
    //  }).mouseout(function () {
    //       $(this).marquee();
    //  });

 })(jQuery);




}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
