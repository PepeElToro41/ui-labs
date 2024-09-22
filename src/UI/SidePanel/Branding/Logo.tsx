import Vide from "@rbxts/vide";
import { Images } from "Constants/Images";
import DropShadow from "UI/Elements/DropShadow";
import Div from "UI/Styles/Div";
import Image from "UI/Styles/Image";
import { Presets } from "UI/Utils/PropDriller";

interface LogoProps {}

function Logo(props: LogoProps) {
	return (
		<Div Name={"Logo"} Size={UDim2.fromOffset(28, 28)}>
			<Image
				Name={"LogoIcon"}
				ImageColor3={Color3.fromRGB(245, 179, 255)}
				{...Presets.Centered}
				Size={UDim2.fromOffset(24, 24)}
				Image={Images.Logo}
			/>
			<DropShadow Elevation={new Vector2(4, 4)} />
		</Div>
	);
}

export default Logo;
