local utils = {}

function utils.counter(start: number?)
	local count = start or 0
	return function(add: number?)
		local current = count
		count += add or 1
		return current
	end
end

function utils.nonnil<T>(value: T?, default: T): T
	if value == nil then
		return default
	else
		return value
	end
end

return utils
