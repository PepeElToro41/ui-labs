declare namespace TableUtil {
	/**
	 * Performs a deep copy of the given table. In other words,
	 * all nested tables will also get copied.
	 *
	 * ```lua
	 * local tbl = {"a", "b", "c"}
	 * local tblCopy = TableUtil.Copy(tbl)
	 * ```
	 */
	export function Copy<T>(tbl: T): T;

	/**
	 * Performs a shallow copy of the given table. In other words,
	 * all nested tables will not be copied, but only moved by
	 * reference. Thus, a nested table in both the original and
	 * the copy will be the same.
	 *
	 * ```lua
	 * local tbl = {"a", "b", "c"}
	 * local tblCopy = TableUtil.CopyShallow(tbl)
	 * ```
	 */
	export function CopyShallow<T>(tbl: T): T;

	/**
	 * Synchronizes a table to a template table. If the table does not have an
	 * item that exists within the template, it gets added. If the table has
	 * something that the template does not have, it gets removed.
	 *
	 * ```lua
	 * local tbl1 = {kills = 0; deaths = 0; points = 0}
	 * local tbl2 = {points = 0}
	 * TableUtil.Sync(tbl2, tbl1)  -- In words: "Synchronize table2 to table1"
	 * print(tbl2.deaths)
	 * ```
	 */
	export function Sync<T extends object, U extends object>(tbl: T, templateTbl: U): T & U;

	/**
	 * Prints out the table to the output in an easy-to-read format. Good for
	 * debugging tables. If deep printing, avoid cyclical references.
	 *
	 * ```lua
	 * local tbl = {a = 32; b = 64; c = 128; d = {x = 0; y = 1; z = 2}}
	 * TableUtil.Print(tbl, "My Table", true)
	 * ```
	 */
	export function Print<T extends object>(tbl: T, label: string, deepPrint: boolean): void;

	/**
	 * Removes an item from an array at a given index. Only use this if you do
	 * NOT care about the order of your array. This works by simply popping the
	 * last item in the array and overwriting the given index with the last
	 * item. This is O(1), compared to table.remove's O(n) speed.
	 *
	 * ```lua
	 * local tbl = {"hello", "there", "this", "is", "a", "test"}
	 * TableUtil.FastRemove(tbl, 2)   -- Remove "there" in the array
	 * print(table.concat(tbl, " "))  -- > hello test is a
	 * ```
	 */
	export function FastRemove<T>(tbl: Array<T>, index: number): void;

	/**
	 * Calls FastRemove on the first index that holds the given value.
	 *
	 * ```lua
	 * local tbl = {"abc", "hello", "hi", "goodbye", "hello", "hey"}
	 * local removed, atIndex = TableUtil.FastRemoveFirstValue(tbl, "hello")
	 * if (removed) then
	 * 	print("Removed at index " .. atIndex)
	 * 	print(table.concat(tbl, " "))  -- > abc hi goodbye hello hey
	 * else
	 * 	print("Did not find value")
	 * end
	 * ```
	 */
	export function FastRemoveFirstValue<T>(tbl: Array<T>, value: T): LuaTuple<[boolean, number | undefined]>;

	/**
	 * This allows you to construct a new table by calling the given function
	 * on each item in the table.
	 *
	 * ```lua
	 * local peopleData = {
	 * 	{firstName = "Bob"; lastName = "Smith"};
	 * 	{firstName = "John"; lastName = "Doe"};
	 * 	{firstName = "Jane"; lastName = "Doe"};
	 * }
	 * local people = TableUtil.Map(peopleData, function(item)
	 * 	return {Name = item.firstName .. " " .. item.lastName}
	 * end)
	 * -- 'people' is now an array that looks like: { {Name = "Bob Smith"}; ... }
	 * ```
	 */
	export function Map<T, U>(tbl: ReadonlyArray<T>, callback: (item: T) => U): Array<U>;

	/**
	 * This allows you to create a table based on the given table and a filter
	 * function. If the function returns 'true', the item remains in the new
	 * table; if the function returns 'false', the item is discluded from the
	 * new table.
	 *
	 * ```lua
	 * local people = {
	 * 	{Name = "Bob Smith"; Age = 42};
	 * 	{Name = "John Doe"; Age = 34};
	 * 	{Name = "Jane Doe"; Age = 37};
	 * }
	 * local peopleUnderForty = TableUtil.Filter(people, function(item)
	 * 	return item.Age < 40
	 * end)
	 * ```
	 */
	export function Filter<T>(tbl: ReadonlyArray<T>, callback: (item: T) => boolean): Array<T>;

	/**
	 * This allows you to reduce an array to a single value. Useful for quickly
	 * summing up an array.
	 *
	 * ```lua
	 * local tbl = {40, 32, 9, 5, 44}
	 * local tblSum = TableUtil.Reduce(tbl, function(accumulator, value)
	 * 	return accumulator + value
	 * end)
	 * print(tblSum)  -- > 130
	 * ```
	 */
	export function Reduce<T>(
		tbl: ReadonlyArray<T>,
		callback: (result: number, v: T, k: number, t: ReadonlyArray<T>) => void,
		initialValue?: number,
	): number;
	export function Reduce<T extends object>(
		tbl: T,
		callback: (result: number, v: T[keyof T], k: keyof T, t: T) => void,
		initialValue?: number,
	): number;

	/**
	 * This allows you to assign values from multiple tables into one. The
	 * Assign function is very similar to JavaScript's Object.Assign() and
	 * is useful for things such as composition-designed systems.
	 *
	 * ```lua
	 * local function Driver()
	 * 	return {
	 * 		Drive = function(self) self.Speed = 10 end;
	 * 	}
	 * end
	 * local function Teleporter()
	 * 	return {
	 * 		Teleport = function(self, pos) self.Position = pos end;
	 * 	}
	 * end
	 * local function CreateCar()
	 * 	local state = {
	 * 		Speed = 0;
	 * 		Position = Vector3.new();
	 * 	}
	 * 	-- Assign the Driver and Teleporter components to the car:
	 * 	return TableUtil.Assign({}, Driver(), Teleporter())
	 * end
	 * local car = CreateCar()
	 * car:Drive()
	 * car:Teleport(Vector3.new(0, 10, 0))
	 * ```
	 */
	export function Assign<A, B>(target: A, source: B): A & B;
	export function Assign<A, B, C>(target: A, source1: B, source2: C): A & B & C;
	export function Assign<A, B, C, D>(target: A, source1: B, source2: C, source3: D): A & B & C & D;
	export function Assign<A, B, C, D, E>(target: A, source1: B, source2: C, source3: D, source4: E): A & B & C & D & E;
	export function Assign<A, B, C, D, E, F>(
		target: A,
		source1: B,
		source2: C,
		source3: D,
		source4: E,
		source5: F,
	): A & B & C & D & E & F;
	export function Assign(target: object, ...sources: Array<any>): any;

	/**
	 * Extends on all elements from one table to another.
	 *
	 * ```lua
	 * local t1 = {"a", "b", "c"}
	 * local t2 = {"d", "e", "f"}
	 *
	 * TableUtil.Extend(t1, t2)
	 * print(t1)  --> { "a", "b", "c", "d", "e", "f" }
	 * ```
	 */
	export function Extend<T>(target: ReadonlyArray<T>, extension: ReadonlyArray<T>): Array<T>;
	export function Extend<T extends object, U extends object>(target: T, extension: U): T & U;

	/**
	 * Returns the index of the given item in the table. If not found, this
	 * will return nil.
	 *
	 * This is the same as table.find, which Roblox added after this method
	 * was written. To keep backwards compatibility, this method will continue
	 * to exist, but will point directly to table.find.
	 *
	 * ```lua
	 * local tbl = {"Hello", 32, true, "abc"}
	 * local abcIndex = TableUtil.IndexOf(tbl, "abc")     -- > 4
	 * local helloIndex = TableUtil.IndexOf(tbl, "Hello") -- > 1
	 * local numberIndex = TableUtil.IndexOf(tbl, 64)     -- > nil
	 * ```
	 */
	export function IndexOf<T>(tbl: ReadonlyArray<T>, item: T): number | undefined;

	/**
	 * Creates a reversed version of the array. Note: This is a shallow
	 * copy, so existing references will remain within the new table.
	 *
	 * ```lua
	 * local tbl = {2, 4, 6, 8}
	 * local rblReversed = TableUtil.Reverse(tbl)  -- > {8, 6, 4, 2}
	 * ```
	 */
	export function Reverse<T>(tbl: ReadonlyArray<T>): Array<T>;

	/**
	 * Shuffles (i.e. randomizes) an array. This uses the Fisher-Yates algorithm.
	 *
	 * ```lua
	 * local tbl = {1, 2, 3, 4, 5, 6, 7, 8, 9}
	 * TableUtil.Shuffle(tbl)
	 * print(table.concat(tbl, ", "))  -- e.g. > 3, 6, 9, 2, 8, 4, 1, 7, 5
	 * ```
	 */
	export function Shuffle<T>(tbl: ReadonlyArray<T>): Array<T>;

	export function IsEmpty<T>(tbl: ReadonlyArray<T>): boolean;

	export function EncodeJSON(tbl: unknown): string;

	export function DecodeJSON(json: string): unknown;
}

export = TableUtil;
