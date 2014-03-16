var stream = require('stream')
  , util = require('util');

// Give our module a stream interface
util.inherits(Device,stream);

// Export it
module.exports=Device;

/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the cloud
 *
 * @fires data - Emit this when you wish to send data to the cloud
 */
function Device(app,cbtcp,g) {

  var self = this;

  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = true;

  this.G = g||'0';
  this.V = 0;
  this.D = 224;

  this._cbtcp = cbtcp;

  var fetchState = function() {
		cbtcp.GetState(function(error,system){
			room = "Living Room";
			cbtcp.GetRoomStateByName(room, function(error,state,level){
				//console.log("State: " + state + " at Level: " + level);
				if (!error){
					var st = new Object
					st.on = state;
					st.bri = level * 254 / 100;
					st.sat = 254;
					update = JSON.stringify(st);
					self.emit('data',update); 
					//self.emit('data',state);
				}
				else app.log.error('(Connected by TCP) %s',error);
			});
		});
  };

  setInterval(fetchState,3000);
  //fetchState();
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} state The data received
 */
Device.prototype.write = function(state) {

  var self = this;

  if (state=='1') {
    //this._wemo.on(function(err) {
	  this._cbtcp.TurnOnRoomByName(room);
      self.emit('data','1');
    //});
  } else {
    //this._wemo.off(function(err) {
	   this._cbtcp.TurnOffRoomByName(room);
     self.emit('data','0');
    //});
  }
};
