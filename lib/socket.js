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
  
  this.readable = true;
  this.writeable = true;

  this.G = "TCP" + (room["rid"]||'0');
  this.V = 0;
  this.D = 1008;
  this.name = room["name"];
  this.bri = -1;
  this.state = -1;
  this._cbtcp = cbtcp;
  this._app = app;
  
  var st = new Object;
  st.on = -1;
  this.lastUpdate = 0;
  
  var fetchState = function() {
		cbtcp.GetRoomStateByName(room["name"], function(error,state,level){
			if (!error){
				var brightness = Math.floor(level * 254 / 100);
				var currentTime = new Date().getTime()
				if(self.state != state || self.bri != brightness || currentTime > (self.lastUpdate + 3000*60) ){
					
					if(st.on != state){
						app.log.info("(TCP Lights) " + room["name"] + " [new,state=" + state + ",level=" + Math.floor(level) + "]");
					}else{
						app.log.info("(TCP Lights) " + room["name"] + " [update,state=" + state + ",level=" + Math.floor(level) + "]");
					}
					
					self.lastUpdate = new Date().getTime();
					self.bri = brightness;
					self.state = state;
					
					st.on = state;
					st.bri = brightness;
					st.sat = 254;
					st.hue = 11200;
					update = JSON.stringify(st);
					self.emit('data',update);
				}
			}
			else app.log.error('(TCP Lights) %s',error);
		});
		setTimeout(fetchState,500);
  };
  setTimeout(fetchState,500);
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} state The data received
 */
Device.prototype.write = function(data) {
	var self = this;
	room = this.name;
	
	if ( data[0] == '{' ) {
		var parsed = JSON.parse( data );
		console.log(parsed);
		var brightness = parsed.bri * 100 / 254.0;
		var on = parsed.on;
		
		var st = new Object;
		if(on){
			this._app.log.info("(TCP Lights) Turn On " + room);
			self._cbtcp.TurnOnRoomWithLevelByName(room,brightness,function(){
				self.lastUpdate = new Date().getTime();
				
				st.on = on;
				st.bri = parsed.bri;
				st.sat = 254;
				st.hue = 11200;
				update = JSON.stringify(st);
				self.emit('data',update); 
			});
			/*
			self._cbtcp.SetRoomLevelByName(room,brightness,function(){
				self._cbtcp.TurnOnRoomByName(room,function(){
					st.on = on;
					st.bri = bri;
					st.sat = 254;
					st.hue = 11200;
					update = JSON.stringify(st);
					self.emit('data',update); 
				});
			});*/
		}else{
			this._app.log.info("(TCP Lights) Turn Off " + room);
			self._cbtcp.TurnOffRoomByName(room,function(){

				self._cbtcp.SetRoomLevelByName(room,brightness,function(){});
				
				self.lastUpdate = new Date().getTime();
				
				st.on = on;
				st.bri = 0;
				st.sat = 254;
				st.hue = 11200;
				update = JSON.stringify(st);
				self.emit('data',update); 
			});
		}
	}
};
