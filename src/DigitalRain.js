import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import gif from "./digital_rain.gif";
import screenfull from "screenfull";
import useForceUpdate from "./useForceUpdate";

const isNil = (value) =>
  value === undefined || value === null || Number.isNaN(value);

/**
 * A component that aims to fit its container, but really excels at fullscreen view...
 *
 * Can fit any size screen and keep its resolution.  Renders at about
 * 150 pixels per second, downward.
 *
 * @param {{
 *   height: number;
 *   width: number
 * }} props
 * @returns JSX.Element
 */
export default function DigitalRain(props) {
  const height = isNil(props.height) ? "100%" : `${props.height}px`;
  const width = isNil(props.width) ? "100%" : `${props.width}px`;

  const forceUpdate = useForceUpdate();

  const outerStylesFullScreen = {
    height: window.screen.height,
    width: window.screen.width,
  };
  const outerStylesNotFullScreen = {
    height: height, //inherit height from parent, not from child. Enforce height limitations.  For some reason width does this by default, but not height.
    width: width,
  };

  //cache values in array pointers for event handler functions that only know the initial context.  No need for refs.
  const [state, setState] = useState({
    ready: [false],
    blobCache: [null],
    isFullScreen: false,
  });

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

  const generateBlob = async (url) => {
    try {
      return await (await fetch(url)).blob();
    } catch (e) {
      console.error("Blob failed to load " + e);
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

  const enterFullScreen = () => {
    window.scroll(0, 0);
    screenfull.request();
  };

  const exitFullScreen = () => screenfull.exit();

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
       * inner div.  As big as the entire screen for drawing the right amount of columns. Drawing is done in browser by width, in rows.
       * Outer div is like a magnifying glass over this.
       */
      <div
        id="DigitalRain_innerContainer"
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
      id={"DigitalRain_outerContainer"}
      onClick={isFullScreen ? exitFullScreen : enterFullScreen}
      className={isFullScreen ? "outerFullScreen" : "outerNotFullScreen"}
      style={isFullScreen ? outerStylesFullScreen : outerStylesNotFullScreen}
    >
      {ready && <TileController blobCache={blobCache} />}
    </div>
  );
}
