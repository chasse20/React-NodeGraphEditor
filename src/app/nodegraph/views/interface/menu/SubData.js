import React from "react";
import PropTypes from "prop-types";
import Sub from "./Sub";
import Style from "./SubData.module.css";

export default class SubData extends Sub
{
	renderContent( tStyle = Style )
	{
		// Items
		const tempItems = this.renderItems();
		
		// Render
		if ( tempItems != null )
		{
			return (
				<React.Fragment>
					<div className={ tStyle.items }>
						{ tempItems }
					</div>
				</React.Fragment>
			);
		}
		
		return null;
	}
	
	renderItems()
	{
		return null;
	}
}

SubData.propTypes = Object.assign(
	{
		isEditable: PropTypes.bool.isRequired
	},
	Sub.propTypes
);

SubData.defaultProps =
{
	isEditable: true
};