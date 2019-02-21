import React from "react";
import PropTypes from "prop-types";
import ControlsBase from "../../../../nodegraph/views/interface/controls/Controls";
import Physics from "./Physics";
import Physics from "./Physics";
import Delete from "./Delete";
import Menu from "./Menu";
import Pan from "./Pan";
import Marquee from "./Marquee";
import Grid from "./Grid";
import GridSnap from "./GridSnap";
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
				<div className={ tStyle.buttons }>
					<div>
						<Pan graph={ this.props.graph }/>
						<Marquee graph={ this.props.graph }/>
					</div>
					<Delete graph={ this.props.graph }/>
					<div>
						<Grid graph={ this.props.graph }/>
						<GridSnap graph={ this.props.graph }/>
					</div>
					<Physics graph={ this.props.graph }/>
				</div>
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