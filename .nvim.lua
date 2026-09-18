-- Per-project Neovim config (loaded via `exrc`).
-- luau-lsp.nvim settings for this project, ported from .zed/settings.json.

-- Treat .lua files as luau in this project (except this file).
vim.filetype.add({
  extension = {
    lua = function(path)
      return path:match("%.nvim%.lua$") and "lua" or "luau"
    end,
  },
})

-- Plugin-level options (what Zed's "ext" section controlled)
require("luau-lsp").config({
  platform = { type = "roblox" },
  sourcemap = {
    enabled = true,
    autogenerate = true,
    -- Zed pointed at default.project.json, which does not exist here.
    -- scripts/dev.luau builds the sourcemap from serve.project.json.
    rojo_project_file = "serve.project.json",
    include_non_scripts = true,
    sourcemap_file = "sourcemap.json",
  },
  types = {
    roblox_security_level = "PluginSecurity",
    documentation_files = { ".zune/zune.d.json" },
  },
  fflags = {
    enable_by_default = false,
    enable_new_solver = false,
    sync = true,
    override = {},
  },
})

-- Raw luau-lsp server settings (what Zed's "luau-lsp" section controlled)
vim.lsp.config("luau-lsp", {
  settings = {
    ["luau-lsp"] = {
      ignoreGlobs = { "**/.pesde/**", "**/serve/**" },
      types = {
        -- Loaded after the Roblox globals, so files that reference Roblox
        -- types resolve. Order here is preserved.
        definitionFiles = {
          ".zune/zune.d.luau",
          "types/types.d.luau",
          "types/vide.d.luau",
          "types/nodes.d.luau",
          "types/services.d.luau",
        },
      },
      completion = {
        enabled = true,
        autocompleteEnd = true,
        addParentheses = false,
        fillCallArguments = false,
        imports = {
          enabled = true,
          suggestServices = true,
          suggestRequires = true,
          requireStyle = "Auto",
          stringRequires = { enabled = true },
          separateGroupsWithLine = true,
          ignoreGlobs = { "**/.pesde/**", "**/serve/**" },
        },
      },
    },
  },
})
