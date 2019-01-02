import Vector2D from "../core/Vector2D";

export default class Zoom
{
	constructor( tSpeed = 0.0005, tMin = 0.1, tMax = 1 )
	{
		this.speed = tSpeed;
		this.min = tMin;
		this.max = tMax;
	}
	
	toJSON()
	{
		var tempJSON = null;

		// Zoom speed
		if ( this.speed !== 0.0005 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.speed = this.speed;
		}

		// Min zoom
		if ( this.min !== 0.1 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.min = this.min;
		}

		// Max zoom
		if ( this.max !== 1 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.max = this.max;
		}

		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			// Zoom speed
			if ( tJSON.speed !== undefined )
			{
				this.speed = tJSON.speed;
			}
			
			// Min zoom
			if ( tJSON.min !== undefined )
			{
				this.min = tJSON.min;
			}
			
			// Max zoom
			if ( tJSON.max !== undefined )
			{
				this.max = tJSON.max;
			}
		}
	}
	
	tryZoom( tTransform, tVelocity ) // TODO: offset zooming from mouse position
	{
		// Calculate
		var tempAmount = tTransform._scale.x + ( tVelocity * this.speed );
		if ( tVelocity < 0 )
		{
			if ( tempAmount < this.min )
			{
				tempAmount = this.min;
			}
		}
		else if ( tempAmount > this.max )
		{
			tempAmount = this.max;
		}

		// Apply
		if ( tempAmount !== tTransform._scale.x )
		{
			tTransform._scale = new Vector2D( tempAmount, tempAmount );
			return true;
		}
		
		return false;
	}
}