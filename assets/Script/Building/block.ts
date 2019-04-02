const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {
  @property
  public type = "science";

  @property(cc.Sprite)
  public icon:cc.Sprite = null;
  @property(cc.Node)
  private effectLayer:cc.Node = null;


}
