/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * settings.js is used to control url-modifiable settings of the demo.
 * If you need to add additional modes or settings, this is the place
 * to start:
 *   - modify the 'modes' object to add new sets of settings values, or to
 *     adjust the default settings.
 *   - modify the 'validSettings' object to add entirely new settings, along
 *     with defining their valid types and arrays of supported values.
 *
 * Usage:
 *
 * import getSettings from './settings';
 * const settings = getSettings();
 */

/**
 * The modes object consists of key-value pairs, where each key is the name of
 * a mode the demo can be placed in and the value is another object which
 * defines the settings for that mode. You can change modes by providing
 * mode as a url parameter; if you do not, you will get the default settings.
 *
 * Note that modes aside from default are layered on top of the default
 * settings, so you don't need to redefine any settings you want to stay the
 * same.
 */
const modes = {
  'default': {
    'mode': 'default',
    'sharing': true,
    'share-qr': true,
    'share-link': true,
    'asteroid-group': 0,
    'model-stride': 16,
    'multiplier': .5,
    'min-part-conf': .5,
    'min-pose-conf': .5,
    'input-res': 257,
    'timeout': 15,
    'speed': 'default',
    'hide-cursor': false,
  },
  'kiosk': {
    'mode': 'kiosk',
    'timeout': 30,
    'hide-cursor': true,
    'multiplier': .75,
    'input-res': 417,
  },
  'kiosk-noqr': {
    'mode': 'kiosk-noqr',
    'sharing': false,
    'hide-cursor': true,
    'multiplier': .75,
    'input-res': 417,
  },
};

/**
 * The validSettings object consists of key-value paris. Each key defines the
 * name of a setting you can provide either by defining it in a mode or by
 * passing it as a url parameter. The value conists of an object with the
 * following properties:
 *   - type: one of 'string', 'bool', 'int', 'float', or
 *     'confidence' (a float value from 0 to 1)
 *   - valid: optional array of all valid values allowed by the parameter.
 */
const validSettings = {
  'sharing': {type: 'bool'},
  'share-qr': {type: 'bool'},
  'share-link': {type: 'bool'},
  'hide-cursor': {type: 'bool'},
  'timeout': {type: 'int'},
  'speed': {type: 'string', validValues: ['relaxed', 'frantic']},
  'asteroid-group': {type: 'int', validValues: [0, 1, 2, 3, 4, 5]},
  'model-stride': {type: 'int', validValues: [8, 16]},
  'multiplier': {type: 'float', validValues: [.5, .75, 1]},
  'min-part-conf': {type: 'confidence'},
  'min-pose-conf': {type: 'confidence'},
  'input-res': {
    type: 'int',
    validValues: [161, 193, 257, 289, 321, 353, 385, 417,
      449, 481, 513, 801, 1217],
  },
};

/**
 * getSettings function checks the url parameters for the mode and for each
 * of the valid settings found in the validSettings object, above. It returns
 * an object of settings and their values. The settings returned start with
 * the defaults, then apply any settings from the modes on top of those,
 * then apply any individual url paramter overrides.
 *
 * @return {Object} settings
 */
export default function getSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const overrides = {};

  const entries = Object.entries(validSettings);
  for (const [setting, properties] of entries) {
    if (!urlParams.has(setting)) {
      continue;
    }

    const {type, validValues} = properties;
    const rawValue = urlParams.get(setting);
    let value;

    if (type === 'string') {
      value = rawValue;
    } else if (type === 'bool') {
      value = (rawValue == 'true' || rawValue == '1');
    } else if (type === 'int') {
      value = parseInt(rawValue);
    } else if (type === 'float') {
      value = parseFloat(rawValue);
    } else if (type === 'confidence') {
      value = parseFloat(rawValue);
    }

    if (validValues && !validValues.includes(value)) {
      continue;
    }

    if (type === 'confidence' && (value < 0 || value > 1)) {
      continue;
    }

    overrides[setting] = value;
  }

  const rawMode = urlParams.get('mode');
  const mode = (Object.keys(modes).includes(rawMode)) ? rawMode : 'default';
  const settings = (mode === 'default')
    ? {...modes['default'], ...overrides}
    : {...modes['default'], ...modes[mode], ...overrides};

  return settings;
}
