import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeNode";
import Types from "../menu-sub-types/Types";
import NodeType from "../menu-item-nodetype/NodeType";

class Node extends Types
{	
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._nodeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setNodeType( this.createType( this.state.newKey ) );
		}
	}
	
	createType( tName )
	{
		return new TypeModel( tName );
	}
	
	renderItems()
	{
		return (
			<React.Fragment>
				{
					Object.keys( this.props.graph._nodeTypes ).map(
						( tKey ) =>
						(
							<NodeType key={ tKey } graph={ this.props.graph } model={ this.props.graph._nodeTypes[ tKey ] }/>
						)
					)
				}
			</React.Fragment>
		);
	}
}

Node.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	Types.propTypes
);

Node.defaultProps =
{
	title: "node types"
};

export default observer( Node );