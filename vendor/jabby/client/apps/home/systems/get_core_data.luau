local Players = game:GetService "Players"

local vm_id = require "@vendor/jabby/modules/vm_id"
local vide = require(script.Parent.Parent.Parent.Parent.Parent.Parent.vide)
local queue = require(script.Parent.Parent.Parent.Parent.Parent.modules.queue)
local remotes = require(script.Parent.Parent.Parent.Parent.Parent.modules.remotes)
local reverse_connector = require(script.Parent.Parent.Parent.Parent.Parent.modules.reverse_connector)

return function(data)
	remotes.ping:fire {
		host = "edit",
		to_vm = vm_id,
	}

	local servers_responding = queue(remotes.new_server_registered)
	local server_update = queue(remotes.update_server_data)

	local n = 0
	local servers = data :: any
	local map_to_idx = {
		server = {},
	}

	return function()
		for connector in servers_responding:iter() do
			local outgoing = reverse_connector(connector)
			remotes.bind_to_server_core:fire(outgoing)
		end

		for connector, packet in server_update:iter() do
			local outgoing = reverse_connector(connector)

			map_to_idx[outgoing.host] = map_to_idx[outgoing.host] or {}
			local idx = map_to_idx[outgoing.host][outgoing.to_vm]

			if not idx then
				idx = n + 1
				n += 1
				map_to_idx[outgoing.host][outgoing.to_vm] = idx
				servers()[idx] = {
					host = outgoing.host,
					vm = outgoing.to_vm,

					schedulers = vide.source {},
					worlds = vide.source {},
				}
				servers(servers())
			end

			local server = servers()[idx]
			local schedulers = server.schedulers()
			local worlds = server.worlds()

			table.clear(schedulers)
			table.clear(worlds)

			for index, data in packet.schedulers do
				local at = schedulers[index]
				if at and at.name == data.name and at.id == data.id then
					continue
				end
				schedulers[index] = data
			end

			for index, data in packet.worlds do
				local at = worlds[index]
				if at and at.name == data.name and at.id == data.id then
					continue
				end
				worlds[index] = data
			end

			server.schedulers(schedulers)
			server.worlds(worlds)
		end
	end
end
