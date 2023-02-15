jQuery(document).ready(function($){
	//open/close mega-navigation
	$('.cd-dropdown-trigger').on('click', function(event){
		event.preventDefault();
		toggleNav();
	});

	//close meganavigation
	$('.cd-dropdown .cd-close').on('click', function(event){
		event.preventDefault();
		toggleNav();
	});

	//on mobile - open submenu
	$('.has-children').children('a').on('click', function(event){
		//prevent default clicking on direct children of .has-children
		event.preventDefault();
		var selected = $(this);
		selected.next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('move-out');
	});

	//on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
	var submenuDirection = ( !$('.cd-dropdown-wrapper').hasClass('open-to-left') ) ? 'right' : 'left';
	$('.cd-dropdown-content').menuAim({
        activate: function(row) {
        	$(row).children().addClass('is-active').removeClass('fade-out');
        	if( $('.cd-dropdown-content .fade-in').length == 0 ) $(row).children('ul').addClass('fade-in');
        },
        deactivate: function(row) {
        	$(row).children().removeClass('is-active');
        	if( $('li.has-children:hover').length == 0 || $('li.has-children:hover').is($(row)) ) {
        		$('.cd-dropdown-content').find('.fade-in').removeClass('fade-in');
        		$(row).children('ul').addClass('fade-out')
        	}
        },
        exitMenu: function() {
        	$('.cd-dropdown-content').find('.is-active').removeClass('is-active');
        	return true;
        },
        submenuDirection: submenuDirection,
    });

	//submenu items - go back link
	$('.go-back').on('click', function(){
		var selected = $(this),
			visibleNav = $(this).parent('ul').parent('.has-children').parent('ul');
		selected.parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('move-out');
	});

	function toggleNav(){
		var navIsVisible = ( !$('.cd-dropdown').hasClass('dropdown-is-active') ) ? true : false;
		$('.cd-dropdown').toggleClass('dropdown-is-active', navIsVisible);
		$('.cd-dropdown-trigger').toggleClass('dropdown-is-active', navIsVisible);
		if( !navIsVisible ) {
			$('.cd-dropdown').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('.has-children ul').addClass('is-hidden');
				$('.move-out').removeClass('move-out');
				$('.is-active').removeClass('is-active');
			});
		}
	}

	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	// if(!Modernizr.input.placeholder){
	// 	$('[placeholder]').focus(function() {
	// 		var input = $(this);
	// 		if (input.val() == input.attr('placeholder')) {
	// 			input.val('');
	// 	  	}
	// 	}).blur(function() {
	// 	 	var input = $(this);
	// 	  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
	// 			input.val(input.attr('placeholder'));
	// 	  	}
	// 	}).blur();
	// 	$('[placeholder]').parents('form').submit(function() {
	// 	  	$(this).find('[placeholder]').each(function() {
	// 			var input = $(this);
	// 			if (input.val() == input.attr('placeholder')) {
	// 		 		input.val('');
	// 			}
	// 	  	})
	// 	});
	// }

    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.navbar-default').outerHeight();
    $(window).scroll(function(event) {
        didScroll = true;
    });
    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 150);

    function hasScrolled() {
        var st = $(this).scrollTop();
        if (Math.abs(lastScrollTop - st) <= delta) return;
        if (st > lastScrollTop && st > navbarHeight) {
			$('.navbar-default').removeClass('nav-down').addClass('nav-up');
			$('#nav-icon1').removeClass('nav-down').addClass('nav-up');
        } else {
            if (st + $(window).height() < $(document).height()) {
				$('.navbar-default').removeClass('nav-up').addClass('nav-down');
				$('#nav-icon1').removeClass('nav-up').addClass('nav-down');
            }
        }
        lastScrollTop = st;
	}

	$(document).on('click','.filtermobilebtn',function(){
		$('.filterslides').slideToggle();
		$(this).toggleClass('active');
	})
		$(document).on('click','#nav-icon1',function(){
        $('.menuviewwrap').show();
        $(this).toggleClass('open');
		$('.menuviewwrap').css({'width':'100%','visibility':'visible'});
		if($('.menuviewwrap').css('display')=='block'){
        	$('html').toggleClass('sidePanel');
		}
    });
		$(document).on('click','.accordion',function(){
		var nextul = $(this).parents('li').find('.servicemenuwrap');
		if(nextul.css('display')=='none'){
			$('.servicemenuwrap').slideUp();
			nextul.slideDown();
			$('li').removeClass('active');
			$(this).parents('li').addClass('active');
		}
		else{
			nextul.slideUp();
			$('li').removeClass('active');
		}
	});

		$(document).on('click','.header_wrap .navbar-default .dummy_contant_wrap .fa',function(){
			$('html').addClass('closetopstrip');
		})

		$(window).scroll(function(){
			sticky_relocate();
		});
});

