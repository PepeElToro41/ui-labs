import Vide from "@rbxts/vide";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import Frame from "UI/Styles/Frame";
import Image from "UI/Styles/Image";

function MainPanel() {
	const theme = useTheme();

	return (
		<Frame BackgroundColor3={theme("Background1")}>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<Image
				Name={"Pattern"}
				Image={Images.Pattern}
				ScaleType={Enum.ScaleType.Tile}
				TileSize={UDim2.fromOffset(80, 80)}
				Position={UDim2.fromOffset(10, 10)}
				Size={new UDim2(1, -10, 1, -10)}
				ImageTransparency={0.87}
			/>
		</Frame>
	);
}

export default MainPanel;
