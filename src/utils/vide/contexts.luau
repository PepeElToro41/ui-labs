function RecurseProviders(providers: { Provider }, index: number, children: () -> any)
	if index > #providers then return children() end

	return providers[index] {
		children = function()
			return RecurseProviders(providers, index + 1, children)
		end,
	}
end

local function ProviderStack(props: {
	providers: { Provider },
	children: () -> any,
})
	return RecurseProviders(props.providers, 1, props.children)
end

return table.freeze {
	ProviderStack = ProviderStack,
}
