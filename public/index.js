import React from "react";
import { createRoot } from "react-dom/client";
//import DigitalRain from "../dist/cjs/index";
//import { useFullScreen } from "../dist/cjs/index";

//const DigitalRain = React.lazy(() => import("../dist/cjs/index"));

//console.log(import("../dist/cjs/index"));

//import DigitalRain, { useFullScreen } from "../dist/cjs/index";

//const DigitalRainModule = import("../dist/cjs/index");

/**
 * Use to dynamically load multiple functions from module
 * This component does things one level higher in order to comply with React hooks rule
 * It will only render the wrapped component when everything is loaded
 */
const withLazy = (WrappedComponent, importModule, propsExtractor, fallback) => {
  return (props) => {
    const [loadedModule, setLoadedModule] = React.useState(null);

    React.useEffect(() => {
      importModule().then((module) => setLoadedModule(propsExtractor(module)));
    }, []);

    return loadedModule ? (
      <WrappedComponent {...loadedModule} {...props} />
    ) : (
      fallback
    );
  };
};

const App = withLazy(
  (props) => {
    const { DigitalRain, useFullScreen } = props;
    const { isFullScreen, screenfull } = useFullScreen();

    return (
      <>
        {!isFullScreen && <div>yo bro</div>}
        <DigitalRain fullScreen />
      </>
    );
  },
  () => import("../dist/cjs/index"),
  (module) => ({
    DigitalRain: module.DigitalRain, //module exports as named and as default
    useFullScreen: module.useFullScreen,
  }),
  <div>...Loading</div>
);

// const App = () => {
//   //const [show, setShow] = useState(false);

//   return (
//     <div>
//       {/* <DigitalRain /> */}
//       <React.Suspense fallback="loading">
//         <DigitalRain />
//       </React.Suspense>
//     </div>
//   );
// };

const root = createRoot(document.getElementById("root"));
root.render(<App />);
