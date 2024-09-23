import React from "@rbxts/react";
import Functional from "./Functional";
import RoactLib from "./RoactReact/RoactLib";
import ReactLib from "./RoactReact/ReactLib";
import Generic from "./Generic";
import FusionLib from "./FusionLib";
import { Signal } from "@rbxts/lemon-signal";
import IrisLib from "./IrisLib";
import VideLib from "./VideLib";
import { RecoverControlsData } from "..";

export interface MounterProps<T extends MountType> {
	Entry: PreviewEntry;
	Result: MountResults[T];
	MountFrame: Frame;
	UnmountSignal: Signal;
	RecoverControlsData?: RecoverControlsData;
	SetRecoverControlsData: (data?: RecoverControlsData) => void;
}

export type Mounter<T extends MountType> = React.FunctionComponent<MounterProps<T>>;

const MountingMap: { [K in MountType]: Mounter<K> } = {
	Functional: Functional,
	RoactLib: RoactLib,
	ReactLib: ReactLib,
	FusionLib: FusionLib,
	IrisLib: IrisLib,
	VideLib: VideLib,
	Generic: Generic,
};
export default MountingMap;
