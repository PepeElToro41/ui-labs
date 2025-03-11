export type ControlProps<T, V> = {
	Control: T,
	Value: Reactive<V>,
	Apply: (val: V) -> any,
}

return nil
