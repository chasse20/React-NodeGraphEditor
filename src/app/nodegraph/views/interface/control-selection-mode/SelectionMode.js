import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import "./SelectionMode.css";

class SelectionControls extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onPanOn = () => { this.props.graph.isPanMode = true; };
		this._onPanOff = () => { this.props.graph.isPanMode = false; };
	}
	
	render()
	{
		const tempIsPanMode = this.props.graph.isPanMode;
		const tempIsPanning = tempIsPanMode || this.props.graph.isPanning;
		
		return (
			<div className="select group">
				<button className={ tempIsPanning ? null : "deselected" } onMouseDown={ this._onPanOn } disabled={ tempIsPanning }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M23.6,11.6l-3.7-3.4C19.5,8,19,8.2,19,8.6v1.9c0,0.3-0.2,0.5-0.5,0.5h-5c-0.3,0-0.5-0.2-0.5-0.5v-5C13,5.2,13.2,5,13.5,5 h1.9c0.4,0,0.7-0.5,0.4-0.8l-3.4-3.7c-0.2-0.2-0.6-0.2-0.8,0L8.3,4.2C8,4.5,8.2,5,8.6,5h1.9C10.8,5,11,5.2,11,5.5v5 c0,0.3-0.2,0.5-0.5,0.5h-5C5.2,11,5,10.8,5,10.5V8.6C5,8.2,4.5,8,4.1,8.3l-3.7,3.4c-0.2,0.2-0.2,0.6,0,0.8l3.7,3.4 C4.5,16,5,15.8,5,15.4v-1.9C5,13.2,5.2,13,5.5,13h5c0.3,0,0.5,0.2,0.5,0.5v5c0,0.3-0.2,0.5-0.5,0.5H8.6c-0.4,0-0.7,0.5-0.4,0.8 l3.4,3.7c0.2,0.2,0.6,0.2,0.8,0l3.4-3.7c0.3-0.3,0.1-0.8-0.4-0.8h-1.9c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h5 c0.3,0,0.5,0.2,0.5,0.5v1.9c0,0.4,0.5,0.7,0.8,0.4l3.7-3.4C23.8,12.2,23.8,11.8,23.6,11.6z"/>
					</svg>
				</button>
				<button className={ tempIsPanMode ? "deselected" : null } onMouseDown={ this._onPanOff } disabled={ !tempIsPanMode }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
						<path d="M-443,269h-4v2h2v4h2V269L-443,269z M-449,269h-4v2h4V269L-449,269z M-455,269h-4v2h4V269L-455,269z M-461,269h-6v4h2v-2h4 V269L-461,269z M-465,275h-2v4h2V275L-465,275z M-465,281h-2v4h2V281L-465,281z M-465,287h-2v4l0,0v2h4v-2h-2V287L-465,287z M-457,291h-4v2h4V291L-457,291z M-451,291h-4v2h4V291L-451,291z M-445,291h-4v2h4V291L-445,291z M-443,289h-2v4h2V289L-443,289z M-443,283h-2v4h2V283L-443,283z M-443,277h-2v4h2V277L-443,277z"/>
					</svg>
				</button>
			</div>
		);
	}
}

SelectionControls.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( SelectionControls );