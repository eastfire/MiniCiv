const {ccclass, property} = cc._decorator;
const Global = require("global");
const Utils = require("utils");

@ccclass // 使用装饰器声明 CCClass
export default class TileFactory extends cc.Component {
  constructor(){
    this.deck = [];
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "science"
        },
        {
          position:{x:0,y:1},
          type: "science"
        },
        {
          position:{x:1,y:0},
          type: "food"
        },
        {
          position:{x:1,y:1},
          type: "food"
        },
      ],
      width: 2,
      height: 2,
      name: "XXX"
    })
  }
  drawTile(){
    let node = new cc.Node();
    node.addComponent("buildingTile")

    let card = Utils.sample(this.deck)
    let result = Utils.rotateTile(Math.round(Math.random()*4), card.blocks, card.width, card.height )
    card.width = result.width;
    card.height = result.height;
    card.blocks.forEach(function(block){
      node.getComponent("buildingTile").addBlock(block)
    })
    node.getComponent("buildingTile").adjustCenter();
    return node;
  }
  addTile(){

  }
  discardTile(){

  }
}
