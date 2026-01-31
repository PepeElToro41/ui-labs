local vide = require "@pkg/vide"

local actions = {}

function actions.hovered(output: Source<boolean>)
	return vide.action(function(instance: TextButton)
		local enter = instance.MouseEnter:Connect(function()
			output(true)
		end)
		local leave = instance.MouseLeave:Connect(function()
			output(false)
		end)

		vide.cleanup(function()
			enter:Disconnect()
			leave:Disconnect()
		end)
	end)
end

function actions.clicked(output: Source<boolean>)
	return vide.action(function(instance: TextButton)
		local clicked = instance.MouseButton1Down:Connect(function()
			output(true)
		end)
		local unclicked = instance.MouseButton1Up:Connect(function()
			output(false)
		end)
		local leave = instance.MouseLeave:Connect(function()
			output(false)
		end)

		vide.cleanup(function()
			clicked:Disconnect()
			unclicked:Disconnect()
			leave:Disconnect()
		end)
	end)
end

function actions.focused(output: Source<boolean>)
	return vide.action(function(instance: TextBox)
		local focus = instance.Focused:Connect(function()
			output(true)
		end)
		local focus_lost = instance.FocusLost:Connect(function()
			output(false)
		end)

		vide.cleanup(function()
			focus:Disconnect()
			focus_lost:Disconnect()
		end)
	end)
end

function actions.dragging(output: Source<boolean>)
	return vide.action(function(drag: UIDragDetector)
		local drag_start = drag.DragStart:Connect(function()
			output(true)
		end)
		local drag_end = drag.DragEnd:Connect(function()
			output(false)
		end)

		vide.cleanup(drag_start)
		vide.cleanup(drag_end)
	end)
end

function actions.absolute_position(output: Source<Vector2>)
	return vide.action(function(gui: GuiObject)
		local changed = gui:GetPropertyChangedSignal("AbsolutePosition"):Connect(function()
			output(gui.AbsolutePosition)
		end)
		output(gui.AbsolutePosition)
		vide.cleanup(changed)
	end)
end

function actions.absolute_size(output: Source<Vector2>)
	return vide.action(function(gui: GuiObject)
		local changed = gui:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
			output(gui.AbsoluteSize)
		end)
		output(gui.AbsoluteSize)
		vide.cleanup(changed)
	end)
end

export type GuiShape = {
	position: Vector2,
	size: Vector2,
}

function actions.absolute_shape(output: Source<GuiShape>)
	return vide.action(function(gui: GuiObject)
		local position_changed = gui:GetPropertyChangedSignal("AbsolutePosition"):Connect(function()
			output().position = gui.AbsolutePosition
			output(output())
		end)
		local size_changed = gui:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
			output().size = gui.AbsoluteSize
			output(output())
		end)

		vide.cleanup(position_changed)
		vide.cleanup(size_changed)
	end)
end

return actions
