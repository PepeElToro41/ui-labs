import type { Enviroment } from "./Enviroment";

/**
 * Replaces the enviroment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param globalEnv _G table
 * @param requireHandler "require()" replacement
 */

export function SetEnviroment(virtualModule: Callback, module: ModuleScript, enviroment: Enviroment) {
	const newEnviroment = setmetatable(
		{
			require: (dependency: ModuleScript) => enviroment.LoadDependency(dependency),
			script: module,
			_G: enviroment.Shared,
		},
		{
			__index: getfenv(), //defaults any global variables to the current global enviroment
		},
	);
	setfenv(virtualModule, newEnviroment);
}
/*
export function LoadVirtualModule2(
	module: ModuleScript,
	requireHandler: (listenModule: ModuleScript) => void,
	enviroment: object,
): LuaTuple<[true, unknown] | [false, string]> {
	const [virtualModule, err] = loadstring(module.Source, module.Name);

	if (virtualModule === undefined) {
		return $tuple(false as const, err!);
	}
	SetEnviroment(virtualModule, module, enviroment, requireHandler);
	const [sucess, result] = pcall(virtualModule);

	if (sucess) {
		return $tuple(true as const, result);
	} else {
		return $tuple(false as const, result as unknown as string);
	}
}
*/
/**
 * Requires a module by using loadstring, this also replaces the _G table and the function "require()"
 * @param module the module to laod
 * @param enviroment enviroment handler to be used
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
