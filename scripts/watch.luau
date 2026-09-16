local fs = zune.fs
local task = zune.task

local function watch(path: string, debounce: number, callback: () -> ()): () -> ()
	local is_debounced = false
	local watchers: { FileWatcher } = {}

	local function on_changed()
		if is_debounced then
			return
		end

		is_debounced = true

		task.delay(debounce, function()
			is_debounced = false
			callback()
		end)
	end

	local function iterate_file(path: string)
		local metadata = fs.metadata(path)

		if metadata.kind == "directory" then
			for _, entry in fs.entries(path) do
				iterate_file(fs.path.join(path, entry.name))
			end
			table.insert(watchers, fs.watch(path, on_changed))
		end
	end

	iterate_file(path)

	return function()
		for _, watcher in watchers do
			watcher:stop()
		end
	end
end

return watch
