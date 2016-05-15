var expect = require('chai').expect,
    Candle = require('../lib/candle');

describe('candle testing', function () {

    it('should be an object', function () {
        var candle = new Candle();

        expect(Candle).to.be.a('function');
        expect(candle).to.be.an('object');
    });

    describe('candle chg test', function () {
      var delay = 1000
      var ts = Date.now();
      var cts = ts - delay;
      var candle = new Candle(cts);

      expect(candle.getArrayData()).to.be.deep.equals([cts, 0,0,0,0,0,0,0]);

      candle.setOpen(5);
      expect(candle.getOpen()).to.be.equals(5);

      candle.setHigh(10);
      expect(candle.getHigh()).to.be.equals(10);

      candle.setLow(1);
      expect(candle.getLow()).to.be.equals(1);

      candle.setClose(7);
      expect(candle.getClose()).to.be.equals(7);

      candle.setVolume(7.1);
      expect(candle.getVolume()).to.be.equals(7.1);

      candle.setFirstTS(ts +1);
      expect(candle.getFirstTS()).to.be.equals(ts+1);

      candle.setLastTS(ts +100);
      expect(candle.getLastTS()).to.be.equals(ts+100);


      expect(candle.getArrayData()).to.be.deep.equals([cts, 5,10,1,7,7.1,ts+1, ts+100]);

      expect(candle.getObjectData()).to.be.deep.equals(
        {
          timestamp:cts,
          open: 5,
          high:10,
          low:1,
          close:7,
          volume:7.1,
          firstTS:ts+1,
          lastTS: ts+100
        });


    });

    describe('candle add trade tests', function () {

        it('candle addTrade from Array', function () {
            var delay = 1000
            var ts = Date.now();
            var cts = ts - delay;
            var candle = new Candle(cts);


            var price, volume, result;

            /* add first trade */
            price = 20.1;
            volume = 10.1;
            result = candle.addTradeArray([cts+3, price, volume]);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts,price,price,price,price,volume, cts+3, cts+3 ]);

            /* add second trade - timed after first one*/
            price = 2.1;
            volume = 1.1;
            result = candle.addTradeArray([cts+10, price, volume]);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts,20.1,20.1,2.1,2.1, 11.2, cts+3, cts+10 ]);

            /* add third trade - timed between existing */
            price = 10.1;
            volume = 5.2;
            result = candle.addTradeArray([cts+5, price, volume]);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts,20.1,20.1,2.1,2.1, 16.4, cts+3, cts+10 ]);

            /* add a trade - update high & first TS */
            price = 21;
            volume = 1;
            result = candle.addTradeArray([cts+1, price, volume]);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21, 2.1, 2.1, 17.4, cts+1, cts+10 ]);

            /* add a trade - update low & last TS */
            price = 1.1;
            volume = 10;
            result = candle.addTradeArray([cts+15, price, volume]);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21, 1.1, 1.1, 27.4, cts+1, cts+15 ]);

            /* add a trade - update high & last TS */
            price = 21.1;
            volume = 10;
            result = candle.addTradeArray([cts+14, price, volume]);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21.1, 1.1, 1.1, 37.4, cts+1, cts+15 ]);

            /* add a trade - this will not go though as it is earlier than candle TS*/
            price = 1121.1;
            volume = 1110;
            result = candle.addTradeArray([cts-1, price, volume]);
            expect(result).to.be.equals(false);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21.1, 1.1, 1.1, 37.4, cts+1, cts+15 ]);

        });

        it('candle addTrade from Object', function () {
            var delay = 1000
            var ts = Date.now();
            var cts = ts - delay;
            var candle = new Candle(cts);


            var trade = {
              price:0,
              volume:0,
              timestamp: 0,
              getPrice:function(){return this.price;},
              getVolume:function(){return this.volume;},
              getTimestamp:function(){return this.timestamp;}
            };

            /* add first trade */
            trade.price = 20.1;
            trade.volume = 10.1;
            trade.timestamp = cts+3;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts,20.1,20.1,20.1,20.1, 10.1, cts+3, cts+3 ]);

            /* add second trade - timed after first one*/
            trade.price = 2.1;
            trade.volume = 1.1;
            trade.timestamp = cts+10;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts,20.1,20.1,2.1,2.1, 11.2, cts+3, cts+10 ]);

            /* add third trade - timed between existing */
            trade.price = 10.1;
            trade.volume = 5.2;
            trade.timestamp = cts+5;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts,20.1,20.1,2.1,2.1, 16.4, cts+3, cts+10 ]);

            /* add a trade - update high & first TS */
            trade.price = 21;
            trade.volume = 1;
            trade.timestamp = cts+1;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21, 2.1, 2.1, 17.4, cts+1, cts+10 ]);

            /* add a trade - update low & last TS */
            trade.price = 1.1;
            trade.volume = 10;
            trade.timestamp = cts+15;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21, 1.1, 1.1, 27.4, cts+1, cts+15 ]);

            /* add a trade - update high & last TS */
            trade.price = 21.1;
            trade.volume = 10;
            trade.timestamp = cts+14;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(true);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21.1, 1.1, 1.1, 37.4, cts+1, cts+15 ]);

            /* add a trade - this will not go though as it is earlier than candle TS*/
            trade.price = 1121.1;
            trade.volume = 1110;
            trade.timestamp = cts-1;
            result = candle.addTrade(trade);
            expect(result).to.be.equals(false);
            expect(candle.getArrayData()).to.be.deep.equals([cts, 21, 21.1, 1.1, 1.1, 37.4, cts+1, cts+15 ]);

        });
    });
});
