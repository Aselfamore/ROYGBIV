var HandDetectionHandler = function(){
  this.shouldRunDetection = false;

  this.rightHandCache = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isActive: false
  };

  this.leftHandCache = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isActive: false
  };

  this.onRightHandStart = noop;
  this.onRightHandMove = noop;
  this.onRightHandStop = noop;

  this.onLeftHandStart = noop;
  this.onLeftHandMove = noop;
  this.onLeftHandStop = noop;
}

HandDetectionHandler.prototype.start = function(){
  var that = this;
  handTrack.startVideo(videoElement).then(function(status) {
    if (!status){
      that.onVideoNotEnabled();
      return;
    }

    that.shouldRunDetection = true;
  });
}

HandDetectionHandler.prototype.stop = function(){
  handTrack.stopVideo();
}

HandDetectionHandler.prototype.onVideoNotEnabled = function(){

}

HandDetectionHandler.prototype.handleDetectedHand = function(x, y, width, height){

  var isRightSide = x >= HANDTRACK_VIDEO_WIDTH /2;

  if (isRightSide){
    if (this.rightHandCache.isActive){
      var dx = x - this.rightHandCache.x;
      var dy = y - this.rightHandCache.y;
      this.onRightHandMove(x, y, width, height, dx, dy);
    }else{
      this.onRightHandStart(x, y, width, height);
    }
    this.rightHandCache.x = x;
    this.rightHandCache.y = y;
    this.rightHandCache.width = width;
    this.rightHandCache.height = height;
    this.rightHandCache.isActive = true;
  }else{
    if (this.leftHandCache.isActive){
      var dx = x - this.leftHandCache.x;
      var dy = y - this.leftHandCache.y;
      this.onLeftHandMove(x, y, width, height, dx, dy);
    }else{
      this.onLeftHandStart(x, y, width, height);
    }
    this.leftHandCache.x = x;
    this.leftHandCache.y = y;
    this.leftHandCache.width = width;
    this.leftHandCache.height = height;
    this.leftHandCache.isActive = true;
  }
}

HandDetectionHandler.prototype.runDetection = function(){
  if (!this.shouldRunDetection){
    return;
  }

  var that = this;
  handTrackModel.detect(videoElement).then(function(predictions){

    var rightHandFound = false;
    var leftHandFound = false;

    for (var i = 0; i < predictions.length; i ++){
      var bbox = predictions[i].bbox;
      if (bbox[0] >= HANDTRACK_VIDEO_WIDTH / 2){
        rightHandFound = true;
      }else{
        leftHandFound = true;
      }
      that.handleDetectedHand(bbox[0], bbox[1], bbox[2], bbox[3]);
    }

    if (!rightHandFound){
      if (that.rightHandCache.isActive){
        that.onRightHandStop();
      }
      that.rightHandCache.isActive = false;
    }

    if (!leftHandFound){
      if (that.leftHandCache.isActive){
        that.onLeftHandStop();
      }
      that.leftHandCache.isActive = false;
    }
  });
}
