import { values } from "mobx";
import Edge from "./Edge";
import Vector2D from "./Vector2D";

export default class Pin
{
	static FromJSON( tJSON, tNode, tVersion )
	{
		if ( tJSON != null && tJSON.name != null && tNode != null )
		{
			const tempPin = new Pin( tNode, tJSON.name );
			Pin.Read( tempPin, tJSON, tVersion );
			
			return tempPin;
		}
		
		return null;
	}
	
	static Read( tPinModel, tJSON, tVersion )
	{
		if ( tPinModel != null && tJSON != null && tJSON.label != null )
		{
			tPinModel.label = tJSON.label;
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
			
			// Links
			if ( tPinModel._isOut )
			{
				const tempLinks = Pin.WriteLinks( values( tPinModel._links ) );
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