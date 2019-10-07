const {ccclass, property} = cc._decorator;
const Global = require("global");
const Utils = require("utils");

import {shuffle} from '../libs/lodash.min'

@ccclass // 使用装饰器声明 CCClass
export default class TileFactory extends cc.Component {
  public deck = [];
  public discardDeck = [];

  constructor(){
    super();
    this.deck = [];
    // this.deck.push({
    //   blocks:[
    //     {
    //       position:{x:0,y:0},
    //       type: "research",
    //       isExtract: true,
    //     },
    //     {
    //       position:{x:0,y:1},
    //       type: "produce",
    //       isExtract: true,
    //     },
    //     {
    //       position:{x:1,y:0},
    //       type: "food",
    //       isExtract: true,
    //     },
    //     {
    //       position:{x:1,y:1},
    //       type: "score",
    //       isExtract: true,
    //     },
    //   ],
    //   name: "独裁政体"
    // })
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "research",
          isExtract: true,
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
      name: "A"
    })
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "research"
        },
        {
          position:{x:0,y:1},
          type: "produce",
          isExtract: true,
        },
        {
          position:{x:1,y:0},
          type: "food"
        },
        {
          position:{x:1,y:1},
          type: "food",
          // isExtract: true,
        },
      ],
      name: "B"
    })
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "food",
          isExtract: true,
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
      name: "C"
    })
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "food"
        },
        {
          position:{x:0,y:1},
          type: "produce",
          isExtract: true,
        },
        {
          position:{x:1,y:0},
          type: "research"
        },
        {
          position:{x:1,y:1},
          type: "research",
        },
      ],
      name: "D"
    })
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "food",
          isExtract: true,
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
      name: "E"
    }),
    this.deck.push({
      blocks:[
        {
          position:{x:0,y:0},
          type: "food"
        },
        {
          position:{x:0,y:1},
          type: "research",
          isExtract: true,
        },
        {
          position:{x:1,y:0},
          type: "produce"
        },
        {
          position:{x:1,y:1},
          type: "produce",
        },
      ],
      name: "F"
    })
    // this.deck.push({
    //   blocks:[
    //     {
    //       position:{x:0,y:0},
    //       type: "research"
    //     },
    //     {
    //       position:{x:0,y:1},
    //       type: "produce"
    //     }        
    //   ],
    //   name: "BBB"
    // })
    // this.deck.push({
    //   blocks:[
    //     {
    //       position:{x:0,y:0},
    //       type: "produce"
    //     },
    //     {
    //       position:{x:0,y:1},
    //       type: "gold",
    //       isExtract: true
    //     }        
    //   ],
    //   name: "金矿"
    // })
    // this.deck.push({
    //   blocks:[
    //     {
    //       position:{x:0,y:0},
    //       type: "research"
    //     },
    //     {
    //       position:{x:0,y:1},
    //       type: "food"
    //     }       
    //   ],
    //   name: "AAA"
    // })
    // this.deck.push({
    //   blocks:[
    //     {
    //       position:{x:0,y:0},
    //       type: "produce"
    //     },
    //     {
    //       position:{x:0,y:1},
    //       type: "food"
    //     }        
    //   ],
    //   name: "CCC"
    // })
    this.deck.forEach((card)=>{
      this.calculateCard(card);
    })

    this.deck = shuffle(this.deck);
  }
  calculateCard(card){
    let maxX = 0;
    let maxY = 0;
    let minX = 5;
    let minY = 5;
    card.blocks.forEach(function(block){
      let x = block.position.x;
      let y = block.position.y;
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    },this)
    card.width = maxX - minX+1;
    card.height = maxY - minY+1;
  }
  drawTile(){
    let node = new cc.Node();
    node.addComponent("buildingTile")

    if ( this.deck.length == 0 ) {
      this.deck = shuffle(this.discardDeck);
      this.discardDeck = [];
    }
    let card = this.deck.pop();
    node.getComponent("buildingTile").card = card;

    card = JSON.parse(JSON.stringify(card)); //复制一份
    let result = Utils.rotateTile(Utils.random(0,3), card.blocks, card.width, card.height )
    card.width = result.width;
    card.height = result.height;
    let offsetX = (card.width-1)/2*Global.TILE_WIDTH;
    let offsetY = (card.height-1)/2*Global.TILE_HEIGHT;
    if ( Math.random()>0.5) Utils.flipTileX(card.blocks,card.width, card.height);
    card.blocks.forEach(function(block){
      node.getComponent("buildingTile").addBlock(block, offsetX, offsetY)
    })
    node.getComponent("buildingTile").width = card.width;
    node.getComponent("buildingTile").height = card.height;
    
    node.anchorX = 0.5;
    node.anchorY = 0.5;
    node.width = card.width*Global.TILE_WIDTH;
    node.height = (card.height)*Global.TILE_HEIGHT;
    return node;
  }
  discardTile(card){
    this.discardDeck.push(card);
  }
  addTile(){

  }
}

