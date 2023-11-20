import React, { useEffect, lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
//import DigitalRain from "../dist/cjs/index";

const DigitalRain = lazy(() => import("../dist/cjs/index"));

//console.log(import("../dist/cjs/index"));

const App = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 5000);
  }, []);
  return (
    <div>
      {/* <DigitalRain /> */}
      {show && (
        <Suspense fallback="loading">
          <DigitalRain />
        </Suspense>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
