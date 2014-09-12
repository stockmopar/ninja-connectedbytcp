var stream = require('stream')
  , ConnectedByTCP = require('connectedbytcp')
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
function Device(app,host,room) {
	var self = this;

	this.readable = true;
	this.writeable = true;

	this.G = "TCP" + (room["rid"]||'0');
	this.V = 0;
	this.D = 1008;
	this.name = room["name"];

	this.bri = -1;
	this.state = -1;
	this._app = app;
	
	this.rid = room["rid"];
	this.host = host;
	
	this.lastUpdate = 0;
  
  /*
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
		//setTimeout(fetchState,500);
  };
  */
  //setTimeout(fetchState,500);
};

Device.prototype.updateState = function(room){
	var self = this;
	
	//console.log("(TCP Lights) updateState() has been called for Room with Name: " + self.name);
	
	var tstate = 0;
	var i = 0;
	var sum = 0;
	var tdevices = room["device"];
	if (typeof(tdevices["did"]) !== 'undefined'){
		i = i+1;
		if(tdevices["state"] != "0"){
			tstate = 1;
			sum = sum + parseInt(tdevices["level"]);
		}
	}else{
		tdevices.forEach(function(tdevice) { 
			i = i+1;
			if(tdevice["state"] != "0"){
				tstate = 1;
				sum = sum + parseInt(tdevice["level"]);
			}
		});
		
	}
	if(i == 0){
		sum = 0;
		i = 1;
		tstate = 0;
	}
	var tlevel = sum / i;
	
	var st = new Object;
	
	st.on = tstate;
	st.bri = tlevel * 254/100;
	st.hue = 11200;
	
	if(!(st.on == self.state && st.bri == self.bri)){
		var update = JSON.stringify(st);
		
		//console.log("(TCP Lights) Emitting New State for Room with Name: " + self.name + " with String: " + update);
		
		self.emit('data',update);
		
		self.state = st.on;
		self.bri = st.bri;
	}
	
	/*
	client.GetRoomStateByName(this.name, function(error,state,level){
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
				
				self.st.on = state;
				self.st.bri = brightness;
				self.st.sat = 254;
				self.st.hue = 11200;
				update = JSON.stringify(self.st);
				self.emit('data',update);
			}
		}
		else app.log.error('(TCP Lights) %s',error);
	});
	*/
}

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} state The data received
 */
Device.prototype.write = function(data) {
	var self = this;
	room = this.name;
	
	var st = new Object;
	
	if ( data[0] == '{' ) {
		var parsed = JSON.parse( data );
		console.log(parsed);
		
		var client = new ConnectedByTCP(host);
		
		if(self.state == 1){
			if(parsed.on){
				if(self.bri != parsed.bri){
					console.log("Setting Level of " + self.name);
					var level = Math.floor(parsed.bri * 100 /254);
					client.SetRoomLevel(self.rid, level, function(error){
						st.on = 1;
						st.bri = parsed.bri;
						st.hue = 11200;
						st.sat = 254;
						
						update = JSON.stringify(st);
						self.emit('data',update); 
					});
				}else{
					console.log("Not Doing Anything for " + self.name);
				}
			}else{
				if(self.bri != parsed.bri){
					console.log("Turning Off and Then Setting Level of  " + self.name);
					var level = Math.floor(parsed.bri * 100 /254);
					client.TurnOffRoom(self.rid, function(error){
						client.SetRoomLevel(self.rid, level, function(error){
							st.on = 0;
							st.bri = parsed.bri;
							st.hue = 11200;
							st.sat = 254;
							
							update = JSON.stringify(st);
							self.emit('data',update); 
						});
					});
				}else{
					console.log("Turning Off  " + self.name);
					client.TurnOffRoom(self.rid, function(error){
						st.on = 0;
						st.bri = parsed.bri;
						st.hue = 11200;
						st.sat = 254;
						
						update = JSON.stringify(st);
						self.emit('data',update); 
					});
				}
			}
		}else{
			if(parsed.on){
				if(self.bri != parsed.bri){
					console.log("Setting Level Then Turning On " + self.name);
					var level = Math.floor(parsed.bri * 100 /254);
					client.SetRoomLevel(self.rid, level, function(error){
						client.TurnOnRoom(self.rid, function(error){
							st.on = 1;
							st.bri = parsed.bri;
							st.hue = 11200;
							st.sat = 254;
							
							update = JSON.stringify(st);
							self.emit('data',update);
						});
					});
				}else{
					console.log("Turning On " + self.name);
					client.TurnOnRoom(self.rid, function(error){
						st.on = 1;
						st.bri = parsed.bri;
						st.hue = 11200;
						st.sat = 254;
						
						update = JSON.stringify(st);
						self.emit('data',update);
					});
				}
			}else{
				if(self.bri != parsed.bri){
					console.log("Setting Level of  " + self.name);
					var level = Math.floor(parsed.bri * 100 /254);
					client.SetRoomLevel(self.rid, level, function(error){
						st.on = 0;
						st.bri = parsed.bri;
						st.hue = 11200;
						st.sat = 254;
						
						update = JSON.stringify(st);
						self.emit('data',update); 
					});
				}else{
					// Don't Do Anything
				}
			}		
		}
	}
	
	/*
	if ( data[0] == '{' ) {
		var parsed = JSON.parse( data );
		console.log(parsed);
		var brightness = parsed.bri * 100 / 254.0;
		var on = parsed.on;
		
		var st = new Object;
		if(on){
			this._app.log.info("(TCP Lights) Turn On " + room);
			/ *
			self.client.TurnOnRoomWithLevelByName(room,brightness,function(){
				self.lastUpdate = new Date().getTime();
				self.state = on;
				self.bri = parsed.bri;
				
				st.on = on;
				st.bri = parsed.bri;
				st.sat = 254;
				st.hue = 11200;
				update = JSON.stringify(st);
				self.emit('data',update); 
			});
			* /
		}else{
			this._app.log.info("(TCP Lights) Turn Off " + room);
			/ *
			self.client.TurnOffRoomByName(room,function(){

				self.client.SetRoomLevelByName(room,brightness,function(){});
				
				self.lastUpdate = new Date().getTime();
				self.state = on;
				self.bri = parsed.bri;
				
				st.on = on;
				//st.bri = 0;
				st.sat = 254;
				st.hue = 11200;
				update = JSON.stringify(st);
				self.emit('data',update); 
			});
			* /
		}
	}
	*/
};
