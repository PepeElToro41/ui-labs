import { useEffect, useMemo, withHooks } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";
import { useSettings } from "UI/Hooks/StoryTree/Searches/useSettings";
import useStoryBook from "UI/Hooks/StoryTree/Searches/useStoryBook";
import Configs from "Plugin/Configs";
import { ListHolder, ListModule } from "./ListRenderer";

function findModule(module: ModuleScript, booksList: StoryBooks | undefined) {
	if (booksList === undefined) return false;
	for (const [bookModule] of pairs(booksList)) {
		if (bookModule === module) {
			return true;
		}
	}
	return false;
}

const renderElement = () => {
	const [storyBooks, storyBookList] = useStoryBook(Configs.SearchServices);
	print("App-ReRendered", storyBookList);

	const divList = useMemo(() => {
		const listEl: Roact.Element[] = [];
		storyBookList.forEach((module, index) => {
			const inside = findModule(module, storyBooks);
			listEl.push(
				<ListModule
					ModuleBind={module}
					Index={index}
					TextColor={inside ? Color3.fromRGB(97, 232, 97) : Color3.fromRGB(217, 102, 102)}
				></ListModule>,
			);
		});
		return listEl;
	}, [storyBookList, storyBooks]);
	const padding = 10;
	return <ListHolder>{divList}</ListHolder>;
};

const Element = withHooks(renderElement);

export = (frameSet: Frame) => {
	const divElement = <Element></Element>;
	const handle = Roact.mount(divElement, frameSet);
	return () => {
		Roact.unmount(handle);
	};
};
