import Roact from "@rbxts/roact";
import { useEffect, withHooks } from "@rbxts/roact-hooked";
import ResizableFrame from "UI/Holders/ResizableFrame";
import ControlTabs from "./ControlTabs";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import FrameFill from "UI/Holders/FrameFill";
import TopList from "UI/Styles/List/TopList";
import { Div } from "UI/Styles/Div";
import { useTween } from "Hooks/Utils/Tween";

const APPEAR_INFO = new TweenInfo(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out);

interface ActionsPanelProps {}

function setProps(props: ActionsPanelProps) {
	return props as Required<ActionsPanelProps>;
}

function ActionsPanelCreate(setprops: ActionsPanelProps) {
	const props = setProps(setprops as Required<ActionsPanelProps>);
	const theme = useTheme();
	const [anchor, tweenAnchor] = useTween(APPEAR_INFO, 1);

	useEffect(() => {
		tweenAnchor(0);
	}, []);

	return (
		<ResizableFrame
			Key="ActionsPanel"
			HandleAnchor="Top"
			BaseSize={new UDim2(1, 0, 0, 200)}
			ResizeRange={new NumberRange(-110, 300)}
			MaxBeforeCollapse={-160}
			HolderProps={{
				AnchorPoint: new Vector2(0, 1),
				Position: UDim2.fromScale(0, 1),
				ZIndex: 3,
			}}
			FrameProps={{
				BackgroundTransparency: 1,
			}}
		>
			<frame
				Key="Holder"
				BackgroundColor3={theme.ActionsPanel.Color}
				Size={UDim2.fromScale(1, 1)}
				BorderSizePixel={0}
				Position={anchor.map((anchor) => UDim2.fromScale(0, anchor))}
			>
				<TopList />
				<ControlTabs />
				<FrameFill
					FillDir="Y"
					Size={UDim2.fromScale(1, 1)}
					FrameProps={{
						BackgroundTransparency: 1,
					}}
				></FrameFill>
			</frame>
		</ResizableFrame>
	);
}
const ActionsPanel = withHooks(ActionsPanelCreate);

export = ActionsPanel;
