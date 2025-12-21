import { Array } from "@rbxts/sift";
import Config from "Plugin/Configs";
import { ArrayDescendants } from "Utils/InstanceUtils";
import { ClassPredicator, PropagateEvent } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useState, useCallback, useEffect } from "@rbxts/react";

export function useInstanceSearch<T extends keyof Instances>(
	className: T,
	filterPredicator: (instance: Instances[T]) => boolean,
	searchIn: Instance[] = Config.DefaultSearch
) {
	type ClassType = Instances[T];
	const Predicator = ClassPredicator(className, filterPredicator);
	const [instanceList, setInstanceList] = useState<ClassType[]>(() => {
		const filtered = Array.filter(ArrayDescendants(searchIn), Predicator) as ClassType[];
		return filtered;
	});

	const Recompute = useCallback(() => {
		const newFiltered = Array.filter(ArrayDescendants(searchIn), Predicator) as ClassType[];
		setInstanceList(newFiltered);
	}, [searchIn, Predicator]);

	useUpdateEffect(Recompute, [searchIn]);

	const OnInstanceAdded = (instance: ClassType) => {
		setInstanceList((oldList) => {
			const exist = oldList.find((itInstance) => itInstance === instance);
			if (Predicator(instance)) {
				//It's a valid instance
				if (exist) {
					//It's already in the list, cloning to force update in case the name changed
					return Array.copy(oldList);
				} else {
					//It's not in the list, there was a new instance or an old instance changed and passed the predicator, adding it
					const newList = Array.push(oldList, instance);
					return newList;
				}
			} else {
				//Did not pass the predicator
				if (exist) {
					//It's in the list, but the predicator did not pass now, removing it
					return Array.filter(oldList, (itInstance) => itInstance !== instance);
				}
			}
			return oldList;
		});
	};
	const OnInstancesRemoving = (removedInstances: ClassType[]) => {
		setInstanceList((oldList) => {
			const newList: ClassType[] = [];
			let removedAmount = 0;
			oldList.forEach((instance) => {
				const wasRemoved = removedInstances.find((removedInstance) => removedInstance === instance);
				if (wasRemoved) {
					removedAmount += 1;
				} else {
					newList.push(instance);
				}
			});
			if (removedAmount > 0) return newList; //Dont update if nothing was removed
			return oldList;
		});
	};

	useEffect(() => {
		const connections: RBXScriptConnection[] = [];
		searchIn.forEach((searchInstance) => {
			connections.push(
				searchInstance.DescendantAdded.Connect((instance) => {
					if (!instance.IsA(className)) return; // if it's not the class we dont care
					if (Predicator(instance)) {
						//If the instance passed the predicator then we add it
						OnInstanceAdded(instance);
					} else {
						//If we do OnInstanceAdded() it will get ignored (We already know it wont pass the predicator)
						//so you wont be able to connect the name change event, then we do it manually
						connections.push(
							(instance as Instance).GetPropertyChangedSignal("Name").Connect(() => {
								OnInstanceAdded(instance);
							})
						);
					}
				})
			);
		});

		ArrayDescendants(searchIn).forEach((instance) => {
			if (!instance.IsA(className)) return;

			connections.push(
				(instance as Instance).GetPropertyChangedSignal("Name").Connect(() => {
					OnInstanceAdded(instance);
				})
			);
			if (Predicator(instance)) {
				//If it's a valid instance we connect when it's removed
				connections.push(
					instance.AncestryChanged.Connect((ancestry, newParent) => {
						if (newParent === undefined) {
							const removed = PropagateEvent(instance, ancestry, instanceList); //I dont know why but roblox wont detect the descendants
							OnInstancesRemoving(removed);
						}
					})
				);
			}
		});

		return () => {
			connections.forEach((connection) => {
				connection.Disconnect();
			});
		};
	}, [instanceList]);

	return $tuple(instanceList, Recompute);
}
