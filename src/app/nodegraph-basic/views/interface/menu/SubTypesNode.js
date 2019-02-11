import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeNode";
import SubTypesNodeBase from "../../../../nodegraph/views/interface/menu/SubTypesNode";
import ItemNodeType from "./ItemNodeType";

class SubTypesNode extends SubTypesNodeBase
{	
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
	{},
	SubTypesNodeBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);

export default observer( SubTypesNode );