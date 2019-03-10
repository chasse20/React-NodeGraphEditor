import { observe } from "mobx";

/**
*	Physics model of a node
*	@memberof nodegraph
*	@param {Node} tModel Node model
*/
export default class BodyNode
{
	constructor( tModel )
	{
		/**
		*	Node model
		*	@type {Node}
		*/
		this._model = tModel;
		/**
		*	Managed index within the physics system
		*	@type {number}
		*/
		this.index = -1;
		/**
		*	X coordinate of the physics body
		*	@type {number}
		*/
		this.x = tModel.position.x;
		/**
		*	Y coordinate of the physics body
		*	@type {number}
		*/
		this.y = tModel.position.y;
		/**
		*	X velocity of the physics body
		*	@type {number}
		*/
		this.vx = 0;
		/**
		*	Y velocity of the physics body
		*	@type {number}
		*/
		this.vy = 0;
		/**
		*	If set, freezes the X coordinate to the value
		*	@type {number}
		*/
		this.fx = null;
		/**
		*	If set, freezes the Y coordinate to the value
		*	@type {number}
		*/
		this.fy = null;
		/**
		*	Tracking delegate for when the node's position is changed by the user when this body is frozen
		*	@type {number}
		*/
		this._onNodePositionDispose = null;
	}
	
	/**
	*	Clears the memory used by the position tracking delegate
	*/
	clear()
	{
		if ( this._onNodePositionDispose !== null )
		{
			this._onNodePositionDispose();
			this._onNodePositionDispose = null;
		}
	}
	
	/**
	*	Freezes the physics body if set true and tracks manual user position changing, unfreezes if false
	*	@param {bool} tIsFrozen Set to true to freeze
	*/
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