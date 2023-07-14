import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useContext, useMemo, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { MouseContext } from "UI/Contexts/MouseContext";
import { DescriptorContext } from "UI/Contexts/Mouse/DescriptorContext";
import { useDescriptor } from "UI/Hooks/MouseControl/useDescriptor";
import { useMouseControl } from "UI/Hooks/useMouseControl";
import Descriptor from "UI/MouseControl/Descriptor";
import Dragger from "UI/MouseControl/Dragger";
import { PluginContext } from "UI/Contexts/PluginContext";
import { useConnections } from "UI/Contexts/GlobalConnections";
import { useEventListener } from "@rbxts/pretty-roact-hooks";
import { RunService } from "@rbxts/services";
import useMouseIcon from "UI/Hooks/MouseControl/useMouseIcon";
import { MouseIconContext } from "UI/Contexts/Mouse/MouseIconContext";
import { Div } from "UI/UIUtils/Styles/Div";

interface MouseControlProps extends PropsWithChildren {}

function getFramePos(frame: Frame, pos: Vector2) {
	const relativePos = pos.sub(frame.AbsolutePosition);
	if (relativePos.X < 0 || relativePos.Y < 0 || relativePos.X > frame.AbsoluteSize.X || relativePos.Y > frame.AbsoluteSize.Y) {
		return;
	}
	return relativePos;
}
function setProps(props: MouseControlProps) {
	return props;
}
function MouseControlCreate(setprops: MouseControlProps) {
	const props = identity<Required<MouseControlProps>>(setProps(setprops) as Required<MouseControlProps>);
	const pluginContext = useContext(PluginContext);
	const pluginObject = pluginContext.PluginObject;
	const mouseFrameRef = useRef<Frame>();
	const [mousePos, getMousePos, setMousePos] = useMouseControl(mouseFrameRef);
	const [setMouseIcon, unsetMouseIcon] = useMouseIcon(pluginObject);
	const iconContextValue = useMemo(() => {
		return { setMouseIcon: setMouseIcon, unsetMouseIcon: unsetMouseIcon };
	}, [setMouseIcon, unsetMouseIcon]);
	const [mouseDesc, descVisible, getMouseDesc, setMouseDesc, removeMouseDesc] = useDescriptor(iconContextValue);
	const connections = useConnections();
	if (pluginContext.DockWidget) {
		useEventListener(RunService.Heartbeat, () => {
			const mouseMouse = pluginContext.DockWidget!.GetRelativeMousePosition();
			setMousePos(mouseMouse);
			connections.MouseMoved.Fire(mouseMouse);
		});
	}
	return (
		<MouseContext.Provider value={{ mouseFrameRef: mouseFrameRef, getMousePos: getMousePos }}>
			<DescriptorContext.Provider
				value={{ getMouseDesc: getMouseDesc, setMouseDesc: setMouseDesc, removeMouseDesc: removeMouseDesc }}
			>
				<MouseIconContext.Provider value={iconContextValue}>
					<Div
						Key={"PluginFrame"}
						Size={UDim2.fromScale(1, 1)}
						Active={true}
						Ref={mouseFrameRef}
						Event={
							pluginContext.DockWidget
								? {} // No mouse events for dock widget (using DockWidget.GetRelativeMousePosition() in RunService.Heartbeat instead)
								: {
										MouseMoved: (frame, x, y) => {
											const relativeMousePos = getFramePos(frame, new Vector2(x, y));
											if (!relativeMousePos) return;
											setMousePos(relativeMousePos);
											connections.MouseMoved.Fire(relativeMousePos);
										},
								  }
						}
					>
						<Div
							Key={"MouseHolder"}
							Size={UDim2.fromOffset(4, 4)}
							Position={UDim2.fromOffset(mousePos.X, mousePos.Y)}
							AutomaticSize={Enum.AutomaticSize.XY}
							ZIndex={4}
						>
							<Descriptor mouseDesc={mouseDesc} descVisible={descVisible} mousePos={mousePos}></Descriptor>
							<Dragger></Dragger>
						</Div>
						{props[Roact.Children]}
					</Div>
				</MouseIconContext.Provider>
			</DescriptorContext.Provider>
		</MouseContext.Provider>
	);
}
const MouseControl = withHooks(MouseControlCreate);

export = MouseControl;
