import { values } from "mobx";
import PinModel from "../../nodegraph/Pin";

export default class Pin
{
	static FromJSON( tJSON, tNode, tVersion )
	{
		if ( tJSON != null && tJSON.name != null && tNode != null )
		{
			const tempPin = new Pin( tNode, tJSON.name );
			return Pin.Read( tempPin, tJSON, tVersion );
			
			return tempPin;
		}
		
		return null;
	}
	
	static Read( tPinModel, tJSON, tVersion )
	{
		if ( tPinModel != null && tJSON != null )
		{
			// Label
			Pin.ReadLabel( tPinModel, tJSON.label, tVersion );
			
			// Offset
			Pin.ReadOffset( tPinModel, tJSON.offset, tVersion );
		}
	}
	
	static ReadOffset( tPinModel, tJSON, tVersion )
	{			
		if ( tJSON != null )
		{
			if ( tJSON.x != null )
			{
				tPinModel._offset.x = tJSON.x;
			}
			
			if ( tJSON.y != null )
			{
				tPinModel._offset.y = tJSON.y;
			}
		}
	}
	
	static ReadPost( tPinModel, tJSON, tNodeRefs, tEdgeTypes, tVersion )
	{
		if ( tPinModel._isOut && tJSON != null && tJSON.links != null && tNodeRefs != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				tPinModel.setLink( Edge.FromJSON( tJSON.links[i], tPinModel, tNodeRefs, tEdgeTypes, tVersion ) );
			}
		}
	}
	
	static Write( tPinModel )
	{
		if ( tPinModel != null )
		{
			var tempJSON = null;
			
			// Label
			if ( tPinModel._label !== "" )
			{
				tempJSON = { label: tPinModel.label };
			}
			
			// Offset
			const tempOffset = Vector2D.Write( tPinModel._offset );
			if ( tempOffset != null )
			{
				tempJSON = { offset: tempOffset };
			}
			
			// Links
			if ( tPinModel._isOut )
			{
				const tempLinks = Pin.WriteLinks( values( tNodeModel._links ) );
				if ( tempLinks != null )
				{
					if ( tempJSON === null )
					{
						tempJSON = {};
					}
					tempJSON.links = tempLinks;
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteLinks( tLinks )
	{
		if ( tLinks != null )
		{
			const tempListLength = tLinks.length;
			if ( tempListLength > 0 )
			{
				const tempLinks = [];
				for ( let i = ( tempListLength - 1 ); i >= 0; --i )
				{
					tempLinks.push( Edge.Write( tLinks[i] ) );
				}
				
				return tempLinks;
			}
		}
		
		return null;
	}
}