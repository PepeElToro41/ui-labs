import Roact from "@rbxts/roact";
import { useCallback, useEffect, useMemo, useState } from "@rbxts/roact-hooked";
import { CollectionService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import { PropagateEvent, StoryPredicator } from "Utils/NodeUtils";
import Signal from "Utils/Signal";
import { Copy, Filter } from "Utils/TableUtil";

export = () => {
	const modulesFiltered = Filter(game.GetDescendants(), StoryPredicator) as ModuleScript[];
	const [storyList, setStoryList] = useState<ModuleScript[]>(modulesFiltered);
	const triggerHierarchy = useMemo(() => new Signal(), []);
	const triggerNodes = useMemo(() => new Signal(), []);
	const onModuleAdded = useCallback(
		(module: ModuleScript) => {
			//Gets called when a module is added or when a module name changes
			setStoryList((oldStoryList) => {
				const exist = oldStoryList.find((instance) => instance === module);
				if (StoryPredicator(module)) {
					//It's a valid history module
					if (exist) {
						//It's already in the list, cloning to force update in case name changed
						return table.clone(oldStoryList);
					} else {
						//It's not in the list, there was a new module or an old module changed to a valid name, adding it
						const newStoryList = table.clone(oldStoryList);
						newStoryList.push(module);
						return newStoryList;
					}
				} else {
					//it's not a valid history module
					if (exist) {
						//It's in the list, the name changed to something not valid, removing it
						return Filter(oldStoryList, (instance) => instance !== module);
					}
				}
				return oldStoryList;
			});
		},
		[storyList],
	);
	const onModuleRemoved = useCallback((removedModules: ModuleScript[]) => {
		//Gets called when a module that is a valid story is removed
		setStoryList((oldStoryList) => {
			const newStoryList: ModuleScript[] = [];
			let removedAmount = 0;
			oldStoryList.forEach((module) => {
				const wasRemoved = removedModules.find((removedModule) => removedModule === module);
				if (wasRemoved) {
					removedAmount += 1;
				} else {
					newStoryList.push(module);
				}
			});
			if (removedAmount > 0) {
				return newStoryList;
			}
			return oldStoryList;
		});
	}, []);
	useEffect(() => {
		// Effect is used when storyList changes
		//Saves connections to disconnect them later
		const connections: RBXScriptConnection[] = [];
		connections.push(
			game.DescendantAdded.Connect((instance) => {
				//Detecting instances added
				if (!instance.IsA("ModuleScript")) return; // if it's not a module script we dont care
				if (StoryPredicator(instance)) {
					//If the module is a valid story module then we add it (there's no point of doing it when it's not a predicator, because it wont change the list)
					onModuleAdded(instance);
				} else {
					//if we do onModuleAdded() it will get ignored so you wont be able to connect the name change this with useEffect, so we do it manually
					connections.push(
						instance.GetPropertyChangedSignal("Name").Connect(() => {
							onModuleAdded(instance);
						}),
					);
				}
			}),
		);
		game.GetDescendants().forEach((instance) => {
			//Iterate over game descendants to connect module
			if (!instance.IsA("ModuleScript")) return;
			//Detecing name changes, for any module, stories (detect not valid name) or non stories (detect valid name)
			connections.push(
				instance.GetPropertyChangedSignal("Name").Connect(() => {
					print("Instance name changed");
					onModuleAdded(instance);
				}),
			);
			if (StoryPredicator(instance)) {
				//If it's a valid story module we connect when it's removed
				connections.push(
					instance.AncestryChanged.Connect((ancestry, newParent) => {
						if (newParent === undefined) {
							const removed = PropagateEvent(instance, ancestry, storyList as ModuleScript[]);
							onModuleRemoved(removed);
						} else {
							triggerHierarchy.Fire();
						}
					}),
				);
			}
		});
		return () => {
			//Cleaning connections
			connections.forEach((connection) => {
				connection.Disconnect();
			});
		};
	}, [storyList]);
	return $tuple(storyList, triggerHierarchy, triggerNodes);
};
