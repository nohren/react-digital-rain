import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import gif from "./digital_rain.gif";
import screenfull from "screenfull";
import useForceUpdate from "./useForceUpdate";
import { withSize } from "react-sizeme";

export const isNil = (value) =>
  value === undefined || value === null || Number.isNaN(value);

/**
 * A component that aims to fit its container, but really excels at fullscreen view...
 *
 * Can fit any size screen and keep its resolution.  Renders at about
 * 150 pixels per second, downward.
 *
 * This is not great for scrolling.  The browser automatically turns off the gif when not actively viewing.
 *
 * @param {{
 *   height: number;
 *   width: number
 * }} props
 * @returns JSX.Element
 */
const Digital_Rain = (props) => {
  const screenHeight = window.screen.height;
  const screenWidth = window.screen.width;
  const innerHeight = window.innerHeight;
  const height = isNil(props.height)
    ? props.size.height || innerHeight
    : props.height;
  const width = isNil(props.width)
    ? props.size.width || screenWidth
    : props.width;

  //const innerHeight = window.innerHeight;
  const forceUpdate = useForceUpdate();

  const outerStylesFullScreen = {
    height: screenHeight,
    width: screenWidth,
    maxHeight: screenHeight, //body needs to have this in case its larger
    maxWidth: screenWidth,
    position: "absolute",
  };
  const outerStylesNotFullScreen = {
    height: `${height}px`,
    width: `${width}px`,
  };

  const [state, setState] = useState({
    ready: false,
    blob: null,
    isFullScreen: false,
  });

  const ready = state.ready;
  const blob = state.blob;
  const isFullScreen = state.isFullScreen;

  const focusChange = (event) => {
    try {
      if (!event.target.hidden) {
        forceUpdate(); //actually causes a remount for the component defined inside this file.
      }
    } catch (e) {
      console.log(e);
    }
  };

  const screenChange = () => {
    if (screenfull.isFullscreen) {
      setState((prevState) => ({ ...prevState, isFullScreen: true }));
    } else {
      setState((prevState) => ({ ...prevState, isFullScreen: false }));
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

    generateBlob(gif).then((blob) => {
      setState({ ...state, blob, ready: true });
    });

    return () => {
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

  const TileMap = (props) => {
    const { blob, height, width } = props;
    const gifHeight = 400;
    const gifWidth = 500;
    const rows = Math.ceil(height / gifHeight);
    const columns = Math.ceil(width / gifWidth);

    const generateMap = useMemo(() => {
      const tiles = [];
      for (let i = 0, t = rows * columns; i < t; i++) {
        const level = Math.floor(i / columns);
        tiles.push(<Tile key={i} ms={2450 * level} blob={blob} />);
      }
      return tiles;
    }, [height, width]);

    return (
      /**
       * Guaranteed to always deliver a map larger than the component height, width
       *
       * Gifs are fixed at 400x500. They are drawn horizontally in columns to be wider than given width. Must explicitly define the width of container to account for the remainder, otherwise columns will not draw correctly according to calculations and not time correctly resulting in a messed up stitching.
       *
       * Outer div is like a magnifying glass over this and can never be larger than these dimensions.
       * Upon full screen mode dimensions snap to the screen dimensions.
       */
      <div
        id="dr_innerContainer"
        style={{
          width: gifWidth * columns,
          height: gifHeight * rows,
        }}
      >
        {generateMap}
      </div>
    );
  };

  return (
    <div
      id="dr_outerContainer"
      onClick={isFullScreen ? exitFullScreen : enterFullScreen}
      className={isFullScreen ? "outerFullScreen" : "outerNotFullScreen"}
      style={isFullScreen ? outerStylesFullScreen : outerStylesNotFullScreen}
    >
      {ready && <TileMap blob={blob} height={height} width={width} />}
    </div>
  );
};

export const DigitalRain = withSize({ monitorHeight: true })(Digital_Rain);
