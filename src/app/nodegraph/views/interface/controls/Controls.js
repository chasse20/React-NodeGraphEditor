import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Menu from "./Menu";
import Pan from "./Pan";
import Marquee from "./Marquee";
import Delete from "./Delete";
import Grid from "./Grid";
import GridSnap from "./GridSnap";
import Style from "./Controls.module.css";

export default class Controls extends React.PureComponent
{	
	render( tStyle = Style )
	{
		return (
			<nav className={ tStyle.controls }>
				{
					this.props.onMenuToggle != null &&
						<Menu onToggle={ this.props.onMenuToggle } isMenuOpen={ this.props.isMenuOpen }/>
				}
				<div className={ tStyle.buttons }>
					{ this.renderButtons() }
				</div>
			</nav>
		);
	}
	
	renderButtons()
	{
		return (
			<React.Fragment>
				<div>
					<Pan graph={ this.props.graph }/>
					<Marquee graph={ this.props.graph }/>
				</div>
				<Delete graph={ this.props.graph }/>
				<div>
					<Grid graph={ this.props.graph }/>
					<GridSnap graph={ this.props.graph }/>
				</div>
			</React.Fragment>
		);
	}
}

Controls.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	isMenuOpen: PropTypes.bool
};

Controls.defaultProps =
{
	isMenuOpen: false
};