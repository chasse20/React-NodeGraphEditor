import React from "react";
import PropTypes from "prop-types";
import TypeModel from "../../../models/Type";

export default class Arrows extends React.PureComponent
{
	render()
	{
		return (
			<defs>
				{
					Object.keys( this.props.types ).map(
						( tKey ) =>
						(
							<marker key={ tKey } id={ "arrow-" + tKey } markerWidth="12" markerHeight="12" viewBox="-10 -5 10 10" orient="auto">
								<path d="M 0 0 L -10 5 L -10 -5 z"/>
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
	types: PropTypes.objectOf( PropTypes.instanceOf( TypeModel ) ).isRequired
};