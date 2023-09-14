import Roact from "@rbxts/roact";
import SlideDrag from "UI/UIUtils/Draggers/SlideDrag";

export = function (target: ScreenGui) {
	const NewSlideDrag = (
		<SlideDrag
			SlideDir={"X"}
			PercentApply={(number) => {
				print(number);
			}}
			UnitType="Pixel"
			DetectProps={{
				AnchorPoint: new Vector2(0.5, 0.5),
				Position: UDim2.fromScale(0.5, 0.5),
				Size: UDim2.fromOffset(300, 30),
				BackgroundTransparency: 0.5,
			}}
		></SlideDrag>
	);
	const Handler = Roact.mount(NewSlideDrag, target, "SlideDrag");
	return function () {
		Roact.unmount(Handler);
	};
};
