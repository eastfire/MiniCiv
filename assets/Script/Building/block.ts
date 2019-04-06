const {ccclass, property} = cc._decorator;
const Global = require("global");

@ccclass
export default class Block extends cc.Component {
  @property(cc.Sprite)
  private background:cc.Sprite=null;
  @property(cc.Sprite)
  private cross:cc.Sprite=null;

  @property(cc.Layout)
  private iconList:cc.Layout=null;

  @property(cc.Node)
  private effectLayer:cc.Node = null;

  @property
  _isValid = true;
  @property
  public get isValid(){
    return this._isValid;
  }
  @property
  public set isValid(newValue){
    if ( this._isValid == newValue ) return;

    this._isValid = newValue;

    this.cross.node.active = !this._isValid;
  }

  start(){
    this.cross.node.active = false;
  }
  getIcon(type:string):number{
    let count = 0;
    this.iconList.node.children.forEach(function(node){
      if ( node.getComponent("icon").type === type) count++;
    },this)
    return  count;
  }
  getAllIcon():[number]{
    let result = [];
    let map = {}
    this.iconList.node.children.forEach(function(node){
      let type = node.getComponent("icon").type;
      if ( map[type] ) {
        map[type]++;
      } else map[type] = 1;
    },this)
    for ( let type in map ) {
      result.push({
        type,
        count: map[type]
      })
    }
    return result;
  }
  getIconTypeCount():number{
    let result = {}
    count = 0;
    this.iconList.node.children.forEach(function(node){
      var type = node.getComponent("icon").type;
      if ( !result[type] ) {
        result[type] = 1;
        count++;
      }
    },this)
    return count;
  }
  extractOneIcon(type){
    for ( let i = 0; i < this.iconList.node.children.length; i++){
      var node = this.iconList.node.children[i]
      let t = node.getComponent("icon").type;
      if ( t === type ) {
        var position = Global.game.node.convertToNodeSpaceAR(this.iconList.node.convertToWorldSpaceAR(node.position))
        node.removeFromParent(false)
        node.position = position;
        return node;
      }
    },this)
    if ( this.iconList.node.children.length === 0 ) {
      this.area.removeBlock();
    }
    return null;
  }

  gainIcon(type, amount = 1){
    for ( let i = 0; i < amount ; i++ ) {
      var prefab = Global.game.iconPrefabMap[type];
      if ( !prefab ) {
        cc.error("icon:"+type+" not register")
        return;
      }
      var icon = cc.instantiate(prefab)
      icon.x = 0;
      icon.y = 0;
      this.iconList.node.addChild(icon);
    }
  }

  removeIcon(type){

  }
}
