import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import NodeMenu from "./NodeMenu";
import Style from "./NodeMenus.module.css";

class NodeMenus extends React.Component
{
	renderNodeMenu( tNode )
	{
		return (
			<NodeMenu key={ tNode._id } node={ tNode }/>
		);
	}
	
	render( tStyle = Style )
	{
		const tempNodes = this.props.graph._selectedNodes;
		if ( tempNodes.length > 0 )
		{
			return (
				<g className={ tStyle.menus }>
					{
						tempNodes.map( ( tNode ) => { return this.renderNodeMenu( tNode ); } )
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