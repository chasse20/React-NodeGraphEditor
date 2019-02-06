import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import Types from "../menu-sub-types/Types";

class Edge extends Types
{	
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._nodeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setNodeType( new TypeModel( this.state.newKey ) );
		}
	}
	
	renderItems()
	{
		return null;
	}
}

Edge.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	Types.propTypes
);

Edge.defaultProps =
{
	title: "edge types"
};

export default observer( Edge );