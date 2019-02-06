import React from "react";
import PropTypes from "prop-types";
import "./Menu.css";

export default class Menu extends React.PureComponent
{
	render()
	{
		return (
			<button className="menu-toggle" onClick={ this.props.onToggle }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 269 24 24">
					<rect x="0" y="286" width="24" height="2"/>
					<rect x="0" y="280" width="24" height="2"/>
					<rect x="0" y="274" width="24" height="2"/>
				</svg>
			</button>
		);
	}
}

Menu.propTypes =
{
	onToggle: PropTypes.func.isRequired
};