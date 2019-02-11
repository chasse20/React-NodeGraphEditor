import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import Icons from "../../Icons";
import Style from "./Pan.module.css";

class Pan extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onPan = () => { this.props.graph.isPanMode = true; };
	}
	
	render( tStyle = Style )
	{
		const tempIsPanning = this.props.graph.isPanMode || this.props.graph.isPanning;
		
		return (
			<button className={ tStyle.button } onMouseDown={ this._onPan } disabled={ tempIsPanning }>
				{ Icons.pan }
			</button>
		);
	}
}

Pan.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Pan );