import { useProducer } from "@rbxts/react-reflex";
import { useEffect } from "@rbxts/react";
import { selectStoryPreviews } from "Reflex/StoryPreview";
import { selectStorySelected } from "Reflex/StorySelection";

const discriminator = (entry: PreviewEntry, index: string) => index;

//Controls the stories when they are mounted mounted (Previes) and it's selection
export function controlPreview() {
	const producer = useProducer<RootProducer>();

	useEffect(() => {
		const unsubscribe = producer.observe(selectStoryPreviews, discriminator, (preview, uid) => {
			//A new story gets added (selecting it there's nothing selected yet)
			const selected = producer.getState(selectStorySelected);
			if (selected === undefined) {
				producer.selectStory(uid);
			}
			return () => {
				//Checking when the story gets unmounted (looking for a new one)
				const selected = producer.getState(selectStorySelected);
				if (selected === uid) {
					const previews = producer.getState(selectStoryPreviews);

					if (previews.size() > 0) {
						producer.selectHighestOrder(previews);
					} else {
						producer.deselectStory();
					}
				}
			};
		});
		return unsubscribe;
	}, []);
	/*useEffect(() => {
		//Looking for "OnWidget" selections
		if (selected === undefined) return;
		const entry = previews.get(selected);
		if (!entry) return;
		if (entry.OnWidget) {
			producer.selectHighestOrder(previews);
		}
	}, [selected, previews]);*/
}
