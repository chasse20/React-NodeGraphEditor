import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import Node from "../Node";
import "./Menu.css";

class Menu extends React.Component
{	
	render()
	{
		const tempInnerRadius = this.props.radius + 10;
		const tempOuterRadius = this.props.radius + 50;
		
		let tempPath = "M 0 " + ( -tempOuterRadius );
		let tempA = " A " + tempOuterRadius + " " + tempOuterRadius + " 0 1 0 0 ";
		tempPath += tempA + tempOuterRadius;
		tempPath += tempA + ( -tempOuterRadius );
		tempPath += " Z ";
		tempPath += " M 0 " + ( -tempInnerRadius );
		tempA = " A " + tempInnerRadius + " " + tempInnerRadius + " 0 1 1 0 ";
		tempPath += tempA + tempInnerRadius;
		tempPath += tempA + ( -tempInnerRadius );
		tempPath += " Z";
		
		return (
			<g className="node-menu">
				<circle fill="#ffffff" fillOpacity="0" x="0" y="0" r={ tempOuterRadius }/>
				<path className="wheel" d={ tempPath }/>
				<line x1="0" y1={ tempOuterRadius } x2="0" y2={ 60 }/>
				<line x1="0" y1={ -tempOuterRadius } x2="0" y2={ -60 }/>
			</g>
		);
	}
}

Menu.propTypes =
{
	radius: PropTypes.number
};

export default observer( Menu );