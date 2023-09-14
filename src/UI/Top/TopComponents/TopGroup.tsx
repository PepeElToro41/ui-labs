import Roact from "@rbxts/roact";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import TopAction from "./TopAction";

declare global {
	namespace Dropdown {
		interface IsTopGroup {
			GroupName: string;
			Actions: IsTopAction[];
		}
	}
}

interface TopGroupProps extends Dropdown.IsTopGroup {
	LayoutOrder: number;
}

function setProps(props: TopGroupProps) {
	return props;
}

function TopGroupCreate(setprops: TopGroupProps) {
	const props = identity<Required<TopGroupProps>>(setProps(setprops) as Required<TopGroupProps>);
	const actions = useMemo(() => {
		const newActions: Roact.Element[] = [];
		props.Actions.forEach((action, index) => {
			newActions.push(
				<TopAction
					ActionName={action.ActionName}
					ActionLabel={action.ActionLabel}
					ActionHandler={action.ActionHandler}
					LayoutOrder={index}
				></TopAction>,
			);
		});
		return newActions;
	}, [props.Actions]);
	return (
		<frame
			Key={props.GroupName}
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, 0)}
			LayoutOrder={props.LayoutOrder}
		>
			<uipadding
				PaddingBottom={new UDim(0, 3)}
				PaddingLeft={new UDim(0, 3)}
				PaddingRight={new UDim(0, 3)}
				PaddingTop={new UDim(0, 3)}
			/>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			{actions}
		</frame>
	);
}
const TopGroup = withHooks(TopGroupCreate);

export = TopGroup;
