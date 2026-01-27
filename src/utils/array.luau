local array = {}

function array.bubble_sort<T>(arr: { T }, predicator: ((T, T) -> boolean)?)
	local n = #arr

	for i = 1, n - 1 do
		local swapped = false
		for j = 1, n - i do
			local a = arr[j + 1]
			local b = arr[j]
			local swap = if predicator then predicator(a, b) else (a :: any) < b
			if swap then
				arr[j], arr[j + 1] = arr[j + 1], arr[j]
				swapped = true
			end
		end
		if not swapped then
			break
		end
	end
end

function array.swap_remove<T>(arr: { T }, index: number)
	local length = #array
	if length == 0 then
		return
	end
	if index == length then
		array[length] = nil
		return
	end
	array[index] = table.remove(array, length)
end

return array
