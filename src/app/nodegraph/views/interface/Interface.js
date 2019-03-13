import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../models/Graph";
import Controls from "./controls/Controls";
import Menu from "./menu/Menu";
import Style from "./Interface.module.css";

export default class Interface extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this.state =
		{
			isOpen: false
		};
		
		// Events
		this._onMenuToggle = () => { this.setState( { isOpen: !this.state.isOpen } ); };
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.interface }`;
		if ( this.state.isOpen )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<div className={ tempClass }>
				{
					this.props.isMenu &&
						<Menu graph={ this.props.graph } isEditable={ this.props.isEditable }/>
				}
				<Controls graph={ this.props.graph } onMenuToggle={ this._onMenuToggle } isMenuOpen={ this.state.isOpen } isMenu={ this.props.isMenu } isEditable={ this.props.isEditable }/>
			</div>
		);
	}
}

Interface.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	isMenu: PropTypes.bool.isRequired,
	isEditable: PropTypes.bool.isRequired
};

Interface.defaultProps =
{
	isMenu: true,
	isEditable: true
};