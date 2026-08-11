import { ReplicatedStorage, ScriptEditorService } from "@rbxts/services";

import type { Environment } from "./Environment";

let runtimeLibModule: ModuleScript | undefined;

interface RbxtsRuntime extends Record<string, unknown> {
	import: (context: ModuleScript, module: Instance, ...path: string[]) => unknown;
}

function ResolveImport(module: Instance, path: string[]) {
	let resolved = module;
	for (const segment of path) {
		resolved = resolved.WaitForChild(segment);
	}

	if (!resolved.IsA("ModuleScript")) {
		error(`Failed to import! Expected ModuleScript, got ${resolved.ClassName}`, 2);
	}

	return resolved;
}

function FindPackageRoot(instance: Instance) {
	let current = instance;
	while (current.Parent !== undefined) {
		const parent = current.Parent;
		if (parent.Name === "node_modules" || parent.Parent?.Name === "node_modules") {
			return current;
		}
		current = parent;
	}
}

function ShouldUseGameRuntime(context: ModuleScript, module: ModuleScript) {
	const packageRoot = FindPackageRoot(module);
	return packageRoot !== undefined && packageRoot !== FindPackageRoot(context);
}

function GetEnvironmentRuntime(environment: Environment): RbxtsRuntime | undefined {
	if (runtimeLibModule === undefined) return;
	return (environment.Shared as Record<never, unknown>)[runtimeLibModule as never] as RbxtsRuntime | undefined;
}

function CreateEnvironmentRuntime(gameRuntime: RbxtsRuntime, environment: Environment): RbxtsRuntime {
	return setmetatable(
		{
			import: (context: ModuleScript, module: Instance, ...path: string[]) => {
				const dependency = ResolveImport(module, path);
				if (ShouldUseGameRuntime(context, dependency)) {
					return gameRuntime.import(context, dependency);
				}

				return environment.LoadDependency(dependency).expect();
			}
		},
		{ __index: gameRuntime }
	) as RbxtsRuntime;
}

/**
 * Replaces the environment of a loadstring'ed function
 * @param virtualModule function result of loadstring()
 * @param module module that was loaded with loadstring()
 * @param environment Environment handler object
 */
export function SetEnvironment(virtualModule: Callback, module: ModuleScript, environment: Environment) {
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

			if (runtimeLibModule !== undefined && resolved === runtimeLibModule) {
				return GetEnvironmentRuntime(environment);
			}

			return environment.LoadDependency(resolved).expect();
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

export function InjectRbxtsRuntime(module: ModuleScript, environment: Environment) {
	const rbxtsInclude = ReplicatedStorage.FindFirstChild("rbxts_include") as Folder | undefined;
	if (rbxtsInclude === undefined) return;

	runtimeLibModule = rbxtsInclude.FindFirstChild("RuntimeLib") as ModuleScript | undefined;
	if (runtimeLibModule === undefined) return;

	const gameRuntime = require(runtimeLibModule) as RbxtsRuntime;
	let environmentRuntime = GetEnvironmentRuntime(environment);
	if (environmentRuntime === undefined) {
		environmentRuntime = CreateEnvironmentRuntime(gameRuntime, environment);
		(environment.Shared as Record<never, unknown>)[runtimeLibModule as never] = environmentRuntime as never;
	}

	// Give the story the game's TS runtime
	(environment.Shared as Record<never, unknown>)[module as never] = environmentRuntime as never;
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
	InjectRbxtsRuntime(module, environment);

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
