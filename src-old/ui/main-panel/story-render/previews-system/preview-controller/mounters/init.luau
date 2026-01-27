-- Here it goes the mapping of the mounters
-- The mounters are responsible for mounting each type of story

local mounters = {
	Functional = require "./functional",
	React = require "./roact-react/react",
	Roact = require "./roact-react/roact",
	Vide = require "./vide",
	Fusion = require "./fusion",
	Iris = require "./iris",
	Generic = require "./generic",
}

return mounters
