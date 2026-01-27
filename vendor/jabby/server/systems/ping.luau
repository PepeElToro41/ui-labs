local Players = game:GetService "Players"

local net = require(script.Parent.Parent.Parent.modules.net)
local queue = require(script.Parent.Parent.Parent.modules.queue)
local remotes = require(script.Parent.Parent.Parent.modules.remotes)
local reverse_connector = require(script.Parent.Parent.Parent.modules.reverse_connector)
local traffic_check = require(script.Parent.Parent.Parent.modules.traffic_check)

return function()
	local ping = queue(remotes.ping)

	return function()
		for connector in ping:iter() do
			local outgoing = reverse_connector(connector)
			remotes.new_server_registered:fire(outgoing)
		end
	end
end
