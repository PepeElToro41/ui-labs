local function ArrayDescendants(array: { Instance })
	local descendants: { Instance } = {}

	for _, instance in ipairs(array) do
		for _, descendant in ipairs(instance:GetDescendants()) do
			table.insert(descendants, descendant)
		end
	end
	return descendants
end

local function FromServiceNames(serviceNames: { ServiceName })
	local services: { Instance } = {}

	for _, serviceName in ipairs(serviceNames) do
		local service = game:GetService(serviceName)
		if not service then continue end

		table.insert(services, service)
	end

	return services
end

return table.freeze {
	ArrayDescendants = ArrayDescendants,
	FromServiceNames = FromServiceNames,
}
