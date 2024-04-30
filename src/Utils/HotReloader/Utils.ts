import Configs from "Plugin/Configs";
import type { Enviroment } from "./Enviroment";

/**
 * Replaces the enviroment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param enviroment Enviroment handler object
 */

export function SetEnviroment(virtualModule: Callback, module: ModuleScript, enviroment: Enviroment) {
	const newEnviroment = setmetatable(
		{
			require: (dependency: ModuleScript) => enviroment.LoadDependency(dependency),
			script: module,
			_G: enviroment.Shared,
			[Configs.GlobalInjectionKey]: enviroment.GlobalInjection,
		},
		{
			__index: getfenv(), //defaults any global variables to the current global enviroment
		},
	);
	setfenv(virtualModule, newEnviroment);
}

/**
 * Requires a module by using loadstring, this also replaces the _G table and the function "require()"
 * @param module the module to laod
 * @param enviroment Enviroment handler object
 */
export async function LoadVirtualModule(module: ModuleScript, enviroment: Enviroment) {
	const [virtualModule, err] = loadstring(module.Source, module.Name);

	if (virtualModule === undefined) {
		throw err;
	}
	SetEnviroment(virtualModule, module, enviroment);
	const [sucess, result] = pcall(virtualModule);
	if (sucess) {
		return result as unknown;
	} else {
		throw result;
	}
}
