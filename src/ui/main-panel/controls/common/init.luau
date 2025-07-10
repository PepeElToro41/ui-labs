export type ControlProps<T, V> = {
	ControlName: string,
	Control: T,
	Order: number?,

	Value: Reactive<V>,
	ResetControl: () -> (),
	Apply: (val: V) -> any,
}

return nil
