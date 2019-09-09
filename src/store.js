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

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let attractTimerId;
const gameTimerSeconds = 60;

export default new Vuex.Store({
  state: {
    activeState: 'attract',
    gameState: 'inactive',
    hasPerson: false,
    poseActivated: false,
    calibrated: false,
    gameCompleted: false,
    videoFeed: false,
    poseData: {},
    zoneDetectedLoaded: false,
    zoneDetectedInstance: false,
    zoneDetectedOne: false,
    zoneDetectedTwo: false,
    zoneDetectedThree: false,
    zoneDetectedFour: false,
    zoneDetectedFive: false,
    zoneDetectedSix: false,
    zoneDetectedSeven: false,
    debugBar: false,
    demoMode: true,
    videoToggle: false,
    displayZones: false,
    gameRank: 'first',
    gameScore: 1.0,
    gameTime: gameTimerSeconds,
    gameTimeCountDown: gameTimerSeconds,
    gameCountDownToPlay: 3,
    asteroidCounter: 30,
    asteroidTotalCount: 30,
    asteroidHits: 0,
    asteroidBlocks: 30,
    asteroidBlocksText: '30',
    share_qr: true,
    share_link: true,
    asteroidGroup: 0,
    modelStride: 16,
    minPartConfidence: .5,
    minPoseConfidence: .5,
    inputResolution: 257,
    multiplier: .5,
    noVideo: false,
    errorState: false,
    globalTimeout: 15000,
    mode: 'default',
    speed: 'default',
    hideCursor: false,
  },
  getters: {
    activeState: (state) => {
      state.activeState;
    },
    hasPerson: (state) => {
      state.hasPerson;
    },
    gameState: (state) => {
      state.gameState;
    },
    poseActivated: (state) => {
      state.poseActivated;
    },
    calibrated: (state) => {
      state.calibrated;
    },
    gameCompleted: (state) => {
      state.gameCompleted;
    },
    videoFeed: (state) => {
      state.videoFeed;
    },
    zoneDetectedInstance: (state) => {
      state.zoneDetectedInstance;
    },
    zoneDetectedOne: (state) => {
      state.zoneDetectedOne;
    },
    zoneDetectedTwo: (state) => {
      state.zoneDetectedTwo;
    },
    zoneDetectedThree: (state) => {
      state.zoneDetectedThree;
    },
    zoneDetectedFour: (state) => {
      state.zoneDetectedFour;
    },
    zoneDetectedFive: (state) => {
      state.zoneDetectedFive;
    },
    zoneDetectedSix: (state) => {
      state.zoneDetectedSix;
    },
    zoneDetectedSeven: (state) => {
      state.zoneDetectedSeven;
    },
    gameScore: (state) => {
      state.gameScore;
    },
    asteroidTotalCount: (state) => {
      state.asteroidTotalCount;
    },
    asteroidCounter: (state) => {
      state.asteroidCounter;
    },
    asteroidHits: (state) => {
      state.asteroidHits;
    },
  },
  mutations: {
    // Application state manager
    setStates(state) {
      if (state.noVideo === true) {
        // User has blocked camera permissions
        // change state to no-video
        state.activeState = 'no-video';
      } else if (state.errorState == true) {
        // General error state
        state.activeState = 'generic-error';
      } else {
        if (state.activeState === 'attract' &&
          state.hasPerson && state.poseActivated && !state.gameCompleted) {
          // Person Detected, Pose Detected, Not Calibrated
          // and Not Game Complete -
          // changing state to calibration
          state.activeState = 'calibration';
        } else if (state.activeState === 'calibration' && state.hasPerson &&
          state.poseActivated && state.calibrated && !state.gameCompleted) {
          // Person Detected, Pose Detected, Calibration Complete
          // and Not Game Complete -
          // changing state to game
          state.activeState = 'game';
        } else if (state.activeState === 'game' && state.poseActivated &&
          state.calibrated && !state.gameCompleted) {
          // In game state - toggling between three states;
          // Error, Countdown, Playing
          if (state.gameCountDownToPlay !== 0) {
            // Game state - Need to Countdown
            // Setting Countdown state
            state.gameState = 'countdown';
          } else if (!state.hasPerson) {
            // Game state - No person detected - Error state
            state.gameState = 'error';
          } else {
            // Game state - Person Detected - Countdown is zero - Playing etate
            state.gameState = 'playing';
          }
        } else if (state.activeState === 'game' && state.hasPerson &&
          state.poseActivated && state.calibrated && state.gameCompleted) {
          // Person Detected, Pose Detected, Calibration Completed,
          // Game Completed -
          // changing state to share
          state.activeState = 'share';
          state.gameState = 'inactive';
        } else if (state.activeState === 'attract') {
          // Application is in attract
          // resetting application states
          setTimeout(function() {
            state.asteroidBlocksText = '30';
            state.asteroidBlocks = 30;
            state.asteroidCounter = 30;

            if (state.speed == 'frantic') {
              state.asteroidCounter = 60;
              state.asteroidBlocks = 60;
              state.asteroidBlocksText = '60';
            } else if (state.speed == 'relaxed') {
              state.asteroidCounter = 15;
              state.asteroidBlocks = 15;
              state.asteroidBlocksText = '15';
            }

            state.asteroidHits = 0;
            state.gameScore = 1;
            state.gameRank = 'first';
            state.gameTimeCountDown = state.gameTime;
            state.gameCountDownToPlay = 3;
          }, 500);
        }
      }
    },

    // Toggling if a person/pose is detected
    setTogglePersonDetected(state, data) {
      state.hasPerson = data;
    },

    // Lost person/pose timeout to reset application if no person/pose
    // within a timeframe set in the environments variable
    setHasPerson(state) {
      if (!state.hasPerson && !state.gameCompleted) {
        if (attractTimerId) clearTimeout(attractTimerId);
        // No person detected - setting attract timeout
        attractTimerId = setTimeout(function() {
          // Resetting - application state to Attract
          state.activeState = 'attract';
          state.gameState = 'inactive';
          state.calibrated = false;
          state.gameCompleted = false;
          state.poseActivated = false;
        }, state.globalTimeout);
      } else if (state.hasPerson && !state.gameCompleted) {
        // Person Detected - clearing attract timeout
        if (attractTimerId) clearTimeout(attractTimerId);
      }
    },

    // Game complete timeout to reset application after game completion
    setGameCompletedTimeout(state) {
      if (state.gameCompleted) {
        if (attractTimerId) clearTimeout(attractTimerId);
        // Game Completed - setting application reset timer
        attractTimerId = setTimeout(function() {
          // Reset all states application to attract/intro state
          state.activeState = 'attract';
          state.gameState = 'inactive';
          state.calibrated = false;
          state.gameCompleted = false;
          state.poseActivated = false;
        }, state.globalTimeout);
      } else if (!state.gameCompleted) {
        if (attractTimerId) clearTimeout(attractTimerId);
      }
    },

    // Set game completed to true
    setGameCompleted(state) {
      state.gameCompleted = true;
    },

    // Set the video feed to a global state
    setVideoFeed(state, data) {
      state.videoFeed = data;
    },

    // Update pose activation
    setPoseActivated(state, data) {
      Vue.set(state, 'poseActivated', data);
    },

    // Update calibration status so game play can begin
    setCalibrated(state, data) {
      state.calibrated = data;
    },

    // Update pose data
    setPoseData(state, data) {
      Vue.set(state, 'poseData', data);
    },

    // Set zoneDetectedLoaded
    setZoneDetectedLoaded(state, data) {
      state.zoneDetectedLoaded = data;
    },

    // Set the ZoneDetectedInstance
    setZoneDetectedInstance(state, data) {
      state.zoneDetectedInstance = data;
    },

    // Toggling zone state
    toggleZoneDetectedOne(state, data) {
      state.zoneDetectedOne = data;
    },

    toggleZoneDetectedTwo(state, data) {
      state.zoneDetectedTwo = data;
    },

    toggleZoneDetectedThree(state, data) {
      state.zoneDetectedThree = data;
    },

    toggleZoneDetectedFour(state, data) {
      state.zoneDetectedFour = data;
    },

    toggleZoneDetectedFive(state, data) {
      state.zoneDetectedFive = data;
    },

    toggleZoneDetectedSix(state, data) {
      state.zoneDetectedSix = data;
    },

    toggleZoneDetectedSeven(state, data) {
      state.zoneDetectedSeven = data;
    },

    asteroidCollision(state, data) {
      if (state.asteroidCounter > 0) {
        if (data === 'hit') {
          state.asteroidHits++;
          state.asteroidBlocks--;

          state.asteroidBlocksText =
             (state.asteroidBlocks < 10) ?
             '0' + state.asteroidBlocks.toString() :
              state.asteroidBlocks.toString();

          state.gameScore =
            Number((state.asteroidTotalCount - state.asteroidHits) /
              state.asteroidTotalCount);

          if (state.gameScore == 0) state.gameScore = 0.01;

          if (state.gameScore >= 0.75) {
            state.gameRank = 'first';
          } else if (state.gameScore >= 0.5) {
            state.gameRank = 'second';
          } else if (state.gameScore >= 0.25) {
            state.gameRank = 'third';
          } else {
            state.gameRank = 'fourth';
          }
        }

        state.asteroidCounter--;
      }
    },
  },
  actions: {},
});
