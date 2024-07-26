import Configs from "Plugin/Configs";
import type { Environment } from "./Environment";

/**
 * Replaces the environment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param environment Environment handler object
 */

export function SetEnvironment(virtualModule: Callback, module: ModuleScript, environment: Environment) {
	const newEnvironment = setmetatable(
		{
			require: (dependency: ModuleScript) => environment.LoadDependency(dependency),
			script: module,
			_G: environment.Shared,
			[Configs.GlobalInjectionKey]: environment.GlobalInjection,
		},
		{
			__index: getfenv(), //defaults any global variables to the current global environment
		},
	);
	setfenv(virtualModule, newEnvironment);
}

/**
 * Requires a module by using loadstring, this also replaces the _G table and the function "require()"
 * @param module the module to laod
 * @param environment Environment handler object
 */
export async function LoadVirtualModule(module: ModuleScript, environment: Environment) {
	const [virtualModule, err] = loadstring(module.Source, module.Name);

	if (virtualModule === undefined) {
		throw err;
	}
	SetEnvironment(virtualModule, module, environment);
	const [sucess, result] = pcall(virtualModule);
	if (sucess) {
		return result as unknown;
	} else {
		throw result;
	}
}
