local Promise = require("@pkg/promise")
local Vide = require "@pkg/vide"

local source = Vide.source
local cleanup = Vide.cleanup
local untrack = Vide.untrack
local effect = Vide.effect

type Promise<T = any> = Promise.TypedPromise<T>
type Source<T> = Vide.Source<T>
type AsyncState<T> = {
	status: Promise.Status,
	message: unknown?,
	value: T?,
}

function useAsyncCallback<T, A...>(callback: (A...) -> Promise<T>): (Reactive<AsyncState<T>>, (A...) -> Promise<T>)
	local currentPromise: Promise<T>? = nil
	local state = source({ status = "Started" } :: AsyncState<T>)

	local function caller(...: A...)
		if currentPromise then currentPromise:cancel() end

		if untrack(state).status ~= "Started" then state({ status = "Started" }) end
		local promise = callback(...)

		promise:andThen(function(value)
			state({ status = promise:getStatus(), value = value })
		end, function(message)
			state({ status = promise:getStatus(), message = message })
		end)

		currentPromise = promise
		return currentPromise :: Promise<T>
	end

	cleanup(function()
		if currentPromise then currentPromise:cancel() end
	end)

	return Vide.lock(state), caller
end

function useAsync<T>(callback: (...any) -> Promise<T>)
	local state, caller = useAsyncCallback(callback)

	local value = function()
		return state().value
	end
	local status = function()
		return state().status
	end
	local message = function()
		return state().message
	end

	effect(function()
		caller()
	end)

	return value, status, message
end

return table.freeze {
	useAsync = useAsync,
	useAsyncCallback = useAsyncCallback,
}
