import { useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useBinding, useCallback, useContext, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { _EnumListType } from "@rbxts/ui-labs/out/ControlsUtil";
import { OverlayContext } from "UI/Contexts/OverlayContext";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";
import { GenerateLabel } from "./ListLabels/ListMap";
import ThemeContext from "UI/Contexts/ThemeContext";

interface MenuDropperProps {
	Description: boolean;
	Selected: string | number;
	Dropdown: Record<string, _EnumListType> | _EnumListType[];
	CanvasBind: Roact.Binding<[Vector2, Vector2]>;
	PosBind: Roact.Binding<Vector2[]>;
	SizeBind: Roact.Binding<Vector2>;
	ApplierCallback: (value: _EnumListType, index: string | number) => void;
	SelfClose: () => void;
}

function MenuItemCreate<T extends boolean>(props: {
	Description: T;
	Label: T extends true ? string : number;
	Value: _EnumListType;
	Apply: (index: T extends true ? string : number) => void;
	Order?: number;
	Theme: Theme;
}) {
	const [hover, setHover] = useState(false);

	const setLabel = useMemo(() => {
		return GenerateLabel({ Value: props.Value, Description: props.Description, Theme: props.Theme });
	}, [props.Label, props.Description, props.Theme]);
	return (
		<frame
			Key={props.Label}
			BackgroundColor3={props.Theme.ControlTheme.EnumList.ListEntry}
			BorderSizePixel={0}
			LayoutOrder={props.Order ?? 0}
			BackgroundTransparency={hover ? 0 : 1}
			Size={new UDim2(1, 0, 0, 25)}
		>
			<Detector
				Key="Detector"
				Event={{
					MouseEnter: () => setHover(true),
					MouseLeave: () => setHover(false),
					MouseButton1Click: () => {
						props.Apply(props.Label);
					},
				}}
			></Detector>
			<uicorner CornerRadius={new UDim(0, 6)} />
			<Div Key={"Key"} AutomaticSize={Enum.AutomaticSize.X} Position={UDim2.fromOffset(8, 0)} Size={UDim2.fromScale(0, 1)}>
				{props.Description ? (
					<Text
						Key={"Label"}
						FontFace={Font.fromEnum(Enum.Font.Gotham)}
						TextColor3={props.Theme.TextColor}
						TextSize={12}
						Text={props.Description ? (props.Label as string) : tostring(props.Value)}
						TextXAlignment={Enum.TextXAlignment.Left}
						AutomaticSize={Enum.AutomaticSize.X}
						Size={UDim2.fromScale(0, 1)}
					/>
				) : (
					setLabel
				)}
			</Div>
			{props.Description ? (
				<Div
					Key={"Value"}
					AnchorPoint={new Vector2(1, 0)}
					AutomaticSize={Enum.AutomaticSize.X}
					Position={new UDim2(1, -8, 0, 0)}
					Size={UDim2.fromScale(0, 1)}
				>
					{setLabel}
				</Div>
			) : undefined}
		</frame>
	);
}
const MenuItem = withHooks(MenuItemCreate);

function PredictY(framePos: Vector2, frameSize: Vector2, flipped: boolean) {
	const anchored = new Vector2(0, flipped ? 0 : 1);
	return framePos.Y - frameSize.Y * (anchored.Y * 2 - 1);
}

function MenuDropperCreate(props: MenuDropperProps) {
	const { OverlayInput } = useContext(OverlayContext);
	const [inside, setInside] = useBinding(false);
	const [flipped, setFlipped] = useState(false);
	const theme = useContext(ThemeContext).Theme;
	const dropdown = useMemo(() => {
		const setDropdown: Roact.Element[] = [];
		if (props.Description) {
			const _Dropdown = props.Dropdown as Record<string, _EnumListType>;
			for (const [key, value] of pairs(_Dropdown)) {
				setDropdown.push(
					<MenuItem
						Description={true}
						Label={key}
						Value={value}
						Theme={theme}
						Apply={(index) => {
							props.ApplierCallback(_Dropdown[index], index);
							props.SelfClose();
						}}
					></MenuItem>,
				);
			}
		} else {
			const _Dropdown = props.Dropdown as Array<_EnumListType>;
			_Dropdown.forEach((value, index) => {
				setDropdown.push(
					<MenuItem
						Description={false}
						Label={index}
						Value={value}
						Theme={theme}
						Order={index}
						Apply={(index) => {
							props.ApplierCallback(_Dropdown[index], index);
							props.SelfClose();
						}}
					></MenuItem>,
				);
			});
		}
		return setDropdown;
	}, [props.Dropdown]);
	useEventListener(OverlayInput, (input) => {
		if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
		if (!inside.getValue()) {
			props.SelfClose();
		}
	});
	const CalculateFlip = useCallback(
		(frame: Frame) => {
			const [canvasPos, canvasSize] = props.CanvasBind.getValue();
			const relativePos = frame.AbsolutePosition.sub(canvasPos);
			const stayPos = relativePos.add(frame.AbsoluteSize.mul(frame.AnchorPoint));
			const unflippedY = PredictY(stayPos, frame.AbsoluteSize, true);
			if (flipped === false) {
				if (unflippedY > canvasSize.Y) {
					setFlipped(true);
				}
			} else {
				if (unflippedY < canvasSize.Y) {
					setFlipped(false);
				}
			}
		},
		[flipped],
	);
	return (
		<Div
			Key={"Holder"}
			Size={props.SizeBind.map((size) => UDim2.fromOffset(size.X, 0))}
			Position={props.PosBind.map((pos) => {
				const finalPos = flipped ? math.ceil(pos[1].Y / 2) : math.floor(pos[1].Y / 2);
				return UDim2.fromOffset(pos[0].X, pos[0].add(new Vector2(0, finalPos)).Y);
			})}
			AnchorPoint={flipped ? new Vector2(0, 1) : new Vector2(0, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Change={{
				AbsoluteSize: (frame) => {
					CalculateFlip(frame);
				},
				AbsolutePosition: (frame) => {
					CalculateFlip(frame);
				},
			}}
		>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<frame
				Key={"Separator"}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				LayoutOrder={flipped ? 1 : -1}
				BorderSizePixel={0}
				Size={props.SizeBind.map((size) => new UDim2(1, 0, 0, size.Y / 2 + 3))}
			/>
			<frame
				Key={"Drop"}
				AutomaticSize={Enum.AutomaticSize.Y}
				BackgroundColor3={theme.ControlTheme.EnumList.ListLabel}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				ZIndex={3}
				AnchorPoint={new Vector2(0, 0)}
				Size={UDim2.fromScale(1, 0)}
				Event={{
					MouseEnter: () => setInside(true),
					MouseLeave: () => setInside(false),
				}}
			>
				<uistroke Color={theme.Divisor} Transparency={0.8} />
				<uicorner CornerRadius={new UDim(0, 6)} />
				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
				{dropdown}
			</frame>
		</Div>
	);
}
const MenuDropper = withHooks(MenuDropperCreate);

export = MenuDropper;
