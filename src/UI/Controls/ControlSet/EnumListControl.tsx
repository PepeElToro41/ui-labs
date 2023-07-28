import Roact from "@rbxts/roact";
import { useBinding, useContext, useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { Text } from "UI/UIUtils/Styles/Text";
import { SpecialControls, _EnumListType } from "@rbxts/ui-labs/out/ControlsUtil";
import { Sprite } from "UI/UIUtils/Sprite";
import { Div } from "UI/UIUtils/Styles/Div";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { OverlayContext } from "UI/Contexts/OverlayContext";
import PositionBinder from "UI/UIUtils/Styles/PositionBinder";
import { GenerateLabel } from "UI/Overlay/ListLabels/ListMap";
import { useEventListener } from "@rbxts/pretty-roact-hooks";
import ThemeContext from "UI/Contexts/ThemeContext";

interface EnumListControlProps extends Control.ControlType<_EnumListType> {
	DefaultIndex: string;
	EnumList: Record<string, _EnumListType>;
}

function setProps(props: EnumListControlProps) {
	return props;
}

function EnumListControlCreate(setprops: EnumListControlProps) {
	const props = identity<Required<EnumListControlProps>>(setProps(setprops) as Required<EnumListControlProps>);
	const [hovered, setHover] = useState(false);
	const overlayContext = useContext(OverlayContext);
	const { DropMenu } = overlayContext;
	const [posBind, setPosBind] = useBinding<Vector2[]>([new Vector2(), new Vector2()]);
	const [listOpened, setListOpened] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState((props.Control as SpecialControls["EnumList"]).Props.Indexed);
	const [canOpen, setCanOpen] = useState(true);
	const theme = useContext(ThemeContext).Theme;
	const resetControls = () => {
		setSelectedIndex((props.Control as SpecialControls["EnumList"]).Props.DefaultIndex);
	};
	useEventListener(props.ResetListen, () => {
		resetControls();
	});
	useEffect(() => {
		(props.Control as SpecialControls["EnumList"]).Props.Indexed = selectedIndex;
		props.ControlApply(props.EnumList[selectedIndex]);
	}, [selectedIndex]);
	return (
		<>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<PositionBinder
				BindSet={setPosBind}
				Key={"DropFrame"}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={hovered ? theme.ControlTheme.EnumList.ListEntry : theme.ControlTheme.EnumList.ListLabel}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(0, 25)}
			>
				<uicorner CornerRadius={new UDim(0, 6)}></uicorner>
				<uistroke Color={theme.Divisor} Transparency={hovered ? 1 : 0.8}></uistroke>
				<Detector
					Key="Detector"
					Size={UDim2.fromScale(1, 1)}
					ZIndex={2}
					Event={{
						MouseEnter: () => {
							setHover(true);
						},
						MouseLeave: () => {
							setHover(false);
						},
						MouseButton1Click: () => {
							const _canOpen = canOpen;
							setCanOpen(true);
							if (listOpened || !_canOpen) return;
							DropMenu(
								true,
								props.DefaultIndex,
								props.EnumList,
								posBind.map((v) => v),
								posBind.map((v) => v[1]),
								(_, index) => {
									setSelectedIndex(index as string);
								},
								() => {
									setListOpened(false);
								},
							);
							setListOpened(true);
						},
						MouseButton1Down: () => {
							if (listOpened) {
								setCanOpen(false);
							}
						},
					}}
				></Detector>
				<Div Key={"Holder"} AutomaticSize={Enum.AutomaticSize.X} Size={UDim2.fromScale(0, 1)}>
					<uipadding PaddingLeft={new UDim(0, 8)} PaddingRight={new UDim(0, 8)}></uipadding>
					<uilistlayout
						Padding={new UDim(0, 4)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					></uilistlayout>
					<textlabel
						Key={"SelectIndex"}
						FontFace={
							new Font(
								"rbxasset://fonts/families/GothamSSm.json",
								Enum.FontWeight.ExtraLight,
								Enum.FontStyle.Normal,
							)
						}
						Text={selectedIndex}
						TextColor3={theme.TextColor}
						TextSize={12}
						TextTruncate={Enum.TextTruncate.AtEnd}
						TextXAlignment={Enum.TextXAlignment.Left}
						AutomaticSize={Enum.AutomaticSize.X}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Position={UDim2.fromOffset(8, 0)}
						Size={UDim2.fromScale(0, 1)}
					>
						<uisizeconstraint MaxSize={new Vector2(170, math.huge)} MinSize={new Vector2(80, 0)}></uisizeconstraint>
						<uipadding PaddingRight={new UDim(0, 8)}></uipadding>
					</textlabel>
					<frame
						Key={"SelectValue"}
						AnchorPoint={new Vector2(1, 0.5)}
						AutomaticSize={Enum.AutomaticSize.X}
						BackgroundColor3={new Color3(1, 1, 1)}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						LayoutOrder={1}
						Position={new UDim2(1, -25, 0.5, 0)}
						Size={UDim2.fromScale(0, 1)}
					>
						{GenerateLabel({ Value: props.EnumList[selectedIndex], Description: true, Theme: theme })}
						<uilistlayout
							HorizontalAlignment={Enum.HorizontalAlignment.Right}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						/>
						<uisizeconstraint MaxSize={new Vector2(120, math.huge)} MinSize={new Vector2(20, 0)}></uisizeconstraint>
					</frame>
					<Sprite
						Key={"Drop"}
						ImageRectOffset={new Vector2(192, 128)}
						AnchorPoint={new Vector2(1, 0.5)}
						AutomaticSize={Enum.AutomaticSize.X}
						BackgroundTransparency={1}
						ImageColor3={theme.IconsColor}
						LayoutOrder={2}
						Position={new UDim2(1, -5, 0.5, 0)}
						Size={UDim2.fromOffset(15, 15)}
					></Sprite>
				</Div>
			</PositionBinder>
		</>
	);
}
const EnumListControl = withHooks(EnumListControlCreate);

export = EnumListControl;
