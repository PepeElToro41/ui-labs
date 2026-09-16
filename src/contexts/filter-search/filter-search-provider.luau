local vide = require "@pkg/vide"
local FILTER_SEARCH_CONTEXT = require "./filter-search-context"

local function filter_search_provider(props: ProviderChildren)
	local filter: FILTER_SEARCH_CONTEXT.FilterSearch = vide.source(nil :: string?)
	return FILTER_SEARCH_CONTEXT(filter, props.children)
end

return filter_search_provider
