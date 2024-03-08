/**
 * Replaces the enviroment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param globalEnv _G table
 * @param requireHandler "require()" replacement
 */

export function SetEnviroment(
	virtualModule: Callback,
	module: ModuleScript,
	enviroment: object,
	requireHandler: (listenModule: ModuleScript) => void,
) {
	const newEnviroment = setmetatable(
		{
			require: (dependency: ModuleScript) => {
				return requireHandler(dependency);
			},
			script: module,
			_G: enviroment,
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
 * @param requireHandler function that will replace "require()"
 * @param globalEnv table that will use as _G for the module
 */
export function LoadVirtualModule(
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
