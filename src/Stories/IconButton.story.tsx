import Roact from "@rbxts/roact";
import Themes from "Plugin/Themes";
import ThemeContext from "UI/Contexts/ThemeContext";
import IconButton from "UI/UIUtils/IconButton";

print("Sup");

function Test(target: ScreenGui) {
	const NewStoryTool = (
		<ThemeContext.Provider value={{ Theme: Themes.Dark }}>
			<IconButton
				ButtonName="IconButton"
				Icon={{
					RectOffset: new Vector2(0, 0),
					RectSize: new Vector2(64, 64),
				}}
				Position={UDim2.fromScale(0.5, 0.5)}
				CornerRadius={new UDim(0.2, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromOffset(100, 100)}
				OnClick={() => {
					print("Clicked");
				}}
			></IconButton>
		</ThemeContext.Provider>
	);
	const Handler = Roact.mount(NewStoryTool, target);
	return function () {
		Roact.unmount(Handler);
	};
}

export = [110, 70];
