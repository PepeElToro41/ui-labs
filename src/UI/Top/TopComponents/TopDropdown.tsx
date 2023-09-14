import Roact from "@rbxts/roact";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import TopGroup from "./TopGroup";

interface TopDropdownProps {
	Position: UDim2;
	Dropdown: Dropdown.IsTopGroup[];
	Width?: number;
}

function setProps(props: TopDropdownProps) {
	return props;
}

function TopDropdownCreate(setprops: TopDropdownProps) {
	const props = identity<Required<TopDropdownProps>>(setProps(setprops) as Required<TopDropdownProps>);
	const actionGroups = useMemo(() => {
		const newActionGroups: Roact.Element[] = [];
		let index = 0;
		props.Dropdown.forEach((actionGroup) => {
			newActionGroups.push(
				<TopGroup GroupName={actionGroup.GroupName} Actions={actionGroup.Actions} LayoutOrder={index}></TopGroup>,
			);
			newActionGroups.push(
				<frame
					Key="Divisor"
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={0.8}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, 1)}
					LayoutOrder={index + 1}
				/>,
			);
			index += 2;
		});
		return newActionGroups;
	}, [props.Dropdown]);
	return (
		<frame
			Key="Dropdown"
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundColor3={Color3.fromRGB(31, 31, 31)}
			BorderSizePixel={0}
			Position={props.Position}
			Size={new UDim2(0, props.Width ?? 300, 0, 0)}
		>
			<uicorner CornerRadius={new UDim(0, 4)} />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} SortOrder={Enum.SortOrder.LayoutOrder} />
			<uistroke Color={Color3.fromRGB(255, 255, 255)} Transparency={0.8} />
			{actionGroups}
		</frame>
	);
}
const TopDropdown = withHooks(TopDropdownCreate);

export = TopDropdown;
