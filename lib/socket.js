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
function Device(app,client,G,name,id,type) {
	var self = this;

	this.readable = true;
	this.writeable = true;

	this.type = type;
	
	this.G = G;
	this.V = 0;
	this.D = 1008;
	this.name = name;

	this.bri = -1;
	this.state = -1;
	this._app = app;
	this.client = client;
	
	if(type == "room"){
		this.rid = id;
	}else if(type=="fixture"){
		this.did = id;
	}
	this.lastUpdate = 0;
};

Device.prototype.updateState = function(room){
	var self = this;

	var tstate = 0;
	var tlevel = 0;
	
	if(self.type == "room"){
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
		tlevel = sum / i;
	}else if(self.type == "fixture"){
		if(tdevice["state"] != "0"){
			tstate = 1;
			tlevel = parseInt(tdevice["level"]);
		}else{
			tstate = 0;
			tlevel = 0;
		}
	}
	var st = new Object;
	
	st.on = tstate;
	st.bri = tlevel * 254/100;
	st.hue = 11200;
	
	var currentTime = new Date().getTime();
	
	if(!(st.on == self.state && st.bri == self.bri) || currentTime > (self.lastUpdate + 3000*60) ){
		var update = JSON.stringify(st);
		
		self.lastUpdate = new Date().getTime();
		self.emit('data',update);
		
		self.state = st.on;
		self.bri = st.bri;
	}
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
		console.log("Previous State: " + self.state + " AND Brightness: " + self.bri);
		if(self.type == "room"){
			if(self.state){
				// LIGHT IS CURRENTLY ON
				if(parsed.on){
					if(self.bri != parsed.bri){
						console.log("Setting Level of " + self.name);
						var level = Math.floor(parsed.bri * 100 /254);
						self.client.SetRoomLevel(self.rid, level, function(error){
							st.on = 1;
							st.bri = parsed.bri;
							st.hue = 11200;
							st.sat = 254;
							
							self.bri = parsed.bri;
							
							self.lastUpdate = new Date().getTime();
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
						self.client.TurnOffRoom(self.rid, function(error){
							self.client.SetRoomLevel(self.rid, level, function(error){
								st.on = 0;
								st.bri = 0;
								st.hue = 11200;
								st.sat = 254;
								
								self.state = 0;
								self.bri = parsed.bri;
								
								self.lastUpdate = new Date().getTime();
								update = JSON.stringify(st);
								self.emit('data',update); 
							});
						});
					}else{
						console.log("Turning Off  " + self.name);
						self.client.TurnOffRoom(self.rid, function(error){
							st.on = 0;
							st.bri = parsed.bri;
							st.hue = 11200;
							st.sat = 254;
							
							self.state = 0;
							
							self.lastUpdate = new Date().getTime();
							update = JSON.stringify(st);
							self.emit('data',update); 
						});
					}
				}
			}else{
				// LIGHT IS CURRENTLY OFF
				if(parsed.on){
					// WANT TO TURN ON
					if(parsed.bri == 0){
						parsed.bri = 254;
					}
					console.log("Setting Level Then Turning On " + self.name);
					var level = Math.floor(parsed.bri * 100 /254);
					self.client.SetRoomLevel(self.rid, level, function(error){
						self.client.TurnOnRoom(self.rid, function(error){
							st.on = 1;
							st.bri = parsed.bri;
							st.hue = 11200;
							st.sat = 254;
							
							self.bri = parsed.bri;
							self.state = 1;
							
							self.lastUpdate = new Date().getTime();
							update = JSON.stringify(st);
							self.emit('data',update);
						});
					});
				}else{
					// THIS SHOULD NEVER HAPPEN
					if(self.bri != parsed.bri){
						console.log("Setting Level of  " + self.name);
						var level = Math.floor(parsed.bri * 100 /254);
						self.client.SetRoomLevel(self.rid, level, function(error){
							st.on = 0;
							st.bri = parsed.bri;
							st.hue = 11200;
							st.sat = 254;
							
							self.bri = parsed.bri;
							
							self.lastUpdate = new Date().getTime();
							update = JSON.stringify(st);
							self.emit('data',update); 
						});
					}else{
						// Don't Do Anything
					}
				}		
			}
		}
	}
};
