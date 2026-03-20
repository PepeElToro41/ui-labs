import React, { PropsWithChildren, useBinding, useCallback, useState } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { usePosition } from "Hooks/Utils/AppHolder";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Sprite from "UI/Utils/Sprite";

interface OptionListControlProps extends PropsWithChildren {
	ListOverlay: (position: UDim2 | React.Binding<UDim2>, onClose: () => void) => { Key: string; Element: React.Element };
}

function OptionListControl(props: OptionListControlProps) {
	const theme = useTheme();
	const [hovered, hoverApi] = useToggler(false);
	const [udim, setUdim] = useBinding<[pos: Vector2, size: Vector2]>([Vector2.zero, Vector2.zero]);
	const [dropdownActive, setDropdownActive] = useState(false);
	const [canOpen, setCanOpen] = useState(true);

	const { setPopup } = useProducer<RootProducer>();
	const getPosition = usePosition();

	const OnUDimApply = useCallback((frame: Frame) => {
		setUdim([frame.AbsolutePosition, frame.AbsoluteSize]);
	}, []);

	const OnListDropdown = useCallback(() => {
		const currentCanOpen = canOpen;
		setCanOpen(true);
		if (!currentCanOpen || dropdownActive) return;

		const mappedPos = udim.map(([pos, size]) => {
			const position = getPosition(pos).add(new Vector2(0, size.Y / 2));
			return UDim2.fromOffset(position.X, position.Y);
		});

		const element = props.ListOverlay(mappedPos, () => setDropdownActive(false));
		setPopup(element.Key, element.Element);
		setDropdownActive(true);
	}, [props.ListOverlay, getPosition, dropdownActive, canOpen]);

	const OnMouseDown = useCallback(() => {
		if (dropdownActive) {
			setCanOpen(false);
		}
	}, [dropdownActive]);

	return (
		<Div>
			<frame
				Size={new UDim2(0, 0, 1, -8)}
				AutomaticSize={Enum.AutomaticSize.X}
				Position={new UDim2(0, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={theme.List[hovered ? "FrameHovered" : "Frame"]}
				Change={{
					AbsolutePosition: OnUDimApply,
					AbsoluteSize: OnUDimApply
				}}
			>
				<Detector
					ZIndex={4}
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnListDropdown,
						MouseButton1Down: OnMouseDown
					}}
				/>
				<Corner Radius={6} />
				<Div key={"Holder"}>
					<LeftList Padding={new UDim(0, 10)} VerticalAlignment={Enum.VerticalAlignment.Center} />
					<Padding Left={10} Right={6} />
					{props["children"] ?? new Map()}
					<Sprite
						key={"Drop"}
						ImageProps={{
							Size: UDim2.fromOffset(15, 15),
							LayoutOrder: 5
						}}
						Sprite={"Collapse"}
					></Sprite>
				</Div>
			</frame>
		</Div>
	);
}

export default OptionListControl;
