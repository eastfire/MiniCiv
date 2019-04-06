const {ccclass, property} = cc._decorator;
const Global = require("global");
const Common = require("common");
const Utils = require("utils");
import TileFactory from "./tileFactory"
import Board from "board"

@ccclass // 使用装饰器声明 CCClass
export default class MainGame extends cc.Component {
  private res = {};
  private maxRes = {};
  @property(Board)
  public board: Board = null;
  @property([cc.Prefab])
  public blockPrefabs: cc.Prefab[] = [];
  @property([cc.Prefab])
  public areaPrefabs: cc.Prefab[] = [];
  @property([cc.Prefab])
  public iconPrefabs: cc.Prefab[] = [];
  @property(cc.Label)
  public researchLabel: cc.Label = null;
  @property(cc.Label)
  public produceLabel: cc.Label = null;
  @property(cc.Label)
  public foodLabel: cc.Label = null;
  @property(cc.Label)
  public goldLabel: cc.Label = null;
  @property(cc.Sprite)
  public researchIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public produceIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public foodIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public goldIcon: cc.Sprite = null;
  @property(cc.Label)
  public scoreLabel: cc.Label = null;
  @property(cc.Sprite)
  public researchObjectIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public produceObjectIcon: cc.Sprite = null;

  @property
  private _phase = "";
  @property
  public get phase(){
    return this._phase;
  }
  @property
  public set phase(newValue){
    if ( this._phase == newValue ) return;
    this._phase = newValue;
    this.node.emit("PHASE:"+this._phase);
  }

  @property
  public get food(){
    return this.res.food;
  }
  @property
  public set food(newValue){
    if ( this.res.food == newValue ) return;
    this.res.food = newValue;
    this.resLabel.food.string = this.res.food + "/" + this.maxRes.food;
  }

  @property
  public get maxFood(){
    return this.maxRes.food;
  }
  @property
  public set maxFood(newValue){
    if ( this.maxRes.food == newValue ) return;
    this.maxRes.food = newValue;
    this.resLabel.food.string = this.res.food + "/" + this.maxRes.food;
  }

  @property
  public get research(){
    return this.res.research;
  }
  @property
  public set research(newValue){
    if ( this.res.research == newValue ) return;
    this.res.research = newValue;
    this.resLabel.research.string = this.res.research + "/" + this.maxRes.research;
  }

  @property
  public get maxResearch(){
    return this.maxRes.research;
  }
  @property
  public set maxResearch(newValue){
    if ( this.maxRes.research == newValue ) return;
    this.maxRes.research = newValue;
    this.resLabel.research.string = this.res.research + "/" + this.maxRes.research;
  }

  @property
  public get produce(){
    return this.res.produce;
  }
  @property
  public set produce(newValue){
    if ( this.res.produce == newValue ) return;
    this.res.produce = newValue;
    this.resLabel.produce.string = this.res.produce + "/" + this.maxRes.produce;
  }

  @property
  public get maxProduce(){
    return this.maxRes.produce;
  }
  @property
  public set maxProduce(newValue){
    if ( this.maxRes.produce == newValue ) return;
    this.maxRes.produce = newValue;
    this.resLabel.produce.string = this.res.produce + "/" + this.maxRes.produce;
  }

  @property
  public get gold(){
    return this.res.gold;
  }
  @property
  public set gold(newValue){
    if ( this.res.gold == newValue ) return;
    this.res.gold = newValue;
    this.resLabel.gold.string = this.res.gold;
  }

  private _score = -1;
  @property
  public get score(){
    return this._score;
  }
  @property
  public set score(newValue){
    if ( this._score == newValue ) return;
    this._score = newValue;
    this.scoreLabel.string = this._score;
  }

  public iconPrefabMap = {};
  public blockPrefabMap = {};
  public areaPrefabMap = {};

