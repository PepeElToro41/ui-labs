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

-- Project root (exrc can also be picked up from a subdirectory).
local root = vim.fs.dirname(vim.fs.find(".nvim.lua", { upward = true, path = vim.fn.getcwd() })[1])
local function rel(path)
  return vim.fs.joinpath(root, path)
end

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
    -- Global definition files. These must go here: the plugin turns them into
    -- `--definitions:@name=path` server args. The `luau-lsp.types.definitionFiles`
    -- server setting is NOT picked up from Neovim.
    definition_files = {
      zune = rel(".zune/zune.d.luau"),
      types = rel("types/types.d.luau"),
      vide = rel("types/vide.d.luau"),
      nodes = rel("types/nodes.d.luau"),
      services = rel("types/services.d.luau"),
    },
    documentation_files = { rel(".zune/zune.d.json") },
  },
  fflags = {
    enable_by_default = false,
    enable_new_solver = false,
    sync = true,
    override = {
      -- Roblox's synced flags turn this on, which rejects the `declare class`
      -- syntax used by .zune/zune.d.luau and makes the whole file fail to load.
      LuauDisallowExternClassInTypeDefinitions = false,
    },
  },
})

-- Raw luau-lsp server settings (what Zed's "luau-lsp" section controlled)
vim.lsp.config("luau-lsp", {
  settings = {
    ["luau-lsp"] = {
      ignoreGlobs = { "**/.pesde/**", "**/serve/**" },
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
