local use_filter_search = require "@contexts/filter-search/use-filter-search"
local search_input = require "@ui/components/inputs/search-input"

local function story_search(props: {}?)
	local filter = use_filter_search()

	local function on_text_changed(input: string)
		filter(if input == "" then nil else input)
	end

	return search_input {
		placeholder = "Search Story...",
		changed = on_text_changed,
		native = {
			Name = "story_search",
		},
	}
end

return story_search
