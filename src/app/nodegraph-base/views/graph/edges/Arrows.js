import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";

class Arrows extends React.Component
{
	render()
	{
		return (
			<defs>
				{
					Object.keys( this.props.graph._edgeTypes ).map(
						( tKey ) =>
						(
							<marker key={ tKey } id={ "arrow-" + tKey } markerWidth="10" markerHeight="10" viewBox="-10 -5 10 10" orient="auto">
								<path d="M 0 0 L -10 5 L -10 -5 z"/>
							</marker>
						)
					)
				}
			</defs>
		);
	}
}

export default observer( Arrows );

Arrows.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};