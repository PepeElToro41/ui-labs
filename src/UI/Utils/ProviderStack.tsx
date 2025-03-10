import React, { PropsWithChildren, ReactElement } from "@rbxts/react";
import Sift from "@rbxts/sift";

type ContextProvider = (props: React.PropsWithChildren<{}>) => React.Element;

interface ProviderStackProps extends PropsWithChildren {
	Providers: ContextProvider[];
}

function ProviderStack(props: ProviderStackProps) {
	const stack = Sift.Array.reverse(props.Providers);

	const constructed = stack.reduce((nested, Provider) => {
		return <Provider>{nested}</Provider>;
	}, props.children);
	return constructed as ReactElement;
}

export default ProviderStack;
