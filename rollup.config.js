import { defineConfig } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import md5 from 'md5';

export default defineConfig({
  input: 'src/index.js',
  output: {
    // file: './dist/hyperion.js',
    dir: './dist',
    manualChunks: {
      "hyperionCore": [
        "@hyperion/hyperion-core/src/intercept",
        "@hyperion/hyperion-dom/src/INode",
        "@hyperion/hyperion-dom/src/IElement_",
      ],
      "hyperionTrackElementsWithAttributes": [
        "@hyperion/hyperion-dom/src/IElement",
        "@hyperion/hyperion-util/src/trackElementsWithAttributes",
      ],
      "hyperionSyncMutationObserver": [
        "@hyperion/hyperion-util/src/SyncMutationObserver",
      ],
      "hyperionOnNetworkRequest": [
        "@hyperion/hyperion-dom/src/IWindow",
        "@hyperion/hyperion-dom/src/IXMLHttpRequest",
        "@hyperion/hyperion-util/src/onNetworkRequest",
      ],
      "hyperionFlowlet": [
        "@hyperion/hyperion-flowlet/src/Index",
        "@hyperion/hyperion-flowlet/src/Flowlet",
        "@hyperion/hyperion-flowlet/src/FlowletManager",
      ],
    },
    chunkFileNames: "[name].js",
    minifyInternalExports: false,
    /////////////////////////////////////////////////////////////////
    format: 'es',
    name: 'hyperion',
    intro: `
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.
 *
 * This file is auto generated from the Hyperion project hosted on
 * https://github.com/facebookincubator/hyperion
 * Instead of changing this file, you should:
 * - git clone https://github.com/facebookincubator/hyperion
 * - npm install
 * - npm run install-packages
 * - <make necessary modifications>
 * - npm run build
 * - <copy the 'hyperion/dist/' folder
 *
 * @generated <<SignedSource::08411d9f4a630be70617b13b3a5bcc0e>>
 */

    `,
    generatedCode: {
      preset: 'es2015',
      preferConst: true,
      constBindings: true,
      symbols: false, // use of Symobl
    }
  },
  // preserveSymlinks: true,
  plugins: [
    resolve({
      // // main: false,
      // mainFields: ['name', 'module', 'main'],
      // customResolveOptions: {
      //   moduleDirectory: [
      //     "./packages/devtools",
      //     "./packages/global",
      //     "./packages/hook",
      //     "./packages/hyperion-core",
      //     "./packages/hyperion-dom",
      //     "./packages/hyperion-util"
      //   ]
      // }
    }),
    {
      generateBundle: (options, bundle, isWrite) => {
        for (let bundleName in bundle) {
          const b = bundle[bundleName];
          if (typeof b.code === "string") {
            const signature = md5(b.code);
            b.code = b.code.replace(/@generated <<SignedSource::[^>]+>>/, `@generated <<SignedSource::${signature}>>`);
            b.code = b.code.replace(/(import [^']*from ')[.]\/([^.]+)[.]js(';)/g, `$1$2$3`);
          }
        }
      }
    }
  ]
})