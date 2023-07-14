import { useDeferEffect, useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useCallback, useContext, useEffect, useState } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";
import { PropagateEvent } from "Utils/NodeUtils";
import { Filter } from "Utils/TableUtil";

//This hooks search in the game hierarchy for specific instances with a Predicator and returns a list of them (Updates when a new instance is added or removed)
//Right now the predicator is re-calculated when the name of the instance changes as I only need this, but it can be changed to a more general solution

type ServiceNames = (keyof Services)[];

const TreePredicator = <T extends keyof Instances>(className: T, FilterPredicator: (checkInstance: Instances[T]) => boolean) => {
	return (instance: Instance) => {
		const [sucess] = pcall(() => {
			return instance.Name;
		});
		if (!instance.IsA(className)) return false;
		return sucess && instance.Parent !== undefined && instance.IsA(className) && FilterPredicator(instance);
	};
};
function ServiceForEach(serviceTable: ServiceNames, iterator: (service: Instance) => void) {
	serviceTable.forEach((serviceName) => {
		const service = game.GetService(serviceName);
		if (!service) return;
		iterator(service);
	});
}
function DescendantsOfService(serviceTable: ServiceNames) {
	const descendants: Instance[] = [];
	ServiceForEach(serviceTable, (service) => {
		service.GetDescendants().forEach((descendant) => descendants.push(descendant));
	});
	return descendants;
}

export = <T extends keyof Instances>(
	ClassName: T,
	FilterPredicator: (Instance: Instances[T]) => boolean,
	SearchIn?: ServiceNames,
) => {
	type TreeObject = Instances[T];
	const serviceSearch = SearchIn ?? Configs.SearchServices;
	const Predicator = TreePredicator(ClassName, FilterPredicator);
	const instancesFiltered = Filter(DescendantsOfService(serviceSearch), Predicator) as TreeObject[];
	const [instanceList, setInstanceList] = useState<TreeObject[]>(instancesFiltered);
	useUpdateEffect(() => {
		const newFiltered = Filter(DescendantsOfService(serviceSearch), Predicator) as TreeObject[];
		setInstanceList(newFiltered);
	}, [serviceSearch]);

	const onInstanceAdded = useCallback(
		(instance: TreeObject) => {
			//Gets called when an instance is added or when an instance name changes
			setInstanceList((oldList) => {
				const exist = oldList.find((itInstance) => itInstance === instance);
				if (Predicator(instance)) {
					//It's a valid instance
					if (exist) {
						//It's already in the list, cloning to force update in case name changed
						return table.clone(oldList);
					} else {
						//It's not in the list, there was a new instance or an old instance changed to a predicator, adding it
						const newList = table.clone(oldList);
						newList.push(instance);
						return newList;
					}
				} else {
					//it's not a valid predicator or instance
					if (exist) {
						//It's in the list, or the predicator did not pass now, removing it
						return Filter(oldList, (itInstance) => itInstance !== instance);
					}
				}
				return oldList;
			});
		},
		[instanceList],
	);
	const onInstanceRemoved = useCallback((removedInstances: TreeObject[]) => {
		//Gets called when a module that is a valid story is removed
		setInstanceList((oldList) => {
			const newList: TreeObject[] = [];
			let removedAmount = 0;
			oldList.forEach((instance) => {
				const wasRemoved = removedInstances.find((removedInstance) => removedInstance === instance);
				if (wasRemoved) {
					removedAmount += 1;
				} else {
					newList.push(instance);
				}
			});
			if (removedAmount > 0) {
				return newList;
			}
			return oldList;
		});
	}, []);
	useEffect(() => {
		// Effect is used when list changes
		// Saves connections to disconnect them later
		debug.profilebegin("Tree Searching");
		const connections: RBXScriptConnection[] = [];
		//Connecting to services
		ServiceForEach(serviceSearch, (service) => {
			connections.push(
				service.DescendantAdded.Connect((instance) => {
					//Detecting instances added
					if (!instance.IsA(ClassName)) return; // if it's not a module script we dont care
					if (Predicator(instance)) {
						//If the instance is a valid predicator then we add it (there's no point of doing it when it's not a predicator, because it wont change the list)
						onInstanceAdded(instance);
					} else {
						//if we do onInstanceAdded() it will get ignored so you wont be able to connect the name change this with useEffect, so we do it manually
						connections.push(
							(instance as Instance).GetPropertyChangedSignal("Name").Connect(() => {
								onInstanceAdded(instance);
							}),
						);
					}
				}),
			);
		});
		DescendantsOfService(serviceSearch).forEach((instance) => {
			//Iterate over game descendants to connect instances that are already in the game
			if (!instance.IsA(ClassName)) return;
			//Detecing name changes (If I need to detect more things I can do it here)
			connections.push(
				(instance as Instance).GetPropertyChangedSignal("Name").Connect(() => {
					onInstanceAdded(instance);
				}),
			);
			if (Predicator(instance)) {
				//If it's a valid instance we connect when it's removed
				connections.push(
					instance.AncestryChanged.Connect((ancestry, newParent) => {
						if (newParent === undefined) {
							const removed = PropagateEvent(instance, ancestry, instanceList);
							onInstanceRemoved(removed);
						}
					}),
				);
			}
		});
		debug.profileend();
		return () => {
			//Cleaning connections
			debug.profilebegin("Tree Disconnecting");
			connections.forEach((connection) => {
				connection.Disconnect();
			});
			debug.profileend();
		};
	}, [instanceList]);
	return $tuple(instanceList);
};
