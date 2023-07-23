import Roact from "@rbxts/roact";
import { $terrify } from "rbxts-transformer-t";
import Signal from "./Signal";
import { _UILabsInternal as UL } from "@rbxts/ui-labs/out/Internal";
import { HoarcekatStory } from "@rbxts/ui-labs";
import { __intern } from "@rbxts/ui-labs/out/ControlsUtil";

export const DefWarn = "\n\nDEFAULT SETTINGS WILL BE USED";

//--------LIBRARY UTILS--------//

type MountLibReturn = LuaTuple<[UseLibType, UILibsPartial]>;

function GetLibInTable(tbl: UILibsPartial & { use?: UseLibType }): [UseLibType, UILibsPartial | undefined] | undefined {
	if ("use" in tbl) {
		if ($terrify<UseLibType>()(tbl.use)) {
			return [tbl.use, undefined];
		} else {
			warn(`\nKey "use" can only be "Roact" or "React", got ${tbl.use}\n this key will be ignored`);
		}
	}
	if (tbl.roact && CheckRoact(tbl.roact)) {
		return ["Roact" as UseLibType, { roact: tbl.roact }];
	} else if (tbl.react && tbl.reactRoblox && CheckReact(tbl.react) && CheckReactRoblox(tbl.reactRoblox)) {
		return ["React" as UseLibType, { react: tbl.react, reactRoblox: tbl.reactRoblox }];
	}
	return undefined;
}

function GetMountLib(
	storyResult: UL.ObjectStory,
	node: StoryType,
	settings: UILabsSettings,
): MountLibReturn | LuaTuple<[undefined]> {
	//Getting the UI library Inside the story return
	const LibInStory = GetLibInTable(storyResult);
	const LibInBook = "BookNodeBinded" in node ? GetLibInTable(node.BookNodeBinded.UILibs ?? {}) : undefined;
	const LibInSettings = GetLibInTable(settings ?? {});
	const LatestUse: UILibsPartial = {
		roact: LibInStory?.[1]?.roact ?? LibInBook?.[1]?.roact ?? LibInSettings?.[1]?.roact,
		react: LibInStory?.[1]?.react ?? LibInBook?.[1]?.react ?? LibInSettings?.[1]?.react,
		reactRoblox: LibInStory?.[1]?.reactRoblox ?? LibInBook?.[1]?.reactRoblox ?? LibInSettings?.[1]?.reactRoblox,
	};
	if (LibInStory) {
		return $tuple(LibInStory[0], LatestUse);
	} else if (LibInBook) {
		return $tuple(LibInBook[0], LatestUse);
	} else if (LibInSettings) {
		return $tuple(LibInSettings[0], LatestUse);
	} else return $tuple(undefined);
}

function GetElementFromReturn(
	UseLib: LibLike.Roact | LibLike.React,
	element: UL.ObjectStory["story"],
	props: UL.UILabsProps,
): Roact.Element | undefined {
	if (typeIs(element, "function")) {
		return UseLib.createElement<UL.UILabsProps>(element as never, props);
	} else if (typeIs(element, "table")) {
		return element;
	}
}
function ExtractControls(controls: UL.SetRuntimeControls) {
	const extractedControls: Record<string, UL.AllExtractControls> = {};
	for (const [key, control] of pairs(controls)) {
		const gotValue = control.Bind.Current as UL.AllExtractControls;
		extractedControls[key] = gotValue;
	}
	return extractedControls;
}
function CreateProps(inputListener: InputSignals | undefined, controls: UL.SetRuntimeControls | undefined): UL.UILabsProps {
	const props = {
		InputListener: inputListener,
		Controls: controls ? ExtractControls(controls) : undefined,
	};
	return props;
}
function ConnectControls(controls: UL.SetRuntimeControls, callback: () => void) {
	const connections = new Array<Signal.Connection>();
	for (const [key, control] of pairs(controls)) {
		const connection = control.Bind.Changed.Connect(callback);
		connections.push(connection);
	}
	return connections;
}

