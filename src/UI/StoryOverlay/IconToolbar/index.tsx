import { lerp } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect } from "@rbxts/react";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import Rounder from "UI/Styles/Rounder";
import SpriteButton from "../../Utils/SpriteButton";
import Corner from "UI/Styles/Corner";
import Divisor from "UI/Utils/Divisor";
import { Counter } from "Utils/NumberUtils";
import { useProducer } from "@rbxts/react-reflex";
import Immut from "@rbxts/immut";
import { Selection } from "@rbxts/services";
import { set } from "@rbxts/sift/out/Array";

interface IconToolbarProps {
	PreviewEntry: PreviewEntry;
}

const HOVER_INFO = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function IconToolbar(props: IconToolbarProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [hoverAlpha, tweenHoverAlpha] = useTween(HOVER_INFO, 0);
	const [zIndexBehaviorGlobal, zIndexBehaviorGlobalApi] = useToggler(false);
	const { updateMountData, setMountData } = useProducer<RootProducer>();
	const count = Counter();

	const entry = props.PreviewEntry;

	useEffect(() => {
		tweenHoverAlpha(hovered ? 1 : 0);
	}, [hovered]);

	const OnReload = useCallback(() => {
		const reloader = entry.HotReloader;
		if (reloader) {
			reloader.Reload();
		}
	}, [entry]);
	const OnZoomIn = useCallback(() => {
		updateMountData(props.PreviewEntry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.Zoom += 10;
			}),
		);
	}, [entry]);
	const OnZoomOut = useCallback(() => {
		updateMountData(entry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.Zoom -= 10;
			}),
		);
	}, [entry]);
	const OnViewOnViewport = useCallback(() => {
		updateMountData(entry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.OnViewport = !draft.OnViewport;
			}),
		);
	}, [entry]);

	const OnViewOnExplorer = useCallback(() => {
		if (!entry.Holder) return;
		Selection.Set([entry.Holder!]);
	}, [entry]);

	const toggleZIndexBehavior = useCallback(() => {
		updateMountData(entry.Key, (old) =>
			Immut.produce(old, (draft) => {
				if (zIndexBehaviorGlobal) {
					draft.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
					zIndexBehaviorGlobalApi.disable();
				} else {
					draft.ZIndexBehavior = Enum.ZIndexBehavior.Global;
					zIndexBehaviorGlobalApi.enable();
				}
			}),
		);
	}, [entry]);

	return (
		<Div
			key={"IconToolbar"}
			Size={UDim2.fromOffset(35, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={UDim2.fromOffset(5, 5)}
			ZIndex={2}
			ClipsDescendants={true}
		>
			<Detector
				Size={new UDim2(0, 35, 1, 0)}
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
				}}
			/>
			<Div
				key={"ButtonsHolder"}
				Position={hoverAlpha.map((a) => UDim2.fromScale(-1 + a, 0))}
				BackgroundTransparency={0.2}
				BackgroundColor3={Color3.fromRGB(26, 26, 33)}
			>
				<Corner Radius={6} />
				<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 2)} />
				<SpriteButton ButtonName="Reload" Sprite="Reload" Description="Reload" OnClick={OnReload} Order={count()} />
				<SpriteButton ButtonName="ZoomIn" Sprite="ZoomIn" Description="Zoom In" OnClick={OnZoomIn} Order={count()} />
				<SpriteButton ButtonName="ZoomOut" Sprite="ZoomOut" Description="Zoom Out" OnClick={OnZoomOut} Order={count()} />
				<SpriteButton
					ButtonName="ViewOnViewport"
					Sprite="ViewOnViewport"
					Description="View On Viewport"
					Active={entry.OnViewport}
					OnClick={OnViewOnViewport}
					Order={count()}
				/>
				<SpriteButton
					ButtonName="ViewOnExplorer"
					Sprite="ViewOnExplorer"
					Description="View On Explorer"
					OnClick={OnViewOnExplorer}
					Order={count()}
				/>
				<SpriteButton
					ButtonName="ViewportZIndexBehaviorT"
					Sprite="Picker"
					Active={entry.OnViewport}
					Description="Toggle ZIndex Behavior To Global/Sibling"
					OnClick={toggleZIndexBehavior}
					Order={count()}
				/>
			</Div>
			<frame
				key={""}
				Size={new UDim2(0, 3, 1, -8)}
				Position={UDim2.fromOffset(0, 4)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={hoverAlpha.map((a) => lerp(0.9, 1, a))}
				ZIndex={2}
			>
				<Rounder />
			</frame>
		</Div>
	);
}

export default IconToolbar;
