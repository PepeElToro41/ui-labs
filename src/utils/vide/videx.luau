local vide = require "@pkg/vide"
local collections = require "@pkg/collections"
local object = collections.Object
local array = collections.Array

local utils = {}

function recurse_providers(providers: { Provider }, depth: number, children: () -> any)
	if depth > #providers then
		return children()
	end

	return providers[depth] {
		children = function()
			return recurse_providers(providers, depth + 1, children)
		end,
	}
end

function utils.provider_stack(props: {
	providers: { Provider },
	children: () -> any,
})
	return recurse_providers(props.providers, 1, props.children)
end

-- This takes an array of objects, and passes them to indexes with the identifier key
function utils.keyed_array<T, R>(
	input: Reactive<{ T }>,
	key: ((item: T) -> string) | string,
	transform: (value: Reactive<T>, key: any, index: Reactive<number>) -> R
): Reactive<{ R }>
	local indexed_array = vide.derive(function()
		local map: Map<string, { index: number, item: T }> = {}

		for index, item in input() do
			local search_key = key
			if type(key) == "function" then
				search_key = key(item)
			end

			map[(item :: any)[search_key]] = { index = index, item = item }
		end
		return map
	end)

	return vide.indexes(indexed_array, function(item, key)
		local item_value = function()
			return item().item
		end
		local item_index = function()
			return item().index
		end
		return transform(item_value, key, item_index)
	end)
end

function utils.constant<T>(val: T): Reactive<T>
	return function()
		return val
	end
end

function utils.inner_effect(callback: () -> ())
	return vide.untrack(function()
		vide.effect(callback)
		return nil
	end)
end

function utils.single<T, R>(source: Source<T>, transform: (value: T) -> R): Reactive<R>
	local value_array = vide.derive(function()
		return { source() }
	end)

	local derived = vide.values(value_array, function(value)
		return transform(value)
	end)

	return function()
		return derived()[1]
	end
end

--[[
   This function memoizes the keys and avoids re-computing the keys when key-ed map changes.
   Because if the map changes immediately when mounting it will cause an infinite loop.
]]
function utils.memo_indexes<K, VI, VO>(input: () -> Map<K, VI>, transform: (() -> VI, K) -> VO): (() -> { VO }) | nil
	local memoized_keys = vide.source(object.keys(input()) :: any) :: Source<{ K }>

	vide.effect(function()
		local old_keys = vide.untrack(memoized_keys)
		local new_keys: { K } = object.keys(input()) :: any
		if #new_keys ~= #old_keys then
			memoized_keys(new_keys)
		else
			for _, key in pairs(old_keys) do
				if not array.includes(new_keys, key) then
					memoized_keys(new_keys)
					break
				end
			end
		end
	end)

	return vide.values(memoized_keys, function(key)
		local preview = vide.source(input()[key])
		vide.effect(function()
			local current_input = input()[key]
			if current_input == nil then
				return
			end
		end)

		return transform(preview, key)
	end)
end

function utils.source_from<T>(init: (T | Source<T>)?, def: T?): Source<T>
	if not init then
		return vide.source(def :: T)
	end

	if type(init) == "function" then
		return init
	end

	return vide.source(init)
end

function utils.show(value: any, render: () -> any): any
	if typeof(value) == "function" then
		return vide.show(value, render)
	else
		if value then
			return render()
		else
			return {}
		end
	end
end

type Connection = {
	Disconnect: (self: any) -> (),
}

type Event<T...> = {
	Connect: (self: any, callback: (T...) -> ()) -> Connection,
} | RBXScriptSignal<T...>

function utils.connect<T...>(event: Event<T...>, callback: (T...) -> ())
	local connection = (event :: any):Connect(callback)
	vide.cleanup(function()
		connection:Disconnect()
	end)
end

return utils
