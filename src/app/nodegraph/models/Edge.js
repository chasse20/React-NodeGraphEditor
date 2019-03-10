import { observable, decorate } from "mobx";
import EdgeBase from "../../nodegraph-base/models/Edge";

/**
*	Edge model used for representing a relationship between pins
*	@memberof nodegraph
*	@augments nodegraph-base.Edge
*	@param {TypeEdge} tType Edge type
*	@param {Pin} tSource Source pin reference
*	@param {Pin} tTarget Target pin reference
*	@param {number} [tWeight=1] Weight of the edge used in auto-placement physics
*	@param {Object} [tData] Associative array of edge data
*/
export default class Edge extends EdgeBase
{
	constructor( tType, tSource, tTarget, tWeight = 1.0, tData = {} )
	{
		super( tType, tSource, tTarget );
		
		/**
		*	Weight of the edge used in auto-placement physics
		*	@type {number}
		*/
		this.weight = tWeight;
		/**
		*	Associative array of edge data
		*	@type {Object}
		*/
		this.data = tData;
	}
}

decorate( Edge,
	{
		weight: observable,
		data: observable
	}
);