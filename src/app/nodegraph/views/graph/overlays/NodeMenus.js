import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import Node from "../nodes/Node";
import NodeMenu from "./NodeMenu";
import Style from "./NodeMenus.module.css";

class NodeMenus extends React.Component
{	
	render( tStyle = Style )
	{
		const tempNodes = this.props.graph._selectedNodes;
		if ( tempNodes.length > 0 )
		{
			return (
				<g className={ tStyle.menus }>
					{
						tempNodes.map(
							( tNode ) =>
							(
								<NodeMenu key={ tNode._id } node={ tNode }/>
							)
						)
					}
				</g>
			);
		}
		
		return null;
	}
}

NodeMenus.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( NodeMenus );