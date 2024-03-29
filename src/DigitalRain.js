import "./styles.css";
import React, { useEffect, useState, useRef } from "react";
import gif from "./digital_rain.gif";
import screenfullAPI from "screenfull";

const GIF_HEIGHT = 400; //css pixels
const GIF_WIDTH = 500; //css pixels

const isNil = (value) =>
  value === undefined || value === null || Number.isNaN(value);

const noop = () => {};

const screenfull = screenfullAPI.isEnabled
  ? screenfullAPI
  : {
      on: noop,
      off: noop,
      request: noop,
      isFullScreen: false,
      isEnabled: false,
    }; //adjust screenfull to handle safari mobile

/**
 * fetch gif data, convert to binary large object
 */
const generateBlob = async (url) => {
  try {
    return await (await fetch(url)).blob();
  } catch (e) {
    console.error("Blob failed to load " + e);
  }
};

//Escaping react, vanilla JS DOM manipulation
const timeouts = [];
/**
 * generate tiles
 * may start to generate rain while some rain is still pending in the event loop
 * added debouncing
 */
const generateRain = (htmlElement, blob, rows, columns) => {
  while (timeouts.length > 0) {
    clearTimeout(timeouts.pop());
  }

  for (let i = 0, tiles = rows * columns; i < tiles; i++) {
    const level = Math.floor(i / columns);

    timeouts.push(
      setTimeout(() => {
        const img = document.createElement("img");
        img.setAttribute("class", "tile");
        img.src = URL.createObjectURL(blob);
        htmlElement.append(img);
      }, 2450 * level)
    );
  }
};

/**
 * Function removes all tiles.
 */
const destroyRain = (htmlElement) => {
  while (!isNil(htmlElement?.firstChild)) {
    URL.revokeObjectURL(htmlElement.firstChild.src);
    htmlElement.removeChild(htmlElement.firstChild);
  }
};

/**
 * a hook to expose fullscreen functionality and to tell you when you are in or out of fullscreen
 */
export const useFullScreen = () => {
  const [isFullScreen, setFullScreen] = useState(false);

  const screenChange = () => {
    if (screenfull.isFullscreen) {
      setFullScreen(true);
    } else {
      setFullScreen(false);
    }
  };
  useEffect(() => {
    screenfull.on("change", screenChange);
    return () => {
      screenfull.off("change", screenChange);
    };
  }, []);

  return {
    isFullScreen,
    screenfull,
  };
};

const TileGenerator = (props) => {
  const {
    blobCache,
    windowScreenHeight,
    windowScreenWidth,
    isFullScreen,
    windowInnerHeight,
    animationSeconds,
  } = props;
  const ref = useRef(null);
  const rows = Math.ceil(windowScreenHeight / GIF_HEIGHT);
  const columns = Math.ceil(windowScreenWidth / GIF_WIDTH);

  /**
   * This useEffect is our bridge between React lifecycle world and manual DOM manipulation.
   * Turns out that refs on unmount are unreliable.
   * It's a race condition between the DOM unmounting the component and the useEffect function running.
   *
   * cache value of ref within the function scope.
   * const instance = ref.current
   *
   * https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html#effect-cleanup-timing
   */
  useEffect(() => {
    const instance = ref.current;
    if (!isNil(instance)) {
      generateRain(instance, blobCache, rows, columns);
    }

    return () => {
      if (!isNil(instance)) {
        destroyRain(instance);
      }
    };
  }, []);

  return (
    <div
      id="inner"
      style={{
        width: GIF_WIDTH * columns,
        height: isFullScreen ? windowScreenHeight : windowInnerHeight,
        overflowY: "hidden",
        animation: `blurAnimation ${animationSeconds ?? rows * 2.7}s ease-in`,
      }}
      ref={ref}
    ></div>
  );
};

