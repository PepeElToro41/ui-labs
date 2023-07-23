import Roact from "@rbxts/roact";
import { useCallback, useContext, useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { Text } from "UI/UIUtils/Styles/Text";
import { useTween } from "UI/Hooks/Utils/useTween";
import ResizableFrame from "UI/UIUtils/ResizableFrame";
import ThemeContext from "UI/Contexts/ThemeContext";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";

const LabelInfo = new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0);

function ActionTabCreate(props: {
	Index: IsActionWindow;
	Label?: string;
	SelectedWindow: IsActionWindow;
	LayoutOrder: number;
	SetWindow: (state: IsActionWindow) => void;
}) {
	const [labelSize, tweenSize] = useTween(LabelInfo, props.SelectedWindow === props.Index ? 1 : 0);
	const theme = useContext(ThemeContext).Theme;
	const [hovered, setHover] = useState(false);
	useUpdateEffect(() => {
		if (props.Index === props.SelectedWindow) {
			tweenSize(1);
		} else {
			tweenSize(0);
		}
	}, [props.SelectedWindow, props.Index]);
	const active = props.Index === props.SelectedWindow;
	return (
		<frame
			Key={"Tab" + props.Index}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundTransparency={1}
			Size={new UDim2(0, 0, 1, 0)}
			LayoutOrder={props.LayoutOrder}
		>
			<Detector
				ZIndex={3}
				Event={{
					MouseEnter: () => setHover(true),
					MouseLeave: () => setHover(false),
					MouseButton1Click: () => props.SetWindow(props.Index),
				}}
			></Detector>
			<Text
				Key="WindowLabel"
				AutomaticSize={Enum.AutomaticSize.X}
				Size={new UDim2(0, 0, 0, 18)}
				Text={string.upper(props.Label ?? props.Index)}
				TextColor3={active || hovered ? theme.TextColor : theme.TextDisabledColor}
				FontFace={Font.fromName("GothamSSm", active ? Enum.FontWeight.Medium : Enum.FontWeight.ExtraLight)}
				TextSize={12}
				TextYAlignment={Enum.TextYAlignment.Bottom}
			>
				<frame
					Key={"Underline"}
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundColor3={Color3.fromRGB(23, 122, 203)}
					BorderSizePixel={0}
					Position={new UDim2(0.5, 0, 1, 8)}
					Size={labelSize.map((size) => new UDim2(size, 0, 0, 2))}
				/>
			</Text>
			<uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />
		</frame>
	);
}
const ActionTab = withHooks(ActionTabCreate);

declare global {
	interface IsActiveWindow {
		WindowType: IsActionWindow;
		Window: Roact.Element;
	}
}

interface ActionWindowProps {
	ActiveWindows: Array<IsActiveWindow>;
}

function ActionWindowCreate(props: ActionWindowProps) {
	const [selectedWindow, _selectWindow] = useState<IsActionWindow>(props.ActiveWindows[0].WindowType);
	const theme = useContext(ThemeContext).Theme;
	const SelectWindow = useCallback((window: IsActionWindow) => {
		_selectWindow(window);
	}, []);

	type Windows = Record<IsActionWindow, Roact.Element>;
	const AllWindows = useMemo<Partial<Windows>>(() => {
		const windows: Partial<Windows> = {};
		props.ActiveWindows.forEach((window) => {
			windows[window.WindowType] = window.Window;
		});
		return windows;
	}, [props.ActiveWindows]);
	useUpdateEffect(() => {
		let toSelect: IsActiveWindow | undefined = props.ActiveWindows[0];
		props.ActiveWindows.forEach((window) => {
			if (window.WindowType === selectedWindow) {
				toSelect = window;
			}
		});
		if (toSelect) {
			_selectWindow(toSelect.WindowType);
		}
		//_selectWindow(props.ActiveWindows[0].WindowType);
	}, [props.ActiveWindows]);
	const AllTabs = useMemo(() => {
		const tabs: Roact.Element[] = [];
		props.ActiveWindows.forEach((window, index) => {
			const Tab = (
				<ActionTab
					Index={window.WindowType}
					LayoutOrder={index}
					SelectedWindow={selectedWindow}
					SetWindow={SelectWindow}
				></ActionTab>
			);
			tabs.push(Tab);
		});
		return tabs;
	}, [props.ActiveWindows, selectedWindow]);

	return (
		<ResizableFrame
			Key="ActionPanel"
			ResizeRange={new NumberRange(-120, 200)}
			MaxBeforeCollapse={-190}
			BaseSize={new UDim2(1, 0, 0, 233)}
			HandleAnchor="Top"
			HolderProps={{
				AnchorPoint: new Vector2(0, 1),
				Position: new UDim2(0, 0, 1, -1),
				LayoutOrder: 2,
				ZIndex: 3,
			}}
			FrameProps={{
				BackgroundColor3: theme.ActionWindow,
				BackgroundTransparency: 0,
				BorderSizePixel: 0,
			}}
		>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<uipadding PaddingTop={new UDim(0, 2)} />
			<frame Key="ControlTabs" BackgroundTransparency={1} Size={new UDim2(1, 0, 0, 25)} ZIndex={2}>
				<frame Key="LeftList" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
					<uipadding PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 8)} />
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0, 10)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					{/* Rendering Window Tabs for Changing Windows */}
					{AllTabs}
				</frame>
				<frame Key="RightList" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Right}
						Padding={new UDim(0, 10)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					{/*<frame
						Key="Close"
						AutomaticSize={Enum.AutomaticSize.X}
						BackgroundTransparency={1}
						Size={new UDim2(0, 18, 0, 18)}
					>
						<imagelabel
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={1}
							Image="rbxassetid://13941267944"
							ImageRectOffset={new Vector2(192, 192)}
							ImageRectSize={new Vector2(64, 64)}
							Position={new UDim2(0.5, 0, 0.4, 0)}
							Size={new UDim2(1, 0, 1, 0)}
						/>
               </frame>*/}
					<uipadding PaddingLeft={new UDim(0, 8)} PaddingRight={new UDim(0, 5)} />
				</frame>
			</frame>
			<frame Key="Window" BackgroundTransparency={1} LayoutOrder={1} Size={new UDim2(1, 0, 1, -25)}>
				<uipadding />
				{AllWindows[selectedWindow]}
			</frame>
		</ResizableFrame>
	);
}
const ActionWindow = withHooks(ActionWindowCreate);

export = ActionWindow;
