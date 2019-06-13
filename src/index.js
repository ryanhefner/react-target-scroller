import { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import Tween, { Easing } from 'tweenkle';

export const Direction = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

class TargetScroller extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = Object.assign({}, prevState, {
      scrollingElement: TargetScroller.getElement(nextProps.scrollingElement),
      targetElement: TargetScroller.getElement(nextProps.target),
    });

    return isEqual(nextState, prevState) ? null : nextState;
  }

  static getElement(target, defaultTarget) {
    try {
      return !!(!target || typeof target === 'string')
        ? !!(!target || target === 'document.scrollingElement' || target === 'document.body')
          ? document.scrollingElement || document.body
          : document.querySelector(target)
        : target;
    }
    catch (err) {
      return null;
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      scrollingElement: null,
      targetElement: null,
    };

    this.onTweenTick = this.onTweenTick.bind(this);
    this.onTweenComplete = this.onTweenComplete.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  componentDidMount() {
    addEventListener('wheel', this.onWheel);

    const {
      delay,
      scrollingElement,
      target,
    } = this.props;

    setTimeout(() => {
      this.setState({
        scrollingElement: TargetScroller.getElement(scrollingElement),
        targetElement: TargetScroller.getElement(target),
      });
    }, delay);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    const {
      delay,
    } = this.props;

    setTimeout(() => {
      this.scrollToTarget();
    }, delay);
  }

  componentWillUnmount() {
    if (this.tween) {
      this.tween.stop();
    }

    removeEventListener('wheel', this.onWheel);
  }

  scrollToTarget() {
    const {
      scrollingElement,
      targetElement,
    } = this.state;

    if (this.tween) {
      this.tween.stop();
    }

    if (!targetElement) {
      return;
    }

    const {
      direction,
      duration,
      ease,
      offset,
    } = this.props;

    const elementRect = targetElement.getBoundingClientRect();
    const scrollPosition = direction === Direction.HORIZONTAL
      ? scrollingElement.scrollLeft
      : scrollingElement.scrollTop;
    const scrollTarget = direction === Direction.HORIZONTAL
      ? scrollPosition + (elementRect.left - offset)
      : scrollPosition + (elementRect.top - offset);

    this.tween = new Tween({
      start: scrollPosition,
      end: scrollTarget,
      duration,
      ease,
    });
    this.tween.on('tick', this.onTweenTick);
    this.tween.on('complete', this.onTweenComplete);
    this.tween.start();
  }

  onTweenTick(data) {
    const {
      direction,
      onTweenTick,
    } = this.props;

    const {
      scrollingElement,
    } = this.state;

    const directionParam = direction === Direction.HORIZONTAL
      ? 'scrollLeft'
      : 'scrollTop';

    scrollingElement[directionParam] = data.value;

    onTweenTick(data);
  }

  onTweenComplete(data) {
    const {
      direction,
      onTweenComplete,
    } = this.props;

    const {
      scrollingElement,
    } = this.state;

    const directionParam = direction === Direction.HORIZONTAL
      ? 'scrollLeft'
      : 'scrollTop';

    scrollingElement[directionParam] = data.value;

    onTweenComplete(data);
  }

  onWheel() {
    if (this.tween) {
      this.tween.stop();
    }
  }

  render() {
    return null;
  }
}

TargetScroller.propTypes = {
  delay: PropTypes.number,
  direction: PropTypes.string,
  duration: PropTypes.number,
  ease: PropTypes.func,
  offset: PropTypes.number,
  scrollingElement: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  target: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  onTweenComplete: PropTypes.func,
  onTweenTick: PropTypes.func,
};

TargetScroller.defaultProps = {
  delay: 0,
  direction: Direction.VERTICAL,
  duration: 650,
  ease: Easing.Quad.InOut,
  offset: 0,
  onTweenComplete: () => {},
  onTweenTick: () => {},
};

export default TargetScroller;
