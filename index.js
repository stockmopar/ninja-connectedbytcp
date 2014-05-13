var Socket = require('./lib/socket')
  , util = require('util')
  , stream = require('stream')
  , ConnectedByTCP = require('connectedbytcp')
  , configHandlers = require('./lib/config');

// Give our module a stream interface
util.inherits(cbtcp,stream);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default module configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the cloud
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the cloud
 */
function cbtcp(opts,app) {

  var self = this;
  this._app = app;
  this._opts = opts;
  this._opts.sockets = opts.sockets || [];

  app.on('client::up', this.init.bind(this));
};

/**
 * Discover and load WeMos
 */
cbtcp.prototype.init = function(){

  this.scan();
  // Register known WeMos
  this._opts.sockets.forEach(this.load.bind(this));
};

// Export it
module.exports = cbtcp;

cbtcp.prototype.scan = function() {
  
  // Discover WeMos
  //WeMo.discover(function(WeMos) {

    //this._app.log.info('(WeMo) Found %s WeMo(s)',WeMos.length);
    // Iterate over found WeMos
    //WeMos.forEach(function(WeMo) {

      //var host = WeMo.location.host;

      //if (this._opts.sockets.indexOf(host)===-1) {
      //  this.remember(host);
      //}
	//if(this._opts.sockets.length
    //  this.load(host);

    //}.bind(this));

  //}.bind(this));
};

cbtcp.prototype.load = function(host) {
  this._app.log.info("(TCP Lights) Device at " + host + " is now being registered");
  app = this._app;
  //console.log("Connected by TCP at " + host + " is now being registered");
  client = new ConnectedByTCP(host);
  
  client.GetState(function(error,system){
		//console.log(system);
		system.forEach(function(room) { 
			//this.emit('register',new Socket(this._app,client,G));
			//console.log(room["name"]);
			//G = room["rid"];
			this.emit('register',new Socket(this._app,client,room));
			/*
			if(room["name"] == name){
				state = 0;
				var i = 0;
				var sum = 0;
				var devices = room["device"];
				devices.forEach(function(device) { 
					i = i+1;
					if(device["state"] != "0"){
						state = 1;
						sum = sum + parseInt(device["level"]);
					}
				});
				if(i == 0){
					sum = 0;
					i = 1;
					state = 0;
				}
				level = sum / i;
				cb(null,state,level);
			}
			*/
		}.bind(this));

	//this.emit('register',new Socket(this._app,client,G));
  }.bind(this));
  
    var fetchState = function() {
		app.log.info("(TCP Lights) State Request");
		client.GetState(function(error,system){
			app.log.info(system);
			app.log.info("(TCP Lights) State Response");
			setTimeout(fetchState,1000);
		});
	};
	setTimeout(fetchState,1000);
  //var G = this._opts.sockets.indexOf(host);
  
  //
};

/**
 * Add a particular WeMo to this configuration
 * @param {[String} host Host of the WeMo to remember
 */
cbtcp.prototype.remember = function(host) {

  this._opts.sockets.push(host);
  this.save();
};

/**
 * Called when a user prompts a configuration
 * @param  {Object}   rpc     RPC Object
 * @param  {Function} cb      Callback with return data
 */
cbtcp.prototype.config = function(rpc,cb) {

  var self = this;

  if (!rpc) {
    return configHandlers.probe.call(this,cb);
  }

  switch (rpc.method) {
    case 'configScan':               return configHandlers.configScan.call(this,rpc.params,cb); break;
    case 'manual_set_tcp':    return configHandlers.manual_set_tcp.call(this,rpc.params,cb); break;
    case 'manual_get_tcp':    return configHandlers.manual_get_tcp.call(this,rpc.params,cb); break;
    case 'manual_show_remove': return configHandlers.manual_show_remove.call(this,rpc.params,cb); break;
    case 'manual_remove_tcp': return configHandlers.manual_remove_tcp.call(this,rpc.params,cb); break;
    default:                   return cb(true);                                              break;
  }
};
