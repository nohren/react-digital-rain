import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import image from "@rollup/plugin-image";

export default {
  input: "src/DigitalRain.js",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "DigitalRain",
    sourcemap: true,
    globals: {
      react: "React",
      screenfull: "screenfull"
    },
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
    styles(),
    terser()
  ],
};
