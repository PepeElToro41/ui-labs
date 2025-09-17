import { ScriptEditorService } from "@rbxts/services";
import type { Environment } from "./Environment";

/**
 * Replaces the environment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param environment Environment handler object
 */
export function SetEnvironment(
	virtualModule: Callback,
	module: ModuleScript,
	environment: Environment
) {
	const globals = {
		require: (dependency: ModuleScript) => {
			return environment.LoadDependency(dependency).expect();
		},
		script: module,
		_G: environment.Shared
	};
	const env = getfenv();
	const injection = environment.GetGlobalInjection();
	const index = injection ? setmetatable(injection, { __index: env }) : env;

	const newEnvironment = setmetatable(globals, {
		__index: index //defaults any global variables to the current global environment
	});
	setfenv(virtualModule, newEnvironment);
}

/**
 * Requires a module by using loadstring, this also replaces the _G table and the function "require()"
 * @param module the module to laod
 * @param environment Environment handler object
 */
export async function LoadVirtualModule(
	module: ModuleScript,
	environment: Environment
) {
	const [virtualModule, err] = loadstring(
		ScriptEditorService.GetEditorSource(module),
		module.GetFullName()
	);

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
