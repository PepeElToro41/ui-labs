import Roact from "@rbxts/roact";
import DeltaDrag from "UI/UIUtils/Draggers/DeltaDrag";

export = function (target: ScreenGui) {
	const NewSlideDrag = (
		<DeltaDrag
			SlideDir={"X"}
			DeltaApply={(number) => {
				print(number);
			}}
			DetectProps={{
				AnchorPoint: new Vector2(0.5, 0.5),
				Position: UDim2.fromScale(0.5, 0.5),
				Size: UDim2.fromOffset(300, 30),
				BackgroundTransparency: 0.5,
			}}
		></DeltaDrag>
	);
	const Handler = Roact.mount(NewSlideDrag, target, "SlideDrag");
	return function () {
		Roact.unmount(Handler);
	};
};
