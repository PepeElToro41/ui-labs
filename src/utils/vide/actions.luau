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

		vide.cleanup(function()
			drag_start:Disconnect()
			drag_end:Disconnect()
		end)
	end)
end

return actions
