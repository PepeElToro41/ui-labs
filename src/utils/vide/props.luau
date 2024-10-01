function Collapse(...)
	local collapsed = {}

	for i, tbl in ipairs { ... } do
		for key, value in pairs(tbl) do
			collapsed[key] = value
		end
	end

	return collapsed
end

function Extract(props: { [any]: any }, key: string)
	local prop = props[key]
	props[key] = nil
	return prop
end

return table.freeze {
	Collapse = Collapse,
	Extract = Extract,
}
