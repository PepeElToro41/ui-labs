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

function Clicked(output: Source<boolean>)
	return action(function(instance: TextButton)
		local clicked = instance.MouseButton1Down:Connect(function()
			output(true)
		end)
		local unclicked = instance.MouseButton1Up:Connect(function()
			output(false)
		end)
		local leave = instance.MouseLeave:Connect(function()
			output(false)
		end)

		cleanup(function()
			clicked:Disconnect()
			unclicked:Disconnect()
			leave:Disconnect()
		end)
	end)
end

function Focused(output: Source<boolean>)
	return action(function(instance: TextBox)
		local focus = instance.Focused:Connect(function()
			output(true)
		end)
		local focusLost = instance.FocusLost:Connect(function()
			output(false)
		end)

		cleanup(function()
			focus:Disconnect()
			focusLost:Disconnect()
		end)
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

function Shape(output: Source<{ AbsoluteSize: Vector2, AbsolutePosition: Vector2 }>)
	return action(function(instance: GuiObject)
		local value = { AbsoluteSize = instance.AbsoluteSize, AbsolutePosition = instance.AbsolutePosition }

		local connection1 = instance:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
			value.AbsoluteSize = instance.AbsoluteSize
			value.AbsolutePosition = instance.AbsolutePosition
			output(value)
		end)
		local connection2 = instance:GetPropertyChangedSignal("AbsolutePosition"):Connect(function()
			value.AbsoluteSize = instance.AbsoluteSize
			value.AbsolutePosition = instance.AbsolutePosition
			output(value)
		end)
		output(value)

		cleanup(function()
			connection1:Disconnect()
			connection2:Disconnect()
		end)
	end)
end

return table.freeze {
	Hovered = Hovered,
	Dragging = Dragging,
	Focused = Focused,
	Clicked = Clicked,
	Shape = Shape,
}
