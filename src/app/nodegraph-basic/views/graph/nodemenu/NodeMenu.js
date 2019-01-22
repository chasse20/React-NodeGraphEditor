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
				<g className="icon" viewBox="0 0 24 24" transform={ "translate(-" + ( this.props.radius + 15 ) + " -15 ) scale(1.5)" }>
					<path d="M4,21.3C4,22.8,5.2,24,6.7,24h10.7c1.5,0,2.7-1.2,2.7-2.7v-16H4V21.3z M7.3,11.8L9.2,10l2.8,2.8l2.8-2.8l1.9,1.9l-2.8,2.8 l2.8,2.8l-1.9,1.9L12,16.5l-2.8,2.8l-1.9-1.9l2.8-2.8L7.3,11.8z M16.7,1.3L15.3,0H8.7L7.3,1.3H2.7V4h18.7V1.3H16.7z"/>
				</g>
				<g className="icon" viewBox="0 0 24 24" transform={ "translate(" + ( this.props.radius - 25 ) + " -20 ) scale(2)" }>
					<path d="M17.4,6.2c1.2,1.2,1.2,3.2,0,4.4l-2.8,2.8l1.3,1.3l2.8-2.8c2-2,2-5.1,0-7.1s-5.1-2-7.1,0L8.8,7.7L10.2,9L13,6.2 C14.2,5,16.2,5,17.4,6.2z M13.8,8.4L8.1,14l1.4,1.4l5.7-5.7L13.8,8.4z M11.7,19l2.8-2.8l-1.3-1.3l-2.8,2.8c-1.2,1.2-3.2,1.2-4.4,0 s-1.2-3.2,0-4.4l2.8-2.8L7.4,9.1l-2.8,2.8c-2,2-2,5.1,0,7.1S9.7,20.9,11.7,19z"/>
				</g>
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