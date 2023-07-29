import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import sourcemaps from "rollup-plugin-sourcemaps";
import image from "@rollup/plugin-image";

export default {
  input: "src/DigitalRain.js",
  output: {
    format: "umd",
    name: "DigitalRain",
    globals: {
      react: "React",
      screenfull: "screenfull"
    },
    sourcemap: true,
    file: "dist/index.js"
  },
  external: ["react", "react-dom", "screenfull"],
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    //image needs to be run first before anything else. What a bug.
    image({
      extensions: /\.(png|jpg|jpeg|gif|svg)$/,
    }),
    sourcemaps(),
    terser(),
    styles(),
  ],
};
