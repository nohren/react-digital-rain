//static imports
import "./styles.css";
import React, { useEffect, useState, useRef } from "react";
import gif from "./digital_rain.gif";
import screenfull from "screenfull";

//constants
const GIF_HEIGHT = 400; //pixels
const GIF_WIDTH = 500;  //pixels

//util functions
const isNil = (value) =>
  value === undefined || value === null || Number.isNaN(value);

const noop = () => {};

const generateBlob = async (url) => {
  try {
    return await (await fetch(url)).blob();
  } catch (e) {
    console.error("Blob failed to load " + e);
  }
};

//react escape hatch functions - DOM API functions

/**
 * Imperative function appends the tiles to the dom node and synchronizes them.
 * To be added to componentDidUpdate when blob is ready.
 */
const generateRain = (htmlElement, blob, rows, columns) => {
  for (let i = 0, tiles = rows * columns; i < tiles; i++) {
    const level = Math.floor(i / columns);

    setTimeout(() => {
      const img = document.createElement("img");
      img.setAttribute('class', "tile");
      img.src = URL.createObjectURL(blob);
      htmlElement.append(img);
    }, 2450 * level)
  }
}

/**
 * Function removes all tiles.
 * To be added to componentDidUnmount
 */
const destroyRain = (htmlElement) => {
  while (!isNil(htmlElement?.firstChild)) {
    URL.revokeObjectURL(htmlElement.firstChild.src);
    htmlElement.removeChild(htmlElement.firstChild);
  }  
}

//back to react now

/**
 * declare conmponent outside of react lifecycle to avoid re-declaring to the compiler, new memory reference locations,
 * and unessesary unmount/mounts
 */
const TileGenerator = (props) => {
  const { blobCache, windowScreenHeight, windowScreenWidth, isFullScreen, windowInnerHeight } = props;
  const ref = useRef(null);
  const rows = Math.ceil(windowScreenHeight / GIF_HEIGHT);
  const columns = Math.ceil(windowScreenWidth / GIF_WIDTH);

  useEffect(() => {
    //on mount of this component, the blob is ready, generate the nodes via DOM API
    if (!isNil(ref.current)) { 
      generateRain(ref.current, blobCache, rows, columns);
    }

    return () => {
      //on component unmount remove the nodes
      if (!isNil(ref.current)) {
        destroyRain(ref.current);
      }
    }
  }, []);
  
  return (
    <div
      id="inner"
      style={{
        width: GIF_WIDTH * columns,
        height: isFullScreen ? windowScreenHeight : windowInnerHeight,
        overflowY: "hidden",
      }}
      ref={ref}
    ></div>
  );
};

/**
 * A simple component that fits the container given
 * 
 * ComponentDidMount: DigitalRain registers listeners and sets blob to state
 * 
 * ComponentDidUpdate: no way to avoid re-generating tiles on componentDidUpdate within react since that is what the 
 * component does. Escaped react to generate the tiles via DOM API.  This happens only on TileGenerator component mount.
 * TileGenerator unmount/remount triggered on focus change.
 * 
 * Notes about render:
 * outer div fits to screen to prevent scrolling and
 * inner div holds the tiles.  Inner div is always larger than the viewport.
 * 
 * If fullscreen is enabled, 
 * a click will change css height on the next render.  Following that render, we will request 
 * fullscreen from screenfull.  This avoids seeing a white empty space if the fullscreen request goes first.
 * 
 * While in fullscreen, a click or pressing the escape button will trigger the callback subscribed.  We verify we are no longer in fullscreen, and then change css on the next render.
 *
 */
export function DigitalRain({
  fullScreen = false
}) {
  //state management
  const [mount, setMount] = useState(0);
  const [state, setState] = useState({
    ready: false,
    blobCache: null,
    isFullScreen: false,
  });
  const { ready, blobCache, isFullScreen } = state;

  
  //event handler functions
  const focusChange = (event) => {
    try {
      if (!event.target.hidden) {
        //for functions refernced on componentMount, avoid referencing a variable in the closure scope. Value types will become stale.
        //instead pass a function to refernce the variable in internal state.
        setMount((mount) => mount + 1);
      }
    } catch (e) {
      console.log(e);
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
  
  //effects
  useEffect(() => {
    document.addEventListener("visibilitychange", focusChange);
    screenfull.on("change", screenChange);
    
    generateBlob(gif).then((res) => {
      setState((state) => ({ ...state, blobCache: res, ready: true}))
    });

    return () => {
      document.removeEventListener("visibilitychange", focusChange);
      screenfull.off("change", screenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullScreen && !screenfull.isFullscreen) {
      window.scroll(0, 0);
      screenfull.request();
    }
  }, [isFullScreen])

  return (
    <div
      id={"outer"}
      onClick={fullScreen ? isFullScreen ? screenfull.exit : enterFullScreen: noop}
      className={isFullScreen ? "outerFullScreen" : "outerNotFullScreen"}
      style={isFullScreen ? {
        height: window.screen.height,
        width: window.screen.width,
      } : {
        height: "100%",
        width: "100%",
      }}
    >
      {ready && <TileGenerator 
                  blobCache={blobCache} 
                  windowScreenHeight={window.screen.height} 
                  windowScreenWidth={window.screen.width}
                  isFullScreen={isFullScreen}
                  windowInnerHeight={window.innerHeight}
                  key={`${mount}`}
                />}
    </div>
  );
}
