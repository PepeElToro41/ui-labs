declare function loadstring(s: string, n: string): LuaTuple<[Callback?, string?]>;
declare function getfenv(): { script: LuaSourceContainer };
declare function setfenv(f: Callback, env: object): void;

interface NewLuaMetatable<T> {
	__index?: ((self: T, index: unknown) => void) | { [K in string]: unknown };
	__newindex?: (self: T, index: unknown, value: unknown) => void;
	__add?: (self: T, other: T) => T;
	__sub?: (self: T, other: T) => T;
	__mul?: (self: T, other: T) => T;
	__div?: (self: T, other: T) => T;
	__mod?: (self: T, other: T) => T;
	__pow?: (self: T, other: T) => T;
	__unm?: (self: T) => T;
	__eq?: (self: T, other: T) => boolean;
	__lt?: (self: T, other: T) => boolean;
	__le?: (self: T, other: T) => boolean;
	__call?: (self: T, ...args: Array<unknown>) => void;
	__concat?: (self: T, ...args: Array<unknown>) => string;
	__tostring?: (self: T) => string;
	__len?: (self: T) => number;
	__mode?: "k" | "v" | "kv";
	__metatable?: string;
}
interface Selection extends Instance {
	Add(this: Selection, instancesToAdd: Array<Instance>): void;
	Get(this: Selection): Array<Instance>;
	Remove(this: Selection, instancesToRemove: Array<Instance>): void;
	Set(this: Selection, selection: Array<Instance>): void;
	readonly SelectionChanged: RBXScriptSignal<() => void>;
}
interface Services {
	Selection: Selection;
}

declare function setmetatable<T extends object>(object: T, metatable: NewLuaMetatable<T>): T;
