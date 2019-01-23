import React from "react";
import PropTypes from "prop-types";
import EdgesBase from "../../../../nodegraph/views/graph/edges/Edges";

export default class Edges extends EdgesBase
{
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel.id, onPhysics: this.props.onPhysics } );
	}
}

Edges.propTypes = Object.assign(
	{
		onPhysics: PropTypes.func.isRequired
	},
	EdgesBase.propTypes
);