local signal = require "@pkg/signal"
type EnvironmentClass = {
	__index: Environment,
	create: () -> Environment,
}

export type Dependency = {
	result: any?,
	error: any?,
}

export type Environment = EnvironmentClass & {
	uuid: string,
	shared: { [any]: any },
	injection: { [any]: any }?,
	dependencies: { [ModuleScript]: Dependency },
	loading_dependencies: { [ModuleScript]: { (result: any) -> () } },

	connected: boolean,
	connected_dependencies: { RBXScriptConnection },
	on_dependency_changed: signal.Signal<>,

	disconnect: (Environment) -> (),
	connect_dependency: (Environment, dependency: ModuleScript) -> (),

	inject: (Environment, key: string, value: any) -> (),
	get_injection: (Environment) -> { [any]: any }?,
	load_dependency: (Environment, dependency: ModuleScript) -> any,
}

return nil
