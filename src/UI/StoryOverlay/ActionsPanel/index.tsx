import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import ResizableFrame from "UI/Holders/ResizableFrame";
import ControlTabs, { TabEntry } from "./ControlTabs";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import FrameFill from "UI/Holders/FrameFill";
import TopList from "UI/Styles/List/TopList";
import { Div } from "UI/Styles/Div";
import { useTween } from "Hooks/Utils/Tween";
import DropShadow from "UI/Utils/DropShadow";
import { HttpService } from "@rbxts/services";
import SpriteButton from "UI/Utils/SpriteButton";
import { Detector } from "UI/Styles/Detector";
import ImageButton from "UI/Utils/ImageButton";
import { useToggler } from "Hooks/Utils/Toggler";
import { useActionsHeight, useActionsPinned } from "Context/StoryPanelContext";

const APPEAR_INFO = new TweenInfo(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out);

declare global {
	interface ActionTabEntry {
		DisplayName: string;
		Render: React.Element;
		Order?: number;
	}
}

interface ActionsPanelProps {
	Active: boolean;
	//RenderKey can be given to force it to mount a fresh new panel (This is useful for controls), otherwise "Actions" will be defaulted
	RenderKey?: string;
	Tabs: Map<string, ActionTabEntry>;
}

function setProps(props: ActionsPanelProps) {
	props.Active = props.Active ?? true;
	return props as Required<ActionsPanelProps>;
}

function ActionsPanel(setprops: ActionsPanelProps) {
	const props = setProps(setprops);
	const theme = useTheme();

	const [anchor, tweenAnchor, setAnchor] = useTween(APPEAR_INFO, 1);
	const [selected, setSelected] = useState<string>();
	const [pinned, setPinned] = useActionsPinned();
	const [height, setHeight] = useActionsHeight();

	const active = props.Active && props.Tabs.size() > 0;
	const selectedRender = selected !== undefined ? props.Tabs.get(selected)?.Render : undefined;

	const tabEntries = useMemo(() => {
		const entries = new Map<string, TabEntry>();
		props.Tabs.forEach((tab, index) => {
			entries.set(index, {
				DisplayName: tab.DisplayName,
				Order: tab.Order,
			});
		});
		return entries;
	}, [props.Tabs]);

	const OnPinnedToggle = useCallback(() => {
		setPinned((old) => !old);
	}, [setPinned]);
	const OnSetHeight = useCallback(
		(holder: Frame) => {
			setHeight(holder.AbsoluteSize.Y);
		},
		[active, setHeight],
	);

	useEffect(() => {
		if (active) {
			tweenAnchor(0);
		} else {
			setAnchor(1);
		}
	}, [active]);
	useEffect(() => {
		if (selected !== undefined && props.Tabs.has(selected)) return;
		let last: { Order: number; Index: string };
		props.Tabs.forEach((tab, index) => {
			if (!last || (tab.Order ?? 0) <= last.Order) {
				last = { Order: tab.Order ?? 0, Index: index };
			}
		});
		if (last!) setSelected(last!.Index);
	}, [props.Tabs]);
	useEffect(() => {
		if (!active) {
			setHeight(0);
		}
	}, [active, setHeight]);

	return (
		<ResizableFrame
			key="ActionsPanel"
			HandleAnchor="Top"
			BaseSize={new UDim2(1, 0, 0, 200)}
			ResizeRange={new NumberRange(-110, 400)}
			MaxBeforeCollapse={-160}
			HolderProps={{
				AnchorPoint: new Vector2(0, 1),
				Position: UDim2.fromScale(0, 1),
				ZIndex: 4,
				Visible: active,
			}}
			FrameProps={{
				BackgroundTransparency: 1,
			}}
		>
			{active && (
				<Div
					key="Holder"
					Size={UDim2.fromScale(1, 1)}
					Position={anchor.map((anchor) => UDim2.fromScale(0, anchor))}
					Change={{
						AbsoluteSize: OnSetHeight,
					}}
				>
					<DropShadow Elevation={new Vector2(-1, -2)} Transparency={0.9} />
					<frame
						key={props.RenderKey ?? "Actions"}
						BackgroundColor3={theme.ActionsPanel.Color}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
					>
						<TopList />
						<ControlTabs
							Tabs={tabEntries}
							Selected={selected}
							OnTabSelected={setSelected}
							RightTabs={
								<React.Fragment>
									<ImageButton
										ButtonName="AnchorActionsWindow"
										Description={pinned ? "Floating Window" : "Anchored Window"}
										key={"PinIcon"}
										Icon={pinned ? "rbxassetid://15825809564" : "rbxassetid://15825810568"}
										IconTransparency={0.3}
										Size={UDim2.fromOffset(21, 21)}
										IconScale={0.8}
										OnClick={OnPinnedToggle}
									/>
								</React.Fragment>
							}
						/>
						<Div key={"PanelContents"} Size={new UDim2(1, 0, 1, -26)}>
							{selectedRender}
						</Div>
					</frame>
				</Div>
			)}
		</ResizableFrame>
	);
}

export default ActionsPanel;
