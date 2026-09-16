local APP_RENDER_CONTEXT = require "./app-render-context"

local function use_app_render(): APP_RENDER_CONTEXT.AppRender
	return APP_RENDER_CONTEXT()
end

return use_app_render
