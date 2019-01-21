import React from "react";
import PropTypes from "prop-types";
import Vector2D from "../../../../core/Vector2D";
import "./Grid.css";

export default class Grid extends React.PureComponent
{
	render()
	{
		const tempSize = this.props.zoom * this.props.size;
		
		return (
			<React.Fragment>
				<defs>
					<pattern id="smallGrid" viewBox="0 0 20 20" width="20" height="20" patternUnits="userSpaceOnUse">
						<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#b6b9bf" strokeWidth="0.5" strokeOpacity="0.65"/>
					</pattern>
					<pattern id="grid" width="100" viewBox="0 0 100 100" height="100" patternUnits="userSpaceOnUse" x={ this.props.zoom * this.props.offset.x } y={ this.props.zoom * this.props.offset.y } width={ tempSize } height={ tempSize }>
						<rect width="100" height="100" fill="url(#smallGrid)"/>
						<path d="M 100 0 L 0 0 0 100" fill="none" stroke="#b6b9bf" strokeWidth="2" strokeOpacity="0.45"/>
					</pattern>
				</defs>
				<rect className={ this.props.isVisible ? "grid visible" : "grid" } fill="url(#grid)"/>
			</React.Fragment>
		);
	}
}

Grid.propTypes =
{
	isVisible: PropTypes.bool,
	offset: PropTypes.instanceOf( Vector2D ),
	zoom: PropTypes.number,
	size: PropTypes.number
};

Grid.defaultProps =
{
	isVisible: true,
	offset: new Vector2D(),
	zoom: 1,
	size: 80
};