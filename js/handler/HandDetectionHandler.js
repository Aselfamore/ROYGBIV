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

HandDetectionHandler.prototype.handleDetectedHand = function(prediction){
  
}

HandDetectionHandler.prototype.runDetection = function(){
  if (!this.shouldRunDetection){
    return;
  }

  var that = this;
  handTrackModel.detect(videoElement).then(function(predictions){
    for (var i = 0; i < predictions.length; i ++){
      that.handleDetectedHand(predictions[0]);
    }
  });
}
