# react-digital-rain

<img src="./src/digital_rain.gif">

```
npm install react-digital-rain
```

**Intro:**
This component renders beautiful neon digital rain on a black background.  It fits its container and also can be enabled to go fullscreen on click.


**Technical:**
This component solves a problem with gifs. The problem is that the gif only fits a certain dimension, lets say, 500x400 pixels and when you try to scale it to become a background image using css you lose resolution.  It becomes blurry. Why not think of gifs as tiles and stitch them together to create a picture that fits the screen width and height of any screen? We can time the animation to start sequentially.  That's what this component does.

The gifs are positioned statically in columns and rows. Each row gets a 2450ms delay, which is the speed of the rain over 400 pixels.   The animation travels downward at roughly 166 pixels per second. This achieves a seemless transition from tile to tile that fits on all screen sizes.

A word on caching and timing - A 500x400 tile is served to the browser with the \<img> tag. If we simply use the \<img> tag with src, all instances are given the same gif start time by the browser.  We cannot start sequentially, even if they are appended to the DOM at a later point in time. We can break this behavior by adding a random query string to the end of the \<img src> attribute.  The downside is that this breaks the native browser caching and forces the browser to request the \<img> on each render.  We now have timing but are left with computationally expensive operations. The solution is the blob (binary large object).  With the blob we have control over \<img> timing AND we have control over caching.  The blob is our manual override to cache this gif ourselves.

Of note, the browser pauses gifs when they are out of view to conserve computing resources. When switching between tabs and scrolling in and out of view, this component will simply restart the animation to regain timing.

**Props:**

fullScreen?: boolean;

- allows fullscreen when clicked. Defaults to false.

**Example:**

```

import { DigitalRain } from "react-digital-rain";

const App = props => {

  return <DigitalRain />

}

//for fullscreen on click pass the prop

const App = props => {

  return <DigitalRain fullScreen />

}

export default App;
```
