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

/** PoseNetAdapter.js works with PoseNet to handle the details of loading
 * the model and getting continuous updates on detected poses.
 *
 * Usage:
 *  adapter = new PoseNetAdapter(video: HTMLVideoElement, config**,
 *            minPartConf, minPoseConf)
 *
 * ** config is an object of model configuration settings:
 *    architecture - MobileNetV1
 *    outputStride - 8 or 16 (default). The smaller the number, the more
 *                   accurate the model but the slower the application.
 *    inputResolution - 161 | 193 | 257 (default)| 289 | 321 | 353 | 385 |
 *                      417 | 449 | 481 | 513 | 801 | 1217
 *                      The larger the number, the more accurate the model,
 *                      but the slower the application.
 *    multiplier - 0.5 (default), 0.75 or 1.0. Sets the number of channels used
 *                 for all convolution operations. The larger the number, the
 *                 more accurate the model but the slower the application.
 *    quantBytes - 1, 2 or 4 (default). This parameter affects weight
 *                 quantization in the models. The larger the number, the
 *                 more accurate the model but the slower the application.
 * }
*/

import * as posenet from '@tensorflow-models/posenet';

/**
 * Contains all the variables and functions needed to
 * load and gather data from PoseNet, as well as render the
 * given model's output to a canvas.
 */
class PoseNetAdapter {
  /**
   * @param {HTMLVideoElement} videoStream
   * @param {Object} config - collection of model configuration params
   * @param {Number} minPartConf - threshold for body part detection
   * @param {Number} minPoseConf - threshold for pose detection
   */
  constructor(videoStream, config, minPartConf, minPoseConf) {
    this.adjacentKeyPoints = false;
    this.networkPoseLoaded = false;
    this.architecture = config.architecture;
    this.canvas = null;
    this.codeOutput = {
      'leftShoulder': {},
      'rightShoulder': {},
      'leftWrist': {},
      'rightWrist': {},
    };
    this.ctx = null;
    this.currentPose = false; // array of keypoints and pose probability
    this.flipPoseHorizontal = true;
    this.isPersonDetected = false;
    this.inputResolution = config.inputResolution;
    this.maxDetections = 1; // max # of poses that can be detected in a frame
    this.minPartConfidence = minPartConf; // for body part detection
    this.minPoseConfidence = minPoseConf; // for pose detection
    this.multiplier = config.multiplier;
    this.network = null; // PoseNet
    this.outputStride = config.outputStride;
    this.quantBytes = config.quantBytes;
    this.scale = 1; // what scale to draw skeleton on canvas
    this.shoulders = []; // y-coordinate of shoulders for zone adjustments
    this.videoStream = videoStream;

    this.init();
  }

  /**
   * Loads PoseNet model and calls `this.updateKeypoints()` to
   * get data from the PoseNet model's inference.
   */
  async init() {
    this.network = await posenet.load({
      architecture: this.architecture,
      outputStride: this.outputStride,
      inputResolution: this.inputResolution,
      multiplier: this.multiplier,
    });
    this.updateKeypoints();
  }

  /**
   * Gets the x positions of the shoulders for a given pose.
   * @param {Object} pose
   * @return {Array} - shoulder x positions
   */
  getShoulders(pose) {
    const xPositions = [];
    pose.forEach((joint) => {
      if (joint.part === 'leftShoulder') {
        xPositions.push(joint.position.x);
      }
      if (joint.part === 'rightShoulder') {
        xPositions.push(joint.position.x);
      }
    });
    return xPositions;
  }

  /**
   * Given data about a single pose, getAveragePostion returns the
   * horizontal center of the pose based on the midpoint of the shoulders'
   * x positions.
   * @param {Object} pose - PoseNet data for a single detected pose
   * @return {Number} - the average x position of the shoulders
   */
  getAveragePosition(pose) {
    const points = this.getShoulders(pose);
    return (points[0] + points[1]) / 2;
  }

  /**
   * If the given point is in the middle 33% of the screen, it returns
   * true, otherwise false.
   * @param {Number} point
   * @return {Boolean}
   */
  isPoseCentered(point) {
    if (point > this.videoStream.width / 3 &&
      point < this.videoStream.width * 2 / 3) {
      return true;
    }
    return false;
  }

