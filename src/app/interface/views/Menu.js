import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../nodegraph/Graph";
import MenuModel from "../Menu";
import File from "./File";
import "./Menu.css";

class Menu extends React.Component
{
	render()
	{
		const tempTab = this.props.model.openTab;
		
		return (
			<div className="menu">
				<div className="tabs" >
					<button className={ tempTab === 0 ? "selected" : null } onMouseDown={ () =>{ this.props.model.openTab = 0; } }>file</button>
					<button className={ tempTab === 1 ? "selected" : null } onMouseDown={ () =>{ this.props.model.openTab = 1; } }>graph</button>
					<button className={ tempTab === 2 ? "selected" : null } onMouseDown={ () =>{ this.props.model.openTab = 2; } }>data</button>
				</div>
				<div className="content">
					{
						tempTab === 0 &&
							<File graph={ this.props.graph }/>
					}
				</div>
			</div>
		);
	}
}

export default observer( Menu );

Menu.propTypes =
{
	model: PropTypes.instanceOf( MenuModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};