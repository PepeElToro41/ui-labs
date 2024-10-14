-- From vide :)
function ycall<T, U>(fn: (T) -> U, arg: T, err: (yield: boolean, err: string) -> ()): U?
	local thread = coroutine.create(xpcall)
	local function efn(err: string)
		return debug.traceback(err, 3)
	end
	local resume_ok, run_ok: boolean, result: U? = coroutine.resume(thread, fn, efn, arg)

	if not resume_ok or not run_ok then return err(false, result :: any) end

	if coroutine.status(thread) ~= "dead" then return err(true, "") end

	return result
end

function FastSpawn<A>(fn: (...A) -> (), ...: A)
	local args = { ... }
	local thread = coroutine.create(function()
		fn(unpack(args))
	end)
	coroutine.resume(thread)
end

function UILabsWarn(reason: string, err: string?)
	print("WARNING", reason, err)

	if err then
		warn("[UI Labs] " .. reason .. "\n\n" .. err)
	else
		warn("[UI Labs] " .. reason)
	end
end

return table.freeze {
	ycall = ycall,
	FastSpawn = FastSpawn,
	UILabsWarn = UILabsWarn,
}
