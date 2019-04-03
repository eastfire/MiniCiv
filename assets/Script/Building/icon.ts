const {ccclass, property} = cc._decorator;
const Global = require("global");

@ccclass
export default class Icon extends cc.Component {
  @property
  public type = "science";
  @property
  public amount=1;

  start(){

  }
}
