import React from "react";
import PropTypes from "prop-types";
import ControlsBase from "../../../../nodegraph-base/views/controls/Controls";
import Menu from "./Menu";
import Pan from "../../../../nodegraph-base/views/controls/Pan";
import Marquee from "../../../../nodegraph-base/views/controls/Marquee";
import ZoomIn from "../../../../nodegraph-base/views/controls/ZoomIn";
import ZoomOut from "../../../../nodegraph-base/views/controls/ZoomOut";
import Grid from "../../../../nodegraph-base/views/controls/Grid";
import GridSnap from "../../../../nodegraph-base/views/controls/GridSnap";
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
					this.props.isMenu && this.props.onMenuToggle != null &&
						<Menu onToggle={ this.props.onMenuToggle } isMenuOpen={ this.props.isMenuOpen }/>
				}
				<div className={ tStyle.group }>
					<Pan graph={ this.props.graph }/>
					<Marquee graph={ this.props.graph }/>
				</div>
				<div className={ tStyle.group }>
					<ZoomIn graph={ this.props.graph }/>
					<ZoomOut graph={ this.props.graph }/>
				</div>
				<div className={ tStyle.group }>
					<Grid graph={ this.props.graph }/>
					<GridSnap graph={ this.props.graph }/>
				</div>
				<Physics graph={ this.props.graph }/>
				{
					this.props.isEditable &&
						<Delete graph={ this.props.graph }/>
				}
			</nav>
		);
	}
}

Controls.propTypes = Object.assign(
	{
		isMenuOpen: PropTypes.bool,
		isMenu: PropTypes.bool.isRequired,
		isEditable: PropTypes.bool.isRequired
	},
	ControlsBase.propTypes
);

Controls.defaultProps =
{
	isMenuOpen: false,
	isMenu: true,
	isEditable: true
};