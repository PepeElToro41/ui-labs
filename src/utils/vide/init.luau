local Vide = require "@pkg/vide"
local Collections = require "@pkg/collections"
local Object = Collections.Object
local Array = Collections.Array

type Source<T> = Vide.Source<T>

local cleanup = Vide.cleanup
local source = Vide.source
local derive = Vide.derive
local indexes = Vide.indexes
local untrack = Vide.untrack
local effect = Vide.effect
local values = Vide.values

type Connection = {
	Disconnect: (self: any) -> (),
	[string]: any,
}

type Event<T...> = {
	Connect: (self: any, callback: (T...) -> ()) -> Connection,
	[string]: any,
} | RBXScriptSignal<T...>

-- This takes an array of objects, and passes them to indexes with the identifier key
function array_keys<T, R>(
	input: Reactive<{ T }>,
	key: string | ((item: T) -> string),
	transform: (value: Reactive<T>, key: any, index: Reactive<number>) -> R
): Reactive<{ R }>
	local indexedArray = derive(function()
		local map: Map<string, { index: number, item: T }> = {}

		for index, item in ipairs(input()) do
			local searchKey = (if type(key) == "function" then key(item) else key)

			map[(item :: any)[searchKey]] = { index = index, item = item }
		end
		return map
	end)

	return indexes(indexedArray, function(item, key)
		local itemValue = function()
			return item().item
		end
		local itemIndex = function()
			return item().index
		end
		return transform(itemValue, key, itemIndex)
	end)
end

function constant<T>(val: T): Reactive<T>
	return function()
		return val
	end
end

function inner_effect(callback: () -> ())
	return untrack(function()
		effect(callback)
		return nil
	end)
end

function single<T, R>(source: Source<T>, transform: (value: T) -> R): Source<R>
	return derive(function()
		local value = source()
		return untrack(function()
			return transform(value)
		end)
	end)
end

--[[
   This function memoizes the keys and avoids re-computing the keys when key-ed map changes.
   Because if the map changeds immediately when mounting it will cause an infinite loop.
]]
function memo_indexes<K, VI, VO>(input: () -> Map<K, VI>, transform: (() -> VI, K) -> VO): (() -> { VO }) | nil
	local memoizedKeys = source(Object.keys(input()) :: any) :: Source<{ K }>

	effect(function()
		local oldKeys = untrack(memoizedKeys)
		local newKeys: { K } = Object.keys(input()) :: any
		if #newKeys ~= #oldKeys then
			memoizedKeys(newKeys)
		else
			for _, key in pairs(oldKeys) do
				if not Array.includes(newKeys, key) then
					memoizedKeys(newKeys)
					break
				end
			end
		end
	end)

	return values(memoizedKeys, function(key)
		local preview = source(input()[key])
		effect(function()
			local currentInput = input()[key]
			if currentInput == nil then return end
		end)

		return transform(preview, key)
	end)
end

function init_source<T>(init: (T | Source<T>)?, def: T?): Source<T>
	if not init then return source(def :: T) end

	if type(init) == "function" then return init end

	return source(init)
end

function connect<T...>(event: Event<T...>, callback: (T...) -> ())
	local connection = (event :: any):Connect(callback)
	cleanup(function()
		connection:Disconnect()
	end)
end

return table.freeze {
	constant = constant,
	inner_effect = inner_effect,
	init_source = init_source,
	array_keys = array_keys,
	memo_indexes = memo_indexes,
	single = single,
	connect = connect,
}
