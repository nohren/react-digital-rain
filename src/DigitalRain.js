import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import gif from "./digital_rain.gif";
import screenfull from "screenfull";
import useForceUpdate from "./useForceUpdate";

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

const exitFullScreen = () => screenfull.exit();

const enterFullScreen = () => {
  window.scroll(0, 0);
  screenfull.request();
};

/**
 * A simple component that fits the container given
 * Full screen mode on click: boolean
 */
export function DigitalRain({
  fullScreen = false
}) {
  //forces a render on tab change, so we don't lose timing
  const forceUpdate = useForceUpdate();

  /**
   * cache values in array pointers for event handler functions defined in the initial context.  
   * No need for refs.
  */
  const [state, setState] = useState({
    ready: [false],
    blobCache: [null],
    isFullScreen: false,
  });
  
  //expose state values on each render
  const ready = state.ready[0];
  const blobCache = state.blobCache[0];
  const isFullScreen = state.isFullScreen;

  const focusChange = (event) => {
    try {
      if (!event.target.hidden) {
        forceUpdate();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const screenChange = () => {
    if (screenfull.isFullscreen) {
      setState({ ...state, isFullScreen: true });
    } else {
      setState({ ...state, isFullScreen: false });
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", focusChange);
    screenfull.on("change", screenChange);

    generateBlob(gif).then((res) => {
       //update state pointers, then call reconciliation to draw new values to the screen.
       state.ready[0] = true;
       state.blobCache[0] = res;
       forceUpdate();
    });

    return () => {
      //avoids memory leaks
      document.removeEventListener("visibilitychange", focusChange);
      screenfull.off("change", screenChange);
    };
  }, []);

  const Tile = (props) => {
    const { ms, blob } = props;
    const [show, setShow] = useState(false);

    const blobUrlString = URL.createObjectURL(blob);

    if (!show) {
      setTimeout(() => {
        setShow(true);
      }, ms);
    }

    useEffect(() => {
      // For cleaning up the blob string on unmount.
      return () => {
        if (!isNil(blobUrlString)) {
          URL.revokeObjectURL(blobUrlString);
        }
      };
    });

    return show && <img src={blobUrlString} className="tile" />;
  };

  const TileController = (props) => {
    const { blobCache } = props;
    const gifHeight = 400;
    const gifWidth = 500;
    const rows = Math.ceil(window.screen.height / gifHeight);
    const columns = Math.ceil(window.screen.width / gifWidth);

    const tileMap = useMemo(() => {
      const tileMap = [];
      for (let i = 0, tiles = rows * columns; i < tiles; i++) {
        const level = Math.floor(i / columns);
        tileMap.push(<Tile key={i} ms={2450 * level} blob={blobCache} />);
      }
      return tileMap;
    }, []);

    return (
      /**
       * outer div fits to screen
       * inner div always larger than viewport
       */
      <div
        id="inner"
        style={{
          width: gifWidth * columns,
          height: isFullScreen ? window.screen.height : window.innerHeight,
          overflowY: "hidden",
        }}
      >
        {tileMap}
      </div>
    );
  };

  return (
    <div
      id={"outer"}
      onClick={fullScreen ? isFullScreen ? exitFullScreen : enterFullScreen: noop}
      className={isFullScreen ? "outerFullScreen" : "outerNotFullScreen"}
      style={isFullScreen ? {
        height: window.screen.height,
        width: window.screen.width,
      } : {
        height: "100%",
        width: "100%",
      }}
    >
      {ready && <TileController blobCache={blobCache} />}
    </div>
  );
}
