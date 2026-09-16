local vide = require "@pkg/vide"

-- nil means no filter is active, otherwise the raw search input
export type FilterSearch = Source<string?>

local FILTER_SEARCH_CONTEXT = vide.context() :: vide.Context<FilterSearch>
return FILTER_SEARCH_CONTEXT
