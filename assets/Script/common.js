var DIRECTION_UP = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_DOWN = 2;
var DIRECTION_LEFT = 3;
var DIRECTIONS = [DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN,DIRECTION_LEFT  ];
var REVERSE_DIRECTIONS = [DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_UP, DIRECTION_RIGHT ];

var INCREMENTS = [{
    x:0,
    y:1
},{
    x:1,
    y:0
},{
    x:0,
    y:-1
},{
    x:-1,
    y:0
}];

var DECREMENTS = [{
    x:0,
    y:-1
},{
    x:-1,
    y:0
},{
    x:0,
    y:1
},{
    x:1,
    y:0
}];

var DIAGNAL_INCREMENTS = [{
    x:1,
    y:1
},{
    x:1,
    y:-1
},{
    x:-1,
    y:-1
},{
    x:-1,
    y:1
}];

var ALL_INCREMENTS = [{
    x:0,
    y:1
},{
    x:1,
    y:0
},{
    x:0,
    y:-1
},{
    x:-1,
    y:0
},{
    x:1,
    y:1
},{
    x:1,
    y:-1
},{
    x:-1,
    y:-1
},{
    x:-1,
    y:1
}];
var getIncrementPosition = function(x, y, direction){
    if ( x instanceof  Object ) {
        direction = y;
        y = x.y;
        x = x.x;
    }
    var increment = INCREMENTS[direction]
    return {
        x: x + increment.x,
        y: y + increment.y
    }
}

var getDecrementPosition = function(x, y, direction){
    if ( x instanceof  Object ) {
        direction = y;
        y = x.y;
        x = x.x;
    }
    var increment = DECREMENTS[direction]
    return {
        x: x + increment.x,
        y: y + increment.y
    }
}

module.exports = {
  DIRECTION_UP,
  DIRECTION_RIGHT,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTIONS,
  REVERSE_DIRECTIONS,
  INCREMENTS,
  DECREMENTS,
  DIAGNAL_INCREMENTS,
  ALL_INCREMENTS,

  getIncrementPosition,
  getDecrementPosition,
}
