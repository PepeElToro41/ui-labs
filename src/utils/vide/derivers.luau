local Vide = require "@pkg/vide"

local read = Vide.read

function boolean<T>(input: Derivable<boolean>, onTrue: T, onFalse: T): Reactive<T>
	return function()
		return read(input) and onTrue or onFalse
	end
end

function lerp(alpha: Derivable<number>, min: number, max: number): Reactive<number>
	return function()
		return min + (max - min) * read(alpha)
	end
end

return table.freeze {
	boolean = boolean,
	lerp = lerp,
}
