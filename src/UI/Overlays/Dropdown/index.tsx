import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useCallback, withHooks } from "@rbxts/roact-hooked";
import FrameFill from "UI/Holders/FrameFill";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import DropShadow from "UI/Utils/DropShadow";
import Overlay from "../Overlay";
import { useProducer, useSelector } from "@rbxts/roact-reflex";
import { Detector } from "UI/Styles/Detector";
import { selectMountAmount } from "Reflex/StoryPreview/StoryMount";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface DropdownProps extends PropsWithChildren {
	Position: UDim2 | Roact.Binding<UDim2>;
	Width?: number;
}

function setProps(props: DropdownProps) {
	return props as Required<DropdownProps>;
}

function DropdownCreate(setprops: DropdownProps) {
	const props = setProps(setprops as Required<DropdownProps>);
	const { resetOverlay } = useProducer<RootProducer>();
	const theme = useTheme();

	const OnClose = useCallback(() => {
		resetOverlay();
	}, []);

	return (
		<Overlay
			Size={UDim2.fromOffset(props.Width ?? 220, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={props.Position}
			OnClickClose={OnClose}
		>
			<frame
				Key="Holder"
				BackgroundColor3={theme.Dropdown.Color}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				ZIndex={2}
			>
				<Detector Key="InputBlocker">
					<Corner Radius={4} />
					<Padding Padding={5} />
					<TopList Padding={new UDim(0, 1)} />
					{props[Roact.Children] ?? []}
				</Detector>
			</frame>
			<FrameFill Key={"ShadowHolder"} FillDir="Y" Size={UDim2.fromScale(1, 0)} FrameProps={{ BackgroundTransparency: 1 }}>
				<DropShadow />
			</FrameFill>
		</Overlay>
	);
}
const Dropdown = withHooks(DropdownCreate);

export = Dropdown;
