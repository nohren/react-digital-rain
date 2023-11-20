import React from "react";
import { createRoot } from "react-dom/client";
//import DigitalRain from "../dist/cjs/index";

const DigitalRain = React.lazy(() => import("../dist/cjs/index"));

//console.log(import("../dist/cjs/index"));

const App = () => {
  //const [show, setShow] = useState(false);

  return (
    <div>
      {/* <DigitalRain /> */}
      <React.Suspense fallback="loading">
        <DigitalRain />
      </React.Suspense>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
