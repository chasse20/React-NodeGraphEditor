import Planck from "planck-js";

export default class Physics
{
	constructor()
	{
		this._world = Planck.World(); // interpolation
		this._paused = false;
		
		// Event... window.animation and then have it continuously
	}
	
	destroy()
	{
		// Clear event
	}
	
	// Pause/Play
}