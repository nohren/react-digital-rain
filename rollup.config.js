import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import image from "@rollup/plugin-image";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
//import brotli from "rollup-plugin-brotli";
// import serve from "rollup-plugin-serve";
//import url from "@rollup/plugin-url";

export default {
  input: "src/DigitalRain.js",
  output: [
    {
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
    // {
    //   file: "dist/esm/index.js",
    //   format: "esm",
    //   sourcemap: false,
    // },
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    //image needs to be run first before anything else.
    image({
      extensions: /\.(png|jpg|jpeg|gif|svg)$/,
    }),
    //for not bundling large gif to base64, instead add as asset
    // url({
    //   publicPath: "/images/",
    //   destDir: "dist/cjs/images",
    // }),
    peerDepsExternal(),
    styles(),
    commonjs(),
    nodeResolve(),
    terser(),
  ],
};
