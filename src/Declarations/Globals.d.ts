type PropsExclude<T extends Instance, U extends keyof WritableInstanceProperties<T>> = Partial<
	Omit<WritableInstanceProperties<T>, U>
>;

interface PluginSettings {
	Settings: {
		ModuleBindType: BindTypes;
	};
	Hierarchy: PluginHierarchy;
}
