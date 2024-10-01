export type Derivable<T> = T | (() -> T)
export type Reactive<T> = () -> T

export type ProviderChildren = { children: () -> any }
export type Provider = (props: ProviderChildren) -> any
