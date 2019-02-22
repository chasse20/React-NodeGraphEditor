import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../models/Graph";
import Pan from "./Pan";
import Marquee from "./Marquee";
import Grid from "./Grid";
import GridSnap from "./GridSnap";
import Style from "./Controls.module.css";

export default class Controls extends React.PureComponent
{	
	render( tStyle = Style )
	{
		return (
			<nav className={ tStyle.controls }>
				<div className={ tStyle.group }>
					<Pan graph={ this.props.graph }/>
					<Marquee graph={ this.props.graph }/>
				</div>
				<div className={ tStyle.group }>
					<Grid graph={ this.props.graph }/>
					<GridSnap graph={ this.props.graph }/>
				</div>
			</nav>
		);
	}
}

Controls.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};