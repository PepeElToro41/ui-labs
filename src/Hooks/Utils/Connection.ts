import { useEffect } from "@rbxts/roact";

//Types borrowed from LITTENSYS's hooks
type EventLike<T extends Callback = Callback> = { Connect(callback: T): ConnectionLike };
type ConnectionLike = { Disconnect(): void };

export function useConnection<T extends EventLike>(event: T | undefined, listener: T extends EventLike<infer U> ? U : never, deps?: any[]) {
	const useDeps = deps ?? [];
	useDeps.push(event, listener);
	useEffect(() => {
		if (!event) return;
		const connection = event.Connect(listener);
		return () => connection.Disconnect();
	}, useDeps);
}
