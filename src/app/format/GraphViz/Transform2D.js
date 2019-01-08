import Transform2DModel from "../../core/Transform2D";
import Vector2D2DModel from "../../core/Vector2D";
import Vector2D from "./Vector2D";

export default class Transform2D
{
	static FromJSON( tJSON, tVersion )
	{
		if ( tJSON != null )
		{
			const tempTransform = new Transform2DModel();
			return Transform2D.Read( tempTransform, tJSON, tVersion );
			
			return tempTransform;
		}
		
		return null;
	}
	
	static Read( tTransformModel, tJSON, tVersion )
	{
		if ( tTransformModel != null && tJSON != null )
		{
			Transform2D.ReadPosition( tTransformModel, tJSON.position, tVersion );
			Transform2D.ReadRotation( tTransformModel, tJSON.rotation, tVersion );
			Transform2D.ReadScale( tTransformModel, tJSON.scale, tVersion );
		}
	}
	
	static ReadPosition( tTransformModel, tJSON, tVersion )
	{			
		if ( tJSON != null )
		{
			if ( tJSON.x != null )
			{
				tTransformModel._position.x = tJSON.x;
			}
			
			if ( tJSON.y != null )
			{
				tTransformModel._position.y = tJSON.y;
			}
		}
	}
	
	static ReadRotation( tTransformModel, tJSON, tVersion )
	{
		if ( tJSON != null )
		{
			tTransformModel._rotation = tJSON;
		}
	}
	
	static ReadScale( tTransformModel, tJSON, tVersion )
	{		
		if ( tJSON != null )
		{
			if ( tJSON.x != null )
			{
				tTransformModel._scale.x = tJSON.x;
			}
			
			if ( tJSON.y != null )
			{
				tTransformModel._scale.y = tJSON.y;
			}
		}
	}
	
	static Write( tTransformModel )
	{
		if ( tTransformModel != null )
		{
			var tempJSON = null;
			
			// Position
			const tempPosition = Vector2D.Write( tTransformModel._position );
			if ( tempPosition != null )
			{
				tempJSON = { position: tempPosition };
			}
			
			// Rotation
			if ( tTransformModel._rotation !== 0 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.rotation = tTransformModel._rotation;
			}
			
			// Scale
			if ( !Vector2DModel.IsOne( tTransformModel._scale ) )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.scale = { x: tTransformModel._scale.x, y: tTransformModel._scale.y };
			}
			
			return tempJSON;
		}
		
		return null;
	}
}