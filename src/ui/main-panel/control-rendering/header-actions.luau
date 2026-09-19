local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_tag = require "@hooks/use-tag"
local c = require "@src/components"
local controls = require "@src/systems/controls"
local themes = require "@themes"
local icon_button = require "@ui/elements/icon-button"
local derivers = require "@utils/vide/derivers"
local ecs = require "@vendor/ecs"

type HeaderActionsProps = {
	--- the preview that owns the controls
	entity: ecs.Entity,
}

local BUTTON_SIZE = 20
local ICON_SIZE = 16

--- The buttons at the end of the table header, they act on every control of the preview.
--- Returned as children for a horizontal list
local function header_actions(props: HeaderActionsProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity

	-- read by the mounters on unmount: with it the values are recorded and recovered by the next
	-- mount, without it a reload starts from the defaults
	local keep_controls = use_tag(entity, c.keep_controls)

	local function toggle_keep_controls()
		if not world.exists(entity) then
			return
		end
		if world.has(entity, c.keep_controls) then
			world.remove(entity, c.keep_controls)
		else
			world.add(entity, c.keep_controls)
		end
	end

	local function reset()
		if world.exists(entity) then
			controls.reset(world, entity)
		end
	end

	return {
		-- pinned values stay through a reload
		icon_button {
			name = "keep_controls",
			icon = derivers.boolean(keep_controls, IMAGES.pin_on, IMAGES.pin_off),
			color = function()
				return theme()[if keep_controls() then themes.emphasis else themes.text2]
			end,
			size = BUTTON_SIZE,
			icon_size = ICON_SIZE,
			order = 1,
			activated = toggle_keep_controls,
		},
		icon_button {
			name = "reset",
			icon = IMAGES.reload,
			color = theme(themes.text2),
			size = BUTTON_SIZE,
			icon_size = ICON_SIZE,
			order = 2,
			activated = reset,
		},
	}
end

return header_actions
