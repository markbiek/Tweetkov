/**
 * ã‚³ãƒ³ã‚¹ãƒˆãƒ©ã‚¯ã‚¿
 *
 * @param  string str          ãƒžãƒ«ã‚³ãƒ•é€£éŽ–ã‚’é©ç”¨ã™ã‚‹å…¥åŠ›æ–‡å­—åˆ—
 * @param  number chain_length ãƒã‚§ã‚¤ãƒ³ã®é•·ã•
 * @return void
 */
var Markov = function (str, chain_length) {
  this.init(str, chain_length);
};

Markov.prototype = (function () {
  var NONWORD = "NONWORD",
    state,
    input,
    markovChain,
    chainLength,
    init,
    makeChain,
    pushChain,
    each,
    pick,
    initState,
    nextState,
    getChain;

  /**
   * ãƒã‚§ã‚¤ãƒ³ã®åˆæœŸåŒ–
   * å…¥åŠ›æ–‡å­—åˆ—ã€ãƒã‚§ã‚¤ãƒ³ã®é•·ã•ã‚’è¨­å®šã—ã€ãƒã‚§ã‚¤ãƒ³ã‚’ä½œæˆã™ã‚‹
   *
   * @param  string str å…¥åŠ›æ–‡å­—åˆ—
   * @param  number len ãƒã‚§ã‚¤ãƒ³ã®é•·ã•
   * @return void
   */
  init = function (str, len) {
    len = Number(len);
    chainLength = len > 0 ? len : 1;
    input = str;
    makeChain(input);
  };

  /**
   * ãƒã‚§ã‚¤ãƒ³ã®ä½œæˆ
   *
   * @param  void
   * @return void
   */
  makeChain = function () {
    initState();
    markovChain = {};
    var strArr = input.split(''),
      i,
      c;
    for (i = 0; i < strArr.length; i += 1) {
      c = strArr[i];
      pushChain(c);
      nextState(c);
    }
    pushChain(NONWORD);
  };

  /**
   * ãƒã‚§ã‚¤ãƒ³ 1 æ–‡å­—æŒ¿å…¥ã™ã‚‹
   *
   * @param  string c æŒ¿å…¥ã™ã‚‹æ–‡å­—
   * @return void
   */
  pushChain = function (c) {
    var chain = markovChain,
      i;
    for (i = 0; i < (chainLength - 1); i += 1) {
      if (typeof chain[state[i]] === 'undefined') {
        chain[state[i]] = {};
      }
      chain = chain[state[i]];
    }
    if (typeof chain[state[chainLength - 1]] === 'undefined') {
      chain[state[chainLength - 1]] = [];
    }
    chain[state[chainLength - 1]].push(c);
  };

  /**
   * ãƒžãƒ«ã‚³ãƒ•é€£éŽ–ã«ã‚ˆã‚‹å‡ºåŠ›ã‚’ 1 æ–‡å­—ãšã¤ lambda ã«æ¸¡ã™
   *
   * @param  function lambda æ–‡å­—ã‚’å—ã‘ã‚‹é–¢æ•°
   * @return void
   */
  each = function (lambda) {
    initState();
    for (;;) {
      var p = pick();
      if (p === NONWORD) {
        break;
      } else {
        lambda.apply(null, [p]);
      }
      nextState(p);
    }
  };

  /**
   * ãƒžãƒ«ã‚³ãƒ•é€£éŽ–ã«ã‚ˆã‚Š 1 æ–‡å­—é¸ã¶
   *
   * @param  void
   * @return string ãƒžãƒ«ã‚³ãƒ•é€£éŽ–ã«ã‚ˆã‚ŠæŠ½å‡ºã•ã‚ŒãŸæ–‡å­—
   */
  pick = function () {
    var chain = markovChain,
      i,
      r;
    for (i = 0; i < chainLength; i += 1) {
      chain = chain[state[i]];
    }
    r = Math.floor(Math.random() * chain.length);
    return chain[r];
  };

  /**
   * çŠ¶æ…‹ã®åˆæœŸåŒ–
   *
   * @param  void
   * @return void
   */
  initState = function () {
    state = [];
    for (var i = 0; i < chainLength; i += 1) {
      state[i] = NONWORD;
    }
  };

  /**
   * çŠ¶æ…‹ã‚’æ¬¡ã«é€²ã‚ã‚‹
   *
   * @param  string c ãƒã‚§ã‚¤ãƒ³ã«æŒ¿å…¥ã—ãŸæ–‡å­—
   * @return void
   */
  nextState = function(c) {
    for (var i = 0; i < (chainLength - 1); i += 1) {
      state[i] = state[i + 1];
    }
    state[chainLength - 1] = c;
  };

  /**
   * ãƒã‚§ã‚¤ãƒ³ã‚’å–å¾—ã™ã‚‹ãŸã‚ã®ã‚¤ãƒ³ã‚¿ãƒ¼ãƒ•ã‚§ã‚¤ã‚¹
   *
   * @param  void
   * @return object ç”Ÿæˆã—ãŸãƒã‚§ã‚¤ãƒ³
   */
  getChain = function () {
    return markovChain;
  };

  return {
    init:     init,
    each:     each,
    getChain: getChain
  };
})();