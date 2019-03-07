import { observe } from "mobx";
import Vector2D from "../../core/Vector2D";

export default class BodyNode
{
	constructor( tModel )
	{
		this._model = tModel;
		this.index = -1;
		this.x = tModel.position.x;
		this.y = tModel.position.y;
		this.vx = 0;
		this.vy = 0;
		this.fx = null;
		this.fy = null;
		this._onNodePositionDispose = null;
	}
	
	destroy()
	{
		if ( this._onNodePositionDispose !== null )
		{
			this._onNodePositionDispose();
			this._onNodePositionDispose = null;
		}
	}
	
	set isFrozen( tIsFrozen )
	{
		const tempIsFrozen = this._onNodePositionDispose !== null;				
		if ( tempIsFrozen !== tIsFrozen )
		{
			if ( tIsFrozen )
			{
				this.fx = this.x;
				this.fy = this.y;
				
				// Mimic external changes to the model if frozen
				this._onNodePositionDispose = observe( this._model, "position",
					( tChange ) =>
					{
						this.fx = tChange.newValue.x;
						this.fy = tChange.newValue.y;
					}
				);
			}
			else
			{
				this.x = this.fx;
				this.y = this.fy;
				this.fx = null;
				this.fy = null;
				
				this._onNodePositionDispose();
				this._onNodePositionDispose = null;
			}
		}
	}
}