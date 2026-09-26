--- Parses `--key value` and `--flag` pairs out of the process arguments
local function parse(args: { string }): { [string]: string | true }
	local parsed: { [string]: string | true } = {}

	local index = 1
	while index <= #args do
		local arg = args[index]
		local key = arg:match "^%-%-(.+)$"

		if key then
			local value = args[index + 1]
			if value ~= nil and not value:match "^%-%-" then
				parsed[key] = value
				index += 2
			else
				parsed[key] = true
				index += 1
			end
		else
			index += 1
		end
	end

	return parsed
end

return { parse = parse }
