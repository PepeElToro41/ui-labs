local Yielding = "yielded when called."
local Errored = "errored when called."

local Functional = "Functional story"
local React = "React story"
local Roact = "Roact story"
local Vide = "Vide story"
local Fusion = "Fusion story"
local Iris = "Iris story"
local Generic = "Generic story"

function Compose(...: string)
	return table.concat({ ... }, " ")
end

local WARNINGS = {
	NoStory = "Story module didn't return anything",

	FunctionalYield = Compose(Functional, Yielding),
	FunctionalError = Compose(Functional, Errored),

	NoCleanup = "The story cleanup was not found, likely due to the story error. This can cause a memory leak.",
	CleanupError = "The story cleanup errored when called. This can cause a memory leak.",
}

return WARNINGS
