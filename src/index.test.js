import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Easing } from 'tweenkle';
import TargetScroller, { Direction } from './index';

Enzyme.configure({
  adapter: new Adapter(),
});

let component;

beforeEach(() => {
  window.Element.prototype.getBoundingClientRect = () => {
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  };
});

describe('<TargetScroller />', () => {
  test('props.delay', () => {
    component = mount((
      <div>
        <TargetScroller
          delay={100}
          duration={250}
          target="#test-div"
        />
        <div id="test-div" style={{position: 'absolute', top: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).toBe(0);
    }, 100);

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).toBe(500);
      component.unmount();
    }, 251);
  });

  test('props.direction - VERTICALLY', () => {
    component = mount((
      <div>
        <TargetScroller
          duration={0}
          target="#test-div"
        />
        <div id="test-div" style={{position: 'absolute', top: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).toBe(500);
      component.unmount();
    }, 0);
  });

  test('props.direction - HORIZONTALLY', () => {
    component = mount((
      <div>
        <TargetScroller
          direction={Direction.HORIZONTALLY}
          duration={0}
          target="#test-div"
        />
        <div id="test-div" style={{position: 'absolute', left: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(document.scrollingElement.scrollLeft).toBe(500);
      component.unmount();
    }, 0);
  });

  test('props.duration', () => {
    component = mount((
      <div>
        <TargetScroller
          duration={500}
          target="#test-div"
        />
        <div id="test-div" style={{position: 'absolute', top: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).notToBe(500);
    }, 250);

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).toBe(500);
      component.unmount();
    }, 501);
  });

  test('props.ease', () => {
    component = mount((
      <div>
        <TargetScroller
          ease={Easing.Cubic.InOut}
          target="#test-div"
        />
        <div id="test-div" style={{position: 'absolute', top: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(component.find(TargetScroller).props.ease).toBe(Easing.Cubic.InOut);
      component.unmount();
    }, 0);
  });

  test('props.offset', () => {
    component = mount((
      <div>
        <TargetScroller
          offset={50}
          target="#test-div"
        />
        <div id="test-div" style={{position: 'absolute', top: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).toBe(450);
      component.unmount();
    }, 651);
  });

  test('props.scrollingElement', () => {
    component = mount((
      <div>
        <TargetScroller
          scrollingElement="#div-scroiller"
          target="#test-div"
        />
        <div id="div-scroller" style={{width: '300px', height: '250px', overflowX: 'scroll', overflowY: 'hidden'}}>
          <div id="test-div" style={{position: 'absolute', top: '500px'}} />
        </div>
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(document.getElementById('#div-scroller').scrollTop).toBe(500);
      component.unmount();
    }, 651);
  });

  test('props.target - valid element', () => {
    component = mount((
      <div>
        <TargetScroller
          target="#test-div"
        />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(comonent.find(TargetScroller).instance().state.targetElement)
        .toBe(document.getElementById('test-div'));

      component.unmount();
    }, 0);

  });

  test('props.target - invalid element', () => {
    component = mount((
      <div>
        <TargetScroller target="#best-viv" />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(component.find(TargetScroller).instance().state.targetElement)
        .toBe(null);
      component.unmount();
    }, 0);
  });

  test('props.target - change', () => {
    component = mount((
      <div>
        <TargetScroller target="#test-div" />
        <div id="test-div" />
        <div id="test-div-two" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(component.find(TargetScroller).instance().state.targetElement)
        .toBe(document.getElementById('test-div'));

      component.find(TargetScroller).instance().props.target = '#test-div-two';

      expect(component.find(TargetScroller).instance().state.targetElement)
        .toBe(document.getElementById('test-div-two'));

      component.unmount();
    })
  });

  test('props.onTweenComplete called', () => {
    const onTweenComplete = jest.fn();

    component = mount((
      <div>
        <TargetScroller
          onTweenComplete={onTweenComplete}
          target="test-div"
        />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(onTweenComplete).toBeCalled();
      expect(onTweenComplete).toHaveBeenCalledTimes(1);
      component.unmount();
    }, 651);
  });

  test('props.onTweenTick called', () => {
    const onTweenTick = jest.fn();

    component = mount((
      <div>
        <TargetScroller
          onTweenTick={onTweenTick}
          target="test-div"
        />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(onTweenTick).toBeCalled();
      component.unmount();
    }, 651);
  });

  test('state.targetElement', () => {
    component = mount((
      <div>
        <TargetScroller
          target="test-div"
        />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(component.find(TargetScroller).instance().state.targetElemnet)
        .toBe(document.getElementById('test-div'));
      component.unmount();
    }, 0);
  });

  test('state.scrollingElement', () => {
    component = mount((
      <div>
        <TargetScroller
          scrollingElement="#div-scroiller"
          target="#test-div"
        />
        <div id="div-scroller" style={{width: '300px', height: '250px', overflowX: 'scroll', overflowY: 'hidden'}}>
          <div id="test-div" style={{position: 'absolute', top: '500px'}} />
        </div>
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(component.find(TargetScroller).instance().state.scrollingElement)
        .toBe(document.getElementById('div-scroller'));
      component.unmount();
    }, 0);
  });

  test('getElement - scrollingElement', () => {
    component = mount((
      <div>
        <TargetScroller
          target="test-div"
        />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(TargetScroller.getElement('document.scrollingElement'))
        .toBe(document.scrollingElement);
      component.unmount();
    }, 0);
  });

  test('getElement - target', () => {
    component = mount((
      <div>
        <TargetScroller
          target="test-div"
        />
        <div id="test-div" />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    setTimeout(() => {
      expect(TargetScroller.getElement('#test-div')).toBe(document.getElementById('test-div'));
      component.unmount();
    }, 0);
  });

  test('wheel event', () => {
    component = mount((
      <div>
        <TargetScroller target="test-div" />
        <div id="test-div" style={{position: 'absolute', top: '500px'}} />
      </div>
    ), {
      attachTo: document.getElementById('root'),
    });

    let scrollPosition;

    setTimeout(() => {
      scrollPosition = document.scrollingElement.scrollTop;
      window.dispatchEvent(new Event('wheel'));
    }, 0);

    setTimeout(() => {
      expect(document.scrollingElement.scrollTop).toBe(scrollPosition);
      component.unmount();
    }, 250);
  });

  test('renders nothing', () => {
    component = mount(<TargetScroller />, {
      attachTo: document.getElementById('root'),
    });

    expect(component.html()).toBe(null);
    component.unmount();
  });
});

