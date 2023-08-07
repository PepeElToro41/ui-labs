import { Producer, ProducerMiddleware } from "@rbxts/reflex";

export function CreateMiddleware<State, Actions>(middleware: ProducerMiddleware<State, Actions>) {
	return middleware;
}

export const forwardDispatch: ReturnType<ProducerMiddleware> = (nextAction, name) => {
	return (...args) => nextAction(...args);
};