function sticky_relocate() {
	var window_top = $(window).scrollTop();
	var div_top = $('#sticky-anchor').scrollTop();
	if (window_top > div_top) {
	  $('html').addClass('stick');
	} else {
	  $('html').removeClass('stick');
	}
  }

  //Menu Javascript
  !function(e){e.fn.menuAim=function(t){return this.each(function(){(function(t){var n=e(this),i=null,o=[],u=null,r=null,c=e.extend({rowSelector:"> li",submenuSelector:"*",submenuDirection:"right",tolerance:75,enter:e.noop,exit:e.noop,activate:e.noop,deactivate:e.noop,exitMenu:e.noop},t),l=function(e){e!=i&&(i&&c.deactivate(i),c.activate(e),i=e)},f=function(e){var t=a();t?r=setTimeout(function(){f(e)},t):l(e)},a=function(){if(!i||!e(i).is(c.submenuSelector))return 0;var t=n.offset(),r={x:t.left,y:t.top-c.tolerance},l={x:t.left+n.outerWidth(),y:r.y},f={x:t.left,y:t.top+n.outerHeight()+c.tolerance},a={x:t.left+n.outerWidth(),y:f.y},s=o[o.length-1],h=o[0];if(!s)return 0;if(h||(h=s),h.x<t.left||h.x>a.x||h.y<t.top||h.y>a.y)return 0;if(u&&s.x==u.x&&s.y==u.y)return 0;function m(e,t){return(t.y-e.y)/(t.x-e.x)}var x=l,y=a;"left"==c.submenuDirection?(x=f,y=r):"below"==c.submenuDirection?(x=a,y=f):"above"==c.submenuDirection&&(x=r,y=l);var v=m(s,x),p=m(s,y),b=m(h,x),d=m(h,y);return v<b&&p>d?(u=s,300):(u=null,0)};n.mouseleave(function(){r&&clearTimeout(r);c.exitMenu(this)&&(i&&c.deactivate(i),i=null)}).find(c.rowSelector).mouseenter(function(){r&&clearTimeout(r);c.enter(this),f(this)}).mouseleave(function(){c.exit(this)}).click(function(){l(this)}),e(document).mousemove(function(e){o.push({x:e.pageX,y:e.pageY}),o.length>3&&o.shift()})}).call(this,t)}),this}}(jQuery);

  //xzoom javascript
  function detect_old_ie(){if(!/MSIE (\d+\.\d+);/.test(navigator.userAgent))return!1;var o=new Number(RegExp.$1);return!(o>=9)&&(o>=8||(o>=7||(o>=6||(o>=5||void 0))))}window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(o){window.setTimeout(o,20)},function(o){function t(t,e){this.xzoom=!0;var i,s,n,a,p,l,r,d,c,h,f,u,v,m,g,w,x,b,z,y,C,k,O,M,A,S,H,W,F,I,T,X,Y,R,q,E,L,D,Z,_,j,N,Q,$,B,G,J,K,P,U,V,oo=this,to={},eo=(new Array,new Array),io=0,so=0,no=0,ao=0,po=0,lo=0,ro=0,co=0,ho=0,fo=0,uo=0,vo=0,mo=0,go=detect_old_ie(),wo=/MSIE (\d+\.\d+);/.test(navigator.userAgent),xo="";function bo(){var o=document.documentElement;return{left:(window.pageXOffset||o.scrollLeft)-(o.clientLeft||0),top:(window.pageYOffset||o.scrollTop)-(o.clientTop||0)}}function zo(){if("circle"==oo.options.lensShape&&"lens"==oo.options.position){var o=((A=S=Math.max(A,S))+2*Math.max(I,F))/2;O.css({"-moz-border-radius":o,"-webkit-border-radius":o,"border-radius":o})}}function yo(o,t,e,i){"lens"==oo.options.position?(k.css({top:-(t-r)*X+S/2,left:-(o-d)*T+A/2}),oo.options.bg&&(O.css({"background-image":"url("+k.attr("src")+")","background-repeat":"no-repeat","background-position":-(o-d)*T+A/2+"px "+(-(t-r)*X+S/2)+"px"}),e&&i&&O.css({"background-size":e+"px "+i+"px"}))):k.css({top:-W*X,left:-H*T})}function Co(o,t){var e,i;no<-1&&(no=-1),no>1&&(no=1),Y<R?i=(e=a*(Y-(Y-1)*no))/q:e=(i=p*(R-(R-1)*no))*q,D?(ao=o,po=t,lo=e,ro=i):(D||(co=lo=e,ho=ro=i),A=a/(T=e/s),S=p/(X=i/n),zo(),Oo(o,t),k.width(e),k.height(i),O.width(A),O.height(S),O.css({top:W-I,left:H-F}),M.css({top:-W,left:-H}),yo(o,t,e,i))}function ko(){var o=fo,t=uo,e=vo,i=mo,l=co,r=ho;o+=(ao-o)/oo.options.smoothLensMove,t+=(po-t)/oo.options.smoothLensMove,e+=(ao-e)/oo.options.smoothZoomMove,i+=(po-i)/oo.options.smoothZoomMove,l+=(lo-l)/oo.options.smoothScale,r+=(ro-r)/oo.options.smoothScale,A=a/(T=l/s),S=p/(X=r/n),zo(),Oo(o,t),k.width(l),k.height(r),O.width(A),O.height(S),O.css({top:W-I,left:H-F}),M.css({top:-W,left:-H}),Oo(e,i),yo(o,t,l,r),fo=o,uo=t,vo=e,mo=i,co=l,ho=r,D&&requestAnimFrame(ko)}function Oo(o,t){H=(o-=d)-A/2,W=(t-=r)-S/2,"lens"!=oo.options.position&&oo.options.lensCollision&&(H<0&&(H=0),s>=A&&H>s-A&&(H=s-A),s<A&&(H=s/2-A/2),W<0&&(W=0),n>=S&&W>n-S&&(W=n-S),n<S&&(W=n/2-S/2))}function Mo(){void 0!==g&&g.remove(),void 0!==x&&x.remove(),void 0!==Q&&Q.remove()}function Ao(o){var t=o.attr("title"),e=o.attr("xtitle");return e||(t||"")}this.adaptive=function(){0!=G&&0!=J||(t.css("width",""),t.css("height",""),G=t.width(),J=t.height()),Mo(),$=o(window).width(),B=o(window).height(),K=t.width(),P=t.height();var e=!1;(G>$||J>B)&&(e=!0),K>G&&(K=G),P>J&&(P=J),e?t.width("100%"):0!=G&&t.width(G),"fullscreen"!=U&&(!function(){var e=t.offset();a="auto"==oo.options.zoomWidth?K:oo.options.zoomWidth;p="auto"==oo.options.zoomHeight?P:oo.options.zoomHeight;"#"==oo.options.position.substr(0,1)?to=o(oo.options.position):to.length=0;if(0!=to.length)return!0;switch(U){case"lens":case"inside":return!0;case"top":r=e.top,d=e.left,c=r-p,h=d;break;case"left":r=e.top,d=e.left,c=r,h=d-a;break;case"bottom":r=e.top,d=e.left,c=r+P,h=d;break;case"right":default:r=e.top,d=e.left,c=r,h=d+K}if(h+a>$||h<0)return!1;return!0}()?oo.options.position=oo.options.mposition:oo.options.position=U),oo.options.lensReverse||(V=oo.options.adaptiveReverse&&oo.options.position==oo.options.mposition)},this.xscroll=function(o){if(v=o.pageX||o.originalEvent.pageX,m=o.pageY||o.originalEvent.pageY,o.preventDefault(),o.xscale)no=o.xscale,Co(v,m);else{var t=-o.originalEvent.detail||o.originalEvent.wheelDelta||o.xdelta,e=v,i=m;go&&(e=Z,i=_),no+=t=t>0?-.05:.05,Co(e,i)}},this.openzoom=function(e){switch(v=e.pageX,m=e.pageY,oo.options.adaptive&&oo.adaptive(),no=oo.options.defaultScale,D=!1,g=o("<div></div>"),""!=oo.options.sourceClass&&g.addClass(oo.options.sourceClass),g.css("position","absolute"),b=o("<div></div>"),""!=oo.options.loadingClass&&b.addClass(oo.options.loadingClass),b.css("position","absolute"),w=o('<div style="position: absolute; top: 0; left: 0;"></div>'),g.append(b),x=o("<div></div>"),""!=oo.options.zoomClass&&"fullscreen"!=oo.options.position&&x.addClass(oo.options.zoomClass),x.css({position:"absolute",overflow:"hidden",opacity:1}),oo.options.title&&""!=xo&&(Q=o("<div></div>"),N=o("<div></div>"),Q.css({position:"absolute",opacity:1}),oo.options.titleClass&&N.addClass(oo.options.titleClass),N.html("<span>"+xo+"</span>"),Q.append(N),oo.options.fadeIn&&Q.css({opacity:0})),O=o("<div></div>"),""!=oo.options.lensClass&&O.addClass(oo.options.lensClass),O.css({position:"absolute",overflow:"hidden"}),oo.options.lens&&(lenstint=o("<div></div>"),lenstint.css({position:"absolute",background:oo.options.lens,opacity:oo.options.lensOpacity,width:"100%",height:"100%",top:0,left:0,"z-index":9999}),O.append(lenstint)),function(e,v){switch("fullscreen"==oo.options.position?(s=o(window).width(),n=o(window).height()):(s=t.width(),n=t.height()),b.css({top:n/2-b.height()/2,left:s/2-b.width()/2}),(l=oo.options.rootOutput||"fullscreen"==oo.options.position?t.offset():t.position()).top=Math.round(l.top),l.left=Math.round(l.left),oo.options.position){case"fullscreen":r=bo().top,d=bo().left,c=0,h=0;break;case"inside":r=l.top,d=l.left,c=0,h=0;break;case"top":r=l.top,d=l.left,c=r-p,h=d;break;case"left":r=l.top,d=l.left,c=r,h=d-a;break;case"bottom":r=l.top,d=l.left,c=r+n,h=d;break;case"right":default:r=l.top,d=l.left,c=r,h=d+s}r-=g.outerHeight()/2,d-=g.outerWidth()/2,"#"==oo.options.position.substr(0,1)?to=o(oo.options.position):to.length=0,0==to.length&&"inside"!=oo.options.position&&"fullscreen"!=oo.options.position?(oo.options.adaptive&&G&&J||(G=s,J=n),a="auto"==oo.options.zoomWidth?s:oo.options.zoomWidth,p="auto"==oo.options.zoomHeight?n:oo.options.zoomHeight,c+=oo.options.Yoffset,h+=oo.options.Xoffset,x.css({width:a+"px",height:p+"px",top:c,left:h}),"lens"!=oo.options.position&&i.append(x)):"inside"==oo.options.position||"fullscreen"==oo.options.position?(a=s,p=n,x.css({width:a+"px",height:p+"px"}),g.append(x)):(a=to.width(),p=to.height(),oo.options.rootOutput?(c=to.offset().top,h=to.offset().left,i.append(x)):(c=to.position().top,h=to.position().left,to.parent().append(x)),c+=(to.outerHeight()-p-x.outerHeight())/2,h+=(to.outerWidth()-a-x.outerWidth())/2,x.css({width:a+"px",height:p+"px",top:c,left:h})),oo.options.title&&""!=xo&&("inside"==oo.options.position||"lens"==oo.options.position||"fullscreen"==oo.options.position?(f=c,u=h,g.append(Q)):(f=c+(x.outerHeight()-p)/2,u=h+(x.outerWidth()-a)/2,i.append(Q)),Q.css({width:a+"px",height:p+"px",top:f,left:u})),g.css({width:s+"px",height:n+"px",top:r,left:d}),w.css({width:s+"px",height:n+"px"}),oo.options.tint&&"inside"!=oo.options.position&&"fullscreen"!=oo.options.position?w.css("background-color",oo.options.tint):go&&w.css({"background-image":"url("+t.attr("src")+")","background-color":"#fff"}),C=new Image;var m="";switch(wo&&(m="?r="+(new Date).getTime()),C.src=t.attr("xoriginal")+m,(k=o(C)).css("position","absolute"),(C=new Image).src=t.attr("src"),(M=o(C)).css("position","absolute"),M.width(s),oo.options.position){case"fullscreen":case"inside":x.append(k);break;case"lens":O.append(k),oo.options.bg&&k.css({display:"none"});break;default:x.append(k),O.append(M)}}(),"inside"!=oo.options.position&&"fullscreen"!=oo.options.position?((oo.options.tint||go)&&g.append(w),oo.options.fadeIn&&(w.css({opacity:0}),O.css({opacity:0}),x.css({opacity:0})),i.append(g)):(oo.options.fadeIn&&x.css({opacity:0}),i.append(g)),oo.eventmove(g),oo.eventleave(g),oo.options.position){case"inside":c-=(x.outerHeight()-x.height())/2,h-=(x.outerWidth()-x.width())/2;break;case"top":c-=x.outerHeight()-x.height(),h-=(x.outerWidth()-x.width())/2;break;case"left":c-=(x.outerHeight()-x.height())/2,h-=x.outerWidth()-x.width();break;case"bottom":h-=(x.outerWidth()-x.width())/2;break;case"right":c-=(x.outerHeight()-x.height())/2}x.css({top:c,left:h}),k.xon("load",function(o){if(b.remove(),!oo.options.openOnSmall&&(E<a||L<p))return oo.closezoom(),o.preventDefault(),!1;oo.options.scroll&&oo.eventscroll(g),"inside"!=oo.options.position&&"fullscreen"!=oo.options.position?(g.append(O),oo.options.fadeIn?(w.fadeTo(300,oo.options.tintOpacity),O.fadeTo(300,1),x.fadeTo(300,1)):(w.css({opacity:oo.options.tintOpacity}),O.css({opacity:1}),x.css({opacity:1}))):oo.options.fadeIn?x.fadeTo(300,1):x.css({opacity:1}),oo.options.title&&""!=xo&&(oo.options.fadeIn?Q.fadeTo(300,1):Q.css({opacity:1})),E=k.width(),L=k.height(),oo.options.adaptive&&(s<G||n<J)&&(M.width(s),M.height(n),E*=s/G,L*=n/J,k.width(E),k.height(L)),co=lo=E,ho=ro=L,q=E/L,Y=E/a,R=L/p;var t,e=["padding-","border-"];I=F=0;for(var i=0;i<e.length;i++)t=parseFloat(O.css(e[i]+"top-width")),I+=t!=t?0:t,t=parseFloat(O.css(e[i]+"bottom-width")),I+=t!=t?0:t,t=parseFloat(O.css(e[i]+"left-width")),F+=t!=t?0:t,t=parseFloat(O.css(e[i]+"right-width")),F+=t!=t?0:t;I/=2,F/=2,vo=fo=ao=v,mo=uo=po=m,Co(v,m),oo.options.smooth&&(D=!0,requestAnimFrame(ko)),oo.eventclick(g)})},this.movezoom=function(o){v=o.pageX,m=o.pageY,go&&(Z=v,_=m);var t=v-d,e=m-r;V&&(o.pageX-=2*(t-s/2),o.pageY-=2*(e-n/2)),(t<0||t>s||e<0||e>n)&&g.trigger("mouseleave"),oo.options.smooth?(ao=o.pageX,po=o.pageY):(zo(),Oo(o.pageX,o.pageY),O.css({top:W-I,left:H-F}),M.css({top:-W,left:-H}),yo(o.pageX,o.pageY,0,0))},this.eventdefault=function(){oo.eventopen=function(o){o.xon("mouseenter",oo.openzoom)},oo.eventleave=function(o){o.xon("mouseleave",oo.closezoom)},oo.eventmove=function(o){o.xon("mousemove",oo.movezoom)},oo.eventscroll=function(o){o.xon("mousewheel DOMMouseScroll",oo.xscroll)},oo.eventclick=function(o){o.xon("click",function(o){t.trigger("click")})}},this.eventunbind=function(){t.xoff("mouseenter"),oo.eventopen=function(o){},oo.eventleave=function(o){},oo.eventmove=function(o){},oo.eventscroll=function(o){},oo.eventclick=function(o){}},this.init=function(e){oo.options=o.extend({},o.fn.xzoom.defaults,e),i=oo.options.rootOutput?o("body"):t.parent(),U=oo.options.position,V=oo.options.lensReverse&&"inside"==oo.options.position,oo.options.smoothZoomMove<1&&(oo.options.smoothZoomMove=1),oo.options.smoothLensMove<1&&(oo.options.smoothLensMove=1),oo.options.smoothScale<1&&(oo.options.smoothScale=1),oo.options.adaptive&&o(window).xon("load",function(){G=t.width(),J=t.height(),oo.adaptive(),o(window).resize(oo.adaptive)}),oo.eventdefault(),oo.eventopen(t)},this.destroy=function(){oo.eventunbind()},this.closezoom=function(){D=!1,oo.options.fadeOut?(oo.options.title&&""!=xo&&Q.fadeOut(299),"inside"!=oo.options.position||"fullscreen"!=oo.options.position?(x.fadeOut(299),g.fadeOut(300,function(){Mo()})):g.fadeOut(300,function(){Mo()})):Mo()},this.gallery=function(){var o,t=new Array,e=0;for(o=so;o<eo.length;o++)t[e]=eo[o],e++;for(o=0;o<so;o++)t[e]=eo[o],e++;return{index:so,ogallery:eo,cgallery:t}},this.xappend=function(e){var i=e.parent();function s(s){Mo(),s.preventDefault(),oo.options.activeClass&&(j.removeClass(oo.options.activeClass),(j=e).addClass(oo.options.activeClass)),so=o(this).data("xindex"),oo.options.fadeTrans&&((y=new Image).src=t.attr("src"),(z=o(y)).css({position:"absolute",top:t.offset().top,left:t.offset().left,width:t.width(),height:t.height()}),o(document.body).append(z),z.fadeOut(200,function(){z.remove()}));var n=i.attr("href"),a=e.attr("xpreview")||e.attr("src");xo=Ao(e),e.attr("title")&&t.attr("title",e.attr("title")),t.attr("xoriginal",n),t.removeAttr("style"),t.attr("src",a),oo.options.adaptive&&(G=t.width(),J=t.height())}eo[io]=i.attr("href"),i.data("xindex",io),0==io&&oo.options.activeClass&&(j=e).addClass(oo.options.activeClass),0==io&&oo.options.title&&(xo=Ao(e)),io++,oo.options.hover&&i.xon("mouseenter",i,s),i.xon("click",i,s)},this.init(e)}o.fn.xon=o.fn.on||o.fn.bind,o.fn.xoff=o.fn.off||o.fn.bind,o.fn.xzoom=function(e){var i,s;if(this.selector){var n=this.selector.split(",");for(var a in n)n[a]=o.trim(n[a]);this.each(function(a){if(1==n.length)if(0==a){if(void 0!==(i=o(this)).data("xzoom"))return i.data("xzoom");i.x=new t(i,e)}else void 0!==i.x&&(s=o(this),i.x.xappend(s));else if(o(this).is(n[0])&&0==a){if(void 0!==(i=o(this)).data("xzoom"))return i.data("xzoom");i.x=new t(i,e)}else void 0===i.x||o(this).is(n[0])||(s=o(this),i.x.xappend(s))})}else this.each(function(n){if(0==n){if(void 0!==(i=o(this)).data("xzoom"))return i.data("xzoom");i.x=new t(i,e)}else void 0!==i.x&&(s=o(this),i.x.xappend(s))});return void 0!==i&&(i.data("xzoom",i.x),o(i).trigger("xzoom_ready"),i.x)},o.fn.xzoom.defaults={position:"right",mposition:"inside",rootOutput:!0,Xoffset:0,Yoffset:0,fadeIn:!0,fadeTrans:!0,fadeOut:!1,smooth:!0,smoothZoomMove:3,smoothLensMove:1,smoothScale:6,defaultScale:0,scroll:!0,tint:!1,tintOpacity:.5,lens:!1,lensOpacity:.5,lensShape:"box",lensCollision:!0,lensReverse:!1,openOnSmall:!0,zoomWidth:"auto",zoomHeight:"auto",sourceClass:"xzoom-source",loadingClass:"xzoom-loading",lensClass:"xzoom-lens",zoomClass:"xzoom-preview",activeClass:"xactive",hover:!1,adaptive:!0,adaptiveReverse:!1,title:!1,titleClass:"xzoom-caption",bg:!1}}(jQuery);
