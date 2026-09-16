local string_utils = {}

function string_utils.trim_left(str: string)
	return string.gsub(str, "^%s*", "")
end

function string_utils.trim_right(str: string)
	return string.gsub(str, "%s*$", "")
end

function string_utils.trim(str: string)
	return string.gsub(str, "^%s*(.-)%s*$", "%1")
end

return string_utils
