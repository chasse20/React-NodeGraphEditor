import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import SubData from "./SubData";
import ItemEdge from "./ItemEdge";

class SubDataEdges extends SubData
{	
	renderItems()
	{
		const tempGraph = this.props.graph;
		if ( tempGraph._selectedEdgesCount > 0 )
		{
			return (
				<React.Fragment>
					{
						Object.values( tempGraph._selectedEdges ).map(
							( tEdge ) =>
							(
								<ItemEdge key={ tEdge.id } model={ tEdge }/>
							)
						)
					}
				</React.Fragment>
			);
		}
		
		return null;
	}
}

SubDataEdges.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	SubData.propTypes
);

SubDataEdges.defaultProps =
{
	title: "selected edges"
};

export default observer( SubDataEdges );