var _viewer;
var _rotInterval = {lastx:0,lasty:90,lastz:0}; 

function ISYExtensionDeviceOrientation(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);

  _viewer = viewer;
}

ISYExtensionDeviceOrientation.prototype = Object.create(Autodesk.Viewing.Extension.prototype);

ISYExtensionDeviceOrientation.prototype.load = function () {
  console.log('ISYExtensionDeviceOrientation loaded');

/*  if(window.DeviceOrientationEvent){
      _rotInterval = {lastx:0,lasty:90,lastz:0}; 
      window.addEventListener("deviceorientation", orientationListener, false); 
  }else
  {
      alert("DeviceOrientationEvent is not supported");
  }
*/
var promise = FULLTILT.getDeviceOrientation({'type': 'world'});
		promise.then(function(orientationControl) {
			orientationControl.listen(function() {
				// Get latest screen-adjusted deviceorientation data
				var screenAdjustedEvent = orientationControl.getFixedFrameEuler();
        orientationListener(screenAdjustedEvent);
				/*ctx.clearRect(0,0,arrowWidth,arrowWidth);
				// Convert true north heading to radians
				var heading = screenAdjustedEvent.alpha * Math.PI / 180;
				var x1 = halfArrowWidth + Math.round(halfArrowWidth * Math.sin(heading));
				var y1 = halfArrowWidth - Math.round(halfArrowWidth * Math.cos(heading));
				var x2 = halfArrowWidth + Math.round(10.0 * Math.sin(heading - Math.PI/2));
				var y2 = halfArrowWidth - Math.round(10.0 * Math.cos(heading - Math.PI/2));
				var x3 = halfArrowWidth + Math.round(10.0 * Math.sin(heading + Math.PI/2));
				var y3 = halfArrowWidth - Math.round(10.0 * Math.cos(heading + Math.PI/2));
				ctx.beginPath();
				ctx.moveTo(x1,y1);
				ctx.lineTo(x2,y2);
				ctx.lineTo(x3,y3);
				ctx.closePath();
				ctx.fill();*/
			});
  });

  return true;
}



ISYExtensionDeviceOrientation.prototype.unload = function () {
  console.log('ISYExtensionDeviceOrientation unloaded');

  window.removeEventListener('deviceorientation', orientationListener);

  return true;
}

 function orientationListener(event){
    //rotInterval = {lastx:0,lasty:0,lastz:0}; 

    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;

    document.getElementById("alpha").innerHTML="Alpha="+alpha;
    document.getElementById("beta").innerHTML="Beta="+beta;

    // get camera
    var cam = _viewer.getCamera();

 /*   newx = event.alpha;
    newy = event.beta;
    newz = event.gamma;  

    //rotate the camera
    var localCam = cam.clone();
    var newPosition = localCam.position;
    var newTarget = localCam.target;
    var directionFwd = cam.target.clone().sub(cam.position);
    var directionRight = directionFwd.clone().cross(cam.up).normalize();

    //rotate around up vector
    var yawX = new THREE.Quaternion();
    var changed = ( Math.abs(newx-_rotInterval.lastx) >1 );
    if(changed) 
      yawX.setFromAxisAngle(localCam.up, 2*Math.PI*(newx-_rotInterval.lastx)/360);

    //rotate around right vector
    var yawY= new THREE.Quaternion();
    changed = ( Math.abs(newy-_rotInterval.lasty) >1 );
    if(changed) 
      yawY.setFromAxisAngle(directionRight, 2*Math.PI*(newy-_rotInterval.lasty)/360);

    var yawQ = new THREE.Quaternion();
    yawQ.multiply(yawX).multiply(yawY);//.multiply(yawZ);

    directionFwd.applyQuaternion(yawQ);
    localCam.up.applyQuaternion(yawQ);
    var _navapi = _viewer.navigation;
    newTarget = newPosition.clone().add(directionFwd);
    _navapi.setView(newPosition, newTarget);
    _navapi.orientCameraUp(); 

    _rotInterval = {lastx:newx,lasty:newy,lastz:newz};  
*/
 
 
    // get position and target
    var position = cam.position.clone();
    var target = cam.target.clone();

    // get view vector
    var vecViewDir = new THREE.Vector3();
    vecViewDir.subVectors(target,position);

    // get length of view vector
    var length = vecViewDir.length();

    // rotate alpha
    var vec = new THREE.Vector3();
    vec.y = length;
    var zAxis = new THREE.Vector3(0,0,1);
    vec.applyAxisAngle(zAxis,THREE.Math.degToRad(alpha));

    // rotate beta
    var vec2 = new THREE.Vector3(vec.x,vec.y,vec.z);
    vec2.normalize();
    vec2.negate();
    vec2.cross(zAxis);
    vec.applyAxisAngle(vec2,THREE.Math.degToRad(beta) + Math.PI / 2);

    // add to camera
    target = target.addVectors(position,vec);
    _viewer.navigation.setView (position, target);
   // var xAxis = new THREE.Vector3(1,0,0);
  //  zAxis.applyAxisAngle(xAxis,THREE.Math.degToRad(gamma));
    _viewer.navigation.setCameraUpVector (zAxis) ;
    //_viewer.applyCamera(cam,false);
}


Autodesk.Viewing.theExtensionManager.registerExtension('ISYExtensionDeviceOrientation', ISYExtensionDeviceOrientation);