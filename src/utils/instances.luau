local function from_service_names(serviceNames: { ServiceName })
	local services: { Instance } = {}

	for _, serviceName in ipairs(serviceNames) do
		local service = game:GetService(serviceName)
		if not service then
			continue
		end

		table.insert(services, service)
	end

	return services
end

return table.freeze {
	from_service_names = from_service_names,
}
