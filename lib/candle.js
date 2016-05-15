'use strict';

/* structure of array representing trade data */
var TRADE_TS = 0;
var TRADE_PRICE = 1;
var TRADE_VOLUME = 2;
var TRADE_ID = 3;

/* structure of array representing candle data */
var CANDLE_TS = 0;
var CANDLE_OPEN = 1;
var CANDLE_HIGH = 2;
var CANDLE_LOW = 3;
var CANDLE_CLOSE = 4;
var CANDLE_VOLUME = 5;
var CANDLE_FIRST_TS = 6;
var CANDLE_LAST_TS = 7;

var Candle = function (ts) {
  this.init(ts);
};

Candle.prototype.setInitState = function (state) {
  this._inited = !!state;
};

Candle.prototype.init = function (ts) {
  this._volume = 0;

  this._timestamp = ts || 0;
  this._firstTS = 0;
  this._lastTS = 0;

  this._open = 0;
  this._high = 0;
  this._low = 0;
  this._close = 0;

  this._inited = false;
};

Candle.prototype.addTrade = function (trade) {
  var ts = trade.getTimestamp();
  var volume = trade.getVolume();
  var price = trade.getPrice();

  // make sure that trade is elegible to be in the candle
  if(this._timestamp > ts){
    return false;
  }else if(!this._inited){
    this._inited = true;
    this._open = this._high = this._low = this._close = price;
    this._firstTS = this._lastTS = ts;
    this._volume = volume;
    return true;
  }

  if( ts > this._lastTS ) {
    this._lastTS = ts;
    this._close = price;
  }
  if( ts < this._firstTS ) {
    this._firstTS = ts;
    this._open = price;
  }

  if(this._high <  price ){
    this.setHigh(price);
  }
  if(this._low >  price ){
    this.setLow(price);
  }

  this._volume += volume;
  return true;
};

Candle.prototype.addTradeArray = function (trade) {
  var ts = trade[TRADE_TS];
  var price = trade[TRADE_PRICE];
  var volume = trade[TRADE_VOLUME];

  // make sure that trade is elegible to be in the candle
  if(this._timestamp > ts){
    return false;
  }else if(!this._inited){
    this._inited = true;
    this._open = this._high = this._low = this._close = price;
    this._firstTS = this._lastTS = ts;
    this._volume = volume;
    return true;
  }

  if( ts >= this._lastTS ) {
    this._lastTS = ts;
    this._close = price;
  }
  if( ts <= this._firstTS ) {
    this._firstTS = ts;
    this._open = price;
  }

  if(this._high <  price ){
    this.setHigh(price);
  }
  if(this._low >  price ){
    this.setLow(price);
  }

  this._volume += volume;
  return true;
};

Candle.prototype.setCandleFromArray = function(candleArray){
  this._timestamp = candleArray[CANDLE_TS];

  this._open = candleArray[CANDLE_OPEN];
  this._high = candleArray[CANDLE_HIGH];
  this._low = candleArray[CANDLE_LOW];
  this._close = candleArray[CANDLE_CLOSE];

  this._volume = candleArray[CANDLE_VOLUME];

  this._firstTS = candleArray[CANDLE_FIRST_TS];
  this._lastTS = candleArray[CANDLE_LAST_TS];

  this._inited = true;
};

Candle.prototype.getVolume = function () {return this._volume};
Candle.prototype.setVolume = function (volume) {this._volume = volume};

Candle.prototype.getTimestamp = function () {return this._timestamp};
Candle.prototype.setTimestamp = function (timestamp) {this._timestamp = timestamp};

Candle.prototype.getFirstTS = function () {return this._firstTS};
Candle.prototype.setFirstTS = function (ts) {this._firstTS = ts};

Candle.prototype.getLastTS = function () {return this._lastTS};
Candle.prototype.setLastTS = function (ts) {this._lastTS = ts};

Candle.prototype.getOpen = function () {return this._open};
Candle.prototype.setOpen = function (open) {this._open = open};

Candle.prototype.getHigh = function () {return this._high};
Candle.prototype.setHigh = function (high) {this._high = high};

Candle.prototype.getLow = function () {return this._low};
Candle.prototype.setLow = function (low) {this._low = low};

Candle.prototype.getClose = function () {return this._close};
Candle.prototype.setClose = function (close) {this._close = close};

Candle.prototype.getArrayData = function(){
  return [
    this._timestamp,
    this._open,
    this._high,
    this._low,
    this._close,
    this._volume,
    this._firstTS,
    this._lastTS,
  ];
};

Candle.prototype.getObjectData = function(){
  return {
    timestamp: this._timestamp,
    open: this._open,
    high: this._high,
    low: this._low,
    close: this._close,
    volume: this._volume,
    firstTS: this._firstTS,
    lastTS: this._lastTS,
  };
};


module.exports = Candle;
