local utils = {}

function utils.vector2(convert: Vector3)
	return Vector2.new(convert.X, convert.Y)
end

function utils.vector3(convert: Vector2)
	return Vector3.new(convert.X, convert.Y, 0)
end

function utils.udim_vector(convert: UDim2)
	return Vector2.new(convert.X.Offset, convert.Y.Offset)
end

function utils.udim_offset(udim: UDim2)
	return udim.X.Offset + udim.Y.Offset
end

return utils
