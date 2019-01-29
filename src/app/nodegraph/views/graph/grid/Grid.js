import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import "./Grid.css";

class Grid extends React.Component
{
	render()
	{
		const tempGraph = this.props.graph;
		const tempSize = tempGraph.zoom * tempGraph.gridSize;
		
		return (
			<React.Fragment>
				<defs>
					<pattern id="smallGrid" viewBox="0 0 20 20" width="20" height="20" patternUnits="userSpaceOnUse">
						<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#b6b9bf" strokeWidth="0.5" strokeOpacity="0.65"/>
					</pattern>
					<pattern id="grid" viewBox="0 0 100 100" patternUnits="userSpaceOnUse" x={ tempGraph.zoom * tempGraph.position.x } y={ tempGraph.zoom * tempGraph.position.y } width={ tempSize } height={ tempSize }>
						<rect width="100" height="100" fill="url(#smallGrid)"/>
						<path d="M 100 0 L 0 0 0 100" fill="none" stroke="#b6b9bf" strokeWidth="2" strokeOpacity="0.45"/>
					</pattern>
				</defs>
				<rect className={ tempGraph.isGridVisible ? "grid visible" : "grid" } fill="url(#grid)" width="100%" height="100%"/>
			</React.Fragment>
		);
	}
}

export default observer( Grid );

Grid.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};