import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import PhysicsModel from "../Physics";
import "./PhysicsToggle.css";

class PhysicsToggle extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onPhysicsToggle = () => { this.props.model.isEnabled = !this.props.model.isEnabled; };
	}
	
	render()
	{
		return (
			<button className={ this.props.model.isEnabled ? "physics selected" : "physics" } onMouseDown={ this._onPhysicsToggle }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<circle cx="15.9" cy="15.9" r="8"/>
					<path d="M7.6,16.2c-0.5-0.9-0.8-2-0.8-3.1c0-3.5,2.8-6.3,6.3-6.3c1.1,0,2.2,0.3,3.1,0.8c0.9,0.1,1.7,0.3,2.5,0.6 c-1.4-1.6-3.4-2.6-5.6-2.6C9,5.7,5.7,9,5.7,13.1c0,2.2,1,4.2,2.6,5.6C7.9,17.9,7.7,17.1,7.6,16.2z"/>
					<path d="M4.5,12.5c0-0.4,0-0.7,0.1-1.1c-0.1-0.4-0.2-0.8-0.2-1.3C4.4,7,7,4.4,10.1,4.4c0.4,0,0.9,0.1,1.3,0.2 c0.4,0,0.7-0.1,1.1-0.1c0.6,0,1.2,0.1,1.8,0.2c-1.2-0.9-2.6-1.4-4.2-1.4c-3.8,0-6.8,3.1-6.8,6.8c0,1.6,0.5,3,1.4,4.2 C4.6,13.7,4.5,13.1,4.5,12.5z"/>
					<path d="M2.2,10.2c0-0.4,0-0.7,0.1-1.1C1.9,8.4,1.7,7.7,1.7,6.9C1.7,4,4,1.7,6.9,1.7c0.8,0,1.6,0.2,2.3,0.6 c0.3,0,0.7-0.1,1.1-0.1c0.3,0,0.6,0,0.9,0.1c-1.1-1-2.6-1.7-4.3-1.7c-3.5,0-6.3,2.8-6.3,6.3c0,1.6,0.6,3.1,1.7,4.3 C2.2,10.8,2.2,10.5,2.2,10.2z"/>
				</svg>
			</button>
		);
	}
}

PhysicsToggle.propTypes =
{
	model: PropTypes.instanceOf( PhysicsModel ).isRequired
};

export default observer( PhysicsToggle );