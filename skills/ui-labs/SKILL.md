---
name: ui-labs
description: Drive the UI Labs storybook plugin in Roblox Studio through the Roblox Studio MCP to mount stories, hot reload them, tweak controls, run code inside a story, compare before/after and take screenshots. Use when building or checking Roblox UI in a project that has UI Labs stories (.story modules).
---

# UI Labs

UI Labs mounts `.story` modules in edit mode, hot reloads them when their source changes and
sandboxes each mount. Its automation api lives in Studio as a Luau table that you call through
the Roblox Studio MCP `execute_luau` tool, always with `datamodel_type = "Edit"`. Never start
play mode for this.

## Connect

Every running UI Labs instance registers in `shared.UILabs`, keyed by widget id (`UILabs`,
`UILabs_DEV`, `UILabs_CANARY`). The plugin window must be open in Studio, otherwise the
table is empty.

```lua
local api = shared.UILabs and shared.UILabs.UILabs
if not api then
	local ids = {}
	for id in pairs(shared.UILabs or {}) do table.insert(ids, id) end
	return "UI Labs is not open, registered: " .. table.concat(ids, ", ")
end
return api.help()
```

`api.help()` returns the full reference. Results are plain tables, return them through
`HttpService:JSONEncode` to read them. Errors are raised as Luau errors with a `[UI Labs api]`
prefix. Yielding (`task.wait`) is allowed, `wait`, `mount` and `reload` yield until done.

## Stories and previews

- `api.stories()` lists `{ id, name, path, module, storybook }`. `path` is the explorer path
  (`Storybook/folder/story`). Any function taking a story accepts the id, that path, the
  module full name, a unique name, or the ModuleScript.
- `api.mount(story, opts?)` returns `preview_id, status`. opts: `auto_reload` (true),
  `select` (false), `wait` (true), `timeout` (10). Mounting the same story twice gives two
  independent previews.
- `api.status(preview)` returns `{ state, story, module, story_type, error, selected,
  auto_reload, holder, holders, scale, order, generation, root_path }` with `state` one of `loading`,
  `mounted`, `error`.
- `api.previews()`, `api.select(preview)`, `api.unmount(preview)`, `api.unmount_all()`.
- `api.holder(preview, holder?, shown?)` opens or closes one of the places a story is shown
  in: `viewport` (a ScreenGui under CoreGui, drawn over the Studio viewport), `widget` (its
  own dock widget) or `editor` (the plugin window, which closes the other two). Several can
  be open at once and the story goes into the first of viewport, widget, editor, leaving the
  others open and empty. It is only re-parented, so it keeps running with its state and
  controls. CoreGui and dock widgets are invisible to `screen_capture`, so use `api.capture`
  for screenshots, not the viewport holder.

Unmount what you mounted when you are done, previews are tabs the user sees.

## Looking at a mounted story

`status.root_path` is the full name of the frame the story rendered into. Use the MCP
`inspect_instance` and `search_game_tree` tools on that path to read sizes, positions, text
and colors. `api.root(preview)` returns the Frame itself when you need it in Luau.

## Changing code and waiting for the reload

Edit the story or any module it requires the way the project does it (files synced by Rojo,
or the MCP `multi_edit` tool on the script). Every preview with auto reload on remounts by
itself. To know when the new code is up, use generations:

```lua
local api = shared.UILabs.UILabs
local id = ...                     -- preview id
local g = api.status(id).generation
-- change the source here (outside this call), then:
local status = api.wait(id, { after = g, timeout = 10 })
return HttpService:JSONEncode(status)   -- state "mounted" or "error" with the message
```

`generation` increases on every load, mounted or errored. `status.timed_out` is set when the
wait gave up. `api.reload(preview)` forces a reload and waits the same way.

## Before / after

Freeze one preview, keep another live, change the code, compare both:

```lua
local before = api.mount("Storybook/button", { auto_reload = false })
local after = api.mount("Storybook/button")
```

The frozen preview keeps its old code, and old copies of every module it required, until
`api.reload(before)` or `api.auto_reload(before, true)`. Compare the two roots with instance
tools, or capture both in one screenshot.

## Controls

- `api.controls(preview)` returns the tree: `{ name = { type, value, default, min, max,
  step, list } }`, groups as `{ group = true, controls = { ... } }`.
- `api.set_control(preview, "name" | "group.name", value)` type checks plain values.
- `api.reset_controls(preview)`.

Color3 values come out as null through JSONEncode, read them with `run` if needed.

## Running code inside a story

`api.run(preview, source, ...)` compiles `source` and runs it in the preview's sandbox: the
story's `require`, `script`, `_G` and `shared`, plus `preview`, `root` (Frame), `module`,
`controls` (current values) and `uilabs` (the api). Extra arguments arrive as `...`, returned
values come back.

```lua
return api.run(id, [[
	local button = root:FindFirstChild("Button", true)
	return button and button.AbsoluteSize.X, button and button.Text
]])
```

## Screenshots

The MCP `screen_capture` tool only shows the 3D viewport, never the plugin window. UI Labs
can render previews into the viewport for a moment:

1. `local s = api.capture({ id1, id2 }, { columns = 2 })` (no list = every mounted preview).
   Returns `rects` with the viewport pixel rectangle of each preview, `viewport` size and
   `scale`. The grid is scaled to fit the viewport.
2. Call `screen_capture`.
3. `api.capture_end()`. The session also ends by itself after 30 seconds.

The capture is a ScreenGui under StarterGui that is never saved with the place. It needs the
Studio setting "Show StarterGui in edit mode", which is on by default. If the screenshot shows
only the 3D scene, that setting is off. Do not edit or delete the capture gui yourself.

## Pitfalls

- A story that errors on load has `state = "error"` and `error` with the message, and no root.
  Fix the source and `wait` with `after` again.
- Entity ids are only valid while the preview is mounted. Re-read `api.previews()` if a call
  says a preview does not exist.
- Only the running variant registers, `shared.UILabs` can hold several when multiple copies of the plugin are running. Pick the one the user is using, or ask.
- Stories can also be mounted by the user from the explorer. `api.previews()` shows those too.
