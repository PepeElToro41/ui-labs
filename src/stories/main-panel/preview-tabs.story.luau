local scheduler_provider = require "@contexts/scheduler/scheduler-provider"
local SYSTEM_ORDER = require "@contexts/scheduler/system-order"
local use_system = require "@contexts/scheduler/use-system"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local world_provider = require "@contexts/world/world-provider"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local themes = require "@themes"
local preview_tabs = require "@ui/main-panel/preview-tabs"
local frame = require "@ui/styles/frame"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"

vide.strict = false

local FAKE_STORIES = { "button", "dropdown", "slider" }

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	return videx.provider_stack {
		providers = {
			world_provider,
			scheduler_provider,
		},
		children = function()
			local world = use_world()
			local theme = use_theme()

			use_system(previews.system(), SYSTEM_ORDER.previews)

			-- fake previews carry only what the tabs read; nothing gets loaded
			local first: ecs.Entity? = nil
			for index, name in FAKE_STORIES do
				local module = Instance.new "ModuleScript"
				module.Name = name .. ".story"

				local preview = world.entity()
				world.set(preview, c.module_script, module)
				world.set(preview, c.preview_order, index)
				if index == 1 then
					world.add(preview, c.quick_mounted)
				end
				world.add(preview, c.story_preview)
				first = first or preview
			end
			if first then
				previews.select(world, first)
			end

			return frame {
				Name = "canvas",
				BackgroundColor3 = theme(themes.background1),

				preview_tabs {},
			}
		end,
	}
end)
