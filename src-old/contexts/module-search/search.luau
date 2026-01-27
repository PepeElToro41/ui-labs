local Utils = require "./utils"
local Vide = require "@pkg/vide"
local CONFIGS = require "@constants/configs"
local Sift = require "@pkg/sift"
local Array = require("@pkg/collections").Array

local ArrayDescendants = require("@utils/instance").ArrayDescendants

local source = Vide.source
local effect = Vide.effect
local cleanup = Vide.cleanup

function useInstanceSearch(className: string, predicate: (instance: Instance) -> boolean)
	local InstancePredicator = Utils.ClassPredicator(className, predicate)
	local instanceList = source(Utils.SearchPredicated(CONFIGS.FileSearch, InstancePredicator))

	local function OnInstanceAdded(instance: Instance)
		local oldList = instanceList()
		local exist = not not Array.find(oldList, function(fn)
			return fn == instance
		end)
		if InstancePredicator(instance) then
			-- It's a valid instance
			if exist then
				-- It's already in the list, cloning to force update in case the name changed
				instanceList(table.clone(oldList))
			else
				-- It's not in the list, there was a new instance or an old instance changed and passed the predicator, adding it
				instanceList(Sift.Array.push(oldList, instance))
			end
		else
			-- It's not a valid instance
			if exist then
				-- It was in the list, but the predicator did not pass now, removing it
				local filtered = Sift.Array.filter(oldList, function(fn)
					return fn ~= instance
				end)
				instanceList(filtered)
			end
		end
	end

	local function OnInstancesRemoving(removed: { Instance })
		local oldList = instanceList()
		local newList: { Instance } = {}
		local removedCount = 0
		for _, instance in ipairs(removed) do
			local wasRemoved = Array.find(oldList, function(fn)
				return fn == instance
			end)
			if wasRemoved then
				removedCount = removedCount + 1
			else
				table.insert(newList, instance)
			end
		end
		if removedCount > 0 then instanceList(newList) end
	end

	effect(function()
		-- This reruns everytime the instances list changes
		local list = instanceList()
		local connections: { RBXScriptConnection } = {}

		-- Listening for descendants
		for _, instance in ipairs(CONFIGS.FileSearch) do
			local descendantAdded = instance.DescendantAdded:Connect(function(instance)
				if not instance:IsA(className) then return end
				if InstancePredicator(instance) then
					-- If the instance passed the predicator then we add it
					OnInstanceAdded(instance)
				else
					-- If we do OnInstanceAdded() it will get ignored (We already know it wont pass the predicator)
					-- so you wont be able to connect the name change event, instead, we do it manually
					table.insert(
						connections,
						instance:GetPropertyChangedSignal("Name"):Connect(function()
							OnInstanceAdded(instance)
						end)
					)
				end
			end)
			table.insert(connections, descendantAdded)
		end

		-- Connecting all instances
		for _, instance in ipairs(ArrayDescendants(CONFIGS.FileSearch)) do
			if not instance:IsA(className) then continue end
			table.insert(
				connections,
				instance:GetPropertyChangedSignal("Name"):Connect(function()
					OnInstanceAdded(instance)
				end)
			)

			if InstancePredicator(instance) then
				table.insert(
					connections,
					instance.AncestryChanged:Connect(function(ancestry, newParent)
						if not newParent then
							-- I dont know why but roblox wont detect the descendants being removed
							local removed = Utils.PropagateEvent(instance, ancestry, list)
							OnInstancesRemoving(removed)
						end
					end)
				)
			end
		end

		cleanup(function()
			for _, connection in ipairs(connections) do
				connection:Disconnect()
			end
		end)
	end)

	return instanceList
end

return useInstanceSearch
