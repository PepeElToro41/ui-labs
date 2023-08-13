export function ArrayDescendants(instanceArray: Instance[]) {
	const descendants: Instance[] = [];

	instanceArray.forEach((instance) => {
		instance.GetDescendants().forEach((descendant) => {
			descendants.push(descendant);
		});
	});
	return descendants;
}

export function FromServiceNames<T extends (keyof Services)[]>(serviceTable: T, iterator?: (service: Instance) => void) {
	const servicesFound: Services[T[number]][] = [];

	serviceTable.forEach((serviceName) => {
		const service = game.GetService(serviceName) as Services[T[number]];
		if (!service) return;
		servicesFound.push(service);
		if (iterator) iterator(service);
	});

	return servicesFound;
}
