import Roact, { useCallback, useEffect, useMemo, useState } from "@rbxts/roact";
import LifetimeComponent from "UI/Holders/LifetimeChildren/LifetimeComponent";
import { CreateHolder } from ".";
import { LifetimeController } from "UI/Holders/LifetimeChildren/LifetimeController";

interface HolderParenterProps {
	MountFrame: Frame;
	Entry: PreviewEntry;
	MountType?: MountType;
}

//This component parents your story, Im using "LifetimeComponent" to delay the components unmounting and avoid to Roact destroying it
function HolderParenter(props: HolderParenterProps) {
	const entry = props.Entry;

	const holdersMount = useMemo(() => {
		const holders = new Map<HolderType, Roact.Element>();

		const mainHolder: HolderType = entry.OnWidget ? "Widget" : "Editor";
		holders.set(mainHolder, CreateHolder(mainHolder, entry, props.MountType, props.MountFrame));

		if (entry.OnViewport) {
			holders.set("Viewport", CreateHolder("Viewport", entry, props.MountType, props.MountFrame));
		}
		return holders;
	}, [entry]);

	return <LifetimeComponent>{holdersMount}</LifetimeComponent>;
}

export default HolderParenter;
