function ToVector2(convert: Vector3)
	return Vector2.new(convert.X, convert.Y)
end

function ToVector3(convert: Vector2)
	return Vector3.new(convert.X, convert.Y, 0)
end

function UDim2ToVector2(convert: UDim2)
	return Vector2.new(convert.X.Offset, convert.Y.Offset)
end

function UDimOffset(udim: UDim2)
	return udim.X.Offset + udim.Y.Offset
end

function Lerp(a: number, b: number, t: number)
	return a + (b - a) * t
end

function Counter(start: number?)
	local count = start or 0
	return function(add: number?)
		local current = count
		count += add or 1
		return current
	end
end

return table.freeze {
	ToVector2 = ToVector2,
	ToVector3 = ToVector3,
	UDim2ToVector2 = UDim2ToVector2,
	UDimOffset = UDimOffset,
	Lerp = Lerp,
	Counter = Counter,
}
