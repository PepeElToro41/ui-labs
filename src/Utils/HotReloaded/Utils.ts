export function SetEnviroment(
	virtualModule: Callback,
	module: ModuleScript,
	globalEnv: object,
	requireHandler: (listenModule: ModuleScript) => void,
) {
	const enviroment = setmetatable(
		{
			require: (dependant: ModuleScript) => {
				return requireHandler(dependant);
			},
			script: module,
			_G: globalEnv,
		},
		{
			__index: getfenv(),
		},
	);
	setfenv(virtualModule, enviroment);
}

export function LoadVirtualModule(
	module: ModuleScript,
	requireHandler: (listenModule: ModuleScript) => void,
	globalEnv: object,
): LuaTuple<[true, unknown] | [false, string]> {
	const [virtualModule, err] = loadstring(module.Source, module.Name);
	if (virtualModule === undefined) {
		return $tuple(false as const, err!);
	}
	SetEnviroment(virtualModule, module, globalEnv, requireHandler);
	const [sucess, result] = pcall(virtualModule);

	if (sucess) {
		return $tuple(true as const, result);
	} else {
		return $tuple(false as const, result as unknown as string);
	}
}
