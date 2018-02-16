# Rocket sass framework

## How to use

In your main sass file, import the framework, order is important.
Use [node-sass-glob-importer](https://www.npmjs.com/package/node-sass-glob-importer)

    /* Framework */
    @import "node_modules/rocket-sass-framework/scss/reset";
    @import "node_modules/rocket-sass-framework/scss/function/**/*.scss";
    @import "node_modules/rocket-sass-framework/scss/variable/**/*.scss";
    @import "node_modules/rocket-sass-framework/scss/mixin/**/*.scss";
    @import "node_modules/rocket-sass-framework/scss/class/**/*.scss";
    @import "node_modules/rocket-sass-framework/scss/data-attribute/**/*.scss";
    
## Features

### Media queries

 Following Chrome devtools specification, there is several size predefined :

    phone    : 425px
    phone-m  : 375px
    phone-s  : 320px
    tablet   : 768px
    small    : 1024px
    medium   : 1280px
    large    : 1680px
    4k       : 2560px

#### From

    @media #{$from-phone}{ }

 compile to

    @media screen and (min-width: 426px){ }

#### To

    @media #{$to-phone}{ }

 compile to

    @media screen and (max-width: 425px){ }

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

    <div hide-on="phone">
        I'm on a tablet or desktop
    </div>
    <div show-on="phone">
        I'm on a phone
    </div>

### Aspect ratio

 Define size in css
 
    <div class="Product">
      <img src="product.jpg" object-fit="cover">
    </div>

    .Product{
      @include aspect-ratio(1/2);
      img{ position:overlay }
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

    <a icon="facebook"></a>
    <a icon-after="facebook"></a>

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

