import { useAsyncEffect, useDeferEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { Children, useCallback, useEffect, useState } from "@rbxts/react";
import { HttpService, RunService } from "@rbxts/services";

interface ComponentState {
	Key: string | number;
	Element: React.ReactNode;
	UnactiveTick: number;
	UID: string;
}
interface ReactElement extends React.Element {
	type: any;
}

type PropsType = Record<any, any>;

const LifetimeInternal = newproxy();
const UIDInternal = newproxy();

export class LifetimeController {
	AllComponents: Map<string, ComponentState> = new Map();
	RenderedUIDs: Map<string | number, string> = new Map();
	Updater: () => void = () => {};

	SetUpdater(updater: () => void) {
		this.Updater = updater;
	}
	GetComponent(uid: string) {
		return this.AllComponents.get(uid);
	}
	IsComponentActive(uid: string) {
		const component = this.GetComponent(uid);
		if (!component) return false;
		const render = this.GetRendered(component);
		if (render === undefined) return false;
		return this.RenderedUIDs.get(render) === uid;
	}
	GetRendered(component: ComponentState) {
		const renderKey = this.RenderedUIDs.get(component.Key);
		if (renderKey === undefined) return renderKey;
		if (renderKey !== component.UID) return;
		return component.Key;
	}
	RemoveRenderedByUID(uid: string) {
		const component = this.GetComponent(uid);
		if (!component) return;
		const rendered = this.RenderedUIDs.get(component.Key);
		if (rendered === uid) {
			this.RenderedUIDs.delete(component.Key);
		}
	}
	UnlistComponent(uid: string) {
		if (this.IsComponentActive(uid)) return;
		this.RemoveRenderedByUID(uid);
		this.AllComponents.delete(uid);
		this.Updater();
	}
	RegistryComponent(element: React.Element, key: string | number) {
		const uid = HttpService.GenerateGUID();
		const newComponent: ComponentState = {
			Key: key,
			Element: element,
			UnactiveTick: 0,
			UID: uid,
		};
		this.AllComponents.set(uid, newComponent);
		this.RenderedUIDs.set(key, uid);
	}
	UpdateComponent(uid: string, element: React.Element) {
		const component = this.AllComponents.get(uid);
		if (!component) return;
		this.AllComponents.set(uid, {
			...component,
			Element: element,
		});
	}
	ProcessChildren(children: React.Children) {
		const newChildren = new Map<string | number, string>();

		this.RenderedUIDs.forEach((uid, key) => {
			const child = children.get(key);
			if (!child) return;
			newChildren.set(key, uid);
			this.UpdateComponent(uid, child);
		});
		this.RenderedUIDs = newChildren;

		children.forEach((child, key) => {
			const uid = this.RenderedUIDs.get(key);
			if (uid === undefined) {
				return this.RegistryComponent(child, key);
			}
		});
	}
	RenderComponents() {
		const renderedChildren: React.Children = new Map();
		this.AllComponents.forEach((component, uid) => {
			const child: React.Children = new Map();
			const element = component.Element as ReactElement;
			if (typeOf(element.type) === "function") {
				const props = (element.props as PropsType) ?? {};
				props[LifetimeInternal] = this;
				props[UIDInternal] = uid;
				child.set(component.Key, React.createElement(element.type, { ...props }));
			} else {
				child.set(component.Key, element);
			}

			renderedChildren.set(uid, <React.Fragment>{child}</React.Fragment>);
		});
		return renderedChildren;
	}
	Destroy() {}
}
function useIntrinsicData(props: PropsType) {
	const uid = props[UIDInternal] as string | undefined;
	const controller = props[LifetimeInternal] as LifetimeController | undefined;
	if (uid === undefined || !controller) return {};

	return { uid, controller };
}
function useComponentData(props: PropsType) {
	const { uid, controller } = useIntrinsicData(props);
	if (uid === undefined || !controller) return undefined;

	return controller.AllComponents.get(uid);
}
export function useComponentIsActive(props: PropsType) {
	const { uid, controller } = useIntrinsicData(props);
	if (uid === undefined || !controller) return undefined;
	return controller.IsComponentActive(uid);
}
export function useComponentLifetime(props: PropsType, initLifetime?: number) {
	const [lifetime, setLifetime] = useState<number | undefined>(initLifetime);
	const [unmountTick, setUnmountTick] = useState<number>();
	const { uid, controller } = useIntrinsicData(props);

	if (uid === undefined || !controller)
		throw 'You cant use useComponentLifetime hook in components that are not children of a "LifetimeComponent"';
	const isActive = controller.IsComponentActive(uid);

	useEffect(() => {
		if (!isActive) {
			setUnmountTick(os.clock());
		}
	}, [isActive]);
	useEffect(() => {
		if (unmountTick === undefined) return;
		if (isActive) return;
		if (lifetime === undefined) return;

		const connector = RunService.RenderStepped.Connect(() => {
			const now = os.clock();
			if (now - unmountTick > lifetime) {
				controller.UnlistComponent(uid);
				setLifetime(undefined);
			}
		});
		return () => connector.Disconnect();
	}, [isActive, unmountTick, lifetime]);

	const OnSetLifetime = useCallback((lifetime?: number) => {
		setLifetime(lifetime);
	}, []);

	return OnSetLifetime;
}

export function useDeferLifetime(props: PropsType, steps = 1) {
	const [deferred, setDeferred] = useState(0);
	const active = useComponentIsActive(props);
	const { uid, controller } = useIntrinsicData(props);

	if (uid === undefined || !controller)
		throw 'You cant use useComponentLifetime hook in components that are not children of "LifetimeComponent"';

	useDeferEffect(() => {
		if (!active) {
			if (deferred >= steps) {
				controller.UnlistComponent(uid);
			} else {
				setDeferred((o) => o + 1);
			}
		}
	}, [active, deferred, steps]);
}

export function useLifetimeAsync(props: PropsType, asyncCallback?: () => Promise<any>) {
	const { uid, controller } = useIntrinsicData(props);
	const [asyncLifetime, setAsyncLifetime] = useState(() => asyncCallback);
	const active = useComponentIsActive(props);

	if (uid === undefined || !controller)
		throw 'You cant use useComponentLifetime hook in components that are not children of "LifetimeComponent"';

	const OnSetAsync = useCallback((asyncCallback: () => Promise<any>) => {
		setAsyncLifetime(() => {
			return asyncCallback;
		});
	}, []);

	useAsyncEffect(() => {
		if (!asyncLifetime || active) return Promise.resolve();

		return asyncLifetime().tap(() => {
			controller.UnlistComponent(uid);
		});
	}, [active, asyncLifetime]);

	return OnSetAsync;
}
