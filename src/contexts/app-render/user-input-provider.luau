local signal = require "@pkg/signal"
local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local videx = require "@utils/vide/videx"
local USER_INPUT_CONTEXT = require "./user-input-context"

type Modifiers = USER_INPUT_CONTEXT.Modifiers
type ModifierName = "ctrl" | "shift" | "alt"

local MODIFIER_KEYCODES: { [Enum.KeyCode]: ModifierName } = {
	[Enum.KeyCode.LeftControl] = "ctrl",
	[Enum.KeyCode.RightControl] = "ctrl",
	[Enum.KeyCode.LeftShift] = "shift",
	[Enum.KeyCode.RightShift] = "shift",
	[Enum.KeyCode.LeftAlt] = "alt",
	[Enum.KeyCode.RightAlt] = "alt",
}

local MODIFIER_KEYS: { [ModifierName]: Enum.ModifierKey } = {
	ctrl = Enum.ModifierKey.Ctrl,
	shift = Enum.ModifierKey.Shift,
	alt = Enum.ModifierKey.Alt,
}

local MOUSE_INPUTS = {
	[Enum.UserInputType.MouseMovement] = true,
	[Enum.UserInputType.MouseWheel] = true,
	[Enum.UserInputType.MouseButton1] = true,
	[Enum.UserInputType.MouseButton2] = true,
	[Enum.UserInputType.MouseButton3] = true,
}

--[[
	Renders the app under a listener frame that covers it, and shares the inputs it receives.

	UserInputService does not see inputs inside a plugin widget, a GuiObject does while the mouse
	is over it. The listener is not Active and sits on top of everything, so it sees every input
	of the app without taking it away from anything below.

	Modifier keys follow their key presses. A key released while the mouse is outside the widget
	never reports its release, so every mouse input also syncs them with the modifiers it carries,
	which corrects a stale key as soon as the mouse comes back.
]]
local function user_input_provider(props: ProviderChildren)
	local listener = vide.source(nil :: Frame?)
	local mouse_position = vide.source(Vector2.zero)
	local modifiers: Modifiers = {
		ctrl = vide.source(false),
		shift = vide.source(false),
		alt = vide.source(false),
	}

	local input_began = signal.new() :: signal.Signal<InputObject>
	local input_changed = signal.new() :: signal.Signal<InputObject>
	local input_ended = signal.new() :: signal.Signal<InputObject>

	vide.cleanup(function()
		input_began:Destroy()
		input_changed:Destroy()
		input_ended:Destroy()
	end)

	--- updates the modifiers before the signals fire, so listeners read the current ones
	local function update_modifiers(input: InputObject, began: boolean)
		local modifier = MODIFIER_KEYCODES[input.KeyCode]
		if modifier then
			modifiers[modifier](began)
		elseif MOUSE_INPUTS[input.UserInputType] then
			for name, key in MODIFIER_KEYS do
				modifiers[name](input:IsModifierKeyDown(key))
			end
		end
	end

	local function on_input_began(input: InputObject)
		update_modifiers(input, true)
		input_began:Fire(input)
	end

	local function on_input_changed(input: InputObject)
		if input.UserInputType == Enum.UserInputType.MouseMovement then
			mouse_position(Vector2.new(input.Position.X, input.Position.Y))
		end
		update_modifiers(input, true)
		input_changed:Fire(input)
	end

	local function on_input_ended(input: InputObject)
		update_modifiers(input, false)
		input_ended:Fire(input)
	end

	local context: USER_INPUT_CONTEXT.UserInput = {
		listener = listener,
		mouse_position = mouse_position,
		modifiers = modifiers,
		input_began = input_began,
		input_changed = input_changed,
		input_ended = input_ended,
	}

	return USER_INPUT_CONTEXT(context, function()
		return div {
			Name = "app",

			div {
				Name = "input_listener",
				ZIndex = 2,
				vide.action(function(frame: Frame)
					listener(frame)
					videx.connect(frame.InputBegan, on_input_began)
					videx.connect(frame.InputChanged, on_input_changed)
					videx.connect(frame.InputEnded, on_input_ended)
				end),
			},
			props.children(),
		}
	end)
end

return user_input_provider
