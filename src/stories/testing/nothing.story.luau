-- a functional story cannot carry a summary or controls, the action panel has to stay hidden
return function(target: Frame)
	local label = Instance.new "TextLabel"
	label.Name = "nothing"
	label.AutomaticSize = Enum.AutomaticSize.XY
	label.Position = UDim2.fromOffset(20, 20)
	label.BackgroundTransparency = 1
	label.FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Bold)
	label.TextSize = 16
	label.TextColor3 = Color3.new(1, 1, 1)
	label.Text = "no summary, no controls"
	label.Parent = target

	return function()
		label:Destroy()
	end
end
