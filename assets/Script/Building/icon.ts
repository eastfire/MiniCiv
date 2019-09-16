const {ccclass, property} = cc._decorator;
const Global = require("global");

@ccclass
export default class Icon extends cc.Component {
  @property
  public type = "research";
  @property
  public amount=1;
  @property(cc.Sprite)
  public extractIcon:cc.Sprite=null;

  @property
  _isExtract = false;
  @property
  public get isExtract(){
    return this._isExtract;
  }
  @property
  public set isExtract(newValue){
    this._isExtract = newValue;
    this.extractIcon.node.active = this.isExtract;
  }

  start(){
    
  }

  
}
