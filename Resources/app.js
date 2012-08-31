var c = {};

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
	var tweetUrl = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&include_rts=0&count=200';
	var profileImgUrl = 'https://api.twitter.com/1/users/profile_image?size=bigger';
	var tweets = '';
	var rawTweets = {};
	c.styles = {
		DEFAULT_PADDING: 20,
		DEFAULT_BUTTON_HEIGHT: 60,
		DEFAULT_BUTTON_WIDTH: 220
	};
	
	Ti.include('functions.js');
	Ti.include('markov.js');
		
	//Glob all tweets into a single string that we use to generate Markov chains from
	var processTweets = function(data) {
		var inputText = '';
		
		for(var i in data) {
			if(data.hasOwnProperty(i)) {
				var tweet = data[i];
				
				//Don't include retweets
				if(!/^RT/.test(tweet.text)) {
					inputText += tweet.text + ' ';
				}
			}	
		}
		
		dbg(inputText);
		inputText = cleanTweet(inputText);
		dbg('-------------');
		dbg(inputText);
		
		return inputText;
	};
	
	var genTweet = function(inputText, len) {
		len = typeof len == 'undefined' ? 4 : len; //Default is 4th-order chain
		var chain  = new Markov(inputText, len);
		var result = '';
		chain.each(function (v) {
      		result += v;
    	});
    	
    	//Shorten the string to the last space found prior to 140 chars 
    	//(basically, make sure it's a valid tweet length)
    	if(result.length > 140) {
    		result = result.substring(0, 140);
    		var lastSpace = result.lastIndexOf(' ');
    		if(lastSpace >= 0) {
    			result = result.substring(0, lastSpace);
    		}
    	}
    	
    	//Remove the first word because this seems to always be the same
    	var firstSpace = result.indexOf(' ');
    	result = result.substring(firstSpace, result.length - firstSpace);
    	
    	return result;
	};
	
	var loadTweets = function() {
		if(screenName.value != '') {
			var url = tweetUrl + '&screen_name=' + screenName.value;
			var imgUrl = profileImgUrl + '&screen_name=' + screenName.value;
			
			dbg(url);
			dbg(imgUrl);
			btGenTweet.visible = false;	
			profileImage.visible = false;
				
			getJSON(url, function(data) {
				rawTweets = data;
				tweets = processTweets(data);
				btGenTweet.visible = true;
				
				profileImage.image = imgUrl;
				profileImage.visible = true;
			});
		}else {
			alrt('Please enter a Twitter screen name.');
		};
	};
		
	Titanium.UI.setBackgroundColor('#000');
	
	var btLoadTweets = Titanium.UI.createButton({
		title:'Load Tweets',
		height: c.styles.DEFAULT_BUTTON_HEIGHT,
		width: c.styles.DEFAULT_BUTTON_WIDTH,
		top:10
	});
	btLoadTweets.addEventListener('click', function(e) {
		loadTweets();
	});
	
	var btGenTweet = Ti.UI.createButton({
		title: 'Generate Tweet',
		height: c.styles.DEFAULT_BUTTON_HEIGHT,
		width:  c.styles.DEFAULT_BUTTON_WIDTH,
		top: 10 + btLoadTweets.height + c.styles.DEFAULT_PADDING,
		visible: false
	});
	btGenTweet.addEventListener('click', function(e) {
		var tweet = genTweet(tweets);
		
		textArea.value = tweet;
	});
	
	var screenName = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  color: '#336699',
	  top: btGenTweet.top + btGenTweet.height + c.styles.DEFAULT_PADDING,
	  left: c.styles.DEFAULT_PADDING,
	  width: '90%', 
	  height: 120,
	  value: 'antelopelovefan'
	});
	screenName.addEventListener('change', function(e) {
		btGenTweet.visible = false;
	});
	
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: '#888',
	  font: {fontSize:40, fontWeight:'bold'},
	  textAlign: 'left',
	  value: '',
	  top: screenName.top + screenName.height + c.styles.DEFAULT_PADDING,
	  left: c.styles.DEFAULT_PADDING,
	  width: '90%', 
	  height: '50%'
	});
	
	var profileImage = Ti.UI.createImageView({
	  top: c.styles.DEFAULT_PADDING,
	  left: c.styles.DEFAULT_PADDING,
	  width: 73,
	  height: 73,
	  visible: false
	});

	
	var winMain = Titanium.UI.createWindow({  
	    title:'Tab 1',
	    backgroundColor:'#fff'
	});
	
	winMain.add(profileImage);
	winMain.add(btLoadTweets);
	winMain.add(btGenTweet);
	winMain.add(textArea);
	winMain.add(screenName);
	winMain.open();
	
	loadTweets();
	
	dbg("Finished opening");
})();