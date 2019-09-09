<!--
  ZoneDetector.vue serves as the middleware for the front-end and
  PoseNet.
  ZoneDetector is initialized in App.vue and is passed a video stream
  and the state machine's store object. It gets data from
  PoseNet via PosenetAdapter.js and updates the state machine
  accordingly for rendering and gameplay on the front end.

  Usage:
    import ZoneDetector from './plugins/ZoneDetector.vue'
    ZoneDetector.data.initialize(this.video: HTMLVideoElement, store)
-->

<script>
import PoseNetAdapter from '../lib/PoseNetAdapter';

export default {
  name: 'ZoneDetector',

  methods: {
    /**
     * Creates an instance of PosenetAdapter and maps out the
     * zones necessary for gameplay.
     *
     * @param {HTMLVideoElement} videoStream
     * @param {Vuex.Store} store
     */
    initialize(videoStream, store) {
      this.store = store;
      // configuration settings for the model you want to load in
      // the model you would like to use
      // settings can be changed using url parameters, refer to README
      // for more details
      this.modelConfig = {
        architecture: 'MobileNetV1',
        outputStride: this.store.state.modelStride,
        inputResolution: this.store.state.inputResolution,
        multiplier: this.store.state.multiplier,
        quantBytes: 4,
      };
      // threshold settings can be changed using url parameters, refer
      // to README for more details
      this.adapter =
        new PoseNetAdapter(
            videoStream,
            this.modelConfig,
            this.store.state.minPartConfidence,
            this.store.state.minPoseConfidence,
        );
      this.updateZonesToggle = true;
      this.cavnas = null;
      this.ctx = null;
      this.frameCount = 0;
      this.request = null;
      this.reset = false;
      this.videoHeight = videoStream.height;
      this.videoStream = videoStream;
      this.videoWidth = videoStream.width;
      this.zones = [];
      this.zone_one = {
        id: 0,
        polygon: [],
        store: 'toggleZoneDetectedOne',
      };
      this.zones.push(this.zone_one);

      this.zone_two = {
        id: 1,
        polygon: [],
        store: 'toggleZoneDetectedTwo',
      };
      this.zones.push(this.zone_two);

      this.zone_three = {
        id: 2,
        polygon: [],
        store: 'toggleZoneDetectedThree',
      };
      this.zones.push(this.zone_three);

      this.zone_four = {
        id: 3,
        polygon: [],
        store: 'toggleZoneDetectedFour',
      };
      this.zones.push(this.zone_four);

      this.zone_five = {
        id: 4,
        polygon: [],
        store: 'toggleZoneDetectedFive',
      };
      this.zones.push(this.zone_five);

      this.zone_six = {
        id: 5,
        polygon: [],
        store: 'toggleZoneDetectedSix',
      };
      this.zones.push(this.zone_six);

      this.zone_seven = {
        id: 6,
        polygon: [],
        store: 'toggleZoneDetectedSeven',
      };
      this.zones.push(this.zone_seven);

      // Animate is disabled until we can sort out performance issues
      this.animate();
    },

    /**
     * Checks if all zones habe been activated for calibration step.
     */
    calibrate() {
      if (this.store.state.zoneDetectedOne &&
        this.store.state.zoneDetectedTwo &&
        this.store.state.zoneDetectedThree &&
        this.store.state.zoneDetectedFour &&
        this.store.state.zoneDetectedFive &&
        this.store.state.zoneDetectedSix &&
        this.store.state.zoneDetectedSeven) {
        this.store.commit('setCalibrated', true);
      }
    },

    /**
     * Gets continuous data updates from model inference by calling
     * this.getPose().
     */
    animate() {
      const self = this;
      this.frameCount++;
      this.request =
          requestAnimationFrame(self.animate.bind(self));

      if (this.adapter.networkPoseLoaded
        && this.store.state.zoneDetectedLoaded === false) {
        this.store.commit('setZoneDetectedLoaded', true);
      }

      this.getPose();
    },

    /**
     * Updates the `this.currentPose` and the data in store.
     */
    getPose() {
      // If we have reached the end of the game but not yet restarted
      // the model
      if (this.store.state.activeState === 'share' &&
        !this.reset) {
        this.reset = true;
        this.adapter =
          new PoseNetAdapter(
              this.videoStream,
              this.modelConfig,
              this.store.state.minPartConfidence,
              this.store.state.minPoseConfidence,
          );
        this.adapter.getCanvas(this.canvas, this.ctx);
      }

      if (this.store.state.activeState === 'attract' && this.reset) {
        this.reset = false;
      }

      if (this.adapter.isPersonDetected &&
          !this.store.state.hasPerson) {
        this.store.commit('setTogglePersonDetected', true);
      }

      if (this.adapter.isPersonDetected && !this.store.state.poseActivated) {
        this.getActivationPose();
      }

      if (this.store.state.hasPerson && !this.adapter.isPersonDetected) {
        this.store.commit('setTogglePersonDetected', false);
      }

      if (!this.store.state.calibrated && this.store.state.poseActivated) {
        this.calibrate();
      }

      if (this.canvas) {
        this.adjustZones();
        if (this.store.state.displayZones || this.store.state.debugBar) {
          this.drawZones();
        }
      }

      if ((this.store.state.poseActivated || this.store.state.calibrated) &&
      this.store.state.activeState !== 'share' &&
      this.store.state.gameState !== 'countdown') {
        if (this.updateZonesToggle) this.updateForceField();
        // updates PoseNet data that is rendered every 25 frames
        if (this.frameCount % 25 === 0) {
          this.store.commit('setPoseData', this.adapter.codeOutput);
        }
      }
      if (this.store.state.activeState !== 'share') {
        this.adapter.update();
      }
    },

    /**
     * Checks is user is correctly posing to activate gameplay.
     * If so, updates the data in the store to reflect the changes.
     */
    getActivationPose() {
      const self = this;
      const activated =
        this.adapter.checkForActivationPose();
      if (activated) {
        this.store.commit('setPoseActivated', true);
        this.updateZonesToggle = false;
        setTimeout( function() {
          self.updateZonesToggle = true;
        }, 2000);
      }
    },

    /**
     * Uses a ray casting algotithm to determine if the
     * given point is inside the given polygon. This will be used
     * to determine which zone the user's hands are currently in.
     *
     * Ray casting determines if a point is in a shape by casting
     * a horizontal ray from the left and counting how many times it
     * hits an edge of the given shape. If it is an odd number of
     * times, the point is inside the shape, and if it is even, we
     * conclude that the point lies outside of the polygon.
     */

    isInside(point, polygon) {
      const x = point.x;
      const y = point.y;

      let inside = false;
      let j = polygon.length - 1;
      for (let i = 0; i < polygon.length; i++) {
        if (i !== 0) {
          j = i - 1;
        }
        const xi = polygon[i][0];
        const yi = polygon[i][1];
        const xj = polygon[j][0];
        const yj = polygon[j][1];

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }

      return inside;
    },

    /**
     * Indicates which zone the user's hands are currently in.
     */
    updateForceField() {
      const armPositions = this.adapter.getArmPositions();
      const activatedZones = [];
      this.zones.forEach((zone) => {
        armPositions.forEach((joint) => {
          if (this.isInside(joint.position, zone.polygon)) {
            activatedZones.push(zone.store);
          } else {
            if (this.store.state.calibrated) {
              this.store.commit(zone.store, false);
            }
          }
        });
      });
      activatedZones.forEach((toggle) => {
        this.store.commit(toggle, true);
      });
    },

    /**
     * Adjusts the placement of zones relative to the user's shoulders.
     */
    adjustZones() {
      let zoneHeight;
      let center = this.videoWidth / 2;
      const oneThird = 1 / 3 * this.videoWidth;
      const twoThird = 2 / 3 * this.videoWidth;
      const oneEigth = 1 / 10 * this.videoWidth;
      const sevenEigth = 9 / 10 * this.videoWidth;
      let shoulderLeft;
      let shoulderRight;

      if (this.adapter.shoulders.length === 2) {
        zoneHeight = (this.adapter.shoulders[0][1] +
          this.adapter.shoulders[1][1]) / 2;
        zoneHeight = zoneHeight * 2;
        center = (this.adapter.shoulders[0][0] +
          this.adapter.shoulders[1][0]) / 2;
      } else {
        zoneHeight = this.videoHeight;
      }


      shoulderLeft = oneThird;
      shoulderRight = twoThird;

      if (this.adapter.shoulders.length == 2) {
        shoulderLeft = this.adapter.shoulders[0][0];
        shoulderRight = this.adapter.shoulders[1][0];
      } else {
        shoulderLeft = oneThird;
        shoulderRight = twoThird;
      }

      this.zone_one.polygon = [
        [0, zoneHeight],
        [0, 2 / 3 * zoneHeight],
        [center, 2 / 3 * zoneHeight],
        [center, zoneHeight],
      ];

      this.zone_two.polygon = [
        [0, 2 / 3 * zoneHeight],
        [0, 1 / 2 * zoneHeight],
        [shoulderLeft, 1 / 2 * zoneHeight],
        [shoulderLeft, 2 / 3 * zoneHeight],
      ];

      this.zone_three.polygon = [
        [0, 0],
        [oneEigth, 0],
        [shoulderLeft, 1 / 2 * zoneHeight],
        [0, 1 / 2 * zoneHeight],
      ];

      this.zone_four.polygon = [
        [oneEigth, 0],
        [sevenEigth, 0],
        [shoulderRight, 1 / 2 * zoneHeight],
        [shoulderLeft, 1 / 2 * zoneHeight],
      ];

      this.zone_five.polygon = [
        [sevenEigth, 0],
        [this.videoWidth, 0],
        [this.videoWidth, 1 / 2 * zoneHeight],
        [shoulderRight, 1 / 2 * zoneHeight],
      ];

      this.zone_six.polygon = [
        [shoulderRight, 1 / 2 * zoneHeight],
        [this.videoWidth, 1 / 2 * zoneHeight],
        [this.videoWidth, 2 / 3 * zoneHeight],
        [shoulderRight, 2 / 3 * zoneHeight],
      ];

      this.zone_seven.polygon = [
        [center, 2 / 3 * zoneHeight],
        [this.videoWidth, 2 / 3 * zoneHeight],
        [this.videoWidth, zoneHeight],
        [center, zoneHeight],
      ];
    },

    /**
     * Updates video width and height
     * @param {Number} width
     * @param {Number} height
     */
    updateDimensions(width, height) {
      this.videoWidth = width;
      this.videoHeight = height;
    },

    /**
     * Draws zones onto canvas for debugging
     */
    drawZones() {
      this.zones.forEach((x) => {
        let j = x.polygon.length - 1;
        for (let i = 0; i < x.polygon.length; i++) {
          if (i !== 0) {
            j = i - 1;
          }
          this.ctx.beginPath();
          this.ctx.moveTo(x.polygon[i][0], x.polygon[i][1]);
          this.ctx.lineTo(x.polygon[j][0], x.polygon[j][1]);
          this.ctx.stroke();
        }
      });
    },

    /**
     * Passes the canvas to the adapter.
     * @param {HTMLCanvasElement} canvas
     */
    drawSkeleton(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.adapter.getCanvas(this.canvas, this.ctx);
    },
  },
};
</script>
