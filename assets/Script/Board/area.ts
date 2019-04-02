const {ccclass, property} = cc._decorator;

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
}
