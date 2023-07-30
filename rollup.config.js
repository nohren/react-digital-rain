import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import image from "@rollup/plugin-image";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import gzipPlugin from 'rollup-plugin-gzip'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

//for future, maybe use plugin postcss instead of styles
//seems to have much more use and therefore possibly support

export default {
  input: "src/DigitalRain.js",
  output: [
    {
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true
    },
    {
       file: "dist/esm/index.js",
       format: "esm",
       sourcemap: true,
    }
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    //image needs to be run first before anything else. What a bug.
    image({
      extensions: /\.(png|jpg|jpeg|gif|svg)$/,
    }),
    peerDepsExternal(),
    styles(),
    commonjs(),
    nodeResolve(),
    terser(),
    gzipPlugin(),
  ],
};
