import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import SelectionModel from "../Selection";

class Selection extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		
	}
	
	render() // TODO: Delete
	{
		return (
			<div/>
		);
	}
}

Selection.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired
};

export default observer( Selection );