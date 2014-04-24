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
function Device(app,cbtcp,room) {

  var self = this;

  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = true;

  this.G = room["rid"]||'0';
  this.V = 0;
  this.D = 1008;
  this.name = room["name"];

  this._cbtcp = cbtcp;
  
  var st = new Object;
  st.on = -1;
  var lastUpdate = 0;
  var fetchState = function() {
	//cbtcp.GetState(function(error,system){
	//		room = "Living Room";
			cbtcp.GetRoomStateByName(room["name"], function(error,state,level){
				if (!error){
					//var st = new Object;
					var currentTime = new Date().getTime()
					if(st.on != state || currentTime > (lastUpdate + 1000*60) ){
						console.log(room["name"] + " has state (" + state + ") with a level of " + level);
						lastUpdate = new Date().getTime();
						st.on = state;
						st.bri = level * 254 / 100;
						st.sat = 254;
						st.hue = 11200;
						update = JSON.stringify(st);
						self.emit('data',update);
						
					}
					//self.emit('data',state);
				}
				else app.log.error('(Connected by TCP) %s',error);
			});
		//});
  };
  setInterval(fetchState,500);
  //fetchState();
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} state The data received
 */
Device.prototype.write = function(data) {
	console.log("Received Data");
	console.log(data);
	var self = this;
	room = this.name;
	console.log(room);
	if ( data[0] == '{' ) {
	// json, ie light protocol
		var parsed = JSON.parse( data );
		console.log(parsed);
		var brightness = parsed.bri * 100 / 254.0;
		var on = parsed.on;
		
		var st = new Object
		if(on){
			this._cbtcp.TurnOnRoomByName(room);
			st.bri = 254;
		}else{
			this._cbtcp.TurnOffRoomByName(room);
			st.bri = 0;
		}
		
		
		st.on = on;
		//st.bri = level * 254 / 100;
		st.sat = 254;
		
		st.hue = 11200;
		update = JSON.stringify(st);
		self.emit('data',update); 
		
		/*
		var temp = parsed.ct;

		if ( this.lightGroup.colorType == 'rgbw' ) {
		// new RGB+W LEDs
		self.writeRGBW( parsed );
		} else if ( this.lightGroup.colorType == 'rgb' ) {
		var cb = function() {
		self.doBrightnessVoodoo( brightness );
		};
		if ( on ) {
		cb = function() {
		  if ( parsed.sat === 0 ) {
			// white
			self.sendRGBWhiteColorCommand( function() {
			  self.doBrightnessVoodoo( brightness );
			} );
		  } else {
			// colour
			var brokenHue = 255 - parseInt(parsed.hue / 0xff);
			var resetRed = (brokenHue + 0xb0);
			self.sendRGBColorCommand( resetRed % 0xff, function() {
			  self.doBrightnessVoodoo( brightness );
			} );
		  }
		};
		}
		self.sendRGBLEDOnCommand( on, cb );
		*/
	}
	/*
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
  */
};