//--------STORY MOUNTERS--------//

function MountHoarcekatStory(execute: HoarcekatStory, target: Frame, inputListener?: InputSignals) {
	const unmounter = execute(target, inputListener ?? undefined);
	return unmounter;
}

function MountRoactStory(
	UseRoact: LibLike.Roact,
	story: UL.ObjectStory["story"],
	target: Frame,
	inputListener: InputSignals | undefined,
	controls: UL.SetRuntimeControls | undefined,
) {
	const element = GetElementFromReturn(UseRoact, story, CreateProps(inputListener, controls));
	if (!element) {
		warn(
			"No element was found to mount the story\n an element can be a Roact element or a function that returns a Roact element",
		);
		return $tuple(undefined);
	}
	const roactTree = UseRoact.mount(element, target);
	const updater = (props: UL.UILabsProps) => {
		const newElement = GetElementFromReturn(UseRoact, story, props);
		if (!newElement) return;
		UseRoact.update(roactTree, newElement);
	};
	const changeConnections = controls
		? ConnectControls(controls, () => {
				updater(CreateProps(inputListener, controls));
		  })
		: undefined;
	const cleanup = () => {
		if (changeConnections) {
			for (const connection of changeConnections) {
				connection.Disconnect();
			}
		}
		UseRoact.unmount(roactTree);
	};
	return $tuple(cleanup, updater);
}

function MountReactStory(
	UseReact: LibLike.React,
	UseReactRoblox: LibLike.ReactRoblox,
	story: UL.ObjectStory["story"],
	target: Frame,
	inputListener: InputSignals | undefined,
	controls: UL.SetRuntimeControls | undefined,
) {
	const element = GetElementFromReturn(UseReact, story, CreateProps(inputListener, controls));
	if (!element) {
		warn(
			"No element was found to mount the story\n an element can be a React element or a function that returns a React element",
		);
		return $tuple(undefined);
	}
	const root = UseReactRoblox.createRoot(target);
	root.render(element);
	const updater = (props: UL.UILabsProps) => {
		const newElement = GetElementFromReturn(UseReact, story, props);
		if (!newElement) return;
		root.render(newElement);
	};
	const changeConnections = controls
		? ConnectControls(controls, () => {
				updater(CreateProps(inputListener, controls));
		  })
		: undefined;
	const cleanup = () => {
		if (changeConnections) {
			for (const connection of changeConnections) {
				connection.Disconnect();
			}
		}
		root.unmount();
	};
	return $tuple(cleanup, updater);
}

//--------STORY MOUNTING--------//
function SetActionsApi(storyName: string, summary: string | undefined, controls: UL.SetControls | undefined, API: ActionsAPI) {
	API.SetSummary(
		summary
			? {
					StoryName: storyName,
					Summary: summary,
			  }
			: undefined,
	);
	return API.SetControls(controls);
}

