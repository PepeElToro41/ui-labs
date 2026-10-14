-- Usage reference returned by `api.help()`, written for an AI agent driving UI Labs through
-- the Roblox Studio MCP `execute_luau` tool (Edit datamodel)

return [[
UI Labs API

Discovery
  Every running UI Labs instance registers itself in the global `shared.UILabs` table, keyed
  by its widget id ("UILabs", "UILabs_DEV", "UILabs_CANARY"). Pick one:
    local api = shared.UILabs.UILabs
  Each entry carries `id`, `variant`, `version` and `api_version`.
  Previews and stories are plain numbers. Return values are plain tables unless noted, so
  `HttpService:JSONEncode` works on them. Errors are raised as Luau errors.

Stories
  api.storybooks() -> { { name, module } }
  api.stories()    -> { { id, name, path, module, storybook } }
    `path` is the explorer path ("Storybook/folder/story"), `module` the ModuleScript full name
  api.module(story) -> ModuleScript
    `story` everywhere is a node id, an explorer path, a module full name, a unique story
    name / path suffix, or the ModuleScript itself

Previews (mounted stories, each one a tab)
  api.mount(story, opts?) -> preview id, status
    opts: { auto_reload = true, select = false, wait = true, timeout = 10 }
    The same story can be mounted several times, each mount has its own environment.
  api.unmount(preview) / api.unmount_all()
  api.select(preview)                      activates the tab
  api.previews() -> { status }             ordered like the tabs
  api.status(preview) -> status
    { id, state = "loading" | "mounted" | "error", story, module, story_type, error,
      selected, auto_reload, holder, holders, scale, order, generation, root_path }
    `generation` increases every time the story is (re)loaded, mounted or errored, `root_path`
    is the full name of the frame the story rendered into.
  api.wait(preview, opts?) -> status
    opts: { timeout = 10, after = generation }
    Yields until the preview is mounted or errored. With `after`, waits for a load newer than
    that generation: read `status(p).generation`, change the source, then `wait(p, { after = g })`.
  api.root(preview) -> Frame?              the live story frame, inspect it with instance tools
  api.auto_reload(preview, enabled)        a frozen preview keeps its old code (and old copies of
                                           every module it required) until `reload` is called
  api.reload(preview, opts?) -> status     forces a reload, waits like `wait` unless wait = false
  api.zoom(preview, scale) / api.reset_view(preview)
    the zoom and the position belong to the editor view, a story shown in the viewport or in
    a widget is drawn there at its own size
  api.holder(preview, holder?, shown?)     opens or closes one of the places the story is
                                           shown in: "viewport" (a ScreenGui under CoreGui,
                                           drawn over the Studio viewport), "widget" (its own
                                           dock widget) or "editor" (the app, which closes the
                                           other two). `shown` defaults to true. Several can
                                           be open at once: the story goes into the first of
                                           viewport, widget, editor and the others stay open
                                           and empty. It is only re-parented, so it keeps
                                           running with its state and controls. Returns the
                                           one holding the story, which is also `status.holder`
                                           (`status.holders` says which ones are open).

Hot reload
  Editing a story module's Source (Rojo sync, script edits) reloads every preview of it that
  has auto reload on. Before / after comparisons: mount the story twice, freeze one with
  `auto_reload(p, false)`, change the code, compare both roots or capture them side by side.

Controls
  api.controls(preview) -> { [name] = { type, value, default, min, max, step, list }
                           | { group = true, controls = { ... } } }
  api.set_control(preview, "name" | "group.name", value)
  api.reset_controls(preview)

Running code inside a story
  api.run(preview, source, ...) -> ...
    Compiles `source` and runs it inside the preview's hot reload environment: the story's
    `require`, `script`, `_G` and `shared`, plus these globals: `preview` (id), `root` (Frame),
    `module`, `controls` (current values) and `uilabs` (this api). Extra arguments arrive as
    `...`. Yielding is allowed, returned values come back.

Screenshots
  The Studio MCP `screen_capture` tool only sees the 3D viewport, which also draws StarterGui
  in edit mode (keep "Show StarterGui in edit mode" enabled in Studio settings).
  api.capture(previews?, opts?) -> { path, rects, viewport, scale, ends_at }
    opts: { columns, size = Vector2, gap = 8, background = Color3, timeout = 30 }
    Clones the given previews (default: every mounted one) into a non-archivable ScreenGui
    under StarterGui, laid out in a grid that is scaled to fit the viewport. `rects` gives the
    viewport pixel rectangle of each preview. Then call `screen_capture`, then `capture_end`.
    The session ends by itself after `timeout` seconds.
  api.capture_end() -> boolean
]]
