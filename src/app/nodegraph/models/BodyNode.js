export default class BodyNode
{
	constructor( tModel )
	{
		this._model = tModel;
		this.index = -1;
		this.x = tModel.position.x;
		this.y = tModel.position.y;
		this.fx = null;
		this.fy = null;
		this.vx = 0;
		this.vy = 0;
	}
}