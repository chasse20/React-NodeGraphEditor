import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import Style from "./Marquee.module.css";

class Marquee extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onMarquee = () => { this.props.graph.isPanMode = false; };
	}
	
	render( tStyle = Style )
	{
		return (
			<button className={ tStyle.button } onMouseDown={ this._onMarquee } disabled={ !this.props.graph.isPanMode }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
					<path d="M-443,269h-4v2h2v4h2V269L-443,269z M-449,269h-4v2h4V269L-449,269z M-455,269h-4v2h4V269L-455,269z M-461,269h-6v4h2v-2h4 V269L-461,269z M-465,275h-2v4h2V275L-465,275z M-465,281h-2v4h2V281L-465,281z M-465,287h-2v4l0,0v2h4v-2h-2V287L-465,287z M-457,291h-4v2h4V291L-457,291z M-451,291h-4v2h4V291L-451,291z M-445,291h-4v2h4V291L-445,291z M-443,289h-2v4h2V289L-443,289z M-443,283h-2v4h2V283L-443,283z M-443,277h-2v4h2V277L-443,277z"/>
				</svg>
			</button>
		);
	}
}

Marquee.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Marquee );