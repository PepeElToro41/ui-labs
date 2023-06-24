import Roact from "@rbxts/roact";
import { useContext, withHooks } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";
import Themes from "Plugin/Themes";
import ThemeContext from "UI/Contexts/ThemeContext";

interface SearchInputProps {
	Size: UDim2;
	Position: UDim2;
	LayoutOrder?: number;
	AnchorPoint?: Vector2;
	Placeholder?: string;
	OnSearchChanged: (text: string) => void;
}

function setProps(props: SearchInputProps) {
	return props;
}

function SearchInputCreate(setprops: SearchInputProps) {
	const props = identity<Required<SearchInputProps>>(setProps(setprops) as Required<SearchInputProps>);
	const theme = useContext(ThemeContext).Theme;
	return (
		<frame
			LayoutOrder={props.LayoutOrder ?? 1}
			Key="SearchFrame"
			BackgroundColor3={theme.SearchInput}
			AnchorPoint={props.AnchorPoint ?? new Vector2(0.5, 0)}
			Position={props.Position}
			Size={props.Size}
		>
			<uicorner />
			<imagelabel
				Key="MagnifyIcon"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Image={Configs.IconsSprite}
				ImageColor3={theme.IconsColor}
				ImageRectOffset={new Vector2(128, 0)}
				ImageRectSize={new Vector2(64, 64)}
				Position={new UDim2(0, 6, 0.5, 0)}
				Size={new UDim2(0, 19, 0, 19)}
			/>
			<textbox
				Key="Input"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamMedium}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				PlaceholderColor3={theme.SearchPlaceholder}
				PlaceholderText={props.Placeholder ?? ""}
				Position={new UDim2(0, 30, 0.5, 0)}
				Size={new UDim2(0, 200, 0.8, 0)}
				Text={""}
				TextColor3={theme.TextColor}
				TextSize={13}
				TextXAlignment={Enum.TextXAlignment.Left}
				Change={{
					Text: (textBox) => {
						props.OnSearchChanged(textBox.Text);
					},
				}}
			/>
		</frame>
	);
}
const SearchInput = withHooks(SearchInputCreate);

export = SearchInput;
