import TWEEN from '@tweenjs/tween.js';

let supportsPassive = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true;
        }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
} catch (e) {}

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
    var style = document.documentElement.style;

    if(style.animationName !== undefined)
        return lowerCaseEventTypes();

    for(var i = 0, len = prefixes.length, prefix; i < len; i++) {
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

function AOSInterface($el, props){

    var data = {
            bounding: {},
            interval: false,
        timeout: false,
            current: false,
        shown: false,
        strengthPercent : String(props.strength).indexOf('%') !==-1,
        offsetPercent : String(props.offset).indexOf('%') !==-1
    };

    data.strength = parseInt(String(props.strength).replace('%',''));
    data.offset = parseInt(String(props.offset).replace('%',''));
    data.delay = parseFloat(String(props.delay).replace('ms','').replace('s',''));
    data.duration = parseFloat(String(props.duration).replace('ms','').replace('s',''));

    var methods = {
        mounted: function() {
            if(
                (props.phone !== "disabled" && window.innerWidth <= 640) ||
                (props.tablet !== "disabled" && window.innerWidth <= 768 && window.innerWidth > 640) ||
                (props.small !== "disabled" && window.innerWidth <= 1024 && window.innerWidth > 768) ||
                (window.innerWidth > 1024)
            ) {
                $el.classList.add('on-scroll--wait');
                methods.listen();
            }
            else{
                $el.classList.remove('on-scroll');
        }
    },
        update: function(){
            var rect = $el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            data.bounding = { top: rect.top + scrollTop, left: rect.left + scrollLeft, height: rect.height, width: rect.width, bottom: rect.bottom + scrollTop};

            methods.scroll();
        },
        listen: function(){
            document.addEventListener('resize', methods.update);
            document.addEventListener('scroll', methods.update, supportsPassive?{passive:true}:false );
            methods.update();
        },
        destroyed: function(){
            clearInterval(data.interval);
            document.removeEventListener('scroll', methods.update);
            document.removeEventListener('resize', methods.update);
        },
        end: function(){

            if( data.delay )
                $el.style[aosPrefixAnimation.fn+'Delay'] = '';

            if( data.duration )
                $el.style[aosPrefixAnimation.fn+'Duration'] = '';

            $el.classList.remove('on-scroll--'+props.animation);
            $el.classList.remove('on-scroll');
        },
        parallax: function(pos){

            var offset = 0;

            if (pos > data.bounding.top && data.bounding.bottom > window.pageYOffset) {

                if (data.bounding.top < window.innerHeight) {
                    offset = window.pageYOffset / data.bounding.bottom;
                } else {
                    offset = (pos - data.bounding.top) / (data.bounding.bottom + window.innerHeight - data.bounding.top);
                }
            }
            else {

                offset = pos > data.bounding.top ? 1 : 0;
            }

            offset = Math.max(0, Math.min(1, offset));
            offset = props.invert ? 1 - offset : offset;
            offset = props.center ? offset - 0.5 : offset;

            if( data.current !== offset)
            {
                data.current = offset;

                let value = data.strengthPercent ? Math.round(offset*data.strength*1000)/1000 : Math.round(offset*data.strength*10)/10;
                let strength = data.strengthPercent ? value+'%' : value+'px';

                $el.style.transform = 'translateY('+strength+')';
                $el.style.WebkitTransform = 'translateY('+strength+')';

                if( !data.strengthPercent ){
                    clearTimeout(data.timeout);
                    data.timeout = setTimeout(function(){
                        value = Math.round(value);
                        strength = data.strengthPercent ? value+'%' : value+'px';
                        $el.style.transform = 'translateY('+strength+')';
                        $el.style.WebkitTransform = 'translateY('+strength+')';
                    },100);
                }
            }
        },
        tween: function (startValue, endValue) {

            if( document.documentElement.lang === 'fr' )
                endValue = parseFloat( endValue.replace(' ', '').replace(/,/, '.') );
            else
                endValue = parseFloat( endValue.replace(' ', '').replace(/,/g, '') );

            var is_int = parseInt(endValue) === endValue;
            var unit_decimal = document.documentElement.lang==='fr'?',':'.';
            var unit_thousand = document.documentElement.lang==='fr'?' ':',';

            function animate () {
                if (TWEEN.update())
                    requestAnimationFrame(animate)
            }

             function format(value) {
                 value = is_int ? Math.round(value) : (Math.round(value*1000)/1000);
                 var n = is_int ? 0 :1;
                 var re = '\\d(?=(\\d{' + (3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
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
                    $el.textContent = format(object.tweeningValue);
                })
                .onComplete(methods.end)
                .start();

            animate();
        },
        scroll: function(){
            
            var pos = 0;

            if( props.animation === 'parallax')
                pos = window.pageYOffset + window.innerHeight;
            else if( data.offsetPercent )
                pos = window.pageYOffset + window.innerHeight*data.offset/100;
            else
                pos = window.pageYOffset + window.innerHeight - data.offset;

            if ( (data.bounding.top <= pos && !data.shown) || props.animation === 'parallax') {

                if( props.animation === 'increment') {
                    var delay = data.delay<10?data.delay*1000:data.delay;
                    setTimeout(function(){ methods.tween(0, $el.textContent) }, delay);
                }
                else if( props.animation === 'parallax') {
                    methods.parallax(pos);
                }
                else {

                    if (data.delay)
                        $el.style[aosPrefixAnimation.fn + 'Delay'] = data.delay + (data.delay < 10 ? 's' : 'ms');

                    if (data.duration)
                        $el.style[aosPrefixAnimation.fn + 'Duration'] = data.duration + (data.duration < 10 ? 's' : 'ms');

                    $el.addEventListener(aosPrefixAnimation.end, methods.end, false);
                }

                if( !data.shown ){
                    $el.classList.remove('on-scroll--wait');
                    $el.classList.add('on-scroll--'+props.animation);

                    data.shown = true;
                }
            }

            if( data.bounding.top > window.pageYOffset + window.innerHeight && data.shown && props.animation !== 'parallax'){
                $el.classList.add('on-scroll--wait');
                $el.classList.remove('on-scroll--'+props.animation);

                data.shown = false;
            }
            }
        }

    return methods;
};

const AOSComponent = {
    name :'on-scroll',
    render: function(h) {
        return h(this.tag, {class:'on-scroll'}, this.$slots.default);
    },
    props:{
        animation: { default: 'fade-in' },
        delay: { default: 0 },
        offset: { default: 100 },
        strength: { default: 100 },
        duration: { default: 0.5 },
        tag: { default: 'div' },
        invert: { default: false },
        center: { default: false },
        loop: { default: false },
        small: { default: 'active' },
        tablet: { default: 'disabled' },
        phone: { default: 'disabled' }
    },
    data: function(){
        return{
            interface: null
        }
    },
    mounted: function() {
	      this.interface = new AOSInterface(this.$el, this);
	      this.interface.mounted();
    },
    destroyed: function() {

        this.interface.destroyed();
    }
};


const AOSDirective = {
    name :'on-scroll',
    inserted(el, binding, vnode) {

        let props = {
            animation: 'fade-in' ,
            delay: 0,
            offset: 100,
            strength: 100,
            duration: 0.5,
            invert: false,
            center: true,
            loop: false,
            small: 'active',
            tablet: 'disabled',
            phone: 'disabled'
        };

        props = {...props, ...binding.value };
        el.classList.add('on-scroll');

        el.aos = new AOSInterface(el, props);
        el.aos.mounted();
    },
    unbind(el, binding, vnode) {
        el.aos.destroyed()
    }
}

const install = function (Vue, globalOptions) {
    Vue.component(AOSComponent.name, AOSComponent)
    Vue.directive(AOSDirective.name, AOSDirective)
}
const VueAOS = { AOSComponent, AOSDirective, install }

export default VueAOS
export { AOSComponent, AOSDirective, install }
