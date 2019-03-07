import { observable, decorate, computed } from "mobx";
import NodeBase from "../../nodegraph-base/models/Node";
import Pin from "./Pin";

export default class Node extends NodeBase
{
	constructor( tGraph, tType, tText = "", tData = {} )
	{
		super( tGraph, tType );
		
		this._pins =
		{
			in: new Pin( "in", this, false ),
			out: new Pin( "out", this )
		};
		this.text = tText;
		this.data = tData;
	}
	
	get isVisible()
	{
		if ( this._type.isVisible )
		{
			var tempIsLinks = false; // if there are links, only display if at least one of them is visible
			for ( let tempName in this._pins )
			{
				let tempLinks = this._pins[ tempName ]._links;
				for ( let tempID in tempLinks )
				{
					if ( tempLinks[ tempID ]._type.isVisible )
					{
						return true;
					}
					
					tempIsLinks = true;
				}
			}
			
			return !tempIsLinks;
		}
		
		return false;
	}
}

decorate( Node,
	{
		text: observable,
		data: observable,
		isVisible: computed
	}
);