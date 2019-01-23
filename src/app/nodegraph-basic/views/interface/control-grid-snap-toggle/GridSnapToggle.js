import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import OptionsModel from "../../../models/Options";

class GridToggleSnap extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onToggle = () => { this.props.options.isGridSnap = !this.props.options.isGridSnap; };
	}
	
	render()
	{
		return (
			<button className={ this.props.options.isGridSnap ? "selected" : null } onMouseDown={ this._onToggle }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
					<path d="M-445.3,278.9l-6.4-6.4l-3.4,3.4l6.4,6.4c1.4,1.4,1.4,3.6,0,5s-3.6,1.4-5,0l-6.4-6.4l-3.4,3.4l6.4,6.4 c3.2,3.2,8.5,3.2,11.7,0S-442.1,282.1-445.3,278.9z M-450.9,278.3l-2.3-2.3l1.7-1.7l2.3,2.3L-450.9,278.3z M-459.3,286.5l-2.3-2.3 l1.7-1.7l2.3,2.3L-459.3,286.5z"/>
					<polygon points="-452.3,278.6 -452.3,277.3 -452,277.3 -453.3,276 -453.3,276.3 -454.6,276.3 -453.7,277.3 -453.3,277.3 -453.3,277.7 "/>
					<path d="M-455.2,283.7h2v2l0.6,0.6c0.1,0.1,0.2,0.2,0.3,0.3v-2.8h3c-0.1-0.2-0.2-0.3-0.3-0.4l-0.5-0.5h-2.2v-2.2l-0.9-0.9v3.1h-2.9 L-455.2,283.7z"/>
					<polygon points="-459.7,281.2 -459.7,282.8 -459.7,282.8 -458.8,283.7 -458.8,283.7 -457.2,283.7 -458.1,282.8 -458.8,282.8 -458.8,282.1 "/>
					<path d="M-445,288.8v-9.6c-0.1-0.1-0.2-0.2-0.3-0.3l-1.5-1.5v5.4h-1.4c0.2,0.3,0.3,0.6,0.4,0.9h1v5.5h-5.5V288 c-0.3-0.1-0.6-0.3-0.9-0.5v1.6h-5.2l1.4,1.4c0.1,0.1,0.3,0.3,0.5,0.4h9.4C-446,291-445,290-445,288.8z"/>
					<polygon points="-453.3,275.9 -452.3,275 -452.3,273.1 -453.3,274.1 "/>
					<polygon points="-461.1,283.7 -460.2,282.8 -461.9,282.8 -462.9,283.7 "/>
					<polygon points="-458.8,286 -459.3,286.5 -459.7,286.2 -459.7,287.9 -458.8,288.9 "/>
					<path d="M-460.4,289.2h-4.7v-4.7l-0.2-0.2l0.2-0.2v-0.3h0.3l0.4-0.4l0.5-0.5h-1.2v-5.5h5.5v2l0.6,0.6l0.3,0.3v-2.9h3.1l-0.4-0.4 l-0.5-0.5h-2.2v-5.5h5.5v1.2l0.6-0.6l0.3-0.3v-0.3h0.3l0.3-0.3l0.3,0.3h4.5v4.5l1.8,1.8v-6c0-1.2-1-2.2-2.2-2.2h-17.6 c-1.2,0-2.2,1-2.2,2.2v17.6c0,1.2,1,2.2,2.2,2.2h6.2L-460.4,289.2z M-465.2,270.8h5.5v5.5h-5.5V270.8z"/>
					<polygon points="-449.2,276.6 -449.9,277.3 -446.9,277.3 -447.8,276.3 -449.5,276.3 "/>
				</svg>
			</button>
		);
	}
}

GridToggleSnap.propTypes =
{
	options: PropTypes.instanceOf( OptionsModel ).isRequired
};

export default observer( GridToggleSnap );