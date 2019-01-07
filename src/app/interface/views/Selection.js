import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Transform2DModel from "../../core/Transform2D";
import SelectionModel from "../Selection";
import GridModel from "../Grid";
import SelectionPan from "./SelectionPan";
import SelectionMarquee from "./SelectionMarquee";
import SelectionNodes from "./SelectionNodes";

class Selection extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._pan = null;
		this._marquee = null;
		this._nodes = null;
		
		// Events
		this._onPan = ( tComponent ) => { this._pan = tComponent; };
		this._onMarquee = ( tComponent ) => { this._marquee = tComponent; };
		this._onNodes = ( tComponent ) => { this._nodes = tComponent; };
	}
	
	onSelectGraph( tEvent, tGraph )
	{
		this.props.model.isPanningHeld = tEvent != null && tEvent.button === 1; // middle mouse pans!
		
		this._pan.onSelect( tEvent, tGraph );
		this._marquee.onSelect( tEvent, tGraph );
		this._nodes.onSelectGraph( tEvent, tGraph );
	}
	
	onSelectNode( tEvent, tNode )
	{
		this._nodes.onSelect( tEvent, tNode );
	}
	
	onSelectEdge( tEvent, tEdge ) // TODO: Edge selection
	{
	}
	
	render()
	{
		return (
			<React.Fragment>
				<SelectionPan ref={ this._onPan } model={ this.props.model } viewTransform={ this.props.viewTransform }/>
				<SelectionMarquee ref={ this._onMarquee } model={ this.props.model } viewTransform={ this.props.viewTransform }/>
				<SelectionNodes ref={ this._onNodes } model={ this.props.model } viewTransform={ this.props.viewTransform } grid={ this.props.grid }/>
			</React.Fragment>
		);
	}
}

Selection.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	grid: PropTypes.instanceOf( GridModel ).isRequired
};

export default observer( Selection );