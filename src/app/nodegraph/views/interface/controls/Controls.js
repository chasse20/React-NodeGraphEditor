import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Menu from "../controls-menu/Menu";
import Selection from "../controls-selection/Selection";
import Delete from "../controls-delete/Delete";
import Grid from "../controls-grid/Grid";
import GridSnap from "../controls-gridsnap/GridSnap";
import "./Controls.css";

export default class Controls extends React.PureComponent
{	
	render()
	{
		return (
			<nav className="controls">
				{
					this.props.onMenuToggle != null &&
						<Menu onToggle={ this.props.onMenuToggle }/>
				}
				<div className="buttons">
					<Selection graph={ this.props.graph }/>
					<Delete graph={ this.props.graph }/>
					<div className="group">
						<Grid graph={ this.props.graph }/>
						<GridSnap graph={ this.props.graph }/>
					</div>
				</div>
			</nav>
		);
	}
}

Controls.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};