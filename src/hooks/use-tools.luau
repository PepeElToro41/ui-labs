local use_tag = require "@hooks/use-tag"
local c = require "@src/components"
local ecs = require "@vendor/ecs"

export type Tools = {
	--- whether that tool is enabled over the story of the preview
	measure: Reactive<boolean>,
	select: Reactive<boolean>,
	outlines: Reactive<boolean>,
}

--- The story tools enabled on `preview`, see ui/main-panel/story-content/tools
local function use_tools(preview: Derivable<ecs.Entity>): Tools
	return {
		measure = use_tag(preview, c.measure_tool),
		select = use_tag(preview, c.select_tool),
		outlines = use_tag(preview, c.outline_marker),
	}
end

return use_tools
