# react-digital-rain

<img src="./src/digital_rain.gif">

```
npm install react-digital-rain
```

**Intro:**

This gif is really beautiful. The problem is it's only 500x400 and when you try to scale it to become a background image using css you lose the resolution. A friend of mine had a thought, why not stitch it together to fit the screen width and height? And why not delay the animation sequentially so that it all looks like one moving image no matter the screen dimensions? That's what this project attempts to do and place in one react component for use.

**Technical:**

The tiles are positioned statically in columns and rows. Each row gets a 2450ms delay, achieving a seemless animation that fits on all screen sizes. This works because the animation travels downward at 150pixels/second.

You can click on the animation for fullscreen and click again to remove fullscreen.

The browser pauses gifs when they are out of view to conserve computing resources. When switching between tabs and scrolling in and out of view, this component will simply restart the animation to regain timing.

**Props:**

height?: number;

- can pass explicitly. If not passed, it will be determined by the parent container. In the event that the parent container height is 0, then the component will occupy window.innerHeight.

width?: number;

- can pass explicitly. If not passed, it will be determined by the parent container. In the event that the parent container width is 0, then the component will occupy window.screen.width.

enableFullScreen?: boolean;

- toggles true/false the fullscreen click event on the component. Defaults to true. You can choose to import exitFullScreen and enterFullScreen to do your own stuff.

@returns JSX.Element

**Example:**

```

import { DigitalRain } from "react-digital-rain";

const App = props => {

  return <DigitalRain />

  // or <DigtalRain height={400} width={800} enableFullScreen={false}/>

}

export default App;
```

More control over this event.

```
import { DigitalRain, enterFullScreen, exitFullScreen } from "react-digital-rain";

//implement own fullscreen logic.
```
