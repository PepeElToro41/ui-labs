local FILTER_SEARCH_CONTEXT = require "./filter-search-context"

local function use_filter_search(): FILTER_SEARCH_CONTEXT.FilterSearch
	return FILTER_SEARCH_CONTEXT()
end

return use_filter_search
