import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import { useBinding, useCallback, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { _EnumListType } from "@rbxts/ui-labs/out/ControlsUtil";
import { OverlayContext, OverlayContextType } from "UI/Contexts/OverlayContext";
import ColorPicker from "UI/Overlay/ColorPicker";
import MenuDropper from "UI/Overlay/MenuDropper";
import { IsOverlayMap } from "UI/Overlay/OverlayMap";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Div } from "UI/UIUtils/Styles/Div";
import PositionBinder from "UI/UIUtils/Styles/PositionBinder";
import Signal from "Utils/Signal";

interface OverlayProps extends PropsWithChildren {}

function setProps(props: OverlayProps) {
	return props;
}

function GetFramePos(framePos: Vector2, absPos: Vector2) {
	return absPos.sub(framePos);
}

function OverlayCreate(setprops: OverlayProps) {
	const props = identity<Required<OverlayProps>>(setProps(setprops) as Required<OverlayProps>);
	const [overlayBind, setOverlayBind] = useBinding<[Vector2, Vector2]>([new Vector2(), new Vector2()]);
	const [overlays, setOverlays] = useState<Partial<Record<keyof IsOverlayMap, Roact.Element>>>({});
	const PickColor = useCallback(
		(
			startColor: Color3,
			posBind: Roact.Binding<Vector2>,
			applierCallback: (setColor: Color3) => void,
			onClose: () => void,
			startAlpha?: number,
			alphaCallback?: (setAlpha: number) => void,
		) => {
			setOverlays((oldOverlays) => {
				const newPicker = (
					<ColorPicker
						StartColor={startColor}
						ColorApply={applierCallback}
						AlphaApply={alphaCallback}
						AlphaChanel={startAlpha}
						Position={posBind.map((absPos) => {
							const framePos = GetFramePos(overlayBind.getValue()[0], posBind.getValue());
							return UDim2.fromOffset(framePos.X, framePos.Y);
						})}
						CanvasBind={overlayBind}
						SelfClose={() => {
							onClose();
							CloseOverlay("ColorPicker");
						}}
					></ColorPicker>
				);
				return {
					...oldOverlays,
					ColorPicker: newPicker,
				};
			});
		},
		[],
	);
	const DropMenu = useCallback(
		(
			description: boolean,
			selected: string | number,
			dropdown: Record<string, _EnumListType> | Array<_EnumListType>,
			posBind: Roact.Binding<Vector2[]>,
			sizeBind: Roact.Binding<Vector2>,
			applierCallback: (value: _EnumListType, index: string | number) => void,
			onClose: () => void,
		) => {
			setOverlays((oldOverlays) => {
				const newDropper = (
					<MenuDropper
						Description={description}
						Selected={selected}
						Dropdown={dropdown}
						PosBind={posBind.map((absPos) => {
							const framePos = GetFramePos(overlayBind.getValue()[0], posBind.getValue()[0]);
							return [framePos, absPos[1]];
						})}
						CanvasBind={overlayBind}
						SizeBind={sizeBind}
						ApplierCallback={applierCallback}
						SelfClose={() => {
							onClose();
							CloseOverlay("MenuDropper");
						}}
					></MenuDropper>
				);
				return {
					...oldOverlays,
					MenuDropper: newDropper,
				};
			});
		},
		[],
	);
	const CloseOverlay = useCallback((overlayName: keyof IsOverlayMap) => {
		setOverlays((oldOverlays) => {
			const newOverlays: typeof oldOverlays = {};
			for (const [key, value] of pairs(oldOverlays)) {
				if (key === overlayName) continue;
				newOverlays[key] = value;
			}
			return newOverlays;
		});
	}, []);
	const contextValue = useMemo(() => {
		const value: OverlayContextType = {
			OverlayBind: overlayBind,
			OverlayInput: new Signal<(input: InputObject) => void>(),
			PickColor: PickColor,
			DropMenu: DropMenu,
			CloseOverlay: CloseOverlay,
		};
		return value;
	}, []);
	return (
		<OverlayContext.Provider value={contextValue}>
			<PositionBinder
				Key="Overlay"
				BindSet={setOverlayBind}
				ZIndex={3}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Event={{
					InputBegan: (_, input) => {
						contextValue.OverlayInput.Fire(input);
					},
				}}
			>
				{[overlays.ColorPicker, overlays.MenuDropper]}
			</PositionBinder>
			{props[Children]}
		</OverlayContext.Provider>
	);
}
const Overlay = withHooks(OverlayCreate);

export = Overlay;
