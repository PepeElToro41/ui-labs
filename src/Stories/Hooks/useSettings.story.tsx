import { useEffect, useMemo, withHooks } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";
import { useSettings } from "UI/Hooks/StoryTree/Searches/useSettings";
import { ListHolder, ListModule } from "./ListRenderer";

const renderElement = () => {
	const [settings, settingsList, fileUsing] = useSettings();

	const divList = useMemo(() => {
		const listEl: Roact.Element[] = [];
		settingsList.forEach((value, index) => {
			listEl.push(
				<ListModule
					Index={index}
					ModuleBind={value}
					TextColor={value === fileUsing ? Color3.fromRGB(99, 224, 99) : undefined}
				></ListModule>,
			);
		});
		return listEl;
	}, [settingsList, fileUsing]);
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
