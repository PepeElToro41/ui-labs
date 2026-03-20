import { RunService, ScriptEditorService } from "@rbxts/services";

import type { Environment } from "./Environment";

/**
 * Replaces the environment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param environment Environment handler object
 */
export function SetEnvironment(virtualModule: Callback, module: ModuleScript, environment: Environment) {
	const currentlyLoading = ((
		environment.Shared as unknown as {
			__currentlyLoading?: Map<Instance, Instance | undefined>;
		}
	).__currentlyLoading ??= new Map<Instance, Instance | undefined>());

	const registeredLibraries = ((
		environment.Shared as unknown as {
			__registeredLibraries?: Map<Instance, boolean>;
		}
	).__registeredLibraries ??= new Map<Instance, boolean>());

	const getModule = (context: Instance, scope?: string, moduleName?: string) => {
		if (scope !== undefined && moduleName) {
			let pkg: Instance | undefined = undefined;

			// ServerScriptService/rbxts_include (only on server) - for server-only packages
			if (RunService.IsServer()) {
				const serverScriptService = game.GetService("ServerScriptService");
				const serverInclude = serverScriptService.FindFirstChild("rbxts_include") as Instance | undefined;
				if (serverInclude) {
					const nodeModules = serverInclude.FindFirstChild("node_modules") as Instance | undefined;
					if (nodeModules) {
						const rbxtsScope = nodeModules.FindFirstChild("@rbxts") as Instance | undefined;
						if (rbxtsScope) {
							pkg = rbxtsScope.FindFirstChild(moduleName) as Instance | undefined;
						}
					}
				}
			}

			// ReplicatedStorage/rbxts_include (shared packages) - fallback
			if (!pkg) {
				const replInclude = game.FindFirstChild("ReplicatedStorage")?.FindFirstChild("rbxts_include") as
					| Instance
					| undefined;
				if (replInclude) {
					const nodeModules = replInclude.FindFirstChild("node_modules") as Instance | undefined;
					if (nodeModules) {
						const rbxtsScope = nodeModules.FindFirstChild("@rbxts") as Instance | undefined;
						if (rbxtsScope) {
							pkg = rbxtsScope.FindFirstChild(moduleName) as Instance | undefined;
						}
					}
				}
			}

			if (!pkg) {
				error(`roblox-ts: Could not find module ${moduleName}`, 2);
			}

			return pkg;
		}

		// fallback
		return context;
	};

	const importFn = (context: Instance, ...args: unknown[]) => {
		if (args.size() === 0) {
			error(`Invalid TS.import call in ${module.GetFullName()}`, 2);
		}

		let target = args[0] as Instance;
		for (let i = 1; i < args.size(); i++) {
			target = target.WaitForChild(args[i] as string);
		}

		if (!target.IsA("ModuleScript")) {
			error(`roblox-ts: Failed to import! Expected ModuleScript, got ${target.ClassName}`, 2);
		}

		const moduleToLoad = target as ModuleScript;

		currentlyLoading.set(context, moduleToLoad);

		// register runtime (prevents multiple TS runtimes)
		if (!registeredLibraries.has(moduleToLoad)) {
			if (environment.Shared[moduleToLoad as never]) {
				error(`roblox-ts: Invalid module access! Do you have multiple TS runtimes? ${moduleToLoad.GetFullName()}`, 2);
			}
			environment.Shared[moduleToLoad as never] = tsRuntime as never;
			registeredLibraries.set(moduleToLoad, true);
		}

		const data = environment.LoadDependency(moduleToLoad).expect();

		if (currentlyLoading.get(context) === moduleToLoad) {
			currentlyLoading.delete(context);
		}

		return data;
	};

	const tsRuntime = {
		getModule,
		import: importFn,
		require: (dependency: ModuleScript | string) => {
			if (typeIs(dependency, "string")) {
				return globals.require(dependency);
			}
			return importFn(module, dependency);
		}
	} as Record<string, unknown>;

	const globals = {
		require: (dependency: ModuleScript | string) => {
			let resolved: ModuleScript | undefined = undefined;
			const depType = typeOf(dependency);
			if (typeIs(dependency, "string")) {
				const stringResolved = ResolveStringPath(module, dependency);
				if (stringResolved === undefined) {
					error(`Could not resolve require ${dependency} in ${module}`, 2);
				}
				if (!stringResolved.IsA("ModuleScript")) {
					error(`Resolved dependency ${dependency} is not a ModuleScript`, 2);
				}
				resolved = stringResolved;
			} else if (depType === "Instance") {
				if (dependency.IsA("ModuleScript")) {
					if (dependency === module) {
						error(`Circular dependency detected: ${module}`, 2);
					}
					resolved = dependency;
				} else {
					error(`Dependency ${dependency} is not a ModuleScript`, 2);
				}
			}
			if (resolved === undefined) {
				error(`Could not resolve require ${dependency} in ${module}`, 2);
			}

			return environment.LoadDependency(resolved).expect();
		},
		script: module,
		_G: environment.Shared,
		TS: tsRuntime
	};

	const env = getfenv();
	const injection = environment.GetGlobalInjection();
	const index = injection ? setmetatable(injection, { __index: env }) : env;

	const newEnvironment = setmetatable(globals, {
		__index: index //defaults any global variables to the current global environment
	});

	environment.Shared[module as unknown as never] = tsRuntime as never;

	setfenv(virtualModule, newEnvironment);
}

/**
 * Requires a module by using loadstring, this also replaces the _G table and the function "require()"
 * @param module the module to laod
 * @param environment Environment handler object
 */
export async function LoadVirtualModule(module: ModuleScript, environment: Environment) {
	const [virtualModule, err] = loadstring(ScriptEditorService.GetEditorSource(module), module.GetFullName());

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

export function ResolveStringPath(root: Instance, path: string) {
	const parts = path.split("/");
	let current: Instance = root.Parent!;

	if (parts.size() === 0) error(`Invalid relative path: ${path}`, 2);
	if (parts[0] !== "." && parts[0] !== ".." && parts[0] !== "@self" && parts[0] !== "@game") {
		error(`Invalid path start: "${parts[0]}" in ${path}`, 2);
	}

	for (let i = 0; i < parts.size(); i++) {
		const part = parts[i];
		if (part === "") {
			error(`Double slashes are not allowed in path: ${path}`, 2);
		}

		if (part === "..") {
			let parent = current.Parent;
			if (parent === undefined) error(`No parent found in: ${current}`, 2);
			current = parent;
		} else if (part === ".") {
			// do nothing
		} else if (part === "@self") {
			current = root;
		} else if (part === "@game") {
			current = game;
		} else {
			const child = current.FindFirstChild(part);
			if (child === undefined) error(`Unknown script ${part} in: ${current}`, 2);
			current = child;
		}
	}

	if (current.IsA("ModuleScript") === false) {
		const initFile = current.FindFirstChild("init") ?? current.FindFirstChild("Init");
		if (initFile === undefined) {
			error(`No init file found in: ${current}`, 2);
		}
		current = initFile;
	}

	return current;
}
