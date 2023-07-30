import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import image from "@rollup/plugin-image";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import gzipPlugin from 'rollup-plugin-gzip'

export default {
  input: "src/DigitalRain.js",
  output: [
    {
      //UMD build
      file: "dist/index.umd.js",
      format: "umd",
      name: "DigitalRain",
      sourcemap: true,
      globals: {
        react: "React",
        screenfull: "screenfull"
      },
    },
    {
       //esm build
       file: "dist/index.esm.js",
       format: "es",
       sourcemap: true,
       globals: {
         react: "React",
         screenfull: "screenfull"
       },
    }
  ],
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
    commonjs(),
    nodeResolve(),
    terser(),
    gzipPlugin(),
  ],
};
