# react-digital-rain 💊 🔴 🔵 ⚡ 🟢 🌧️

➡️ [npmjs](https://www.npmjs.com/package/react-digital-rain)

<img src="./src/digital_rain.gif">
<br></br>

<h2>Release History</h2>
<ul>
<li>
   Version 10 package bundle includes the digital_rain.gif encoded as base64 again. This will automatically be bundled by the users application, no extra work required. No webpack copy plugin.  I found this to be the easiest solution for the end user, it just works.  I highly recommend using code splitting techniques to not delay time to first load of your application. <a href="https://legacy.reactjs.org/docs/code-splitting.html">https://legacy.reactjs.org/docs/code-splitting.html</a>.
 </li>
 <li>
   Version 9 to 9.4.0 included the digital_rain.gif file as an asset due to the huge size of base64 on the bundle. This requires webpack copy plugin on the users end to utilize.  For next JS you can copy/paste the gif into your public/images folder or use webpack copy plugin.
 </li>
 <li>
 As of version 5.0.0, this package now supports Next.js with bundle for CJS. Please use version 4.2.0 and below if you need UMD.
 </li>

</ul>

<h1>Intro</h1>

This component renders neon digital rain on a black background.
It fits its container.
It can be enabled to go fullscreen when clicked on. This is probably best used as a screensaver, in fullscreen mode.

```
npm install react-digital-rain
```

<h1>Technical</h1>

This component uses one gif to fit any screen with no loss of resolution or stretching.

**Problem:**

```
 background-image: url("digital_rain.gif")
 background-size: cover;
 background-repeat: no-repeat;
 background-attachment: fixed;
```

This results in a blurry image as its stretched to fit most screens.

**Solution:**

This component uses a single gif, appending it over and over to fill the screen and timing it so that the rain looks continuous. This is possible with rain.

**Positioning:** We use one outer div and one inner. The inner is going to calculate the gifs for a little larger than the height/width of the container. The outer is the dimensions of the container. Turns out the browser has eccentricities when it comes to gifs. We will talk about that later. Gifs are positioned statically in columns and rows. Each row gets a 2450ms delay, which is the speed of the rain over 400 css pixels. The animation travels downward at roughly 166 css pixels per second. This achieves a seemless transition from tile to tile that fits on all screen sizes.

**Browser Eccentricities - Caching:** A word on caching and timing - A 500x400 gif "tile" is served to the browser with the \<img> tag. If we simply use the \<img> tag with src, all instances are given the same gif start time by the browser. We cannot start sequentially, even if they are appended to the DOM at a later point in time. We can break this behavior by adding a random query string to the end of the \<img src> attribute. The downside is that this breaks the native browser caching and forces the browser to request the \<img> on each render. We now have timing but are left with multiple expensive and slow operations. The solution is the blob (binary large object). With the blob we have control over \<img> timing AND we have control over caching. The blob is our manual override to cache this gif ourselves.

**Browser Eccentricities gifs:** the browser pauses gifs when they are out of view to conserve computing resources. When switching between tabs, resizing the window or resizing the parent element container, this component will simply restart the animation to regain synchronicity within the browser.

<h1>Usage</h1>

<h3>Props</h3>

```
fullScreen?: boolean // enters fullscreen when clicked. Defaults to false.

animationSeconds?: number // the animation duration in seconds. If not provided, the animation duration will be calculated based on screen height
```

<h3>Examples</h3>

```
//static import not recommended
import DigitalRain from "react-digital-rain";

//code splitting recommended

const DigitalRain = React.lazy(() => import("react-digital-rain"));

const App = props => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true)
  }, [])

  return show && (
    <Suspense fallback={<div>Loading...</div>}>
      <DigitalRain />
    </Suspense>
  )
}

//for fullscreen capability with minimal animation

const App = props => {

  return <DigitalRain fullScreen animationSeconds={1}/>

}

export default App;
```

<h3>For more control of fullscreen</h3>
Hide the navbar when fullscreen.

```

import DigitalRain,{ useFullScreen } from "react-digital-rain";

const App = props => {

  const { isFullScreen, screenfull } = useFullScreen();

  return <>
     !isFullScreen && <NavBar />
     <DigitalRain fullScreen />
     </>

}

export default App;
```
