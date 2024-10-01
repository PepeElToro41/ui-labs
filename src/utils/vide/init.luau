local Vide = require "@pkg/vide"

type Source<T> = Vide.Source<T>

local cleanup = Vide.cleanup
local source = Vide.source
local derive = Vide.derive
local indexes = Vide.indexes

type Connection = {
	Disconnect: (self: any) -> (),
	[string]: any,
}

type Event<T...> = {
	Connect: (self: any, callback: (T...) -> ()) -> Connection,
	[string]: any,
}

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

function initSource<T>(init: (T | Source<T>)?, def: T?): Source<T>
	if not init then return source(def) end

	if type(init) == "function" then return init end

	return source(init)
end

return table.freeze {
	constant = constant,
	initSource = initSource,
	array_keys = array_keys,
}
