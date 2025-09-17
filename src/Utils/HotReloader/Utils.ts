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

export function ResolveStringPath(root: Instance, path: string) {
	const parts = path.split("/");
	let current: Instance = root.Parent!;

	if (parts.size() === 0) error(`Invalid relative path: ${path}`, 2);
	if (parts[0] !== "." && parts[0] !== ".." && parts[0] !== "@self") {
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
		} else {
			const child = current.FindFirstChild(part);
			if (child === undefined)
				error(`Unknown script ${part} in: ${current}`, 2);
			current = child;
		}
	}

	if (current.IsA("ModuleScript") === false) {
		const initFile =
			current.FindFirstChild("init") ?? current.FindFirstChild("Init");
		if (initFile === undefined) {
			error(`No init file found in: ${current}`, 2);
		}
		current = initFile;
	}

	return current;
}
