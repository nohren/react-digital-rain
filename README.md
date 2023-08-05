# react-digital-rain 💊 🔴 🔵 ⚡ 🟢 🌧️ 
➡️ [npmjs](https://www.npmjs.com/package/react-digital-rain)

<img src="./src/digital_rain.gif">
<br></br>
<b>As of version 5.0.0, this package now supports Next.js with both CJS and ESM module systems. Please use version 4.2.0 if you need UMD.</b>
<br></br>

<h1>Intro</h1>

This component renders beautiful neon digital rain on a black background. 
It fits its container.
It can be enabled to go fullscreen when clicked on.



```
npm install react-digital-rain
```

When bundled and served with gzip, this package comes in at 8.7mb, 8.6 of which is the gif.


<h1>Technical</h1>

This component uses one gif to fit any screen. Using background image css scales the resolution. It will be blurry.

Instead this component uses a single gif, appending it over and over to fill the screen and timing it so that the rain looks continous.

**Positioning:** We use one outer div and one inner.  The inner is going to calculate the gifs for the entire screen.  The outer is the magnifying glass.  The browser doesn't use whatever isn't showing. We will handle that later.  Gifs are positioned statically in columns and rows. Each row gets a 2450ms delay, which is the speed of the rain over 400 pixels.   The animation travels downward at roughly 166 pixels per second. This achieves a seemless transition from tile to tile that fits on all screen sizes.

**Caching:** A word on caching and timing - A 500x400 tile is served to the browser with the \<img> tag. If we simply use the \<img> tag with src, all instances are given the same gif start time by the browser.  We cannot start sequentially, even if they are appended to the DOM at a later point in time. We can break this behavior by adding a random query string to the end of the \<img src> attribute.  The downside is that this breaks the native browser caching and forces the browser to request the \<img> on each render.  We now have timing but are left with computationally expensive operations. The solution is the blob (binary large object).  With the blob we have control over \<img> timing AND we have control over caching.  The blob is our manual override to cache this gif ourselves.

**Browser-isms:** the browser pauses gifs when they are out of view to conserve computing resources. When switching between tabs, resizing the window or the components parent element, this component will simply restart the animation to regain timing.



<h1>Usage</h1>

<h3>Props</h3>

```
fullScreen?: boolean // enters fullscreen when clicked. Defaults to false.

animationSeconds?: number // the animation duration in seconds. If not provided, the animation duration will be calculated based on screen height
```
<h3>Examples</h3>

```

import { DigitalRain } from "react-digital-rain";

const App = props => {

  return <DigitalRain />

}

//for fullscreen capability with minimal animation

const App = props => {

  return <DigitalRain fullScreen animationSeconds={1}/>

}

export default App;
```

<h3>For more control of fullscreen</h3>

```

import { DigitalRain, useFullScreen } from "react-digital-rain";

const App = props => {
  
  const { isFullScreen, screenfull } = useFullScreen();

  return <>
     !isFullScreen && <NavBar />
     <DigitalRain fullScreen />
     </>

}

export default App;
```
