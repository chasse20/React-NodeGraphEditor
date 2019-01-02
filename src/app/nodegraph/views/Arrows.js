import React from "react";
import { observer } from "mobx-react";
import "./Arrows.css";

class Arrows extends React.Component
{
	render() // TODO: dynamic marker size
	{
		return (
			<React.Fragment>
				{
					Object.values( this.props.types ).map(
						( tType ) =>
						(
							<marker key={ tType._name } id={ "arrow-" + tType._name } markerWidth="12" markerHeight="12" viewBox="-10 -5 10 10" orient="auto">
								<path d="M 0 0 L -10 5 L -10 -5 z" fill={ tType.data.stroke }/>
							</marker>
						)
					)
				}
			</React.Fragment>
		);
	}
}

export default observer( Arrows );