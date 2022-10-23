# react-digital-rain

<img src="./src/digital_rain.gif">

```
npm install react-digital-rain
```

**Intro:**

This implementation of digital rain uses a gif, converted to a blob. These blob "tiles" are instanced based on the parent container dimensions (w,h) or user provided dimensions.

**Animation:**

The tiles are positioned statically in columns and rows. Each row gets a 2450ms delay, leading to a seemless animation that fits on all screen sizes. This works because the animation travels downward at 150pixels/second.

You can click on the animation for fullscreen and click again to remove fullscreen.

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

**Edge cases:**

If the components height or width becomes larger than the screens height or width, then the visual viewport cannot focus on all the tiles i.e tiles will pause and lose timing. This is a browser feature and not a bug... something about freeing up computing resources and stuff. It's strongly recommended not to make this component larger than window.screen.height or window.screen.width.

When switching between tabs and scrolling in and out of view, it will simply restart the animation.
