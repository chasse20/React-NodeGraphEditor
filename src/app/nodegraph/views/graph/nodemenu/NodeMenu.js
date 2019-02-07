import React from "react";
import PropTypes from "prop-types";
import "./NodeMenu.css";

export default class NodeMenu extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._inputTimeout = null;
		this._isInput = false;
		
		// Events
		this._onMouseEnter = ( tEvent ) => { this.onMouseEnter( tEvent ); };
		this._onMouseLeave = ( tEvent ) => { this.onMouseLeave( tEvent ); };
		this._onRemove = ( tEvent ) => { this.onRemove( tEvent ); };
		this._onLinking = ( tEvent ) => { this.onLinking( tEvent ); };
	}
	
	onMouseEnter( tEvent )
	{
		tEvent.stopPropagation();
		
		// Delay input
		this._inputTimeout = setTimeout(
			() =>
			{
				this._isInput = true; 
			},
			500
		);
	}
	
	onMouseLeave( tEvent )
	{
		tEvent.stopPropagation();
		
		// Clear input
		clearInterval( this._inputTimeout );
		this._inputTimeout = null;
		this._isInput = false;
	}
	
	onRemove( tEvent )
	{
		tEvent.stopPropagation();
		
		// Remove
		if ( this._isInput )
		{
			this.props.onRemove();
		}
	}
	
	onLinking( tEvent )
	{
		tEvent.stopPropagation();
		
		// Linking
		if ( this._isInput )
		{
			//this.props.onLinking();
		}
	}
	
	render()
	{
		const tempCircumference = 2 * Math.PI * this.props.radius;
		
		return (
			<g className="node-menu" onMouseEnter={ this._onMouseEnter } onMouseLeave={ this._onMouseLeave }>
				<g>
					<circle className="delete" strokeWidth={ this.props.thickness } strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ this.props.radius } onMouseDown={ this._onRemove }/>
					<g className="icon" viewBox="0 0 14 18" transform={ "translate(-" + ( this.props.radius + 8 ) + " -12) scale(1.2)" }>
						<path d="M1,16c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V4H1V16z M3.5,8.9l1.4-1.4L7,9.6l2.1-2.1l1.4,1.4L8.4,11l2.1,2.1 l-1.4,1.4L7,12.4l-2.1,2.1l-1.4-1.4L5.6,11L3.5,8.9z M10.5,1l-1-1h-5l-1,1H0v2h14V1H10.5z"/>
					</g>
				</g>
				<g>
					<circle className="link" strokeWidth={ this.props.thickness } strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ this.props.radius } onMouseDown={ this._onLinking }/>
					<g className="icon" viewBox="0 0 18 18" transform={ "translate(" + ( this.props.radius - 14 ) + " -12) scale(1.2)" }>
						<path d="M3.3,14.7c-1.2-1.2-1.2-3.2,0-4.4l2.8-2.8L4.8,6.2L1.9,9c-2,2-2,5.1,0,7.1s5.1,2,7.1,0l2.8-2.8l-1.3-1.3 l-2.8,2.8C6.4,15.9,4.5,15.9,3.3,14.7z M6.9,12.5l5.7-5.7l-1.4-1.4l-5.7,5.7L6.9,12.5z M9,1.9L6.2,4.8l1.3,1.3l2.8-2.8 c1.2-1.2,3.2-1.2,4.4,0s1.2,3.2,0,4.4l-2.8,2.8l1.3,1.3L16.1,9c2-2,2-5.1,0-7.1S11,0,9,1.9z"/>
					</g>
				</g>
			</g>
		);
	}
}

NodeMenu.propTypes =
{
	onRemove: PropTypes.func.isRequired,
	onLinking: PropTypes.func.isRequired,
	radius: PropTypes.number,
	thickness: PropTypes.number
};

NodeMenu.defaultProps =
{
	radius: 50,
	thickness: 50
};