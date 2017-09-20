// REST API KEY = OTVjYjUzM2QtYjMzNS00ODFiLTljN2EtY2FhZDkxYTNiOGY4
// APP ID = f970e492-e21e-4d93-bc40-075610c6fc59
module.exports = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic OTVjYjUzM2QtYjMzNS00ODFiLTljN2EtY2FhZDkxYTNiOGY4"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};