  /**
   * Gets data about the currently detected poses and filters through
   * them to prevent select the most centered and clearly displayed pose.
   */
  async updateKeypoints() {
    if (this.network) {
      const poses = await this.network.estimateMultiplePoses(
          this.videoStream, {
            flipHorizontal: this.flipPoseHorizontal,
            scoreThreshold: this.minPartConfidence,
          }
      ).then((res) => {
        this.networkPoseLoaded = true;
        return Promise.resolve(res);
      });

      // if no one is detected
      if (poses.length === 0) {
        this.currentPose = null;
      // if only one person is detected, confirm that they are centered
      // to set this.currentPose
      } else if (poses.length === 1) {
        const average = this.getAveragePosition(poses[0].keypoints);
        if (this.isPoseCentered(average)) {
          this.currentPose = poses[0];
        }
      // if there are multiple people detected, find the ones that
      // are centered and select the one with the highest scoring pose
      } else {
        let bestPose = null;
        let i = 0;
        let bestScore = null;
        while (!bestPose && i < poses.length) {
          const average = this.getAveragePosition(poses[i].keypoints);
          if (this.isPoseCentered(average)) {
            bestPose = poses[i];
            bestScore = poses[i].score;
          }
          i++;
        }
        for (let j = i; j < poses.length; j++) {
          const pose = poses[j];
          const avg = this.getAveragePosition(pose.keypoints);
          if (this.isPoseCentered(avg)) {
            if (pose.score > bestScore) {
              bestPose = pose;
              bestScore = pose.score;
            }
          }
        }
        this.currentPose = bestPose;
      }
      if (this.currentPose) {
        this.drawSkeleton(this.currentPose.keypoints);
        if (this.currentPose.score > this.minPoseConfidence) {
          this.isPersonDetected = true;
        }
      } else {
        this.isPersonDetected = false;
        if (this.ctx) {
          this.ctx.clearRect(
              0, 0, this.canvas.width, this.canvas.height);
        }
      }
    }
  }

  /**
   * Checks if hands are above nose to indicate that user
   * is ready to play the game.
   * @return {boolean}
   */
  checkForActivationPose() {
    const arms = this.getArmPositions();
    if (arms.length < 2) {
      return false;
    }
    // nose is the first thing in the array
    const nose = this.currentPose.keypoints[0];
    if (nose.score >= this.minPartConfidence) {
      const noseYPosition = nose.position.y;
      if (noseYPosition > arms[0].position.y &&
        noseYPosition > arms[1].position.y) {
        return true;
      }
    }
    return false;
  }


  /**
   * getArmPositions return an array of objects which containing
   * wrist and elbow coordinates.
   * eg. [{part: "leftElbow", score: 0.78, position: {x: 100, y: 100}}]
   *
   * @return {array}
   */
  getArmPositions() {
    const armPositions = [];
    this.shoulders = [];
    if (this.isPersonDetected) {
      const joints = this.currentPose.keypoints;
      joints.forEach((joint) => {
        if ((joint.part === 'leftShoulder' ||
          joint.part === 'rightShoulder') &&
          joint.score >= this.minPartConfidence ) {
          if (joint.part === 'leftShoulder') {
            this.codeOutput.leftShoulder = joint;
          } else {
            this.codeOutput.rightShoulder = joint;
          }
          this.shoulders.push([joint.position.x, joint.position.y]);
        }
        if ((joint.part === 'leftWrist' || joint.part === 'rightWrist') &&
          joint.score >= this.minPartConfidence) {
          armPositions.push(joint);
          if (joint.part === 'leftWrist') {
            this.codeOutput.leftWrist = joint;
          } else {
            this.codeOutput.rightWrist = joint;
          }
        }
      });
    }
    return armPositions;
  }

  /**
   * Initializes canvas for pose skeleton drawing
   * @param {HTMLCanvasElement} canvas for drawing PoseNet skeleton
   * @param {CanvasContext} ctx
   */
  getCanvas(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Draws the points that represent the joints
   * @param {Object} point
   * @param {Number} radius
   */
  drawPoint(point, radius) {
    const x = point.x * this.scale;
    const y = point.y * this.scale;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
  }

  /**
   * Given an array of keypoints from PoseNet,
   * it draws the skeleton on to the canvas
   *
   * @param {array} keypoints
   */
  drawSkeleton(keypoints) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < this.minPartConfidence) {
        continue;
      }
      this.drawPoint(keypoint.position, 3);
    }
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
        keypoints, this.minPoseConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
      this.drawSegment(keypoints[0].position, keypoints[1].position);
    });
  }

  /**
   * Draws skeleton on canvas
   * @param {Object} start
   * @param {Object} end
   */
  drawSegment(start, end) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x * this.scale, start.y * this.scale);
    this.ctx.lineTo(end.x * this.scale, end.y * this.scale);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#fff';
    this.ctx.stroke();
  }

  /**
   * This function gets called every few frames and updates the
   * store and canvas and pose data.
   */
  update() {
    this.updateKeypoints();
    this.getArmPositions();
  }
}

export default PoseNetAdapter;
