const {ccclass, property} = cc._decorator;
const Global = require("global");
import Block from "./block"


@ccclass
export default class BuildingTile extends cc.Component {
  private statusList = [];
  private direction = 0;

  start () {


  },
  constructor(){
    this.blocks = [];
  }
  // 成员方法
  onLoad() {
      // init logic

  }

  start(){

  }

  adjustCenter(){
    let maxX = 0;
    let maxY = 0;
    let minX = 5;
    let minY = 5;
    this.blocks.forEach(function(block){
      let x = block.position.x;
      let y = block.position.y;
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    },this)

    this.width = maxX - minX+1;
    this.height = maxY - minY+1;
    this.node.anchorX = (this.width-1)/2;
    this.node.anchorY = (this.height-1)/2;
    cc.log("anchorX:"+this.node.anchorX+" anchorY:"+this.node.anchorY)
  }

  addBlock(opt){
    var position = opt.position;
    if ( this.getBlock(position) ) {
      cc.error("already a block in position:"+position.x+" "+position.y)
      return;
    }
    var blockNode = cc.instantiate(Global.game.blockPrefabMap["block"])

    blockNode.x = Global.TILE_WIDTH*position.x;
    blockNode.y = Global.TILE_HEIGHT*position.y;
    this.node.addChild(blockNode);

    let block = blockNode.getComponent("block");
    block.position = position;
    block.gainIcon(opt.type, opt.amount)
    this.blocks.push(block);
  }

  getBlock(position){
    for ( let i = 0; i < this.blocks.length; i++ ) {
      let block = this.blocks[i]
      if ( position.x === block.position.x && position.y === block.position.y ) return block
    }
    return null;
  }

  getBlockNode(position){
    for ( let i = 0; i < this.node.children.length; i++ ) {
      let blockNode = this.node.children[i]
      let block = blockNode.getComponent("block");
      if ( block ){
         position.x === block.position.x && position.y === block.position.y ) return blockNode
      }
    }
    return null;
  }

  public rotate(clockwise){

  }
}
