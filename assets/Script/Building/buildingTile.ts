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

  addBlock(opt, offsetX, offsetY){
    var position = opt.position;
    if ( this.getBlock(position) ) {
      cc.error("already a block in position:"+position.x+" "+position.y)
      return;
    }
    var blockNode = cc.instantiate(Global.game.blockPrefabMap["block"])

    blockNode.x = Global.TILE_WIDTH*position.x-offsetX;
    blockNode.y = Global.TILE_HEIGHT*position.y-offsetY;
    this.node.addChild(blockNode);

    let block = blockNode.getComponent("block");
    block.position = position;
    block.gainIcon(opt.type, opt.amount, opt.isExtract)
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
