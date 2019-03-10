import { observable, decorate } from "mobx";
import TypeEdgeBase from "../../nodegraph-base/models/TypeEdge";
import Edge from "./Edge";
import EdgeView from "../views/graph/edges/Edge";

/**
*	Edge type definition
*	@memberof nodegraph
*	@augments nodegraph-base.TypeEdge
*	@param {string} [tName=default] Key name of this type used for lookups in the graph
*	@param {Object} [tModelClass] Model class of this type
*	@param {Object} [tViewClass] View class of this type
*	@param {string} [tStroke=#808080] Stroke color of this type's edges
*	@param {string} [tText] Label text of this type's edges
*/
export default class TypeEdge extends TypeEdgeBase
{
	constructor( tName = "default", tModelClass = Edge, tViewClass = EdgeView, tStroke = "#808080", tText = "" )
	{
		super( tName, tModelClass, tViewClass );
		
		/**
		*	True If this type's edges are visible
		*	@type {bool}
		*/
		this.isVisible = true;
		/**
		*	Stroke color of this type's edges
		*	@type {string}
		*/
		this.stroke = tStroke;
		/**
		*	Label text of this type's edges
		*	@type {string}
		*/
		this.text = tText;
	}
}

decorate( TypeEdge,
	{
		isVisible: observable,
		stroke: observable,
		text: observable
	}
);