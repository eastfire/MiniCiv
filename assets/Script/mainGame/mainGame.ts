const {ccclass, property} = cc._decorator;
const Global = require("global");
import TileFactory from "./tileFactory"
import Board from "board"

@ccclass // 使用装饰器声明 CCClass
export default class MainGame extends cc.Component {
  @property([cc.Prefab])
  public blockPrefabs: cc.Prefab[] = [];
  @property([cc.Prefab])
  public areaPrefabs: cc.Prefab[] = [];
  @property([cc.Prefab])
  public iconPrefabs: cc.Prefab[] = [];
  @property(Board)
  public board: Board = null;



  public iconPrefabMap = {};
  public blockPrefabMap = {};
  public areaPrefabMap = {};

  start () {
    Global.game = this;

    this.initIconPrefabMap();
    this.initBlockPrefabMap();
    this.initAreaPrefabMap();
    this.initTileFactory();

    var node = this.tileFactory.drawTile();
    node.x = -200;
    node.y = -400;
    node.setScale(0.6)
    this.node.addChild(node)
    node = this.tileFactory.drawTile();
    node.x = -0;
    node.y = -400;
    node.setScale(0.6)
    this.node.addChild(node)
    node = this.tileFactory.drawTile();
    node.x = 200;
    node.y = -400;
    node.setScale(0.6)
    this.node.addChild(node)
  }
  initTileFactory(){
    this.tileFactory = new TileFactory();
  }
  initIconPrefabMap(){
    this.iconPrefabs.forEach(function(prefab){
      this.iconPrefabMap[prefab.name] = prefab;
    },this)
  }
  initBlockPrefabMap(){
    this.blockPrefabs.forEach(function(prefab){
      this.blockPrefabMap[prefab.name] = prefab;
    },this)
  }

  initAreaPrefabMap(){
    this.areaPrefabs.forEach(function(prefab){
      this.areaPrefabMap[prefab.name] = prefab;
    },this)
  }
});