/**
 A simple component that fits the container given
 
 ComponentDidMount: DigitalRain registers listeners and sets binary large object in state

 ComponentDidUpdate: no way to avoid re-generating tiles on componentDidUpdate in react.  Each render must produce JSX. And that JSX generates the synced gifs.  We only want to generate on mount.  Chose to escape react to generate the tiles via vanilla JS DOM API. 
 
 TileGenerator unmount/remount triggered on focus change, on intersection with viewport (scrolled out of view), on tab change, on fullscreen enter and exit, and on element resize.
 
 Render: outer div fits to screen to prevent scrolling and inner div holds the tiles.  Inner div is always larger than the viewport.
 
 If fullscreen is enabled, 
   a click will change css height on the next render.  Following that render, we will request 
  fullscreen from screenfull.  This avoids seeing a white empty space if the fullscreen request goes first.
 
  While in fullscreen, a click or pressing the escape button will trigger the callback subscribed.  We verify we are no longer in fullscreen, and then change css on the next render.
 
 */
export const DigitalRain = ({ fullScreen = false, animationSeconds }) => {
  const outer = useRef(null);
  const readyRef = useRef(null);
  const [mount, setMount] = useState(0);
  const [state, setState] = useState({
    ready: false,
    blobCache: null,
    isFullScreen: false,
    width: 0,
    height: 0,
  });
  const { ready, blobCache, isFullScreen, width, height } = state;
  readyRef.current = ready;

  const focusChange = (event) => {
    try {
      if (!event.target.hidden) {
        //for functions referenced on componentMount,
        //value type state variables will become stale in closure scope.
        //pass a function to reference the variable in internal state.
        if (readyRef.current) {
          setMount((mount) => mount + 1);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const windowResize = (event) => {
    if (readyRef.current) {
      setMount((mount) => mount + 1);
    }
  };

  const elementResize = (event) => {
    setState((state) => ({
      ...state,
      width: event[0].contentRect.width,
      height: event[0].contentRect.height,
    }));
    if (readyRef.current) {
      setMount((mount) => mount + 1);
    }
  };

  const elementHidden = (event) => {
    if (event[0]?.isIntersecting === true) {
      if (readyRef.current) {
        setMount((mount) => mount + 1);
      }
    }
  };

  const enterFullScreen = () => {
    setState((state) => ({ ...state, isFullScreen: true }));
  };

  const screenChange = () => {
    if (!screenfull.isFullscreen) {
      setState((state) => ({ ...state, isFullScreen: false }));
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", focusChange);
    window.addEventListener("resize", windowResize);
    screenfull.on("change", screenChange);
    const resizeObserver = new ResizeObserver(elementResize);
    const intersectionObserver = new IntersectionObserver(elementHidden);
    if (outer.current) {
      resizeObserver.observe(outer.current);
      intersectionObserver.observe(outer.current);
    }

    generateBlob(gif).then((res) => {
      setState((state) => ({ ...state, blobCache: res, ready: true }));
    });

    return () => {
      document.removeEventListener("visibilitychange", focusChange);
      window.removeEventListener("resize", windowResize);
      screenfull.off("change", screenChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isFullScreen && !screenfull.isFullscreen) {
      window.scroll(0, 0);
      screenfull.request();
    }
  }, [isFullScreen]);

  return (
    <div
      id={"outer"}
      onClick={
        fullScreen && screenfull.isEnabled
          ? isFullScreen
            ? screenfull.exit
            : enterFullScreen
          : noop
      }
      className={isFullScreen ? "outerFullScreen" : "outerNotFullScreen"}
      style={
        isFullScreen
          ? {
              height: window.screen.height,
              width: window.screen.width,
            }
          : {
              height: "100%",
              width: "100%",
            }
      }
      ref={outer}
    >
      {ready && (
        <TileGenerator
          blobCache={blobCache}
          windowScreenHeight={height}
          windowScreenWidth={width}
          isFullScreen={isFullScreen}
          windowInnerHeight={window.innerHeight}
          key={`${mount}`}
          animationSeconds={
            typeof animationSeconds === "number" ? animationSeconds : null
          }
        />
      )}
    </div>
  );
};

export default DigitalRain;
