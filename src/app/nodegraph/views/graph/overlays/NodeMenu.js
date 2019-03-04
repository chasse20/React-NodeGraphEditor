import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeModel from "../../../models/Node";
import Style from "./NodeMenu.module.css";

class NodeMenu extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._element = null;
		this._inputTimeout = null;
		this._isInput = false;
		
		// Events
		this._onPositionDispose = observe( tProps.node, "position", ( tChange ) => { this.position = tChange.newValue; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onMouseEnter = ( tEvent ) => { this.onMouseEnter( tEvent ); };
		this._onMouseLeave = ( tEvent ) => { this.onMouseLeave( tEvent ); };
		this._onRemove = ( tEvent ) => { this.onRemove( tEvent ); };
		this._onLinking = ( tEvent ) => { this.onLinking( tEvent ); };
	}
	
	componentDidMount()
	{
		this.position = this.props.node.position;
	}
	
	componentWillUnmount()
	{
		this._onPositionDispose();
		this._onPositionDispose = null;
		
		if ( this._inputTimeout !== null )
		{
			clearTimeout( this._inputTimeout );
		}
	}
	
	onMouseEnter( tEvent, tStyle = Style )
	{
		// Delay input
		this._inputTimeout = setTimeout(
			() =>
			{
				this._isInput = true; 
			},
			parseFloat( tStyle.openTime ) * 2000
		);
	}
	
	onMouseLeave( tEvent )
	{
		clearInterval( this._inputTimeout );
		this._inputTimeout = null;
		this._isInput = false;
	}
	
	onRemove( tEvent )
	{
		if ( this._isInput )
		{
			this.props.node._graph.removeNode( this.props.node );
		}
	}
	
	onLinking( tEvent )
	{
		if ( this._isInput )
		{
			const tempNode = this.props.node;
			tempNode._graph.linkingPin = tempNode._pins.out;
		}
	}
	
	set position( tPosition )
	{
		this._element.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	get radius()
	{
		return this.props.node._type.radius + 30;
	}
	
	render( tStyle = Style )
	{
		// Variables
		const tempRadius = this.radius;
		const tempCircumference = 2 * Math.PI * tempRadius;
		
		// Class
		var tempClass = `${ tStyle.menu }`;
		
		const tempGraph = this.props.node._graph;
		if ( !tempGraph.isMarqueeing )
		{
			tempClass += ` ${ tStyle.active }`;
		}
		
		if ( tempGraph.linkingPin != null )
		{
			tempClass += ` ${ tStyle.linking }`;
		}
		
		// Render
		return (
			<g className={ tempClass } ref={ this._onElement } onMouseEnter={ this._onMouseEnter } onMouseLeave={ this._onMouseLeave }>
				<g>
					<circle className={ tStyle.delete } strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ tempRadius } onMouseDown={ this._onRemove }/>
					<g className={ tStyle.icon } viewBox="0 0 14 18" transform={ "translate(-" + ( tempRadius + 8 ) + " -12) scale(1.2)" }>
						<path d="M1,16c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V4H1V16z M3.5,8.9l1.4-1.4L7,9.6l2.1-2.1l1.4,1.4L8.4,11l2.1,2.1 l-1.4,1.4L7,12.4l-2.1,2.1l-1.4-1.4L5.6,11L3.5,8.9z M10.5,1l-1-1h-5l-1,1H0v2h14V1H10.5z"/>
					</g>
				</g>
				<g>
					<circle className={ tStyle.link } strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ tempRadius } onMouseDown={ this._onLinking }/>
					<g className={ tStyle.icon } viewBox="0 0 18 18" transform={ "translate(" + ( tempRadius - 14 ) + " -12) scale(1.2)" }>
						<path d="M3.3,14.7c-1.2-1.2-1.2-3.2,0-4.4l2.8-2.8L4.8,6.2L1.9,9c-2,2-2,5.1,0,7.1s5.1,2,7.1,0l2.8-2.8l-1.3-1.3 l-2.8,2.8C6.4,15.9,4.5,15.9,3.3,14.7z M6.9,12.5l5.7-5.7l-1.4-1.4l-5.7,5.7L6.9,12.5z M9,1.9L6.2,4.8l1.3,1.3l2.8-2.8 c1.2-1.2,3.2-1.2,4.4,0s1.2,3.2,0,4.4l-2.8,2.8l1.3,1.3L16.1,9c2-2,2-5.1,0-7.1S11,0,9,1.9z"/>
					</g>
				</g>
			</g>
		);
	}
}

NodeMenu.propTypes =
{
	node: PropTypes.instanceOf( NodeModel ).isRequired
};

export default observer( NodeMenu );