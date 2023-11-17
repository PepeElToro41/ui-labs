import Roact from "@rbxts/roact";
import Functional from "./Functional";
import RoactLib from "./RoactReact/RoactLib";
import ReactLib from "./RoactReact/ReactLib";

type Mounter<T extends MountType> = (result: MountResults[T], target: Frame) => Roact.Element;

function MountFunctional(result: MountResults["Functional"], target: Frame) {
	return <Functional Result={result} MountFrame={target} />;
}
function MountRoact(result: MountResults["RoactLib"], target: Frame) {
	return <RoactLib Result={result} MountFrame={target} />;
}
function MountReact(result: MountResults["ReactLib"], target: Frame) {
	return <ReactLib Result={result} MountFrame={target} />;
}
function MountFusion() {}

const MountingMap: { [K in MountType]: Mounter<K> } = {
	Functional: MountFunctional,
	ReactLib: MountReact,
	RoactLib: MountRoact,
};
export = MountingMap;
