exports.probeGreeting = {
  "contents":[
    { "type":"paragraph",    "text":"Please enter the host of the Connected by TCP Hub."},
    { "type": "submit", "name": "Scan [N/A]", "rpc_method": "configScan" },
    { "type": "submit", "name": "Add Manually", "rpc_method": "manual_get_tcp" },
    { "type": "submit", "name": "Remove Existing", "rpc_method": "manual_show_remove" }

  ]
};

exports.fetchTCPModal = {
  "contents":[
    { "type":"paragraph",    "text":"Please enter the host of the Connected by TCP Hub."},
    { "type":"input_field_text", "field_name": "tcp_host", "value": "", "label": "Host", "placeholder": "192.168.1.137", "required": true},
    { "type":"submit"   ,     "name": "Add", "rpc_method": "manual_set_tcp" }
  ]
};

exports.removeTCPModal = {
  "contents":[
    { "type":"paragraph",    "text":"Please choose the Connected by TCP Hub you wish to remove."},
    { "type": "input_field_select", "field_name": "tcp_host", "label": "Connected by TCP Hub IP", "options": [{ "name": "None", "value": "", "selected": true}], "required": false },
    { "type":"submit"   ,    "name": "Remove", "rpc_method": "manual_remove_tcp" }
  ]
};

exports.removeWeMoModalSuccess = {
  "contents": [
    { "type":"paragraph",    "text":"Your Connected by TCP Hub has been removed."},
    { "type":"paragraph",    "text":"Important: you will still need to manually delete the individual sockets from your dashboard"},
    { "type":"close", "text":"Close"}
  ]
}

exports.scanFinished = {
  "contents": [
    { "type":"paragraph",    "text":"Scan complete. Any found Connected by TCP Hubs will appear on your dashboard shortly."},
    { "type":"close", "text":"Close"}
  ]
}

exports.finish = {
  "finish": true
};