import Configs from "Plugin/Configs";

export function FixColor3(color: Color3) {
	const fixedColor = new Color3(
		math.clamp(color.R, 0, 1),
		math.clamp(color.G, 0, 1),
		math.clamp(color.B, 0, 1)
	);
	return fixedColor;
}

export function GetColorHex(color: Color3) {
	const [sucess, hex] = pcall(() => color.ToHex());
	if (!sucess) return "FFFFFF";
	return hex;
}

export function FastSpawn<T extends (...args: defined[]) => unknown>(
	callback: T,
	...args: Parameters<T>
) {
	const thread = coroutine.create(() => {
		return callback(...args);
	});
	coroutine.resume(thread);
}

export function YCall<T, U>(
	fn: (arg: T) => U,
	arg: T,
	err: (didYield: boolean, err: string) => void
): U | undefined {
	const thread = coroutine.create(xpcall);
	const efn = (err: string) => {
		return debug.traceback(tostring(err), 3);
	};
	const [resume_ok, run_ok, result] = coroutine.resume(thread, fn, efn, arg);

	if (coroutine.status(thread) !== "dead") {
		return err(true, "") as undefined;
	}

	if (!resume_ok || !run_ok) return err(false, result as never) as undefined;

	return result as U;
}

export function UILabsWarn(reason: string, err?: unknown) {
	if (err !== undefined) {
		const formatError = Promise.Error.is(err) ? err.error : err;

		warn("[UI Labs]: " + reason + "\n\n\n" + tostring(formatError));
	} else {
		warn("[UI Labs]: " + reason);
	}
}

export function IsLocalPlugin(gotPlugin?: Plugin) {
	if (gotPlugin === undefined) return true;
	return gotPlugin.Name.find(".rbxm")[0] !== undefined;
}

export function IsCanaryPlugin(gotPlugin?: Plugin) {
	if (gotPlugin === undefined) return false;
	return gotPlugin.Name.find(tostring(Configs.CanaryPluginId))[0] !== undefined;
}

export function CreateTuple<T extends any[]>(...args: T) {
	return args;
}

export function Cast<T>(val: unknown): T {
	return val as T;
}
