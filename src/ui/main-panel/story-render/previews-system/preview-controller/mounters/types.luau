local StoryPreviews = require("@store/story-previews")

type StoryPreview = StoryPreviews.StoryPreview

export type MounterProps<T> = {
	Entry: Reactive<StoryPreview>,
	Result: T,
	MountFrame: Frame,
}
return nil
