const {ccclass, property} = cc._decorator;
const Global = require("global");
import Area from "./Area";

@ccclass // 使用装饰器声明 CCClass
export default class Board extends cc.Component {
  @property([cc.Prefab])
  public blockPrefabs: cc.Prefab[] = [];
  @property([cc.Prefab])
  public areaPrefabs: cc.Prefab[] = [];

  @property(cc.Label)
  label: cc.Label = null;

  @property
  _phase = "";
  @property
  public get phase(){
    return this._phase;
  }
  @property
  set phase(newValue){
    if ( this._phase == newValue ) return;
    this._phase = newValue;
    this.node.emit("PHASE:"+this._phase);
  }

  public blockPrefabMap = {};
  public areaPrefabMap = {};

  start () {

    this.initBlockPrefabMap();
    this.initAreaPrefabMap();
    this.initBoard();

    this.turn = 1;

  },
  initBlockPrefabMap(){
    this.blockPrefabs.forEach(function(prefab){
      this.blockPrefabMap[prefab.name] = prefab;
    },this)
  },
  initAreaPrefabMap(){
    this.areaPrefabs.forEach(function(prefab){
      this.areaPrefabMap[prefab.name] = prefab;
    },this)
  },
  initBoard(){
    this.maxWidth = 12;
    this.maxHeight = 12;

    this.startPosition = {
      x: 3,
      y: 3,
    }
    this.width = 6;
    this.height = 6;

    this.areas = [];
    for ( let x =0; x<this.maxWidth; x++) {
      this.areas.push([])
      for ( let y = 0; y < this.maxHeight; y++ ) {
        var areaNode = cc.instantiate(this.areaPrefabMap["plain"])
        areaNode.x = Global.TILE_WIDTH*(x-(this.maxWidth-1)/2);
        areaNode.y = Global.TILE_HEIGHT*(y-(this.maxHeight-1)/2);
        this.node.addChild(areaNode);

        let area = areaNode.getComponent("area");
        area.position = {x,y};
        this.areas[x][y] = area;
        if ( x>= this.startPosition.x && x < this.startPosition.x+this.width &&
        y>= this.startPosition.y && y < this.startPosition.y+this.height) {
          area.isOpen = true;
        }
      }
    }

    this.adjustCenter();

  }

  adjustCenter(){
    //找到中点
    let maxX = 0;
    let maxY = 0;
    let minX = this.maxWidth;
    let minY = this.maxHeight;
    for ( let x =0; x<this.maxWidth; x++) {
      for ( let y = 0; y < this.maxHeight; y++ ) {
        if ( this.areas[x][y].isOpen ) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }

    this.width = maxX - minX+1;
    this.height = maxY - minY+1;
    this.node.anchorX = (this.width/2+minX)/this.maxWidth;
    this.node.anchorY = (this.height/2+minY)/this.maxHeight;
    cc.log(this.node.anchor)
    cc.log(this.node.anchorX)
    cc.log(this.node.anchorY)
    let maxSize = Math.max( this.width*Global.TILE_WIDTH, this.height*Global.TILE_HEIGHT )
    let scaleRate = cc.winSize.width/maxSize;
    this.node.setScale(scaleRate)
  }
  // 成员方法
  onLoad() {
      // init logic
  }
}
