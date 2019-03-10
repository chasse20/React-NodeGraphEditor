import { observable, decorate, computed } from "mobx";
import NodeBase from "../../nodegraph-base/models/Node";
import Pin from "./Pin";

/**
*	Node model that manages pins
*	@memberof nodegraph
*	@augments nodegraph-base.Node
*	@param {Graph} tGraph Graph model this belongs to
*	@param {TypeNode} tType Node type
*	@param {string} [tText] Display text
*	@param {Object} [tData] Associative array of node data
*/
export default class Node extends NodeBase
{
	constructor( tGraph, tType, tText = "", tData = {} )
	{
		super( tGraph, tType );
		
		/**
		*	Associative array of pin models, responsible for edge links
		*	@type {Object}
		*/
		this._pins =
		{
			in: new Pin( "in", this, false ),
			out: new Pin( "out", this )
		};
		/**
		*	Display text
		*	@type {string}
		*/
		this.text = tText;
		/**
		*	Associative array of edge data
		*	@type {Object}
		*/
		this.data = tData;
	}
	
	/**
	*	Calculates the visibility of this node which is determined only if its type is visible and at least one of its edge links is visible
	*	@return {bool} True if visible
	*/
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