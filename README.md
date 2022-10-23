# react-digital-rain

<img src="./src/digital_rain.gif">

```
npm install react-digital-rain
```

**Intro:**

This implementation of digital rain uses a gif, converted to a blob. These blob "tiles" are instanced based on the parent container dimensions (w,h) or user provided dimensions.

Animation:

The tiles are positioned statically in columns and rows. Each row gets a 2450ms delay, leading to a seemless animation that fits on all screen sizes. This works because the animation travels downward at 150pixels/second.

You can click on the animation for fullscreen and click again to remove fullscreen.

**Props:**

Can pass explicit height or width in px. Otherwise it will render its size according to its parent container. If the parent container has a height or width of 0, then it will define its height / width to fill up the screen. This is usefull when its the only component being rendered and needs to define - bottom up - the size of the DOM containers.

@param

height?: number;

width?: number

@returns JSX.Element

**Example:**

```

import { DigitalRain } from "react-digital-rain";

const App = props => {

  return <DigitalRain />

  // or  <DigtalRain height={400} width={800}/>
}

export default App;
```

**Edge cases:**

If the components height or width becomes larger than the screens height or width, then the visual viewport cannot focus on all the tiles., gifs will pause and lose timing. This is a browser feature and not a bug... something about being out of sight and taking up computing resources and stuff. It's strongly recommended not to make this component larger than window.screen.height or window.screen.width.

When switching between tabs and scrolling it in and out of view, it will simply restart the animation.
