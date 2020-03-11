# 🎯 react-target-scroller

![npm](https://img.shields.io/npm/v/react-target-scroller?style=flat-square)
![npm](https://img.shields.io/npm/l/react-target-scroller?style=flat-square)
![npm](https://img.shields.io/npm/dt/react-target-scroller?style=flat-square)
![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/react-target-scroller?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/react-target-scroller?style=flat-square)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/ryanhefner/react-target-scroller?style=flat-square)


React component that smoothly scrolls to the `target` element passed in via props.

## Install

Via [npm](https://npmjs.com/package/react-target-scroller)

```sh
npm install --save react-target-scroller
```

Via [Yarn](https://yarn.fyi/react-target-scroller)

```sh
yarn add react-target-scroller
```

## How to use

The `TargetScroller` is very configurable and designed to do a single thing well. I have another project, [`react-hash-handler`](https://github.com/ryanhefner/react-hash-handler), that pairs well with this component, but can easily be used alone, or coupled with your own components.

Below are the properties and callbacks that can be set on the component, along with an example of some general use.

### Properties

* `delay:Number` - The time in milliseconds to delay the scroll after the `target` has been set/changed. (default: `0`)

* `direction:String` - The direction the `scrollingElement` will incremented/decremented in order to reach its target. The options are available via an `export` available from the component. Example: `import TargetScroller, {Direction} from 'react-target-scroller;` The options are, `Direction.VERTICAL` or `Direction.HORIZONTAL`. (default: `Direction.VERTICAL`)

* `duration:Number` - The duration in milliseconds that the page will take to transition to the `target`. (default: `650`)

* `ease:Func` - The easing function used to define the tween of the transition. `TargetScroller` uses [`tweenkle`](https://github.com/ryanhefner/tweenkle) and supports all the [easing equations](https://github.com/ryanhefner/tweenkle#easing) offered in that library, or you can write your own based on the ease spec. (default: `Quad.InOut`)

* `offset:Number` - Number used to offset the scroll position. Useful for making sure fixed headers don’t cover up the target object.

* `scrollingElement:[String || Element]` - The element that will be scrolled in order to reach the `target`. This is handy if you have a scrollable element in the page and want to target its children. (default: `'document.scrollingElement'`).

* `target:[String || Element]` - The property that defines which element to scroll to. You can either supply an actual reference to the element, or a string that can target the element. (Note: If you supply a string, make sure it’s a string format that is supported by `querySelector`.)

### Callbacks

* `onTweenComplete:Func` - A function that is called when the scroll transition has finished.

* `onTweenTick:Func` - A function that is called during the scroll transition on the way to the `target`.

### Examples

```js
import React, { Component } from 'react';
import TargetScroller from 'react-target-scroller';

...

class ExampleComponent extends Compnonent {
  constructor(props) {
    super(props);

    this.state = {
      scrollTarget: null,
    };

    this.onNavLinkClick = this.onNavLinkClick.bind(this);
  }

  onNavLinkClick(evt) {
    const hash = href.indexOf('#') > -1 ? href.split('#')[1] : null;

    if (!hash) {
      return;
    }

    this.setState({
      scrollTarget: `#${hash}`,
    });
  }

  render() {
    const {
      scrollTarget,
    } = this.state;

    return (
      <div className="page-wrapper">
        <nav>
          <ul>
            <li><a href="#overview" onClick={this.onNavLinkClick}>Overview</a></li>
            <li><a href="#about" onClick={this.onNavLinkClick}>About</a></li>
            <li><a href="#contact" onClick={this.onNavLinkClick}>Contact</a></li>
          </ul>
        </nav>
        <TargetScroller target={scrollTarget} />
        ...
        <section id="overview">
          ...
        </section>
        <section id="about">
          ...
        </section>
        <section id="contact">
          ...
        </section>
      </div>
    );
  }
}
```

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
