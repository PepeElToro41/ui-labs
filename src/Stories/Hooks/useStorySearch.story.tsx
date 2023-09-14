import { useEffect, useMemo, withHooks } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";
import { useSettings } from "UI/Hooks/StoryTree/Searches/useSettings";
import useStorySearch from "UI/Hooks/StoryTree/Searches/useStorySearch";
import Configs from "Plugin/Configs";
import { ListHolder, ListModule } from "./ListRenderer";

const renderElement = () => {
	const [storyList] = useStorySearch(Configs.SearchServices);
	print("App-ReRendered", storyList);

	const divList = useMemo(() => {
		const listEl: Roact.Element[] = [];
		storyList.forEach((value, index) => {
			listEl.push(<ListModule Index={index} ModuleBind={value}></ListModule>);
		});
		return listEl;
	}, [storyList]);
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
