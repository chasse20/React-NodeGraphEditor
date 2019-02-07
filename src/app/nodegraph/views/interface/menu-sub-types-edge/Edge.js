import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import Types from "../menu-sub-types/Types";
import EdgeType from "../menu-item-edgetype/EdgeType";

class Edge extends Types
{	
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._edgeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setEdgeType( new TypeModel( this.state.newKey ) );
		}
	}
	
	renderItems()
	{
		return (
			<React.Fragment>
				{
					Object.keys( this.props.graph._edgeTypes ).map(
						( tKey ) =>
						(
							<EdgeType key={ tKey } graph={ this.props.graph } model={ this.props.graph._edgeTypes[ tKey ] }/>
						)
					)
				}
			</React.Fragment>
		);
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