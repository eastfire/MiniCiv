const {ccclass, property} = cc._decorator;
const Global = require("global");

@ccclass
export default class Icon extends cc.Component {
  @property
  public type = "research";
  @property
  public amount=1;

  start(){

  }
}
