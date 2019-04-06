const {ccclass, property} = cc._decorator;
import Block from "../Building/block"

@ccclass // 使用装饰器声明 CCClass
export default class Area extends cc.Component {
  @property
  _isAvailable = false;
  @property
  public get isAvailable(){
    return this._isAvailable;
  }
  @property
  public set isAvailable(newValue){
    if ( this._isAvailable == newValue ) return;
    this._isAvailable = newValue;

    this.node.active = true;
  }
  @property(cc.Sprite)
  public mainSprite: cc.Sprite = null;

  @property
  _isOpen = false;
  @property
  public get isOpen(){
    return this._isOpen;
  }
  @property
  public set isOpen(newValue){
    if ( this._isOpen == newValue ) return;
    this._isOpen = newValue;
    this.node.active = true;
  }

  public position = {
    x:1,
    y:1,
  };

  public terrain = "plain";
  public block=null;

  start(){
    this.node.active = this.isOpen;
  }

  public gainBlock(blockNode:cc.Node):void{
    this.mainSprite.node.addChild(blockNode)
    blockNode.x = 0;
    blockNode.y = 0;
    this.block = blockNode.getComponent(Block)
    this.block.area = this;
    this.block.position = this.position;
  }
  public removeBlock(){
    this.block.node.removeFromParent(true)
    this.block = null;
  }

  public checkValid(block:Block): boolean {
    if ( this.block || !this.isOpen ) return false;
    return true;
  }
}
