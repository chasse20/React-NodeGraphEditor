import React from "react";
import PropTypes from "prop-types";
import TypeModel from "../../../Type";
import "./Arrows.css";

export default class Arrows extends React.PureComponent
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
								<path d="M 0 0 L -10 5 L -10 -5 z" fill={ this.props.types[ tKey ].data.stroke }/>
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