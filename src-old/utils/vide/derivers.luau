local Vide = require "@pkg/vide"

local read = Vide.read

function boolean<T>(input: Derivable<boolean>, onTrue: T, onFalse: T): Reactive<T>
	return function()
		return read(input) and onTrue or onFalse
	end
end

function key(input: Derivable<any>, index: string): Reactive<any>
	return function()
		return read(input)[index]
	end
end

function offset(input: Derivable<number>, axis: ("X" | "Y")?, even: boolean?, scaling: number?): Reactive<UDim2>
	return function()
		local input = if even then (math.round(read(input) :: number / 2) * 2) else read(input)
		local base = UDim2.fromScale(scaling or 0, scaling or 0)

		if axis == "X" then
			return base + UDim2.fromOffset(input, 0)
		elseif axis == "Y" then
			return base + UDim2.fromOffset(0, input)
		else
			return base + UDim2.fromOffset(input, input)
		end
	end
end

function scale(input: Derivable<number>, axis: ("X" | "Y")?): Reactive<UDim2>
	return function()
		local val = read(input)
		if axis == "X" then
			return UDim2.fromScale(val, 0)
		elseif axis == "Y" then
			return UDim2.fromScale(0, val)
		else
			return UDim2.fromScale(val, val)
		end
	end
end

type Lerpable = {
	Lerp: (self: any, other: any, alpha: number) -> any,
}

function lerp<T>(alpha: Derivable<number>, min: T, max: T): Reactive<T>
	return function()
		local value = read(alpha)

		if type(min) == "number" then
			return min + (max - min) * value
		else
			local val = (min :: any) :: Lerpable
			return val:Lerp(max, value)
		end
	end
end

return table.freeze {
	boolean = boolean,
	lerp = lerp,
	key = key,
	offset = offset,
	scale = scale,
}
