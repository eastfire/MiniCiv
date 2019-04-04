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
          type: "research"
        },
        {
          position:{x:0,y:1},
          type: "produce"
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
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "food"
        },
        {
          position:{x:0,y:1},
          type: "produce"
        },
        {
          position:{x:1,y:0},
          type: "research"
        },
        {
          position:{x:1,y:1},
          type: "research"
        },
      ],
      width: 2,
      height: 2,
      name: "XXX"
    })
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "food"
        },
        {
          position:{x:0,y:1},
          type: "research"
        },
        {
          position:{x:1,y:0},
          type: "produce"
        },
        {
          position:{x:1,y:1},
          type: "produce"
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
    card = JSON.parse(JSON.stringify(card)); //复制一份
    let result = Utils.rotateTile(Utils.random(0,3), card.blocks, card.width, card.height )
    card.width = result.width;
    card.height = result.height;
    card.blocks.forEach(function(block){
      node.getComponent("buildingTile").addBlock(block)
    })
    node.getComponent("buildingTile").adjustCenter();
    node.width = card.width*Global.TILE_WIDTH;
    node.height = (card.height)*Global.TILE_HEIGHT;
    return node;
  }
  addTile(){

  }
  discardTile(){

  }
}