export function LoadStoryModule(
	handle: StoryHandle,
	settings: UILabsSettings,
	target: Frame,
	ActionsContext: ActionContextType,
	inputListener?: InputSignals,
): LuaTuple<[UseLibType | "Hoarcekat" | undefined, UL.Unmounter?, UL.Updater?]> {
	const result = handle.Result;
	const ActionsAPI = ActionsContext.ActionsAPI;
	ActionsAPI.SetSummary(undefined); //Resetting Summary
	ActionsAPI.SetControls(undefined); //Resetting Controls
	ActionsAPI.ReloadControls.Fire();
	if (typeIs(result, "function")) {
		return $tuple("Hoarcekat", MountHoarcekatStory(result satisfies UL.StoryExecutor, target, inputListener));
	} else if (typeIs(result, "table")) {
		if (!("story" in result)) {
			warn('Story table didnt have a "story" key, this is required to mount the story');
			return $tuple(undefined);
		}
		const [LibName, LibToUse] = GetMountLib(result, handle.NodeBinded, settings);
		//CreateControls is a function that checks for primitives and converts them to a table control
		const controls = result.controls ? __intern.CreateControls(result.controls) : undefined;
		const runtimeControls = SetActionsApi(handle.NodeBinded.DisplayName, result.summary, controls, ActionsAPI);
		if (LibName === undefined) {
			warn("No lib was found to mount the story, Internal's Roact will be used instead");
			const [cleanup, updater] = MountRoactStory(Roact, result.story, target, inputListener, runtimeControls);
			if (!cleanup) return $tuple(undefined);
			return $tuple("Roact", cleanup, updater);
		}
		if (LibName === "Roact") {
			const [cleanup, updater] = MountRoactStory(LibToUse.roact!, result.story, target, inputListener, runtimeControls);
			if (!cleanup) return $tuple(undefined);
			return $tuple("Roact", cleanup, updater);
		} else if (LibName === "React") {
			const [cleanup, updater] = MountReactStory(
				LibToUse.react!,
				LibToUse.reactRoblox!,
				result.story,
				target,
				inputListener,
				runtimeControls,
			);
			if (!cleanup) return $tuple(undefined);
			return $tuple("React", cleanup, updater);
		}
	}
	return $tuple(undefined);
}

//--------LIBRARY TYPECHECKING--------//

export function CheckRoact(
	roact: unknown,
	//Warn function, if not given it will default to an empty function, effectively disabling it
	warnFn: (msg: string) => void = () => {},
	//Warn module to throw the warning on
	warnModule: ModuleScript = script as ModuleScript,
): roact is LibLike.Roact {
	const roactType = typeOf(roact);
	if (!typeIs(roact, "table")) {
		warnFn(`\nRoact returned at ${warnModule.GetFullName()} is a ${roactType}\nonly a Roact table is accepted${DefWarn}`);
		return false;
	}
	if (!("createElement" in roact) || !typeIs(roact.createElement, "function")) {
		warnFn(
			`\nThe provided Roact at ${warnModule.GetFullName()} does not contain a createElement function\n Delete the roact setting to use internal's Roact (not recommended)${DefWarn}`,
		);
		return false;
	}
	if (!("mount" in roact) || !typeIs(roact.mount, "function")) {
		warnFn(
			`\nThe provided Roact at ${warnModule.GetFullName()} does not contain a mount function\n Delete the roact setting to use internal's Roact (not recommended)${DefWarn}`,
		);
		return false;
	}
	return true;
}
export function CheckReact(
	react: unknown,
	//Warn function, if not given it will default to an empty function, effectively disabling it
	warnFn: (msg: string) => void = () => {},
	//Warn module to throw the warning on
	warnModule: ModuleScript = script as ModuleScript,
): react is LibLike.React {
	const reactType = typeOf(react);
	if (!typeIs(react, "table")) {
		warnFn(
			`\nReact setting returned at ${warnModule.GetFullName()} is a ${reactType}\nonly a React table is accepted${DefWarn}`,
		);
		return false;
	}
	if (!("createElement" in react) || !typeIs(react.createElement, "function")) {
		warnFn(`\nThe provided React at ${warnModule.GetFullName()} does not contain a createElement function${DefWarn}`);
		return false;
	}
	return true;
}
export function CheckReactRoblox(
	reactRoblox: unknown,
	//Warn function, if not given it will default to an empty function, effectively disabling it
	warnFn: (msg: string) => void = () => {},
	//Warn module to throw the warning on
	warnModule: ModuleScript = script as ModuleScript,
): reactRoblox is LibLike.ReactRoblox {
	const reactRobloxType = typeOf(reactRoblox);
	if (!typeIs(reactRoblox, "table")) {
		warnFn(
			`\nReactRoblox setting returned at ${warnModule.GetFullName()} is a ${reactRobloxType}\nonly a ReactRoblox table is accepted${DefWarn}`,
		);
		return false;
	}
	if (!("createRoot" in reactRoblox) || !typeIs(reactRoblox.createRoot, "function")) {
		warnFn(`\nThe provided ReactRoblox at ${warnModule.GetFullName()} does not contain a createRoot function${DefWarn}`);
		return false;
	}
	return true;
}

