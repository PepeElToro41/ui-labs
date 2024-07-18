import { useUpdate } from "@rbxts/pretty-react-hooks";
import React, { PropsWithChildren, useMemo } from "@rbxts/react";
import { LifetimeController } from "./LifetimeController";

interface LifetimeComponentProps extends PropsWithChildren {}

function LifetimeComponent(props: LifetimeComponentProps) {
	const rerender = useUpdate();
	const controller = useMemo(() => new LifetimeController(), []);
	controller.SetUpdater(rerender);

	const children = (props["children"] as ReactChildren) ?? new Map();

	controller.ProcessChildren(children);
	const comps = controller.RenderComponents();
	return <React.Fragment>{comps}</React.Fragment>;
}

export default LifetimeComponent;
