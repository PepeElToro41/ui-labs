--[[

	net is a utility library designed to handle connections to other actors and
	the server for me.

]]

local Players = game:GetService "Players"
local RunService = game:GetService "RunService"

local signal = require(script.Parent.signal)
local vm_id = require(script.Parent.vm_id)
local traffic_check = require(script.Parent.traffic_check)
local types = require(script.Parent.types)

local local_host: "server" | "edit" | Player

if RunService:IsEdit() then
	local_host = "edit"
elseif RunService:IsServer() then
	local_host = "server"
else
	local_host = Players.LocalPlayer
end

local function create_event<T...>(name: string, unreliable: boolean?, do_not_block_traffic: boolean?)
	local on_event_fire, fire = signal()

	local event = {
		type = "event",

		fire = function(_, connector: types.OutgoingConnector, ...)
			--- if the host is within this vm, we can fire it straight to
			if not traffic_check.check(local_host, connector.host, true) then
				return
			end
			-- same host, same vm.
			if connector.host == local_host then
				local incoming = {
					host = local_host,
					from_vm = vm_id,
					to_vm = connector.to_vm,
				}

				fire(incoming, ...)
			--- if the host is the same, but in a separate actor
			--- we have to fire the actor
			elseif connector.host == local_host and connector.to_vm ~= vm_id then
				error "actor is not supported in edit mode"
			--- we need to fire the server
			elseif connector.host == "server" then
				error "server/client supported in edit mode"
			--- we need to fire the client
			elseif local_host == "server" then
				error "server/client supported in edit mode"
			--- we need to tell the server to redirect this to the client
			else
				error "client/client supported in edit mode"
			end
		end,

		connect = function(_, callback: (types.IncomingConnector, T...) -> ())
			return on_event_fire:connect(callback :: any)
		end,
	}

	return (event :: any) :: types.NetEvent<T...>
end

return {
	create_event = create_event,
	local_host = local_host,
}