//--------RETURN TYPECHECKING--------//
export function HasUILib(object: {} & UILibsPartial) {
	if ("roact" in object || "react" in object || "reactRoblox" in object) {
		return true;
	}
	return false;
}
export function CheckSettingsReturn(
	warnFn: (warnMsg: string) => void,
	module: ModuleScript,
	returnSettings: unknown,
): returnSettings is UILabsSettings {
	const returnType = typeOf(returnSettings);
	if (!typeIs(returnSettings, "table")) {
		warnFn(`\nValue returned at ${module.GetFullName()} is a ${returnType}\ntable is needed${DefWarn}`);
		return false;
	}
	//Checking ServiceSearch
	if ("ServiceSearch" in returnSettings) {
		const serviceSearchType = typeOf(returnSettings.ServiceSearch);
		if (!typeIs(returnSettings.ServiceSearch, "table")) {
			warnFn(
				`\nServiceSearch setting returned at ${module.GetFullName()} is a ${serviceSearchType}\n an array of Services names is only accepted${DefWarn}`,
			);
			return false;
		}
		const serviceSearch = returnSettings.ServiceSearch as Array<unknown>;
		for (let index = 0; index < serviceSearch.size(); index++) {
			const value = serviceSearch[index];
			const valueType = typeOf(value);
			if (!typeIs(value, "string")) {
				warnFn(
					`\nServiceSearch returned at ${module.GetFullName()} contains (${valueType}) a non-string value\n only Services Names are accepted${DefWarn}`,
				);
				return false;
			}
			const [sucess, serviceGot] = pcall(() => {
				return game.GetService(value as keyof Services);
			});
			if (!sucess || !serviceGot) {
				warnFn(
					`\nServiceSearch returned at ${module.GetFullName()} contains a non-existent service name\n only Services Names are accepted${DefWarn}`,
				);
				return false;
			}
		}
	}
	//Checking HotReloadIgnore
	if ("HotReloadIgnore" in returnSettings) {
		const hotReloadIgnoreType = typeOf(returnSettings.HotReloadIgnore);
		if (!typeIs(returnSettings.HotReloadIgnore, "table")) {
			warnFn(
				`\nHotReloadIgnore setting returned at ${module.GetFullName()} is a ${hotReloadIgnoreType}\n an array of Instances is only accepted${DefWarn}`,
			);
			return false;
		}
		const hotReloadIgnore = returnSettings.HotReloadIgnore as Array<unknown>;
		for (let index = 0; index < hotReloadIgnore.size(); index++) {
			const value = hotReloadIgnore[index];
			const valueType = typeOf(value);
			if (!typeIs(value, "Instance")) {
				warnFn(
					`\nHotReloadIgnore array returned at ${module.GetFullName()} contains (${valueType}) a non-Instance value\n only Instances are accepted in the array${DefWarn}`,
				);
				return false;
			}
		}
	}
	//Checking Roact
	if ("roact" in returnSettings) {
		const isRoact = CheckRoact(returnSettings.roact, warnFn, module);
		if (!isRoact) return false;
	}
	//Checking React
	if ("react" in returnSettings) {
		const isReact = CheckReact(returnSettings.react, warnFn, module);
		if (!isReact) return false;
	}
	//Checking ReactRoblox
	if ("reactRoblox" in returnSettings) {
		const isReactRoblox = CheckReact(returnSettings.reactRoblox, warnFn, module);
		if (!isReactRoblox) return false;
	}
	if (!HasUILib(returnSettings)) {
		warnFn(`\nNo UI Library was provided at ${module.GetFullName()}\nInternal's Roact will be used (not recommended)`);
	}
	return true;
}
