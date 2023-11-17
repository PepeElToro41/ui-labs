import { StoryCheck } from "./Utils";
import MountingMap from "./Mounters";

export function MountStory<T extends MountType>(mountType: T, result: MountResults[T], frame: Frame) {
	const mounter = MountingMap[mountType];
	const renderer = mounter(result, frame);

	return renderer;
}
