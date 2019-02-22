import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import SubTypes from "./SubTypes";
import ItemEdgeType from "./ItemEdgeType";

class SubTypesEdge extends SubTypes
{
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._edgeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setEdgeType( this.createType( this.state.newKey ) );
			this.setState( { newKey: "" } );
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
					Object.keys( this.props.graph._edgeTypes ).map(
						( tKey ) =>
						(
							<ItemEdgeType key={ tKey } graph={ this.props.graph } model={ this.props.graph._edgeTypes[ tKey ] }/>
						)
					)
				}
			</React.Fragment>
		);
	}
}

SubTypesEdge.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	SubTypes.propTypes
);

SubTypesEdge.defaultProps =
{
	title: "edge types"
};

export default observer( SubTypesEdge );