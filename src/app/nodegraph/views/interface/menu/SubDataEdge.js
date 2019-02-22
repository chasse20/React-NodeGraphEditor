import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import SubData from "./SubData";
import ItemEdge from "./ItemEdge";

class SubDataEdge extends SubData
{	
	renderItems()
	{
		const tempEdges = this.props.graph._selectedEdges;
		if ( tempEdges.length > 0 )
		{
			return (
				<React.Fragment>
					{
						tempEdges.map(
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

SubDataEdge.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	SubData.propTypes
);

SubDataEdge.defaultProps =
{
	title: "selected edges"
};

export default observer( SubDataEdge );