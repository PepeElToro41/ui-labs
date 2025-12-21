export const WARNINGS = {
	NoStory: "Story module didn't return anything",
	RequireError: "Story module errored when required",
	StoryTypeError: "Story is not a valid valid story type",
	NoControlsReconciler: "Error Reconciling controls, New controls expected, got %s",
	NoReconcileResult: "Invalid controls returned from reconciler, table expected, got %s",

	Yielding: "%s yielded when called.",
	StoryError: "%s errored when called.",

	NoCleanup: "The story cleanup was not found, likely due to the story error.",
	CleanupError: "The story cleanup errored when called. This can cause a memory leak."
};

export const WARNING_STORY_TYPES = {
	Functional: "Functional story",
	React: "React story",
	Roact: "Roact story",
	Vide: "Vide story",
	Fusion: "Fusion story",
	Iris: "Iris story",
	Generic: "Generic story"
};
