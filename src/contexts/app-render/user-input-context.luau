local signal = require "@pkg/signal"
local vide = require "@pkg/vide"

export type Modifiers = {
	ctrl: Source<boolean>,
	shift: Source<boolean>,
	alt: Source<boolean>,
}

export type UserInput = {
	--- frame on top of the whole app, every input the app receives goes through it
	listener: Source<Frame?>,
	--- as the inputs report it, in the same space as `AbsolutePosition`
	mouse_position: Source<Vector2>,
	--- modifier keys being held
	modifiers: Modifiers,

	input_began: signal.Signal<InputObject>,
	input_changed: signal.Signal<InputObject>,
	input_ended: signal.Signal<InputObject>,
}

local USER_INPUT_CONTEXT = vide.context() :: vide.Context<UserInput>
return USER_INPUT_CONTEXT
