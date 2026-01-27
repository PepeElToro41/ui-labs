local UILabs = require "@ui/uilabs"
local ProviderStack = require("@utils/vide/contexts").ProviderStack

local ModuleSearchProvider = require("@contexts/module-search").ModuleSearchProvider
local StorybooksProvider = require("@contexts/storybooks").StorybooksProvider
local StoryNodesProvider = require("@contexts/story-nodes").StoryNodesProvider
local ThemeProvider = require("@contexts/theme").ThemeProvider
local AppRenderProvider = require("@contexts/app-render").AppRenderProvider

local OverlaysRenderer = require "@ui/overlays/renderer"

function App()
	return ProviderStack {
		providers = {
			ModuleSearchProvider,
			StorybooksProvider,
			StoryNodesProvider,
			ThemeProvider,
			AppRenderProvider,
		},
		children = function()
			return OverlaysRenderer {
				children = UILabs,
			}
		end,
	}
end

return App
