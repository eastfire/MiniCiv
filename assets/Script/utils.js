"use strict";

module.exports = {
  rotateTile(angle, blocks, width, height){
    if ( angle === 0) return {
      width,
      height
    };
    if ( angle === 1 ) {
      for ( let i = 0; i < blocks.length; i++ ) {
        var block = blocks[i];
        var x = block.position.x;
        var y = block.position.y;
        blocks[i].position.x = y;
        blocks[i].position.y = width-1-x;
      }
      return {
        width: height,
        height: width
      }
    } else if ( angle === 2 ) {
      for ( let i = 0; i < blocks.length; i++ ) {
        var block = blocks[i];
        var x = block.position.x;
        var y = block.position.y;
        blocks[i].position.x = width-1-x;
        blocks[i].position.y = height-1-y;
      }
      return {
        width,
        height
      }
    } else if ( angle === 3 ) {
      for ( let i = 0; i < blocks.length; i++ ) {
        var block = blocks[i];
        var x = block.position.x;
        var y = block.position.y;
        blocks[i].position.x = height-1-y;
        blocks[i].position.y = x;
      }
      return {
        width: height,
        height: width
      }
    }
  },
  flipTileX(blocks, width, height){
    for ( let i = 0; i < blocks.length; i++ ) {
      var block = blocks[i];
      var x = block.position.x;
      blocks[i].position.x = width-1-x;
    }
  },
  getPointDistance(p1,p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
  },
  contains(array1, item) {
    for ( var i = 0; i < array1.length; i++ ) {
      if ( item == array1[i] ) return true;
    }
    return false;
  },
  random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  },
  sample(array, n) {
    if (n == null) {
      return array[this.random(array.length - 1)];
    }
    var sample = array.slice();
    var length = sample.length;
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  },
  min(array, callback, context) {
    var value = null;
    var valueItem = null;
    array.forEach((item)=>{
      var result = callback.call(context, item);
      if ( value === null || value > result ) {
        value = result;
        valueItem = item;
      }
    })
    return valueItem;
  },
  max(array, callback, context) {
    var value = null;
    var valueItem = null;
    array.forEach((item)=>{
      var result = callback.call(context, item);
      if ( value === null || value < result ) {
        value = result;
        valueItem = item;
      }
    })
    return valueItem;
  },
  any(array, callback, context) {
    for ( var i = 0; i < array.length; i++ ) {
      if ( callback.call(context, array[i]) ) return true;
    }
    return false;
  },
  all(array, callback, context) {
    for ( var i = 0; i < array.length; i++ ) {
      if ( !callback.call(context, array[i]) ) return false;
    }
    return true;
  }
}
