import TWEEN from '@tweenjs/tween.js';

const aosPrefixAnimation = (function(){

    function lowerCaseEventTypes(prefix) {
        prefix = prefix || '';

        return {
            fn: prefix.length?prefix.toLowerCase()+'Animation':'animation',
            start: prefix + 'animationstart',
            end: prefix + 'animationend',
            iteration: prefix + 'animationiteration'
        };
    }

    function camelCaseEventTypes(prefix) {
        prefix = prefix || '';

        return {
            fn: prefix.length?prefix.toLowerCase()+'Animation':'animation',
            start: prefix + 'AnimationStart',
            end: prefix + 'AnimationEnd',
            iteration: prefix + 'AnimationIteration'
        };
    }
    const prefixes = ['webkit', 'Moz', 'O', ''];
    let style = document.documentElement.style;

    if(style.animationName !== undefined)
        return lowerCaseEventTypes();

    for(let i = 0, len = prefixes.length, prefix; i < len; i++) {
        prefix = prefixes[i];

        if(style[prefix + 'AnimationName'] !== undefined) {
            if(i === 0) {
                return camelCaseEventTypes(prefix.toLowerCase());
            } else if(i === 1) {
                return lowerCaseEventTypes();
            } else if(i === 2) {
                return lowerCaseEventTypes(prefix.toLowerCase());
            }
        }
    }

    return {};
})();

export default {
    name :'on-scroll',
    render(h) {
        return h(this.tag, {class:'on-scroll'}, this.$slots.default);
    },
    props:{
        animation: { default: 'fade' },
        delay: { default: 0 },
        offset: { default: 100 },
        duration: { default: '0.5' },
        tag: { default: 'div' },
        invert: { default: false },
        center: { default: false },
        mobile: { default: 'active' }
    },
    data(){
        return{
            bounding: {},
            interval: false,
            current: false
        }
    },
    methods : {
        update(){
            let rect = this.$el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            this.bounding = { top: rect.top + scrollTop, left: rect.left + scrollLeft, height: rect.height, width: rect.width, bottom: rect.bottom + scrollTop}
        },
        listen(){
            document.addEventListener('resize', this.update);
            document.addEventListener('scroll', this.scroll);

            let vm = this;
            this.interval = setInterval(function(){
                vm.update();
                vm.scroll();
            }, 1000);
        },
        ignore(){
            clearInterval(this.interval);
            document.removeEventListener('scroll', this.scroll);
            document.removeEventListener('resize', this.update);
        },
        end(){

            if( this.delay )
                this.$el.style[aosPrefixAnimation.fn+'Delay'] = '';

            if( this.duration )
                this.$el.style[aosPrefixAnimation.fn+'Duration'] = '';

            this.$el.classList.remove('on-scroll-'+this.animation);
            this.$el.classList.remove('on-scroll');
        },
        parallax(){

            let offset = 0;

            if (window.pageYOffset + window.innerHeight > this.bounding.top && this.bounding.bottom > window.pageYOffset) {

                if (this.bounding.top < window.innerHeight) {
                    offset = window.pageYOffset / this.bounding.bottom;
                } else {
                    offset = (window.pageYOffset + window.innerHeight - this.bounding.top) / (this.bounding.bottom + window.innerHeight - this.bounding.top);
                }
            }
            else {

                offset = window.pageYOffset + window.innerHeight > this.bounding.top ? 1 : 0;
            }

            offset = this.invert ? 1 - offset : offset;
            offset = this.center ? offset - 0.5 : offset;

            if( this.current !== offset)
            {
                this.current = offset;
                this.$el.style.transform = 'translateY('+(Math.round(offset*this.offset*10)/10)+'px)';
            }
        },
        tween: function (startValue, endValue) {

            let vm = this;

            if( document.documentElement.lang === 'fr' )
                endValue = parseFloat( endValue.replace(' ', '').replace(/,/, '.') );
            else
                endValue = parseFloat( endValue.replace(' ', '').replace(/,/g, '') );

            let is_int = parseInt(endValue) === endValue;
            let unit_decimal = document.documentElement.lang==='fr'?',':'.';
            let unit_thousand = document.documentElement.lang==='fr'?'':'';

            function animate () {
                if (TWEEN.update())
                    requestAnimationFrame(animate)
            }

             function format(value) {
                 value = is_int ? Math.round(value) : (Math.round(value*1000)/1000);
                 let n = is_int ? 0 :1;
                 let re = '\\d(?=(\\d{' + (3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
                 value = value.toString().replace(new RegExp(re, 'g'), '$& ');

                 if( is_int )
                     return value.replace(/ /g, unit_thousand);
                 else
                     return value.replace('.', unit_decimal);
            }

            new TWEEN.Tween({ tweeningValue: startValue })
                .to({ tweeningValue: endValue }, 1000)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function (object) {
                    vm.$el.textContent = format(object.tweeningValue);
                })
                .onComplete(this.end)
                .start();

            animate();
        },
        scroll(){
            
            let pos = 0;

            if( typeof this.offset === 'string')
                pos = this.offset.indexOf('%') !==-1 ? window.pageYOffset + window.innerHeight*parseInt(this.offset)/100 : window.pageYOffset + window.innerHeight;
            else if( this.animation === 'parallax')
                pos = window.pageYOffset + window.innerHeight;
            else
                pos = window.pageYOffset + window.innerHeight - this.offset;

            if ( this.bounding.top < pos ) {

                if( this.animation === 'increment')
                {
                    this.ignore();

                    let vm = this;
                    let delay = this.delay<10?this.delay*1000:this.delay;
                    setTimeout(function(){ vm.tween(0, vm.$el.textContent) }, delay);
                }
                else if( this.animation === 'parallax')
                {
                    this.parallax();
                }
                else
                {
                    this.ignore();

                    if( this.delay )
                        this.$el.style[aosPrefixAnimation.fn+'Delay'] = this.delay+(this.delay<10?'s':'ms');

                    if( this.duration )
                        this.$el.style[aosPrefixAnimation.fn+'Duration'] = this.duration+(this.duration<10?'s':'ms');

                    this.$el.addEventListener(aosPrefixAnimation.end, this.end, false);
                }

                this.$el.classList.remove('on-scroll-wait');
                this.$el.classList.add('on-scroll-'+this.animation);
            }
        }
    },
    mounted() {
	      if( this.mobile !== "disabled" || window.innerWidth > 640  ) {
		      this.$el.classList.add('on-scroll-wait');
		      this.listen();
		      this.update();
		      this.scroll();
	      }
    },
    destroyed() {

        this.ignore();
    }
};