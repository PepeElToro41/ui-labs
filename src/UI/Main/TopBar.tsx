import Roact from "@rbxts/roact";
import TopControl from "UI/Top/TopControl";
import Configs from "Plugin/Configs";
import ThemeContext from "UI/Contexts/ThemeContext";
import Themes from "Plugin/Themes";
import IconButton from "UI/UIUtils/IconButton";
import { useContext, useEffect, useMemo, useState, withHooksPure } from "@rbxts/roact-hooked";
import { Text } from "UI/UIUtils/Styles/Text";
import { Sprite } from "UI/UIUtils/Sprite";
import { Div } from "UI/UIUtils/Styles/Div";
import useTestDropdown from "UI/Hooks/TestHooks/useTestDropdown";
import TopDropdown from "UI/Top/TopComponents/TopDropdown";

interface TopbarControl {
	ControlName: string;
	ControlLabel: string;
}

interface TopBarProps {}

function setProps(props: TopBarProps) {
	return props;
}

const TopControls: TopbarControl[] = [
	{
		ControlName: "Actions",
		ControlLabel: "Actions",
	},
];

function TopBarCreate(setprops: TopBarProps) {
	const props = identity<Required<TopBarProps>>(setProps(setprops) as Required<TopBarProps>);
	const themeContext = useContext(ThemeContext);
	const theme = themeContext.Theme;
	const themeName = themeContext.Theme.ThemeName!;
	const [themeDescription, setThemeDescription] = useState("Default");
	useEffect(() => {
		const themeDesc = themeName === "Dark" ? "Switch to light theme" : "Switch to dark theme";
		setThemeDescription(themeDesc);
	}, [theme]);
	//const dropdown = useTestDropdown();
	const ControlElements = useMemo(() => {
		const newControlElements: Roact.Element[] = [];
		TopControls.forEach((control, index) => {
			newControlElements.push(
				<TopControl
					Key={tostring(index) + control.ControlName}
					ControlName={control.ControlName}
					ControlLabel={control.ControlLabel}
				/>,
			);
		});
		return newControlElements;
	}, [TopControls]);

	return (
		<frame Key="TopBar" BackgroundColor3={theme.TopBar} BorderSizePixel={0} Size={new UDim2(1, 0, 0, 35)} ZIndex={2}>
			<Text
				Key="PluginName"
				AutomaticSize={Enum.AutomaticSize.XY}
				LayoutOrder={1}
				Position={new UDim2(0, 39, 0, 6)}
				Size={new UDim2(0, 120, 0, 20)}
				Text={Configs.PluginName}
				TextColor3={theme.TextColor}
				TextSize={16}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<Sprite
				Key="Icon"
				AnchorPoint={new Vector2(0, 0.5)}
				Image={Configs.IconsSprite}
				ImageColor3={theme.LogoColor}
				ImageRectOffset={Configs.PluginIconOffset}
				ImageRectSize={Configs.PluginIconSize}
				Position={new UDim2(0, 5, 0.5, -2)}
				Size={new UDim2(0, 30, 0, 30)}
			/>
			<IconButton
				ButtonName="ThemeToggle"
				AnchorPoint={new Vector2(1, 0)}
				Position={new UDim2(1, -5, 0, 2)}
				Size={new UDim2(0, 29, 0, 29)}
				Description={themeDescription}
				Dependencies={[themeDescription]}
				Icon={{
					RectOffset: themeName === "Dark" ? new Vector2(0, 256) : new Vector2(64, 256),
					Size: new UDim2(0, 25, 0, 25),
				}}
				IconColor={{
					Default: themeName === "Dark" ? Color3.fromRGB(207, 194, 144) : Color3.fromRGB(43, 102, 196),
					Hovered: themeName === "Dark" ? Color3.fromRGB(207, 194, 144) : Color3.fromRGB(43, 102, 196),
				}}
				OnClick={() => {
					if (themeContext.SetTheme === undefined) return;
					if (theme === Themes.Dark) {
						themeContext.SetTheme("Light");
					} else {
						themeContext.SetTheme("Dark");
					}
				}}
			></IconButton>
			{/*<TopDropdown Position={UDim2.fromOffset(170, 30)} Dropdown={dropdown}></TopDropdown>*/}
			<Div
				Key="Controls"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Position={new UDim2(0, 170, 0.5, 0)}
				Size={new UDim2(1, -155, 0, 25)}
			>
				<uilistlayout
					Key="ListLayout"
					Padding={new UDim(0, 0)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{...ControlElements}
			</Div>
		</frame>
	);
}

const TopBar = withHooksPure(TopBarCreate);
export = TopBar;
