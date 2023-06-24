import Roact from "@rbxts/roact";
import { useContext, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { MouseContext } from "UI/Contexts/MouseContext";
import { DescriptorContext } from "UI/Contexts/Mouse/DescriptorContext";
import { useDescriptor } from "UI/Hooks/MouseControl/useDescriptor";
import { useMouseControl } from "UI/Hooks/useMouseControl";
import Descriptor from "UI/MouseControl/Descriptor";
import Dragger from "UI/MouseControl/Dragger";
import { useMouse } from "@rbxts/pretty-roact-hooks";
import { PluginContext } from "UI/Contexts/PluginContext";

interface MouseControlProps {
	children: Roact.Element[];
}

function getFramePos(frame: Frame, pos: Vector2) {
	return pos.sub(frame.AbsolutePosition);
}
function setProps(props: MouseControlProps) {
	return props;
}
function MouseControlCreate(setprops: MouseControlProps) {
	const props = identity<Required<MouseControlProps>>(setProps(setprops) as Required<MouseControlProps>);
	const pluginContext = useContext(PluginContext);
	const [mouseDesc, descVisible, getMouseDesc, setMouseDesc, removeMouseDesc] = useDescriptor();
	const mouseFrameRef = useRef<Frame>();
	const [mousePos, getMousePos, setMousePos] = useMouseControl(mouseFrameRef);
	return (
		<MouseContext.Provider value={{ mouseFrameRef: mouseFrameRef, getMousePos: getMousePos }}>
			<DescriptorContext.Provider
				value={{ getMouseDesc: getMouseDesc, setMouseDesc: setMouseDesc, removeMouseDesc: removeMouseDesc }}
			>
				<frame
					Key={"MouseControl"}
					Size={UDim2.fromScale(1, 1)}
					Transparency={1}
					Active={true}
					BackgroundTransparency={1}
					Ref={mouseFrameRef}
					Event={{
						MouseMoved: (frame, x, y) => {
							const relativeMousePos = getFramePos(frame, new Vector2(x, y));
							setMousePos(relativeMousePos);
						},
					}}
				>
					<frame
						Key={"MouseHolder"}
						Size={UDim2.fromOffset(4, 4)}
						Position={UDim2.fromOffset(mousePos.X, mousePos.Y)}
						BackgroundTransparency={1}
						AutomaticSize={Enum.AutomaticSize.XY}
						ZIndex={3}
					>
						<Descriptor mouseDesc={mouseDesc} descVisible={descVisible} mousePos={mousePos}></Descriptor>
						<Dragger></Dragger>
					</frame>
					<Roact.Fragment>{...props.children}</Roact.Fragment>
				</frame>
			</DescriptorContext.Provider>
		</MouseContext.Provider>
	);
}
const MouseControl = withHooks(MouseControlCreate);

export = MouseControl;
