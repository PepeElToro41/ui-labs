local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

local pebble = require(script.Parent.Parent.Parent.Parent.Parent.pebble)
local vide = require(script.Parent.Parent.Parent.Parent.Parent.vide)
local remotes = require(script.Parent.Parent.Parent.Parent.modules.remotes)
local add_component = require(script.Parent.add_component)
local editor = require(script.Parent.editor)

local create = vide.create
local indexes = vide.indexes
local source = vide.source
local show = vide.show

type SystemId = number

type props = {
	host: Player | "server",
	vm: number,
	id: number,
	entity: number,
	inspect_id: number,

	components: vide.Source<{[string]: string}>,
	changes: vide.Source<{[string]: string}>,
	live_updates: vide.Source<boolean>,
	apply_changes: vide.Source<boolean>,

	destroy: () -> (),
	delete: () -> ()
}

local mouse_location = source(Vector2.zero)

RunService.PreRender:Connect(function()
	mouse_location(UserInputService:GetMouseLocation())
end)

return function(props: props)
	local outgoing = {
		host = props.host,
		to_vm = props.vm,
	}

	local live_updates = props.live_updates
	local changes = props.changes

	local text = source("")
	local adding = source(false)
	local editing = source(false :: false | string)

	local function components()
		local components = {}

		for key, value in props.components() do
			if value == "tag" then continue end
			components[key] = value
		end

		return components
	end

	local function tags()
		local tags = {}

		for key, value in props.components() do
			if value ~= "tag" then continue end
			tags[key] = value
		end

		return tags
	end
	
	local function is_removed(value: string)
		return value == "nil"
	end

	local function edit_component(component: string)
		remotes.get_component:fire(outgoing, props.inspect_id, component)
		editing(component)
		
		text("waiting...")
	end

	vide.cleanup(remotes.return_component:connect(function(from, inspect, component, value)
		if props.host ~= from.host then return end
		if props.inspect_id ~= inspect then return end
		
		local current_value = props.changes()[component]

		if current_value then
			text(current_value)
		else
			text(value)
		end
		
	end))

	return pebble.widget {
		title = `Entity #{props.entity}`,
		subtitle = `host: {props.host} vm: {props.vm} id: {props.id}`,

		min_size = Vector2.new(300, 300),

		bind_to_close = props.destroy,

		create "Frame" {
			Size = UDim2.fromScale(1, 1),
			BackgroundTransparency = 1,
			
			create "UIListLayout" {
				VerticalFlex = Enum.UIFlexAlignment.SpaceEvenly,
				Padding = UDim.new(0, 8)
			},

			editor {
				components = props.components,
				editing = editing,
				text = text,
				changes = changes
			},
			
			add_component {
				editing = edit_component,
				text = text,
				changes = changes,
				adding = adding
			},

			pebble.row {

				justifycontent = Enum.UIFlexAlignment.Fill,

				pebble.button {
					text = "Live Updates",
					activated = function()
						live_updates(not live_updates())
					end,

					create "UIListLayout" {
						FillDirection = Enum.FillDirection.Horizontal,
						VerticalAlignment = Enum.VerticalAlignment.Center,
						HorizontalFlex = Enum.UIFlexAlignment.SpaceBetween,
						Padding = UDim.new(0, 4)
					},

					pebble.checkbox {
						size = UDim2.fromOffset(16, 16),
						layoutorder = -1,
						checked = live_updates,

						create "UIFlexItem" {
							FlexMode = Enum.UIFlexMode.None,
						}
					}
					
				},

				pebble.button {
					size = UDim2.fromOffset(130, 30),
					text = function()
						local total = 0

						for _, change in changes() do
							total += 1
						end

						return `Apply {total} Edits`
					end,
					disabled = function()
						return next(changes()) == nil
					end,
					activated = function()
						props.apply_changes(true)
					end
				},

				pebble.button {
					create "UIFlexItem" {
						ItemLineAlignment = Enum.ItemLineAlignment.End,
					},
					size = UDim2.fromOffset(130, 30),

					text = "Cancel changes",
					disabled = function()
						return next(changes()) == nil
					end,
					activated = function()
						changes({})
					end
				}

			},

			create "ScrollingFrame" {
				Size = UDim2.fromScale(1, 0),
				CanvasSize = UDim2.new(),
				AutomaticCanvasSize = Enum.AutomaticSize.Y,

				BackgroundColor3 = pebble.theme.bg[-1],

				ScrollBarThickness = 6,
				VerticalScrollBarInset = Enum.ScrollBarInset.Always,

				create "UIFlexItem" {
					FlexMode = Enum.UIFlexMode.Fill
				},
				
				create "UIListLayout" {
					Padding = UDim.new(0, 4)
				},

				pebble.typography {text = "Components"},

				pebble.container {
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					create "UIListLayout" {
						SortOrder = Enum.SortOrder.Name,
					},

					indexes(components, function(value, key)
						return pebble.button {
							{ Name = if not string.match(key, "^%a") then "zzzz" .. key else key },
							size = UDim2.new(1, 0, 0, 32),
							automaticsize = Enum.AutomaticSize.Y,
					
							text = "",
					
							corner = false,
	
							activated = function()
								edit_component(key)
							end,
					
							create "UIListLayout" {
								FillDirection = Enum.FillDirection.Horizontal,
								HorizontalFlex = Enum.UIFlexAlignment.SpaceEvenly,
								VerticalAlignment = Enum.VerticalAlignment.Center,
								Padding = UDim.new(0, 8)
							},
							
							pebble.padding {
								y = UDim.new(0, 4)
							},
					
							pebble.typography {
								size = UDim2.new(0, 100, 0, 18),
								automaticsize = Enum.AutomaticSize.Y,
								text = key,
								code = true,
								wrapped = true,
								truncate = Enum.TextTruncate.SplitWord,
								xalignment = Enum.TextXAlignment.Left,
							},
					
							pebble.typography {
								size = UDim2.fromOffset(0, 18),
								automaticsize = Enum.AutomaticSize.Y,
					
								yalignment = Enum.TextYAlignment.Top,
								xalignment = Enum.TextXAlignment.Left,
								text = value,
								wrapped = true,
								truncate = Enum.TextTruncate.AtEnd,
								code = true,
					
								create "UIFlexItem" {
									FlexMode = Enum.UIFlexMode.Fill
								},
	
							},
	
							show(function()
								return props.changes()[key] ~= nil
							end, function()
								return pebble.typography {
									text = function()
										local old = value()
										local change = props.changes()[key]
	
										return if old == nil then "(added)"
											elseif is_removed(change) then "(removed)"
											else "(changed)"
									end,
									disabled = true,
									textsize = 14,
								}
							end),

							create "UISizeConstraint" {
								MaxSize = Vector2.new(math.huge, 300)
							}
						}
					end),
				},

				pebble.typography {text = "Tags"},

				pebble.container {
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					create "UIListLayout" {
						SortOrder = Enum.SortOrder.Name,
					},

					indexes(tags, function(value, key)
						local function did_change()
							return changes()[key] ~= nil
						end

						return pebble.button {
							{ Name = if not string.match(key, "^%a") then "zzzz" .. key else key },
							size = UDim2.new(1, 0, 0, 24),
					
							text = "",
					
							corner = false,
	
							activated = function()
								if changes()[key] == "tag" then
									changes()[key] = nil
									props.components()[key] = nil

									-- notify about the change
									changes(changes())
									props.components(props.components())
								elseif changes()[key] then
									changes()[key] = nil
									
									-- notify about the change
									changes(changes())
								else
									changes()[key] = "nil"
									
									-- notify about the change
									changes(changes())
								end
							end,
					
							create "UIListLayout" {
								FillDirection = Enum.FillDirection.Horizontal,
								HorizontalFlex = Enum.UIFlexAlignment.SpaceEvenly,
								VerticalAlignment = Enum.VerticalAlignment.Center,
								Padding = UDim.new(0, 8)
							},
							
							pebble.padding {
								y = UDim.new(0, 4)
							},
					
							pebble.typography {
								size = UDim2.fromScale(0, 1),
								text = key,
								code = true,
								wrapped = true,
								truncate = Enum.TextTruncate.SplitWord,
								xalignment = Enum.TextXAlignment.Left,

								create "UIFlexItem" {
									FlexMode = Enum.UIFlexMode.Fill
								}
							},
	
							show(did_change, function()
								return pebble.typography {
									text = function()
										local old = value()
										local change = changes()[key]
	
										return if old == nil then "(added)"
											elseif is_removed(change) then "(removed)"
											else "(changed)"
									end,
									disabled = true,
									textsize = 14,
								}
							end)
						}
					end),
				}

			},

			pebble.row {

				justifycontent = Enum.UIFlexAlignment.Fill,

				pebble.button {
					size = UDim2.fromOffset(100, 30),
					text = "Delete Id",

					activated = props.delete
				},
				
				pebble.button {
					size = UDim2.fromOffset(200, 30),
					text = "Add Component",

					activated = function()
						adding(true)
					end
				},
				

			}

		}

	}

end