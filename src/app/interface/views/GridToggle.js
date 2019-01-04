import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GridModel from "../Grid";

class GridToggle extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onVisibleToggle = () => { this.props.model.isVisible = !this.props.model.isVisible; };
	}
	
	render()
	{
		return (
			<button className={ this.props.model.isVisible ? "selected" : null } onMouseDown={ this._onVisibleToggle }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
					<path d="M-445.4,269h-19.2c-1.3,0-2.4,1.1-2.4,2.4v19.2c0,1.3,1.1,2.4,2.4,2.4h19.2c1.3,0,2.4-1.1,2.4-2.4v-19.2 C-443,270.1-444.1,269-445.4,269z M-459,291h-6v-6h6V291z M-459,284h-6v-6h6V284z M-459,277h-6v-6h6V277z M-452,291h-6v-6h6V291z M-452,284h-6v-6h6V284z M-452,277h-6v-6h6V277z M-445,291h-6v-6h6V291z M-445,284h-6v-6h6V284z M-445,277h-6v-6h6V277z"/>
				</svg>
			</button>
		);
	}
}

GridToggle.propTypes =
{
	model: PropTypes.instanceOf( GridModel ).isRequired
};

export default observer( GridToggle );