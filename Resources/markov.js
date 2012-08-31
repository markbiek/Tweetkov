/ **
 * Constructor
 *
 Input string * @ param string str to apply the Markov chain
 * @ Param number chain_length length of chain
 * @ Return void
 * /
var Markov = function (str, chain_length) {
  this.init (str, chain_length);
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

  / **
   * Initialize the chain
   * Set the length of the input string, chain, to create a chain
   *
   Input string * @ param string str
   * @ Param number len the length of the chain
   * @ Return void
   * /
  init = function (str, len) {
    len = Number (len);
    ? chainLength = len> 0 len: 1;
    input = str;
    makeChain (input);
  };

  / **
   * Create chain
   *
   * @ Param void
   * @ Return void
   * /
  makeChain = function () {
    initState ();
    markovChain = {};
    var strArr = input.split (''),
      i,
      c;
    for (i = 0; i <strArr.length; i + = 1) {
      c = strArr [i];
      pushChain (c);
      nextState (c);
    }
    pushChain (NONWORD);
  };

  / **
   * Insert one chain letter
   *
   * @ Param string c character you want to insert
   * @ Return void
   * /
  pushChain = function (c) {
    var chain = markovChain,
      i;
    for (i = 0; i <(chainLength - 1); i + = 1) {
      if (typeof chain [state [i]] === 'undefined') {
        chain [state [i]] = {};
      }
      chain = chain [state [i]];
    }
    if (typeof chain [state [chainLength - 1]] === 'undefined') {
      chain [state [chainLength - 1]] = [];
    }
    . chain [state [chainLength - 1]] push (c);
  };

  / **
   * Passed to the lambda output, one character at a time, by the Markov chain
   *
   * Function to receive the letter @ param function lambda
   * @ Return void
   * /
  each = function (lambda) {
    initState ();
    for (; ;) {
      var p = pick ();
      if (p === NONWORD) {
        break;
      } Else {
        lambda.apply (null, [p]);
      }
      nextState (p);
    }
  };

  / **
   * Choose one character by the Markov chain
   *
   * @ Param void
   The character * @ return string extracted by the Markov chain
   * /
  pick = function () {
    var chain = markovChain,
      i,
      r;
    for (i = 0; i <chainLength; i + = 1) {
      chain = chain [state [i]];
    }
    r = Math.floor (Math.random () * chain.length);
    return chain [r];
  };

  / **
   * Initialize the state
   *
   * @ Param void
   * @ Return void
   * /
  initState = function () {
    state = [];
    for (var i = 0; i <chainLength; i + = 1) {
      state [i] = NONWORD;
    }
  };

  / **
   * Continue to the next state
   *
   Character * @ param string c inserted into the chain
   * @ Return void
   * /
  nextState = function (c) {
    for (var i = 0; i <(chainLength - 1); i + = 1) {
      state [i] = state [i + 1];
    }
    state [chainLength - 1] = c;
  };

  / **
   * Interface to obtain the chain
   *
   * @ Param void
   * @ Return object chain that generated
   * /
  getChain = function () {
    return markovChain;
  };

  return {
    init: init,
    each: each,
    getChain: getChain
  };
}) ();