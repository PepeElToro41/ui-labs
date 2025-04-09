--!nonstrict
local Vide = require "@pkg/vide"

local cleanup = Vide.cleanup
local action = Vide.action

type Source<T> = Vide.Source<T>

function Hovered(output: Source<boolean>)
	return action(function(instance: TextButton)
		local enter = instance.MouseEnter:Connect(function()
			output(true)
		end)
		local leave = instance.MouseLeave:Connect(function()
			output(false)
		end)

		cleanup(function()
			enter:Disconnect()
			leave:Disconnect()
		end)
	end)
end

function Changed(property: string, output: (value: any) -> ())
	return action(function(instance)
		local connection = instance:GetPropertyChangedSignal(property):Connect(function()
			output(instance[property])
		end)

		-- remember to clean up the connection when the reactive scope the action
		-- is ran in is destroyed, so the instance can be garbage collected
		cleanup(connection)
	end)
end

function Dragging(output: Source<boolean>)
	return action(function(drag: UIDragDetector)
		local dragStart = drag.DragStart:Connect(function()
			output(true)
		end)
		local dragEnd = drag.DragEnd:Connect(function()
			output(false)
		end)

		cleanup(function()
			dragStart:Disconnect()
			dragEnd:Disconnect()
		end)
	end)
end

return table.freeze {
	Hovered = Hovered,
	Dragging = Dragging,
	Changed = Changed,
}