  start () {
    Global.game = this;
    this.initUI()
    this.initParams();
    this.initIconPrefabMap();
    this.initBlockPrefabMap();
    this.initAreaPrefabMap();
    this.initTileFactory();

    this.boardBottomLine = cc.winSize.height/2-cc.winSize.width/2-Global.TILE_HEIGHT/2;

    this.initTileLine()

    this.restorePhase();
  }
  initUI():void{
    this.resIcon = {};
    this.resLabel = {};

    this.resIcon.research = this.researchIcon;
    this.resIcon.gold = this.goldIcon;
    this.resIcon.produce = this.produceIcon;
    this.resIcon.food = this.foodIcon;

    this.resLabel.research = this.researchLabel;
    this.resLabel.gold = this.goldLabel;
    this.resLabel.produce = this.produceLabel;
    this.resLabel.food = this.foodLabel;


  }
  initParams():void{
    this.tileChoiceCount = Global.INIT_TILE_CHOICE_COUNT;
    this.res = {};
    this.extraRes = {};

    this.food = Global.INIT_FOOD;
    this.research = Global.INIT_RESEARCH;
    this.produce = Global.INIT_PRODUCE;
    this.gold = Global.INIT_GOLD;

    this.maxFood = Global.INIT_MAX_FOOD;
    this.maxResearch = Global.INIT_MAX_RESEARCH;
    this.maxProduce = Global.INIT_MAX_PRODUCE;

    this.extraRes.food = 0;
    this.extraRes.research = 0;
    this.extraRes.produce = 0;

    this.score = 0;

    // this.resLabel.research.string = this.res.research + "/" + this.maxRes.research;
    // this.resLabel.produce.string = this.res.produce + "/" + this.maxRes.produce;
    // this.resLabel.food.string = this.res.food + "/" + this.maxRes.food;
    // this.resLabel.gold.string = this.res.gold;
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
          node.runAction(cc.sequence(
            cc.spawn(
              cc.scaleTo(0.3,this.board.scaleRate),
              cc.moveBy(0.3,0,Global.TILE_HEIGHT),
            ),
            cc.callFunc(function(){
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
      var icons = block.getAllIcon();
      if ( icons.length > 1 ) {
        //TODO choose a icon
      } else if ( icons.length == 1 ){
        this.extractIcon(icons[0].type, block.position)
      }
    },this)
  }
  private extractIcon(type, position){
    let area = this.board.getArea(position);
    this.waitAreaList = [area];
    this.okAreaList = [];
    while (this.waitAreaList.length){
      let area = this.waitAreaList.shift();
      if ( area.block && area.block.getIcon(type) ) {
        this.okAreaList.push(area);
        Common.DIRECTIONS.forEach(function(direction){
          let p = Common.getIncrementPosition(area.position, direction)
          let adjacentArea = this.board.getArea(p);
          if ( adjacentArea && !Utils.contains(this.okAreaList, adjacentArea) && !Utils.contains(this.waitAreaList, adjacentArea) ) {
            this.waitAreaList.push(adjacentArea);
          }
        },this)
      }
    }
    var total = 0
    this.okAreaList.forEach(function(area){
      do {
        let iconNode = area.block.extractOneIcon(type)
        if ( iconNode ) {
          total++;
          this.node.addChild(iconNode)

          var resLabel = this.resLabel[type];
          iconNode.runAction(cc.sequence(
            cc.delayTime(Math.random()*0.2),
            cc.spawn(
              cc.moveTo(Global.GET_REWARD_TIME,resLabel.node.x,resLabel.node.y),
              cc.scaleTo(Global.GET_REWARD_TIME,0.5,0.5)
            ),
            cc.removeSelf(),
            cc.callFunc(function(){
              if ( type === "research" ) {
                this.gainResearch(1)
              } else if ( type === "produce" ) {
                this.gainProduce(1)
              } else if ( type === "food" ) {
                this.gainFood(1)
              } else if ( type === "gold" ) {
                this.gold ++;
              }
            },this)
          ))
        }
      } while (iconNode);
    },this)
    //onGetTotalRes


    this.scheduleOnce(()=>{
      this.turnEnd();
    },Global.GET_REWARD_TIME+0.2);
  }
  turnStart(){
    this.phase = "turnStart"
    this.startPlaceTile();
  }
  gainResearch(amount){
    if ( amount+this.research <= this.maxResearch ) {
      this.research += amount;
    } else {
      this.extraRes.research = amount - ( this.maxResearch - this.research );
      this.research = this.maxResearch;
      //TODO on researchFull
    }
  }
  gainProduce(amount){
    if ( amount+this.produce <= this.maxProduce ) {
      this.produce += amount;
    } else {
      this.extraRes.produce = amount - ( this.maxProduce - this.produce );
      this.produce = this.maxProduce;
      //TODO on produce Full
    }
  }
  gainFood(amount){
    if ( amount+this.food <= this.maxFood ) {
      this.food += amount;
    } else {
      this.extraRes.food = amount - ( this.maxFood - this.food );
      this.food = this.maxFood;
      //TODO on food Full
    }
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
