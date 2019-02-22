import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import NodesBase from "../../../../nodegraph-base/views/graph/nodes/Nodes";

export default class Nodes extends NodesBase
{
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass,
			{
				model: tModel,
				key: tModel._id,
				onLink: this.props.onLink,
				onTargetPin: this.props.onTargetPin,
				onDragStart: this._onDragStart 
			}
		);
	}
}

Nodes.propTypes = Object.assign(
	{
		onTargetPin: PropTypes.func.isRequired
	},
	NodesBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);