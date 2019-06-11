# Scss/VueJS libraries

In your main sass file, import the framework, order is important.

Use [node-sass-glob-importer](https://www.npmjs.com/package/node-sass-glob-importer) to allow `**/*` notation

    /* CSS Framework */
    @import "node_modules/@metabolism/framework/scss/reset";
    @import "node_modules/@metabolism/framework/scss/function/**/*.scss";
    @import "node_modules/@metabolism/framework/scss/variable/**/*.scss";
    @import "node_modules/@metabolism/framework/scss/mixin/**/*.scss";
    @import "node_modules/@metabolism/framework/scss/misc/**/*.scss";
    @import "node_modules/@metabolism/framework/scss/class/**/*.scss";
    @import "node_modules/@metabolism/framework/scss/data-attribute/**/*.scss";
    
    /* VUEJS Specific */
    @import "node_modules/@metabolism/framework/vuejs/**/*.scss";
    
## Features

### Media queries

 Following Chrome devtools specification, there is several size predefined :

    phone    : 425px
    phone-m  : 375px
    phone-s  : 320px
    tablet   : 768px
    small    : 1024px
    large    : 1440px
    4k       : 2560px

#### From

    @media #{$from-phone}{ }

 compile to

    @media screen and (min-width: 425px){ }

#### To

    @media #{$to-phone}{ }

 compile to

    @media screen and (max-width: 767px){ }

#### Only

    @media #{$only-phone}{ }

 compile to

    @media screen and (min-width: 425px) and (max-width: 767px){ }

### Vertical center

 use the `vcenter` class, to use flex powered vertical center

### Display

 hide-on and show-on attributes

 Works will standard media queries, defined in media-queries.scss
 4k, large, medium, small, tablet, phone, phone-m, phone-s

 Also works with js defined `<html>` class, mobile/desktop based on user agent

    <div data-hide_on="phone">
        I'm on a tablet or desktop
    </div>
    <div data-show_on="phone">
        I'm on a phone
    </div>
    
### Animate on scroll

 Import VueJS specific scss

    @import "node_modules/rocket-framework/vuejs/**/*.scss";

 Import lib

    import VueAOS from '@metabolism/framework/vuejs/on-scroll'
    Vue.use(VueAOS);
    
 Add markup
   
    <on-scroll animation="slide-up">Title</on-scroll>
    <!-- disable on mobile -->
    <on-scroll animation="slide-up" mobile="disabled">Title</on-scroll>
    <!-- Generate markup using a span -->
    <on-scroll animation="slide-up" tag="span">Title</on-scroll>
    <!-- Change delay and duration -->
    <on-scroll animation="parallax" delay="100" duration="500">Title</on-scroll>
    
    <!-- use directive -->
    <h2 class="title" v-on-scroll={animation:'fade-in'}>Title</h2>
    
 Available animations :
  - fade-in     
  - fade-out    
  - slide-down  
  - slide-up
  - slide-left
  - slide-right 
  - zoom-out    
  - zoom-in
  - unzoom-in   
  - unzoom-out  
  - rotate-x    
  - rotate-y    
  - pop
  - enlarge
  
Special animations :
  - increment
  - parallax
  
 Parallax : 
 
    <!-- Parallax 200px -->
    <on-scroll animation="parallax" strength="200px">Title</on-scroll>
   
    <!-- Parallax 10% from center, inverted offset -->
    <on-scroll animation="parallax" invert="true" center="true" strength="10%">Title</on-scroll>


### Aspect ratio

 Define size in css
 
    <div class="Product">
      <img src="product.jpg"/>
    </div>

    .Product{
      @include aspect-ratio(1/2);
      img{ position:overlay(); object-fit:cover }
    }

### Background size

Add preconfigured settings

    background : cover();
    background : fit();
    background : contain();
    background : fit-height();
    background : fit-width();

### Position

 Add new position behaviour
 
    position : overlay();
    position : overlay('fixed');

    position : center();
    position : center('x');
    position : center('y');

### Transition

 Add optimized transition properties and shorthands
 
    transition: allow( transform opacity );
    transition: allow( transform opacity, 0.3s );
    transition: allow( transform opacity, 0.3s, $ease-in-out-cubic );

### Icon

 Add an icon directly from the html

    <a data-icon="facebook"></a>
    <a data-icon-after="facebook"></a>

or in the scss file

    @include icon('facebook');
    @include icon('facebook', 'after');

 
### Unsupported browsers

 You can configure $unsupported-browsers variable to display a nice message on unsupported browser

### Predefined variables

#### Animations

 Duration, delay, offset ...

#### Easing
 
 Cubic, Quart, In out...
 
#### Keyframes

 Fade-in, Fade-out, Slide-up ...

### Social colors

 Colors for Facebook, Twitter, Pinterest ...

### Misc
   
 Change scrollbar style (size, background, thumb )

    @include scrollbar(4px, #000, #fff);
 
 Style placeholder
 
    input{
        @include placeholder { color:#fff };
    }

