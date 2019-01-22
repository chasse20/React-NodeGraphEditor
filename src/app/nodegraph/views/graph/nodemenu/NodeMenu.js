import React from "react";
import PropTypes from "prop-types";
import "./NodeMenu.css";

export default class NodeMenu extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Events
		this._edges = null;
		this._edgesCount = 0;
	}
	
	render()
	{
		const tempCircumference = 2 * Math.PI * this.props.radius;
		
		return (
			<g className="node-menu" ref={ this._onElement }>
				<circle className="delete" strokeWidth={ this.props.thickness } strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ this.props.radius } onMouseDown={ this.props.onRemove }/>
				<circle className="link" strokeWidth={ this.props.thickness } strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ this.props.radius } onMouseDown={ this.props.onLinking }/>
			</g>
		);
	}
}

NodeMenu.propTypes =
{
	radius: PropTypes.number,
	thickness: PropTypes.number
};

NodeMenu.defaultProps =
{
	radius: 60,
	thickness: 60
};