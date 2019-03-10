import { observable, decorate } from "mobx";
import TypeNodeBase from "../../nodegraph-base/models/TypeNode";
import Node from "./Node";
import NodeView from "../views/graph/nodes/Node";

/**
*	Node type definition
*	@memberof nodegraph
*	@augments nodegraph-base.TypeNode
*	@param {string} [tName=default] Key name of this type used for lookups in the graph
*	@param {Object} [tModelClass] Model class of this type
*	@param {Object} [tViewClass] View class of this type
*	@param {number} [tRadius=50] Radius of this type's nodes
*	@param {string} [tFill=#a9a9a9] Fill color of this type's nodes
*/
export default class TypeNode extends TypeNodeBase
{
	constructor( tName = "default", tModelClass = Node, tViewClass = NodeView, tRadius = 50, tFill = "#a9a9a9" )
	{
		super( tName, tModelClass, tViewClass );
		
		/**
		*	True If this type's nodes are visible
		*	@type {bool}
		*/
		this.isVisible = true;
		/**
		*	Radius of this type's nodes
		*	@type {number}
		*/
		this.radius = tRadius;
		/**
		*	Fill color of this type's nodes
		*	@type {string}
		*/
		this.fill = tFill;
	}
}

decorate( TypeNode,
	{
		isVisible: observable,
		radius: observable,
		fill: observable
	}
);