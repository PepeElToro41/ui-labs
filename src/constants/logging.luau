local LOG_MESSAGES = {
	NO_STORY = "Story module didn't return anything",
	REQUIRE_ERROR = "Story module errored when required",

	FUNCTION_YIELD = "%s yielded when called.",
	FUNCTION_ERROR = "%s errored when called",

	NO_CLEANUP = "The story cleanup was not found, likely due to the story error. This can cause a memory leak.",
	CLEANUP_ERROR = "The story cleanup errored when called. This can cause a memory leak.",
}

local STORY_NAMES = {
	functional = "Functional story",
	react = "React story",
	roact = "Roact story",
	vide = "Vide story",
	fusion = "Fusion story",
	iris = "Iris story",
	generic = "Generic story",
}

return {
	LOG_MESSAGES = LOG_MESSAGES,
	STORY_NAMES = STORY_NAMES,
}
