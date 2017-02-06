var btclib = require('bitcoinjs-lib');

var host = ''

var $ = {};

$.last = 0; //last timestamp a token was created
$.window = 60000 * 10;  //window period in which a token is valid - caches in memory so to avoud calculating sig every time

$.getToken = function(privkey,callback){
	process.nextTick(function(){
		var ts = '';
		if(Date.now()-$.last<=$.window){
			callback(null,$.token);
		}
		else{
			$.last = Date.now();
			ts = $.last.toString(16);
			if(ts.length%2>0){
				ts = '0' + ts;
			}
			var keyPair = btclib.ECPair.fromWIF(privkey);
			var sig = btclib.message.sign(keyPair,ts);
			var addressBuff = new Buffer(keyPair.getAddress());
			var tsBuff = new Buffer(ts,'hex');
			$.token = Buffer.concat([sig,addressBuff,tsBuff]).toString('base64');
			callback(null,$.token);
		}
		
	})
}


module.exports = $;
