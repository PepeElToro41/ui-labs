import { useEffect } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";
import { selectStoryPreviews } from "Reflex/StoryPreview/StoryMount";
import { selectStorySelected } from "Reflex/StorySelection";

const discriminator = (entry: PreviewEntry, index: string) => index;

export function controlPreview() {
	const producer = useProducer<RootProducer>();

	useEffect(() => {
		const unsubscribe = producer.observe(selectStoryPreviews, discriminator, (_, uid) => {
			const selected = producer.getState(selectStorySelected);
			if (!selected) {
				producer.selectStory(uid);
			}
			return () => {
				const selected = producer.getState(selectStorySelected);
				if (selected === uid) {
					producer.deselectStory();
				}
			};
		});
		return unsubscribe;
	}, []);
}
