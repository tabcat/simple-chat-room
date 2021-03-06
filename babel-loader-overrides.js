"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

/**
 * This source code was adapted from:
 * https://github.com/facebook/create-react-app/blob/v2.0.4/packages/babel-preset-react-app/webpack-overrides.js
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * The MIT license for this code may be found on GitHub:
 * https://github.com/facebook/create-react-app/blob/v2.0.4/packages/babel-preset-react-app/LICENSE
 */
const crypto = require('crypto');

const macroCheck = new RegExp('[./]macro');

module.exports = function () {
  return {
    config(config, {
      source
    }) {
      // don't cache babel macros
      // https://github.com/babel/babel/issues/8497
      if (macroCheck.test(source)) {
        return (0, _assign.default)({}, config.options, {
          caller: (0, _assign.default)({}, config.options.caller, {
            macroInvalidationToken: crypto.randomBytes(32).toString('hex')
          })
        });
      }

      return config.options;
    }

  };
};
//# sourceMappingURL=babel-loader-overrides.js.map