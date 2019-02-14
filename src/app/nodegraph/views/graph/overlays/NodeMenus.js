import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Node from "../nodes/Node";
import NodeMenu from "./NodeMenu";
import Style from "./NodeMenus.module.css";

class NodeMenus extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			nodes: null
		};
	}
	
	render( tStyle = Style )
	{
		<g className={ tStyle.menus }>
			Object.keys( this.state.nodes ).map(
				( tKey ) =>
				(
					<NodeMenu key={ tKey } model={ this.state.nodes[ tKey ] }/>
				)
			)
		</g>
	}
}