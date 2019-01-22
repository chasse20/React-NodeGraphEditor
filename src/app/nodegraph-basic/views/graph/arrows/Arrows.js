import React from "react";
import PropTypes from "prop-types";
import ArrowsBase from "../../../../nodegraph/views/graph/arrows/Arrows";
import EdgeTypeModel from "../../../models/EdgeType";

export default class Arrows extends ArrowsBase
{
	render() // TODO: dynamic marker size
	{
		return (
			<defs>
				{
					Object.keys( this.props.types ).map(
						( tKey ) =>
						(
							<marker key={ tKey } id={ "arrow-" + tKey } markerWidth="12" markerHeight="12" viewBox="-10 -5 10 10" orient="auto">
								<path d="M 0 0 L -10 5 L -10 -5 z" fill={ this.props.types[ tKey ].stroke }/>
							</marker>
						)
					)
				}
			</defs>
		);
	}
}

Arrows.propTypes =
{
	types: PropTypes.objectOf( PropTypes.instanceOf( EdgeTypeModel ) ).isRequired
};