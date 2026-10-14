local CoreGui = game:GetService "CoreGui"

local vide = require "@pkg/vide"
local types = require "./types"

-- over the Studio core ui, a story in the viewport is meant to be looked at
local DISPLAY_ORDER = 100

--- Viewport holder: a ScreenGui under CoreGui, so the story is drawn over the Studio
--- viewport at the size and the place the game would give it
local function viewport_holder(props: types.HolderProps)
	local gui = vide.create "ScreenGui" {
		Name = props.name,
		-- CoreGui is never saved with the place, this only keeps the gui out of copies
		Archivable = false,
		DisplayOrder = DISPLAY_ORDER,
		IgnoreGuiInset = true,
		ResetOnSpawn = false,
		ZIndexBehavior = Enum.ZIndexBehavior.Sibling,

		Parent = CoreGui,
	}

	props.target(gui)

	vide.cleanup(function()
		props.target(nil)
		-- deferred, so the story is moved out before the gui is destroyed: it belongs to the
		-- preview and has to survive leaving the viewport
		task.defer(function()
			gui:Destroy()
		end)
	end)
end

return viewport_holder :: types.Holder
