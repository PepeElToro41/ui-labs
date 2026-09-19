local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local utils = require "./utils"

vide.strict = false

local PARAGRAPH = "This paragraph repeats so the summary overflows the panel and has to scroll, "
	.. "it should wrap to the panel width and never clip under the tabs. "

-- long and rich on purpose: wrapping, scrolling and RichText all get exercised
local SUMMARY = "<b>Summary only</b>\n\n"
	.. "No controls here, so the controls tab is hidden. "
	.. '<font color="#B485FF">Rich text</font> and <i>line breaks</i> should render.\n\n'
	.. string.rep(PARAGRAPH, 6)
	.. "\n\n"
	.. string.rep(PARAGRAPH, 6)

return ui_labs.CreateVideStory({
	vide = vide,
	summary = SUMMARY,
}, function(props)
	return utils.value_list {
		title = "summary only",
		values = {},
	}
end)
