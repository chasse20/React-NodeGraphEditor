import React from "react";
import PropTypes from "prop-types";
import ControlsBase from "../../../../nodegraph/views/controls/Controls";
import Menu from "./Menu";
import Pan from "../../../../nodegraph/views/controls/Pan";
import Marquee from "../../../../nodegraph/views/controls/Marquee";
import Grid from "../../../../nodegraph/views/controls/Grid";
import GridSnap from "../../../../nodegraph/views/controls/GridSnap";
import Delete from "./Delete";
import Physics from "./Physics";
import Style from "./Controls.module.css";

export default class Controls extends ControlsBase
{
	render( tStyle = Style )
	{
		return (
			<nav className={ tStyle.controls }>
				{
					this.props.onMenuToggle != null &&
						<Menu onToggle={ this.props.onMenuToggle } isMenuOpen={ this.props.isMenuOpen }/>
				}
				<div className={ tStyle.group }>
					<Pan graph={ this.props.graph }/>
					<Marquee graph={ this.props.graph }/>
				</div>
				<Delete graph={ this.props.graph }/>
				<div className={ tStyle.group }>
					<Grid graph={ this.props.graph }/>
					<GridSnap graph={ this.props.graph }/>
				</div>
				<Physics graph={ this.props.graph }/>
			</nav>
		);
	}
}

Controls.propTypes = Object.assign(
	{
		isMenuOpen: PropTypes.bool
	},
	ControlsBase.propTypes
);

Controls.defaultProps =
{
	isMenuOpen: false
};