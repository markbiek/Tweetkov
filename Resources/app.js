(function() {
	/*
	 var generate = function () {
    var length = parseInt($('#chain-length').val());
    var chain  = new Markov($('#input-text').val(), length);

    var result = '';
    chain.each(function (v) {
      result += v;
    });

    $('#output-text').fadeOut('fast', function () {
      $('#output-text').html(result.replace(/\r\n|\r|\n/g, '<br />')).fadeIn('fast');
    });
  };

  $('#make').click(generate);

  generate();
	 */
	var tweetUrl = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=antelopelovefan&include_rts=0&count=5';
	
	Ti.include('functions.js');
		
	Titanium.UI.setBackgroundColor('#000');
	
	var win1 = Titanium.UI.createWindow({  
	    title:'Tab 1',
	    backgroundColor:'#fff'
	});
	
	win1.open();
	
	getJSON(tweetUrl, function(data) {
		for(var i in data) {
			if(data.hasOwnProperty(i)) {
				var tweet = data[i];
				
				dbg(tweet.id);
				dbg(tweet.text);
				dbg('');
			}	
		}
	});
	
	dbg("Finished opening");
})();