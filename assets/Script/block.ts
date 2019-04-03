const {ccclass, property} = cc._decorator;
const Global = require("global");

@ccclass
export default class Block extends cc.Component {
  @property(cc.Sprite)
  private background:cc.Sprite=null;

  @property(cc.Layout)
  private iconList:cc.Layout=null;

  @property(cc.Node)
  private effectLayer:cc.Node = null;

  start(){

  }
  getIcon(type){
    let count = 0;
    this.iconList.node.children.forEach(function(node){
      if ( node.getComponent("icon").type === type) count++;
    },this)
    return  count;
  }
  extractIcon(type){

  }
  gainIcon(type, amount = 1){
    cc.log(type)
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