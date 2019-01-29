import { decorate, observable, action } from "mobx";
import OptionsBase from "../../nodegraph/models/Options";

export default class Options extends OptionsBase
{
	constructor( tIsPanMode = false, tIsGridVisible = true, tIsGridSnap = false, tIsPhysics = true )
	{
		super( tIsPanMode, tIsGridVisible, tIsGridSnap );
		
		this.isPhysics = tIsPhysics;
	}
}

decorate( Options,
	{
		isPhysics: observable
	}
);