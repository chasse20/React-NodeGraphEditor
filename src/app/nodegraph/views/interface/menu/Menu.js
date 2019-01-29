import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import IO from "../menu-io/IO";
import "./Menu.css";

export default class Menu extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			tab: 0
		};
	}
	
	render()
	{
		const tempTab = this.state.tab;
		
		return (
			<div className="menu">
				<div className="tabs" >
					<button className={ tempTab === 0 ? "selected" : null } onMouseDown={ () => { this.setState( { tab: 0 } ) } }>file</button>
					<button className={ tempTab === 1 ? "selected" : null } onMouseDown={ () => { this.setState( { tab: 1 } ) } }>graph</button>
					<button className={ tempTab === 2 ? "selected" : null } onMouseDown={ () => { this.setState( { tab: 2 } ) } }>data</button>
				</div>
				<div className="content">
					{
						tempTab === 0 &&
							<IO graph={ this.props.graph }/>
					}
				</div>
			</div>
		);
	}
}

Menu.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};