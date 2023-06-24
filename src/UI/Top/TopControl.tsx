import Roact from "@rbxts/roact";
import ThemeContext from "UI/Contexts/ThemeContext";
import Themes from "Plugin/Themes";
import { useContext, useState, withHooks } from "@rbxts/roact-hooked";

interface TopControlProps {
	ControlName: string;
	ControlLabel: string;
	Dropdown: {};
	OnDropdownClicked?: (OptionName: string) => void;
}

function setProps(props: TopControlProps) {
	return props;
}

function TopControlCreate(setprops: TopControlProps) {
	const props = identity<Required<TopControlProps>>(setProps(setprops) as Required<TopControlProps>);
	const [isHovered, setHovered] = useState(false);
	const theme = useContext(ThemeContext).Theme;
	return (
		<textbutton
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={theme.TopControl}
			BackgroundTransparency={isHovered ? 0 : 1}
			BorderSizePixel={0}
			Size={new UDim2(0, 0, 1, 0)}
			Text={""}
			TextTransparency={1}
			AutoButtonColor={false}
			Active={true}
			Event={{
				MouseEnter: () => {
					setHovered(true);
				},
				MouseLeave: () => {
					setHovered(false);
				},
				MouseButton1Click: () => {},
			}}
		>
			<uipadding
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 10)}
				PaddingRight={new UDim(0, 10)}
				PaddingTop={new UDim(0, 5)}
			/>
			<textlabel
				AnchorPoint={new Vector2(0, 0.5)}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamMedium}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				Position={new UDim2(0, 0, 0.5, 0)}
				Size={new UDim2(0, 0, 1, 0)}
				Text={props.ControlLabel}
				TextColor3={theme.TextColor}
				TextSize={14}
				TextWrapped={true}
			/>
			<uicorner CornerRadius={new UDim(0, 6)} />
		</textbutton>
	);
}
const TopControl = withHooks(TopControlCreate);

export = TopControl;
