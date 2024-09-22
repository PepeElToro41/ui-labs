import Configs from "Constants/Configs";
import { ClassPredicator, PropagateEvent, SearchPredicatedInstances } from "./Utils";
import { cleanup, effect, source } from "@rbxts/vide";
import { Array } from "@rbxts/sift";
import { tuple } from "Utils/Misc";
import { ArrayDescendants } from "Utils/InstanceUtils";


export function useInstanceSearch<T extends keyof Instances>(
	className: T,
	filterPredicator: (instance: Instances[T]) => boolean,
	searchIn: Instance[] = Configs.DefaultSearch,
) {
	type ClassType = Instances[T];
   const Predicator = ClassPredicator(className, filterPredicator);

   const instanceList = source(SearchPredicatedInstances(searchIn, Predicator) as ClassType[]);

   function Recompute() {
      instanceList(SearchPredicatedInstances(searchIn, Predicator) as ClassType[])
   }
   function OnInstanceAdded(instance: ClassType) {
      const oldList = instanceList()
      const exist = oldList.find((itInstance) => itInstance === instance);
      if (Predicator(instance)) {
         //It's a valid instance
         if (exist) {
            //It's already in the list, cloning to force update in case the name changed
            instanceList(Array.copy(oldList));
         } else {
            //It's not in the list, there was a new instance or an old instance changed and passed the predicator, adding it
            instanceList(Array.push(oldList, instance))
         }
      } else {
         //Did not pass the predicator
         if (exist) {
            //It was in the list, but the predicator did not pass now, removing it
            instanceList(Array.filter(oldList, (itInstance) => itInstance !== instance));
         }
      }
   }
   function OnInstancesRemoving(removed: ClassType[]) {
      const oldList = instanceList();
      const newList: ClassType[] = [];
      let removedAmount = 0;
      oldList.forEach((instance) => {
         const wasRemoved = removed.find((removedInstance) => removedInstance === instance);
         if (wasRemoved) {
            removedAmount += 1;
         } else {
            newList.push(instance);
         }
      });
      if(removedAmount <= 0) return;
      instanceList(newList);
   }


   effect(() => {
      // This is fast enough to rerun everytime the instances list changes
      const list = instanceList();
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
						//so you wont be able to connect the name change event, instead, we do it manually
						connections.push(
							(instance as Instance).GetPropertyChangedSignal("Name").Connect(() => {
								OnInstanceAdded(instance);
							}),
						);
					}
				}),
			);
      })
      ArrayDescendants(searchIn).forEach((instance) => {
			if (!instance.IsA(className)) return;

			connections.push(
				(instance as Instance).GetPropertyChangedSignal("Name").Connect(() => {
					OnInstanceAdded(instance);
				}),
			);
			if (Predicator(instance)) {
				//If it's a valid instance we connect when it's removed
				connections.push(
					instance.AncestryChanged.Connect((ancestry, newParent) => {
						if (newParent === undefined) {
                     // I dont know why but roblox wont detect the descendants being removed
							const removed = PropagateEvent(instance, ancestry, list);
							OnInstancesRemoving(removed);
						}
					}),
				);
			}
		});


      cleanup(() => {
         connections.forEach((connection) => {
				connection.Disconnect();
			});
      })
   })

   return tuple(instanceList, Recompute);
}  