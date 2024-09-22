import Sift from "@rbxts/sift";
import Vide, { PropsWithChildren } from "@rbxts/vide";

type ContextProvider = (props: PropsWithChildren) => Vide.Node;

interface ProviderStackProps extends PropsWithChildren {
	Providers: ContextProvider[];
}

function ProviderStack(props: ProviderStackProps) {
	const stack = Sift.Array.reverse(props.Providers);

	const constructed = stack.reduce((nested, Provider) => {
		return <Provider>{nested}</Provider>;
	}, props.children);

	return constructed;
}

export default ProviderStack;
