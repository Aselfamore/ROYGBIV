var HandDetectionHandler = function(){
  this.shouldRunDetection = false;
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

  
}

HandDetectionHandler.prototype.runDetection = function(){
  if (!this.shouldRunDetection){
    return;
  }

  var that = this;
  handTrackModel.detect(videoElement).then(function(predictions){
    for (var i = 0; i < predictions.length; i ++){
      var bbox = predictions[i].bbox;
      that.handleDetectedHand(bbox[0], bbox[1], bbox[2], bbox[3]);
    }
  });
}
