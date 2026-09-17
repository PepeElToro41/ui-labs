--[[
	Runs user code (story mount / cleanup) inside its own coroutine with a traceback.

	A coroutine, not a bare pcall, so a yield inside the story parks that thread instead of
	suspending the caller: cleanups run inside ecs removed hooks in the middle of a
	`world.delete`, which must never be interrupted.
]]

export type Status = "ok" | "error" | "yield"

local function traceback(err: unknown): string
	return debug.traceback(tostring(err), 2)
end

--- Returns the call status and either the function result or the error traceback
local function run_protected(fn: (...any) -> any, ...: any): (Status, any)
	local thread = coroutine.create(xpcall)
	local resume_ok, run_ok, result = coroutine.resume(thread, fn, traceback, ...)

	if not resume_ok then
		return "error", tostring(run_ok)
	end
	if not run_ok then
		return "error", result
	end
	if coroutine.status(thread) ~= "dead" then
		return "yield", nil
	end
	return "ok", result
end

return run_protected
