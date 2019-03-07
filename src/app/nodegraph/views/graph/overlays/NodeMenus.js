import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import NodeMenu from "./NodeMenu";
import Style from "./NodeMenus.module.css";

class NodeMenus extends React.Component
{
	render( tStyle = Style ) // TODO: Instantiation is expensive and should either be pooled or happen alongside nodes!
	{
		const tempGraph = this.props.graph;
		if ( tempGraph._selectedNodesCount > 0 )
		{
			return (
				<g className={ tStyle.menus }>
					{
						Object.values( tempGraph._selectedNodes ).map(
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