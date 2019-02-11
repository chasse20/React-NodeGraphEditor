import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import SubData from "./SubData";
import ItemNode from "./ItemNode";

class SubDataNode extends SubData
{	
	renderItems()
	{
		const tempNodes = this.props.graph._selectedNodes;
		if ( tempNodes.length > 0 )
		{
			return (
				<React.Fragment>
					{
						tempNodes.map(
							( tNode ) =>
							(
								<ItemNode key={ tNode._id } model={ tNode } graph={ this.props.graph }/>
							)
						)
					}
				</React.Fragment>
			);
		}
		
		return null;
	}
}

SubDataNode.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	SubData.propTypes
);

SubDataNode.defaultProps =
{
	title: "selected nodes"
};

export default observer( SubDataNode );