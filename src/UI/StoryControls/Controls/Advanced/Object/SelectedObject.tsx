import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { Selection, StudioService } from "@rbxts/services";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import DescriptiveImage from "UI/StoryPanel/StoryTitle/DescriptiveImage";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";

import AssignButton from "./AssignButton";
import ObjectName from "./ObjectName";

interface SelectedObjectProps {
	CurrentObject?: Instance;
	ClassName: keyof Instances;

	OnAssignObject: (object: Instance) => void;
}

function SelectedObject(props: SelectedObjectProps) {
	const [selected, setSelected] = useState<Instance[]>(() => Selection.Get());
	const theme = useTheme();
	const tooMany = selected.size() > 1;
	const empty = selected.isEmpty();
	const object = selected[0];

	useEffect(() => {
		const connection = Selection.SelectionChanged.Connect(() => {
			setSelected(Selection.Get());
		});
		return () => connection.Disconnect();
	}, []);
	const classIcon = useMemo(() => {
		if (tooMany) return {} as ClassIconInfo;
		if (empty) return;
		const info = StudioService.GetClassIcon(object.ClassName) as ClassIconInfo;
		return info;
	}, [selected]);
	const OnAssign = useCallback(() => {
		if (!object) return;
		props.OnAssignObject(object);
	}, [props.OnAssignObject, object]);

	return (
		<Div Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X}>
			<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 8)} />
			<Text
				Text={"Selection:"}
				TextSize={13}
				Weight={"Light"}
				LayoutOrder={0}
				Size={UDim2.fromScale(0, 1)}
				AutomaticSize={Enum.AutomaticSize.X}
			/>
			{empty ? (
				<Text
					Text={"No Selection"}
					TextSize={13}
					Weight={"Light"}
					TextColor3={theme.Text.Disabled}
					LayoutOrder={1}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
			) : tooMany ? (
				<Text
					Text={`${selected.size()} Items`}
					TextSize={13}
					Weight={"Light"}
					TextColor3={theme.Text.Disabled}
					LayoutOrder={1}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
			) : (
				<Div Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X} LayoutOrder={1}>
					<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 6)} />
					<DescriptiveImage
						ImageName={"SelectedImageClassName"}
						Description={`Class: ${object.ClassName}`}
						LayoutOrder={1}
						Size={UDim2.fromOffset(15, 15)}
						{...classIcon}
					/>
					<ObjectName
						Object={object}
						Size={UDim2.fromScale(0, 1)}
						TextSize={12}
						LayoutOrder={2}
						AutomaticSize={Enum.AutomaticSize.X}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextTruncate={Enum.TextTruncate.AtEnd}
					>
						<uisizeconstraint MinSize={new Vector2(60, 0)} MaxSize={new Vector2(200, math.huge)} />
						<Padding Right={5} />
					</ObjectName>
					<Divisor Size={new UDim(1, -10)} Direction="Y" Order={3} />
					<AssignButton
						Disabled={
							object === props.CurrentObject
								? "Already Assigned"
								: !object.IsA(props.ClassName)
									? `[${props.ClassName}] Required`
									: undefined
						}
						Order={4}
						OnAssign={OnAssign}
					/>
				</Div>
			)}
		</Div>
	);
}

export default SelectedObject;
