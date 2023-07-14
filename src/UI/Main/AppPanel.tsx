import Roact from "@rbxts/roact";
import SideBar from "./SideBar";
import { useCallback, useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import StoryPanel from "./StoryPanel";
import { Div } from "UI/UIUtils/Styles/Div";

interface AppPanelProps {}

function setProps(props: AppPanelProps) {
	return props;
}

function AppPanelCreate(setprops: AppPanelProps) {
	const props = identity<Required<AppPanelProps>>(setProps(setprops) as Required<AppPanelProps>);
	const [addResize, setAddResize] = useState(0);

	const OnAddResize = useCallback((add: number) => {
		setAddResize(add);
	}, []);
	return (
		<Div Key="AppPanel" BackgroundTransparency={1} Position={new UDim2(0, 0, 0, 35)} Size={new UDim2(1, 0, 1, -35)}>
			<uilistlayout FillDirection={Enum.FillDirection.Horizontal} SortOrder={Enum.SortOrder.LayoutOrder} />
			<StoryPanel AddResize={addResize}></StoryPanel>
			<SideBar OnAddResize={(add: number) => OnAddResize(add)}></SideBar>
		</Div>
	);
}
const AppPanel = withHooksPure(AppPanelCreate);

export = AppPanel;
