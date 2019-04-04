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

  @property
  _food = 0;
  @property
  public get food(){
    return this._food;
  }
  @property
  set food(newValue){
    if ( this._food == newValue ) return;
    this._food = newValue;
  }

  @property
  _maxFood = 0;
  @property
  public get maxFood(){
    return this._maxFood;
  }
  @property
  set maxFood(newValue){
    if ( this._maxFood == newValue ) return;
    this._maxFood = newValue;
  }

  @property
  _research = 0;
  @property
  public get research(){
    return this._research;
  }
  @property
  set research(newValue){
    if ( this._research == newValue ) return;
    this._research = newValue;
  }

  @property
  _maxResearch = 0;
  @property
  public get maxResearch(){
    return this._maxResearch;
  }
  @property
  set maxResearch(newValue){
    if ( this._maxResearch == newValue ) return;
    this._maxResearch = newValue;
  }

  @property
  _produce = 0;
  @property
  public get produce(){
    return this._produce;
  }
  @property
  set produce(newValue){
    if ( this._produce == newValue ) return;
    this._produce = newValue;
  }

  @property
  _maxProduce = 0;
  @property
  public get maxProduce(){
    return this._maxProduce;
  }
  @property
  set maxProduce(newValue){
    if ( this._maxProduce == newValue ) return;
    this._maxProduce = newValue;
  }

  public iconPrefabMap = {};
  public blockPrefabMap = {};
  public areaPrefabMap = {};

  start () {
    Global.game = this;

    this.initParams();
    this.initIconPrefabMap();
    this.initBlockPrefabMap();
    this.initAreaPrefabMap();
    this.initTileFactory();

    this.boardBottomLine = cc.winSize.height/2-cc.winSize.width/2-Global.TILE_HEIGHT/2;

    this.initTileLine()

    this.restorePhase();
  }
  initParams():void{
    this.tileChoiceCount = Global.INIT_TILE_CHOICE_COUNT;
  }
  initTileFactory():void{
    this.tileFactory = new TileFactory();
  }
  initIconPrefabMap():void{
    this.iconPrefabs.forEach(function(prefab){
      this.iconPrefabMap[prefab.name] = prefab;
    },this)
  }
  initBlockPrefabMap():void{
    this.blockPrefabs.forEach(function(prefab){
      this.blockPrefabMap[prefab.name] = prefab;
    },this)
  }

  initAreaPrefabMap():void{
    this.areaPrefabs.forEach(function(prefab){
      this.areaPrefabMap[prefab.name] = prefab;
    },this)
  }
  initTileLine():void{
    this.tiles = [];
    for ( let i = 0; i < this.tileChoiceCount; i++ ) {
      this.drawTileToLine();
    }
  }
  restorePhase():void{
    this.turnStart();
  }
  drawTileToLine(){
    let node = this.tileFactory.drawTile();
    node.x = 0;
    node.y = 0;
    node.setScale(Global.WAITING_TILE_SCALE)
    this.node.addChild(node)
    this.setTileEventHandler(node)
    this.addTileToLine(node)
  }
  addTileToLine(tileNode):void{
    this.tiles.push(tileNode)
    this.refreshTilePosition();
  }
  removeTileFromLine(tileNode):void{
    let index = this.tiles.indexOf(tileNode);
    if ( index !== -1 ) {
      tileNode.removeFromParent(true)
      this.tiles.splice(index,1)
      this.refreshTilePosition();
    }
  }
  refreshTilePosition():void{
    var size = cc.winSize.width / this.tiles.length;

    for ( let i = 0; i < this.tiles.length; i++ ) {
      this.tiles[i].stopAllActions();
      this.tiles[i].runAction(cc.moveTo(0.3, i*size+size/2-cc.winSize.width/2, -420))
    }
  }

  setTileEventHandler(node:cc.Node):void{
    node.on("touchstart",function(event){
      if ( this.phase !== "placeTile" ) return;
      if ( this.currentDraggingTile ) return;
      this.currentDraggingTile = node;
      this.draggingTileOriginPosition = {
        x: node.x,
        y: node.y
      }
      let locationInNode = event.getLocation();
      this.prevDraggingPosition = locationInNode
    },this)
    node.on("touchmove",function(event){
      if ( this.phase !== "placeTile" ) return;
      let locationInNode = event.getLocation();
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

      let tile = node.getComponent("buildingTile")
      //find position of tile
      let x = Math.floor((node.x/(this.board.scaleRate*Global.TILE_WIDTH) - tile.width/2 )
        - (this.board.node.x/(this.board.scaleRate*Global.TILE_WIDTH) - this.board.width/2))+this.board.minX+1;
      let y = Math.floor((node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - tile.height/2 )
        - (this.board.node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - this.board.height/2))+this.board.minY+1;
      let position = {x,y}
      this.checkTileValidOnBoard(node, position)
    },this)
    node.on("touchend",function(event){
      if ( this.phase !== "placeTile" ) return;
      let locationInNode = event.getLocation();
      if ( locationInNode.y <= this.boardBottomLine ) {
        this.putBackTile(node)
      } else {
        let tile = node.getComponent("buildingTile")
        //find position of tile
        let x = Math.floor((node.x/(this.board.scaleRate*Global.TILE_WIDTH) - tile.width/2 )
          - (this.board.node.x/(this.board.scaleRate*Global.TILE_WIDTH) - this.board.width/2))+this.board.minX+1;
        let y = Math.floor((node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - tile.height/2 )
          - (this.board.node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - this.board.height/2))+this.board.minY+1;

        let position = {x,y}
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
      let area = this.board.getArea({
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
      this.setBlockEventHandler(blockNode)
    }
    this.removeTileFromLine(tileNode)
    this.drawTileToLine();
    this.collectResource();
  }
  setBlockEventHandler(blockNode:cc.Node):void{
    blockNode.on("touchend",function(event){
      if ( this.phase !== "collectResource" ) return;
      let block = blockNode.getComponent("block")
      if ( block.getIcon() )
    },this)
  }
  turnStart(){
    this.phase = "turnStart"
    this.startPlaceTile();
  }
  startPlaceTile(){
    this.phase = "placeTile"
  }
  collectResource(){
    this.phase = "collectResource"
  }
  turnEnd(){
    this.phase = "turnEnd"
    this.turn++
    this.turnStart();
  }
});
