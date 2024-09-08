import React from "@rbxts/react";
import Functional from "./Functional";
import RoactLib from "./RoactReact/RoactLib";
import ReactLib from "./RoactReact/ReactLib";
import Generic from "./Generic";
import FusionLib from "./FusionLib";
import { Signal } from "@rbxts/lemon-signal";

export interface MounterProps<T extends MountType> {
	Entry: PreviewEntry;
	Result: MountResults[T];
	MountFrame: Frame;
	UnmountSignal: Signal;
}

export type Mounter<T extends MountType> = React.FunctionComponent<MounterProps<T>>;

const MountingMap: { [K in MountType]: Mounter<K> } = {
	Functional: Functional,
	RoactLib: RoactLib,
	ReactLib: ReactLib,
	FusionLib: FusionLib,
	Generic: Generic,
};
export default MountingMap;
