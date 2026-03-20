import { Connection, Signal } from "@rbxts/lemon-signal";
import { Binding } from "@rbxts/react";
import { InputSignals } from "@rbxts/ui-labs";

type InputSignal = Signal<[input: InputObject, gameProcessed: boolean]>;

export default class UserInputMock {
	readonly Mouse: Binding<Vector2>;
	readonly InputSignals: InputSignals;
	readonly InputBegan: InputSignal = new Signal();
	readonly InputChanged: InputSignal = new Signal();
	readonly InputEnded: InputSignal = new Signal();
	readonly MouseMoved: Signal<[Vector2]> = new Signal();

	readonly TouchTapInWorld = new Signal();

	Connections: (Connection | RBXScriptConnection)[] = [];
	KeyDowns = new Set<Enum.KeyCode | Enum.UserInputType>();

	constructor(inputSignals: InputSignals, mouse: Binding<Vector2>) {
		this.Mouse = mouse;
		this.InputSignals = inputSignals;
	}
	Init() {
		this.Connections.push(
			this.InputSignals.InputBegan.Connect((input, processed) => {
				if (input.KeyCode !== Enum.KeyCode.Unknown) {
					this.KeyDowns.add(input.KeyCode);
				}
				if (input.UserInputType !== Enum.UserInputType.Keyboard) {
					this.KeyDowns.add(input.UserInputType);
				}
				this.InputBegan.Fire(input, true);
			}),
			this.InputSignals.InputChanged.Connect((...args) => {
				this.InputChanged.Fire(...args);
			}),
			this.InputSignals.InputEnded.Connect((input, processed) => {
				if (input.KeyCode !== Enum.KeyCode.Unknown) {
					this.KeyDowns.delete(input.KeyCode);
				}
				if (input.UserInputType !== Enum.UserInputType.Keyboard) {
					this.KeyDowns.delete(input.UserInputType);
				}

				this.InputEnded.Fire(input, true);
			}),
			this.InputSignals.MouseMoved.Connect((...args) => this.MouseMoved.Fire(...args))
		);
	}

	IsKeyDown(key: Enum.KeyCode) {
		return this.KeyDowns.has(key);
	}
	IsMouseButtonPressed(button: Enum.UserInputType) {
		return this.KeyDowns.has(button);
	}
	GetMouseLocation() {
		return this.InputSignals.GetMouseLocation();
	}

	Destroy() {
		this.KeyDowns.clear();
		this.InputBegan.Destroy();
		this.InputChanged.Destroy();
		this.InputEnded.Destroy();
		this.TouchTapInWorld.Destroy();

		this.Connections.forEach((connection) => connection.Disconnect());
	}
}
