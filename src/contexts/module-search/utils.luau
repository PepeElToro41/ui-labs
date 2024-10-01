local Sift = require "@pkg/sift"
local Array = Sift.Array
local ArrayDescendants = require("@utils/instance").ArrayDescendants

export type Predicate = (instance: Instance) -> boolean

function ExtensionPredicator(extension: string)
	return function(instance: Instance)
		return not not instance.Name:match("%" .. extension .. "$")
	end
end

function SearchPredicated(search: { Instance }, predicate: Predicate)
	local descendants = ArrayDescendants(search)
	return Array.filter(descendants, predicate)
end

function ClassPredicator(className: string, predicate: Predicate)
	return function(instance: Instance)
		local success = pcall(function()
			return instance.Name
		end)
		if not success then return false end
		if not instance:IsA(className) then return false end
		return instance.Parent ~= nil and predicate(instance)
	end
end

function RemoveExtension(name: string, extension: string)
	return name:gsub("%" .. extension .. "$", "")
end

function PropagateEvent(instance: Instance, ancestry: Instance, search: { Instance })
	local all: { Instance } = { instance }

	for _, child in ipairs(ancestry:GetDescendants()) do
		if child == instance then continue end
		if child:IsDescendantOf(ancestry) then table.insert(all, child) end
	end
	return all
end

return table.freeze {
	ExtensionPredicator = ExtensionPredicator,
	SearchPredicated = SearchPredicated,
	ClassPredicator = ClassPredicator,
	RemoveExtension = RemoveExtension,
	PropagateEvent = PropagateEvent,
}
