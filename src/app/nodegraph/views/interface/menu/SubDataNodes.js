import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import SubData from "./SubData";
import ItemNode from "./ItemNode";

class SubDataNodes extends SubData
{	
	renderItems()
	{
		const tempGraph = this.props.graph;
		if ( tempGraph._selectedNodesCount > 0 )
		{
			return (
				<React.Fragment>
					{
						Object.values( tempGraph._selectedNodes ).map(
							( tNode ) =>
							(
								<ItemNode key={ tNode._id } model={ tNode } isEditable={ this.props.isEditable }/>
							)
						)
					}
				</React.Fragment>
			);
		}
		
		return null;
	}
}

SubDataNodes.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	SubData.propTypes
);

SubDataNodes.defaultProps = Object.assign(
	{
		title: "selected nodes"
	},
	SubData.defaultProps
);

export default observer( SubDataNodes );