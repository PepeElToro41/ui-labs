local Vide = require "@pkg/vide"
local Signal = require "@pkg/signal"

local Div = require "@styles/div"

type Source<T> = Vide.Source<T>
type Context<T> = Vide.Context<T>
type Signal<T...> = Signal.Signal<T...>

type UserInputContext = {
	Listener: Source<Frame>,
	MousePosition: Source<Vector2>,
	MouseAsbolutePosition: Source<Vector2>,
	InputBegan: Signal<InputObject>,
	InputChanged: Signal<InputObject>,
	InputEnded: Signal<InputObject>,
}

local source = Vide.source
local action = Vide.action
local derive = Vide.derive
local effect = Vide.effect
local connect = Vide.connect

local UserInputContext: Context<UserInputContext> = Vide.create_context()

function UserInputProvider(props: ProviderChildren)
	local mousePosition = source(Vector2.zero)
	local inputBegan = Signal.new()
	local inputChanged = Signal.new()
	local inputEnded = Signal.new()
	local listener: Source<Frame> = source()

	local mouseRelative = derive(function()
		local listener = listener()
		if not listener then return mousePosition() end
		return mousePosition() - listener.AbsolutePosition
	end)

	local context: UserInputContext = {
		Listener = listener,
		MousePosition = mouseRelative,
		MouseAsbolutePosition = mousePosition,
		InputBegan = inputBegan,
		InputChanged = inputChanged,
		InputEnded = inputEnded,
	}

	-- Connecting the listener
	effect(function()
		local listener = listener()
		if not listener then return end

		connect(listener.InputBegan, function(inputObject: InputObject)
			inputBegan:Fire(inputObject)
		end)
		connect(listener.InputChanged, function(inputObject: InputObject)
			if inputObject.UserInputType == Enum.UserInputType.MouseMovement then
				mousePosition(Vector2.new(inputObject.Position.X, inputObject.Position.Y))
			end

			inputChanged:Fire(inputObject)
		end)
		connect(listener.InputEnded, function(inputObject: InputObject)
			inputEnded:Fire(inputObject)
		end)
	end)

	return UserInputContext.provide(context, function()
		return Div {
			Name = "App",

			Div {
				Name = "InputListener",
				ZIndex = 2,

				action(listener),
			},
			props.children(),
		}
	end)
end

function useInputListener()
	local context = UserInputContext.consume()
	return context.Listener
end

function useMousePosition(absolute: boolean?)
	local context = UserInputContext.consume()

	if absolute then
		return context.MouseAsbolutePosition
	else
		return context.MousePosition
	end
end

function useInputBegan()
	local context = UserInputContext.consume()
	return context.InputBegan
end

function useInputChanged()
	local context = UserInputContext.consume()
	return context.InputChanged
end

function useInputEnded()
	local context = UserInputContext.consume()
	return context.InputEnded
end

function useInputContext()
	return UserInputContext.consume()
end

return table.freeze {
	UserInputProvider = UserInputProvider,

	useInputListener = useInputListener,
	useMousePosition = useMousePosition,
	useInputBegan = useInputBegan,
	useInputChanged = useInputChanged,
	useInputEnded = useInputEnded,
	useInputContext = useInputContext,
}
