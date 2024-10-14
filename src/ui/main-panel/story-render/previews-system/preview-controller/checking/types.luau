export type StoryType = "Functional" | "React" | "Roact" | "Fusion" | "Iris" | "Vide" | "Generic" --keyof plsssss

export type StoryError = {
	Success: false,
	Error: string,
}
export type StorySuccess = {
	Success: true,
	Type: StoryType,
}

export type LibCheckReturn = "valid" | "skip" | StoryError
export type LibraryChecker = (lib: Map<string, any>) -> LibCheckReturn

export type StoryCheck = StoryError | StorySuccess

return nil
