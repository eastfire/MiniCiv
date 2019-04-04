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

    this.boardBottomLine = cc.winSize.height/2-cc.winSize.width/2-Global.TILE_HEIGHT/2;

    var node = this.tileFactory.drawTile();
    node.x = -200;
    node.y = -400;
    node.setScale(Global.WAITING_TILE_SCALE)
    this.node.addChild(node)
    this.setTileEventHandler(node)

    node = this.tileFactory.drawTile();
    node.x = -0;
    node.y = -400;
    node.setScale(Global.WAITING_TILE_SCALE)
    this.node.addChild(node)
    this.setTileEventHandler(node)

    node = this.tileFactory.drawTile();
    node.x = 200;
    node.y = -400;
    node.setScale(Global.WAITING_TILE_SCALE)
    this.node.addChild(node)
    this.setTileEventHandler(node)
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
  setTileEventHandler(node){
    node.on("touchstart",function(event){
      if ( this.currentDraggingTile ) return;
      this.currentDraggingTile = node;
      this.draggingTileOriginPosition = {
        x: node.x,
        y: node.y
      }
      var locationInNode = event.getLocation();
      this.prevDraggingPosition = locationInNode
    },this)
    node.on("touchmove",function(event){
      var locationInNode = event.getLocation();
      if ( locationInNode.y <= this.boardBottomLine ) {
        if ( this.prevDraggingPosition.y > this.boardBottomLine ) {
          cc.log("node position "+node.x+" "+node.y)
          node.runAction(cc.sequence(
            cc.spawn(
              cc.scaleTo(0.3,Global.WAITING_TILE_SCALE),
              cc.moveBy(0.3,0,-Global.TILE_HEIGHT),
            ),
            cc.callFunc(function(){
            },this)
          ))
        }

      } else {
        if ( this.prevDraggingPosition.y <= this.boardBottomLine ) {
          cc.log("node position "+node.x+" "+node.y)
          node.runAction(cc.sequence(
            cc.spawn(
              cc.scaleTo(0.3,this.board.scaleRate),
              cc.moveBy(0.3,0,Global.TILE_HEIGHT),
            ),
            cc.callFunc(function(){
              cc.log("node position "+node.x+" "+node.y)
            },this)
          ))
        }
      }
      node.x += (locationInNode.x - this.prevDraggingPosition.x )
      node.y += (locationInNode.y - this.prevDraggingPosition.y )
      this.prevDraggingPosition = locationInNode;

      var tile = node.getComponent("buildingTile")
      //find position of tile
      let x = Math.floor((node.x/(this.board.scaleRate*Global.TILE_WIDTH) - tile.width/2 )
        - (this.board.node.x/(this.board.scaleRate*Global.TILE_WIDTH) - this.board.width/2))+this.board.minX+1;
      let y = Math.floor((node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - tile.height/2 )
        - (this.board.node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - this.board.height/2))+this.board.minY+1;
      var position = {x,y}
      this.checkTileValidOnBoard(node, position)
    },this)
    node.on("touchend",function(event){
      cc.log("touchend")
      var locationInNode = event.getLocation();
      if ( locationInNode.y <= this.boardBottomLine ) {
        this.putBackTile(node)
      } else {
        var tile = node.getComponent("buildingTile")
        //find position of tile
        let x = Math.floor((node.x/(this.board.scaleRate*Global.TILE_WIDTH) - tile.width/2 )
          - (this.board.node.x/(this.board.scaleRate*Global.TILE_WIDTH) - this.board.width/2))+this.board.minX+1;
        let y = Math.floor((node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - tile.height/2 )
          - (this.board.node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - this.board.height/2))+this.board.minY+1;
        cc.log("x:"+x+" y:"+y);

        var position = {x,y}
        if ( this.checkTileValidOnBoard(node, position) ) {
          this.putTileOnBoard(node, position)
        } else {
          this.putBackTile(node)
        }
      }
      this.currentDraggingTile = null;
    },this)
  }
  putBackTile(tileNode:cc.Node): void {
    for ( let i = 0; i < tileNode.children.length; i++ ){
      let blockNode = tileNode.children[i]
      let block = blockNode.getComponent("block")
      block.isValid = true;
    }
    tileNode.stopAllActions();
    tileNode.runAction(cc.spawn(
      cc.scaleTo(0.3,Global.WAITING_TILE_SCALE),
      cc.moveTo(0.3,this.draggingTileOriginPosition.x,this.draggingTileOriginPosition.y)
    )
  }
  checkTileValidOnBoard(tileNode:cc.Node, position ): boolean {
    let valid = true;
    for ( let i = 0; i < tileNode.children.length; i++ ){
      let blockNode = tileNode.children[i]
      let block = blockNode.getComponent("block")
      var area = this.board.getArea({
        x: position.x + block.position.x,
        y: position.y + block.position.y
      })
      if ( area && area.checkValid(blockNode) ) {
        block.isValid = true;
      } else {
        block.isValid = false;
        valid = false;
      }
    }
    return valid;
  }
  putTileOnBoard(tileNode:cc.Node, position):void {
    let nodeList = [];
    for ( let i = 0; i < tileNode.children.length; i++ ){
      let blockNode = tileNode.children[i]
      nodeList.push(blockNode)
    }
    for ( let i = 0; i < nodeList.length; i++) {
      let blockNode = nodeList[i]
      tileNode.removeChild(blockNode, false);
      let area = this.board.getArea({
        x: position.x + blockNode.getComponent("block").position.x,
        y: position.y + blockNode.getComponent("block").position.y
      })
      area.gainBlock(blockNode)
    }
    tileNode.removeFromParent(true)
  }
});
