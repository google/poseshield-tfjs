# Pose Shield

Defend your spacecraft from asteroids by striking a pose to control its
forcefields! Pose Shield is an experimental web-based game powered by 
TensorFlow.js and PoseNet.

You can learn more about this experiment or try it out online by heading to
g.co/poseshield.

## Tech stack

These are some of the tools which were used in the implementation of
this project:
* [TensorFlow.js](https://www.tensorflow.org/js) and [PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) handle pose estimation
* [Vue.js](https://vuejs.org/) was used to implement the user interface
* [GSAP](https://github.com/greensock/GreenSock-JS) was used for animations

## Development

### Prerequisites
* Yarn (tested on 1.17.3)
* Node.js (tested on 12.8.0)

If you are missing these dependencies, on OS X you can install them using
[HomeBrew](https://brew.sh/). Once you've installed Brew:

```
brew install yarn
```

### Running Pose Shield locally

You can use the following Yarn commands to run Pose Shield on your
own machine. When running it locally, you'll find the demo here:
http://127.0.0.1:8080/play/

```
# Install dependencies
yarn install

# Serve the demo locally with hot-reloading for development
yarn serve

# Build the demo out to static, minified files in "dist"
yarn build
```

### Where to start reading the code

A lot of this codebase is related primarily to user interface, animating 
asteroids, and managing state. If you are mostly interested in checking out
how the pose estimation works, you might want to start by looking at one of
the following files:
* `src/lib/PoseNetAdapter.js`: all of the interaction with PoseNet happens
  here. Handles getting pose estimations, detecting certain basic poses 
  used by the game, and drawing the pose outline.
* `src/components/ZoneDetector.vue`: this component is in charge of using
  PoseNetAdapter to perform game-specific logic (such as determining when
  specific forcefields are activated) and updating the app's state with this
  information.

### URL parameters

Pose Shield implements several URL parameters that can be used to modify its
settings. Many of these parameters are related to the 
[parameters of the PoseNet model] (https://github.com/tensorflow/tfjs-models/tree/master/posenet#config-params-in-posenetload).

By default, Pose Shield is configured to use PoseNet settings which are 
suitable for slower CPUs and machines without higher end GPUs. If you have
a faster machine, you might want to try changing some of these parameters
to see how it impacts the performance of the model.

First up, you might want to try changing to one of the predefined "modes",
which are combinations of settings given a name. The valid modes are:

* `default`: these are the base settings used when no mode is set
* `kiosk`: this mode uses somewhat higher end settings
* `kiosk-noqr`: the same as `kiosk`, but with the QR-code based social sharing
   turned off.

You would set a mode by adding it to the URL like this:
* Online: https://poseshield.withgoogle.com/play?mode=kiosk
* Running locally: https://127.0.0.1:8080/play?mode=kiosk

Parameters can also be set individually. If you set an individual parameter, it
will override whatever settings came from any mode you may have already chosen.

The available parameters are as follows:
 * `share-qr`: true (default) or false. This disables the QR Code that would otherwise be displayed on the share screen at the end of the game.
 * `share-link`: true (default) or false. This disables the poseshield.withgoogle.com url that would otherwise be displayed on the share screen at the end of the game.
 * `sharing`: true (default) or false. This adds the ability to disable `share-qr` and `share-link` at once. Will override individual settings.
 * `timeout`: number of seconds (default = 15, and must be between 10 and 120) the application will wait the timeout duration before resetting states after a game is completed or if no person is detected.
 * `asteroid-group`: value between 0 and 5 (default = 0). This selects a specific asteroid script for gameplay. If set to 0, it will choose randomly between the 5 available scripts.
 * `model-stride`: 8 or 16 (default). Sets the model's output stride. The smaller the number, the more accurate the model but the slower the application.
 * `multiplier`: 0.5 (default), 0.75 or 1.0. Sets the number of channels used for all convolution operations. The larger the number, the more accurate the model but the slower the application.
 * `input-res`: an integer which defaults to 257 and must be one of the following: 161|193|257|289|321|353|385|417|449|481|513|801|1217. Specifies the size the input image is scaled to before feeding it through the PoseNet model. The larger the number, the more accurate the model but the slower the application.
 * `min-part-conf` - a value between 0 and 1 (default = 0.5). It sets the threshold for body part detection.
 * `min-pose-conf` - a value between 0 and 1 (default = 0.5). It sets the threshold for pose detection.

Here's an example of setting these parameters: 
* Online: https://poseshield.withgoogle.com/play?input-res=289&multiplier=.75
* Running locally: http://127.0.0.1:8080/play?input-res=289&multiplier=.75

### Debugging in the browser

There are some helpful shortcuts you can use to turn debugging features of
the demo on and off, or skip around different modes of the game:

* `v`: toggle video feed on and off
* `z`: toggle video overlay of where the zones are detected. These are used to
  determine which forcefield to activate based on your arm positions
* `d`: switch to debug mode. Turns on video and zones, as well as a 
  framerate display. Once in debug mode, you can also use the following keys:
  * `space bar`: Turn off pose estimation completely (can be useful in 
    development if your machine is struggling with performance)
  * `a` to jump to the attract screen
  * `p` to do the initial pose activation
  * `c` to jump to the calibration screen
  * `g` to jump to the game
  * `s` to jump to the share screen
  * `e` to jump to the error screen
  * use the numbers `1-7` to activate shields with the keyboard.

## License

Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Final Thoughts

This is not an official Google product. We will do our best to support and maintain this experiment but your mileage may vary.

We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators’ rights, including copyright and trademark rights when present, when sharing these works and creating derivative work.

If you want more info on Google's policy, you can find that [here](https://policies.google.com/).


