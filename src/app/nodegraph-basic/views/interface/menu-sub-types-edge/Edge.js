import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import EdgeBase from "../../../../nodegraph/views/interface/menu-sub-types-edge/Edge";
import EdgeType from "../menu-item-edgetype/EdgeType";

class Edge extends EdgeBase
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
							<EdgeType key={ tKey } graph={ this.props.graph } model={ this.props.graph._edgeTypes[ tKey ] }/>
						)
					)
				}
			</React.Fragment>
		);
	}
}

Edge.propTypes = Object.assign(
	{},
	EdgeBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);

export default observer( Edge );