local string_utils = require "@utils/string-utils"

local function convert_matched(matched: { string? }, amount: number): { number }?
	if #matched ~= amount then
		return nil
	end
	local output = {}
	for index, val_str in matched do
		local val = tonumber(val_str)
		if not val then
			return nil
		end
		output[index] = val
	end
	return output
end

local DIGIT = "(%d+)"
local function PATTERN(str: string)
	return "^%s*" .. str .. "%s*$"
end

local RGB_PATTERN = PATTERN(`{DIGIT}%s*,%s*{DIGIT}%s*,%s*{DIGIT}`)
local HSV_PATTERN = PATTERN(`{DIGIT}%s*,%s*{DIGIT}%%?%s*,%s*{DIGIT}%%?`)

local decoders = {
	hex = function(input: string): Color3?
		local success, color = pcall(function()
			return Color3.fromHex(input)
		end)
		if not success then
			return nil
		end
		return color
	end,
	rbg = function(input: string): Color3?
		local rgb = convert_matched({ string.match(input, RGB_PATTERN) }, 3)
		if not rgb then
			return nil
		end
		return Color3.fromRGB(rgb[1], rgb[2], rgb[3])
	end,
	hsv = function(input: string): Color3?
		local hsv = convert_matched({ string.match(input, HSV_PATTERN) }, 3)
		if not hsv then
			return nil
		end
		return Color3.fromHSV(hsv[1] / 360, hsv[2] / 100, hsv[3] / 100)
	end,
}

local parsers = {
	hex = function(color: Color3)
		return `#{color:ToHex():upper()}`
	end,
	rgb = function(color: Color3)
		local r = math.round(color.R * 255)
		local g = math.round(color.G * 255)
		local b = math.round(color.B * 255)

		return `{r}, {g}, {b}`
	end,
	hsv = function(color: Color3)
		local hsv = { color:ToHSV() }
		local h = math.round(hsv[1] * 360)
		local s = math.round(hsv[2] * 100)
		local v = math.round(hsv[3] * 100)

		return `{h}, {s}, {v}`
	end,
}

return {
	decoders = decoders,
	parsers = parsers,
}
