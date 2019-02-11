import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeNode";
import SubTypes from "./SubTypes";
import ItemNodeType from "./ItemNodeType";

class SubTypesNode extends SubTypes
{	
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._nodeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setNodeType( this.createType( this.state.newKey ) );
			this.setState( { newKey: "" } );
		}
	}
	
	createType( tName )
	{
		return new TypeModel( tName );
	}
	
	renderItems()
	{
		return (
			<React.Fragment>
				{
					Object.keys( this.props.graph._nodeTypes ).map(
						( tKey ) =>
						(
							<ItemNodeType key={ tKey } graph={ this.props.graph } model={ this.props.graph._nodeTypes[ tKey ] }/>
						)
					)
				}
			</React.Fragment>
		);
	}
}

SubTypesNode.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	SubTypes.propTypes
);

SubTypesNode.defaultProps =
{
	title: "node types"
};

export default observer( SubTypesNode );