import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import ArrowsBase from "../../../../nodegraph/views/graph/arrows/Arrows";

class Arrows extends ArrowsBase
{
	render() // TODO: dynamic marker size
	{
		const tempTypes = this.props.graph._edgeTypes;
		
		return (
			<defs>
				{
					Object.keys( tempTypes ).map(
						( tKey ) =>
						(
							<marker key={ tKey } id={ "arrow-" + tKey } markerWidth="12" markerHeight="12" viewBox="-10 -5 10 10" orient="auto" fill={ tempTypes[ tKey ].stroke }>
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

Arrows.propTypes = Object.assign(
	{},
	ArrowsBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);