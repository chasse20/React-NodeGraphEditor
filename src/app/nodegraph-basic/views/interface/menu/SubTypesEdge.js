import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import SubTypesEdgeBase from "../../../../nodegraph/views/interface/menu/SubTypesEdge";
import ItemEdgeType from "./ItemEdgeType";

class SubTypesEdge extends SubTypesEdgeBase
{
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
	{},
	SubTypesEdgeBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);

export default observer( SubTypesEdge );