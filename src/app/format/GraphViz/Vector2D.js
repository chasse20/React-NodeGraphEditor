import Vector2DModel from "../../core/Vector2D";

export default class Vector2D
{
	static FromJSON( tJSON, tVersion )
	{
		if ( tJSON != null )
		{
			const tempVector = new Vector2DModel();
			return Vector2D.Read( tempVector, tJSON, tVersion );
			
			return tempVector;
		}
		
		return null;
	}
	
	static Read( tVectorModel, tJSON, tVersion )
	{
		if ( tVectorModel != null && tJSON != null )
		{
			if ( tJSON.x != null )
			{
				tVectorModel.x = tJSON.x;
			}
			
			if ( tJSON.y != null )
			{
				tVectorModel.y = tJSON.y;
			}
		}
	}
	
	static Write( tVectorModel )
	{
		if ( tVectorModel != null )
		{
			var tempJSON = null;
			
			// X
			if ( tVectorModel.x != 0 )
			{
				tempJSON = { x: tVectorModel.x };
			}
			
			// Y
			if ( tVectorModel.y != 0 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.y = tVectorModel.y;
			}
			
			return tempJSON;
		}
		
		return null;
	}
}