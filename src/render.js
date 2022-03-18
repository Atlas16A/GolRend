const renderstart = document.getElementById('RenderStart');
const Public_Address = document.getElementById('Public_Address');
const GLM_Amount = document.getElementById('GLM_Amount')

window.electronAPI.handlePublic_Address((event, address) => {
    Public_Address.innerText = address
});

//window.electronAPI.handleBalance((event, balance) => {
    //GLM_Amount.innerText = balance
//});

//Get Acount balance
//var http = require("https");

//var contract = "0x0B220b82F3eA3B7F6d9A1D8ab58930C064A2b5Bf";
//var address = Public_Address;
//
//var options = {
//  "method": "GET",
//  "hostname": "api.tokenbalance.com",
//  "port": null,
//  "path": "/balance/"+contract+"/"+address
//};
//
//var req = http.request(options, function (res) {
//  var chunks = [];
//
//  res.on("data", function (chunk) {
//    chunks.push(chunk);
//  });
//
//  res.on("end", function () {
//    var body = Buffer.concat(chunks);
//    GLM_Amount.innerText = body.toString()
//  });
//});

//req.end();