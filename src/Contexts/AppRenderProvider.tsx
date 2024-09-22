import Vide, { ProviderChildren, Source, source } from "@rbxts/vide";
import Div from "UI/Styles/Div";

interface AppRenderContext {
	Overlay: Source<Frame>;
	Contents: Source<Frame>;
}

export const AppRenderContext = Vide.create_context({} as AppRenderContext);

function AppRenderProvider(props: ProviderChildren) {
	const overlay = source<Frame>(undefined!);
	const contents = source<Frame>(undefined!);

	//TODO: This separation is needed while I wait for contexts
	const context = {
		Overlay: overlay,
		Contents: contents,
	};

	return AppRenderContext.provide(context, () => (
		<Div Name="App">
			<Div Name="Overlay" action={overlay} ZIndex={2} />
			<Div Name="Contents" action={contents}>
				{props.children()}
			</Div>
		</Div>
	));
}

export function useOverlayHolder() {
	const context = AppRenderContext.consume();
	return context.Overlay;
}

export function useAppContents() {
	const context = AppRenderContext.consume();
	return context.Contents;
}

export default AppRenderProvider;
