export default class FairyControls {
  constructor() {
    this.timeInterval = null;
    this.canvas = document.getElementById("fairy-image");
    this.canvasContext = null;
    this.fairyImage = null;
    this.animationSpeed = 100;
    this.spritesImageProperties = {
      initialOffset: 5,
      spriteWidth: 44,
      lightFairy: {
        playOffsetY: 385,
        animationFrames: 15
      },
      blackFairy: {
        playOffsetY: 671,
        animationFrames: 15
      },
      outLightFairy: {
        playOffsetY: 454,
        animationFrames: 11
      },
      outBlackFairy: {
        playOffsetY: 740,
        animationFrames: 11
      },
      inBlackFairy: {
        playOffsetY: 595,
        animationFrames: 8
      },
      inLightFairy: {
        playOffsetY: 309,
        animationFrames: 8
      }
    };

    this.clearInterval = this._clearInterval.bind(this);
    this.renderFairy = this._renderFairy.bind(this);
    this.renderLightFairy = this._renderLightFairy.bind(this);
    this.renderBlackFairy = this._renderBlackFairy.bind(this);
    this.deactivateLightFairy = this._deactivateLightFairy.bind(this);
    this.deactivateBlackFairy = this._deactivateBlackFairy.bind(this);
    this.activateBlackFairy = this._activateBlackFairy.bind(this);
    this.activateLightFairy = this._activateLightFairy.bind(this);

    this.init();
  }

  init() {
    const self = this;
    this.clearInterval();
    this.canvas.width = 44;
    this.canvas.height = 53;
    this.canvasContext = this.canvas.getContext("2d");

    this.fairyImage = new Image();
    this.fairyImage.onload = function() {
      self.renderLightFairy();
    };
    this.fairyImage.src = "great-fairy.png";
  }

  _clearInterval() {
    if (this.timeInterval !== null) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  _renderFairy(spriteYPosition, spriteAnimationFrames, callbackAction) {
    const self = this;
    let currentOffset = this.spritesImageProperties.initialOffset;
    const { spriteWidth } = this.spritesImageProperties;
    this.clearInterval();

    this.timeInterval = setInterval(function() {
      if (currentOffset <= spriteWidth * spriteAnimationFrames) {
        currentOffset += spriteWidth;
      } else {
        if (callbackAction) {
          return callbackAction();
        }
        currentOffset = self.spritesImageProperties.initialOffset;
      }

      const buffer = document.createElement("canvas");
      const bufferContext = buffer.getContext("2d");
      bufferContext.drawImage(
        self.fairyImage,
        currentOffset,
        spriteYPosition,
        44,
        53,
        0,
        7,
        44,
        53
      );
      const imageData = bufferContext.getImageData(
        0,
        0,
        buffer.width,
        buffer.height
      );
      const { data } = imageData;

      const removeColor = function() {
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] === 185 && data[i + 1] === 128 && data[i + 2] === 255) {
            data[i + 3] = 0; // alpha
          }
        }

        self.canvasContext.putImageData(imageData, 0, 0);
      };

      removeColor();
    }, this.animationSpeed);
  }

  _renderLightFairy() {
    const {
      playOffsetY,
      animationFrames
    } = this.spritesImageProperties.lightFairy;

    this.renderFairy(playOffsetY, animationFrames);
  }

  _renderBlackFairy() {
    const {
      playOffsetY,
      animationFrames
    } = this.spritesImageProperties.blackFairy;

    this.renderFairy(playOffsetY, animationFrames);
  }

  _deactivateLightFairy() {
    const {
      playOffsetY,
      animationFrames
    } = this.spritesImageProperties.outLightFairy;

    this.renderFairy(playOffsetY, animationFrames, this.activateBlackFairy);
  }

  _deactivateBlackFairy() {
    const {
      playOffsetY,
      animationFrames
    } = this.spritesImageProperties.outBlackFairy;

    this.renderFairy(playOffsetY, animationFrames, this.activateLightFairy);
  }

  _activateBlackFairy() {
    const {
      playOffsetY,
      animationFrames
    } = this.spritesImageProperties.inBlackFairy;

    this.renderFairy(playOffsetY, animationFrames, this.renderBlackFairy);
  }

  _activateLightFairy() {
    const {
      playOffsetY,
      animationFrames
    } = this.spritesImageProperties.inLightFairy;

    this.renderFairy(playOffsetY, animationFrames, this.renderLightFairy);
  }
}
