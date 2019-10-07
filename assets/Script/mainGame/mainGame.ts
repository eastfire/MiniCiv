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
  private _turn = 1;
  
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
  @property(cc.Label)
  public scoreLabel: cc.Label = null;
  @property(cc.Label)
  public turnLabel: cc.Label = null;

  @property(cc.Sprite)
  public researchIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public produceIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public foodIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public goldIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public scoreIcon: cc.Sprite = null;
  @property(cc.Sprite)
  public turnIcon: cc.Sprite = null;
  
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

  @property
  public get score(){
    return this.res.score;
  }
  @property
  public set score(newValue){
    if ( this.res.score == newValue ) return;
    this.res.score = newValue;
    this.resLabel.score.string = this.res.score;
  }

  @property
  public get turn(){
    return this._turn;
  }
  @property
  public set turn(newValue){
    if ( this._turn == newValue ) return;
    this._turn = newValue;
    this.turnLabel.string = this._turn.toString();
  }

  public iconPrefabMap = {};
  public blockPrefabMap = {};
  public areaPrefabMap = {};

  private extractActions = [];

  start () {
    Global.game = this;
    this.initUI()
    this.initParams();
    this.initIconPrefabMap();
    this.initBlockPrefabMap();
    this.initAreaPrefabMap();
    this.initTileFactory();

    this.boardBottomLine = cc.winSize.height/2+this.board.node.y-cc.winSize.width/2-Global.TILE_HEIGHT/2;

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
    this.resIcon.score = this.scoreIcon;

    this.resLabel.research = this.researchLabel;
    this.resLabel.gold = this.goldLabel;
    this.resLabel.produce = this.produceLabel;
    this.resLabel.food = this.foodLabel;
    this.resLabel.score = this.scoreLabel;

    this.turnLabel.string = this.turn;
  }
  initParams():void{
    this.tileChoiceCount = Global.INIT_TILE_CHOICE_COUNT;
    this.res = {};
    this.extraRes = {};

    this.food = Global.INIT_FOOD;
    this.research = Global.INIT_RESEARCH;
    this.produce = Global.INIT_PRODUCE;
    this.gold = Global.INIT_GOLD;
    this.score = Global.INIT_SCORE;

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
    this.tileFactory.discardTile(tileNode.getComponent("buildingTile").card);
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
      this.tiles[i].runAction(cc.moveTo(0.3, i*size+size/2-cc.winSize.width/2, -310))
    }
  }
  activeTileLine(active):void{
    for ( let i = 0; i < this.tiles.length; i++ ) {
      this.tiles[i].opacity = active?255:50;
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
      let x = Math.floor(((node.x-Global.TILE_WIDTH/2)/(this.board.scaleRate*Global.TILE_WIDTH) - tile.width/2 )
        - (this.board.node.x/(this.board.scaleRate*Global.TILE_WIDTH) - this.board.width/2))+this.board.minX+1;
      let y = Math.floor(((node.y-Global.TILE_HEIGHT/2)/(this.board.scaleRate*Global.TILE_HEIGHT) - tile.height/2 )
        - (this.board.node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - this.board.height/2))+this.board.minY+1;
      let position = {x,y}
      this.checkTileValidOnBoard(node, position)
    },this)
    node.on("touchend",(event)=>{
      this.onTouchEnd(event,node)
    },this);
    node.on("touchcancel",(event)=>{
      this.onTouchEnd(event,node)
    },this);
  }
  onTouchEnd(event, node){
    if ( this.phase !== "placeTile" ) return;
    let locationInNode = event.getLocation();
    if ( locationInNode.y <= this.boardBottomLine ) {
      this.putBackTile(node)
    } else {
      let tile = node.getComponent("buildingTile")
      //find position of tile
      let x = Math.floor(((node.x-Global.TILE_WIDTH/2)/(this.board.scaleRate*Global.TILE_WIDTH) - tile.width/2 )
        - (this.board.node.x/(this.board.scaleRate*Global.TILE_WIDTH) - this.board.width/2))+this.board.minX+1;
      let y = Math.floor(((node.y-Global.TILE_HEIGHT/2)/(this.board.scaleRate*Global.TILE_HEIGHT) - tile.height/2 )
        - (this.board.node.y/(this.board.scaleRate*Global.TILE_HEIGHT) - this.board.height/2))+this.board.minY+1;

      let position = {x,y}
      if ( this.checkTileValidOnBoard(node, position) ) {
        this.putTileOnBoard(node, position)
      } else {
        this.putBackTile(node)
      }
    }
    this.currentDraggingTile = null;
  }
  putBackTile(tileNode:cc.Node): void {
    for ( let i = 0; i < tileNode.children.length; i++ ){
      let blockNode = tileNode.children[i]
      let block = blockNode.getComponent("block")
      block.isValid = true;
      block.showBackground();
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
      block.hideBackground();
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
    this.removeTileFromLine(tileNode)
    this.drawTileToLine();
    this.collectResource();
  }  
  turnStart(){
    this.phase = "turnStart"
    this.startPlaceTile();
  }
  gainResearch(amount){
    if ( amount+this.research <= this.maxResearch ) {
      this.research += amount;
      this.extraRes.research=0;
    } else {
      this.extraRes.research = amount - ( this.maxResearch - this.research );
      this.research = this.maxResearch;
    }
    if ( this.research === this.maxResearch ) {
      //TODO on researchFull

      this.maxResearch++;
      this.research = 0;
      if ( this.extraRes.research ) {
        this.gainResearch(this.extraRes.research);
      }
    }
  }
  gainProduce(amount){
    if ( amount+this.produce <= this.maxProduce ) {
      this.produce += amount;
      this.extraRes.produce = 0;
    } else {
      this.extraRes.produce = amount - ( this.maxProduce - this.produce );
      this.produce = this.maxProduce;
    }
    if ( this.produce === this.maxProduce ) {
      //TODO on produce Full

      this.maxProduce++;
      this.produce = 0;
      if ( this.extraRes.produce ) {
        this.gainProduce(this.extraRes.produce);
      }
    }
  }
  gainFood(amount){
    if ( amount+this.food <= this.maxFood ) {
      this.food += amount;
      this.extraRes.food = 0;
    } else {
      this.extraRes.food = amount - ( this.maxFood - this.food );
      this.food = this.maxFood;
    }
    if ( this.food === this.maxFood ) {
      //TODO on food Full
    
      this.maxFood++;
      this.food = 0;
      if ( this.extraRes.food ) {
        this.gainFood(this.extraRes.food);
      }
    }
  }
  startPlaceTile(){
    this.phase = "placeTile"
    this.activeTileLine(true);
  }
  collectResource(){
    this.phase = "collectResource";
    this.activeTileLine(false);
    
    this.extractActions = [];
    // mark all resource
    this.board.forEachBlock( (block, area, x, y){
      if ( block ) {
        block.forEachIcon((node)=>{
          let icon = node.getComponent("icon");
          if ( icon.isExtract ) {
            this.collectResourceFromBlock(icon, block.position)
          }
        });
      }
    })
    //gain all resource
    var totals = {
      food: 0,
      produce: 0,
      research: 0,
      gold: 0,
      score: 0,
    };

    this.extractActions.forEach( (extraAction)=>{
      let iconNode = extraAction.iconNode;
      let area = extraAction.area;
      iconNode = area.block.extractOneIconNode(iconNode)
      this.node.addChild(iconNode);
      let type = iconNode.getComponent('icon').type;
      totals[type]++;

      this.collectOneResourceIconNode(iconNode, type);
    })

    //TODO gainResource effect
    this.scheduleOnce(()=>{
      this.turnEnd();
    },Global.GET_REWARD_TIME+0.2);
  }
  collectOneResourceIconNode(iconNode, type) {
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
        } else if ( type === "score" ) {
          this.score ++;
        }
      },this)
    ))
  }
  collectResourceFromBlock(icon, position){
    let type = icon.type;
    let area = this.board.getArea(position);
    let waitAreaList = [area];
    let okAreaList = [];
    while (waitAreaList.length){
      let area = waitAreaList.shift();
      if ( area.block ) {
        let iconNodes = area.block.getIconNodes(type);
        if ( iconNodes.length ) {
          okAreaList.push(area);
          
          iconNodes.forEach( (iconNode)=>{
            if ( !this.extractActions.find(action=>{
                  return action.iconNode==iconNode
                }) ) {
              this.extractActions.push({
                iconNode,
                area
              });
            }
          })        
          
          Common.DIRECTIONS.forEach(function(direction){
            let p = Common.getIncrementPosition(area.position, direction)
            let adjacentArea = this.board.getArea(p);
            if ( adjacentArea && !Utils.contains(okAreaList, adjacentArea) && !Utils.contains(waitAreaList, adjacentArea) ) {
              waitAreaList.push(adjacentArea);
            }
          },this)
        }
      }
    }
  }

  turnEnd(){
    this.phase = "turnEnd";
    this.turn++;
    this.turnStart();
  }
});
