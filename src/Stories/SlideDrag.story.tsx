import Roact from "@rbxts/roact";
import SlideDrag from "UI/UIUtils/SlideDrag";

export = function (target: ScreenGui) {
	const NewSlideDrag = (
		<SlideDrag
			DetectProps={{
				BackgroundTransparency: 0,
				Size: UDim2.fromOffset(100, 5),
				Position: UDim2.fromScale(0.5, 0.5),
				AnchorPoint: new Vector2(0.5, 0.5),
			}}
			SlideDir="X"
			PercentApply={(percent) => {
				print(percent);
			}}
		></SlideDrag>
	);
	const Handler = Roact.mount(NewSlideDrag, target, "SlideDrag");
	return function () {
		Roact.unmount(Handler);
	};
};
