import React, { useEffect, useMemo, useState } from "react";
import gif from "./digital_rain.gif";
import screenfull from "screenfull";
import "./styles.css";

const isNil = (value) =>
  value === undefined || value === null || Number.isNaN(value);

export default function DigitalRain(props) {
  const height = isNil(props.height) ? "100%" : `${props.height}px`;
  const width = isNil(props.width) ? "100%" : `${props.width}px`;

  const outerStylesFullScreen = {
    cursor: "none",
    overflow: "hidden",
    height: window.screen.height,
    width: window.screen.width,
    zIndex: 20,
    backgroundColor: "black",
  };
  const outerStylesNotFullScreen = {
    cursor: "none",
    overflow: "hidden",
    height: height, //inherit height from parent, not from child. Enforce height limitations.  For some reason width does this by default, but not height.
    width: width,
  };

  const [state, setState] = useState({
    ready: false,
    blobCache: null,
    isFullScreen: false,
  });

  useEffect(() => {
    generateBlob(gif).then((res) =>
      setState({
        ...state,
        ready: true,
        blobCache: res,
      })
    );
  }, [state.isFullScreen]);

  useEffect(() => {
    screenfull.on("change", () => {
      if (screenfull.isFullscreen) {
        setState({ ...state, isFullScreen: true });
      } else {
        setState({ ...state, isFullScreen: false });
      }
    });
  }, []);

  const generateBlob = async (url) => {
    try {
      return await (await fetch(url)).blob();
    } catch (e) {
      console.error("Blob failed to load " + e);
    }
  };

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
        if (blobUrlString !== undefined) {
          URL.revokeObjectURL(blobUrlString);
        }
      };
    });

    return show && <img src={blobUrlString} className="tile" />;
  };

  const TileController = () => {
    const gifHeight = 400;
    const gifWidth = 500;
    const rows = Math.ceil(window.screen.height / gifHeight);
    const columns = Math.ceil(window.screen.width / gifWidth);

    const tileMap = useMemo(() => {
      const tileMap = [];
      for (let i = 0, tiles = rows * columns; i < tiles; i++) {
        const level = Math.floor(i / columns);
        tileMap.push(<Tile key={i} ms={2450 * level} blob={state.blobCache} />);
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
          height: state.isFullScreen
            ? window.screen.height
            : window.innerHeight,
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
      onClick={state.isFullScreen ? exitFullScreen : enterFullScreen}
      style={
        state.isFullScreen ? outerStylesFullScreen : outerStylesNotFullScreen
      }
    >
      {state.ready && <TileController />}
    </div>
  );
}
