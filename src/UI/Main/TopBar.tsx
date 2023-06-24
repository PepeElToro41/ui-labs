import Roact from "@rbxts/roact";
import TopControl from "UI/Top/TopControl";
import Configs from "Plugin/Configs";
import ThemeContext from "UI/Contexts/ThemeContext";
import Themes from "Plugin/Themes";
import IconButton from "UI/UIUtils/IconButton";
import { useContext, useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";

export interface TopControlProps {
	ControlName: string;
	ControlLabel: string;
	Dropdown?: Record<string, unknown>;
	OnDropdownClick?: (dropdownClicked: keyof TopControlProps["Dropdown"]) => void;
}

interface TopBarProps {
	TopControls: TopControlProps[];
}

function setProps(props: TopBarProps) {
	return props;
}

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
	const ControlElements = useMemo(() => {
		const newControlElements: Roact.Element[] = [];
		props.TopControls.forEach((control, index) => {
			newControlElements.push(
				<TopControl
					Key={tostring(index) + control.ControlName}
					ControlName={control.ControlName}
					ControlLabel={control.ControlLabel}
					Dropdown={{}}
				/>,
			);
		});
		return newControlElements;
	}, [props.TopControls]);

	return (
		<frame
			Key="TopBar"
			BackgroundColor3={theme.TopBar}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 35)}
			ZIndex={2}
		>
			<textlabel
				Key="PluginName"
				AutomaticSize={Enum.AutomaticSize.XY}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamMedium}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				LayoutOrder={1}
				Position={new UDim2(0, 39, 0, 6)}
				Size={new UDim2(0, 120, 0, 20)}
				Text={Configs.PluginName}
				TextColor3={theme.TextColor}
				TextSize={16}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<imagelabel
				Key="Icon"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
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
			<frame
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
			</frame>
		</frame>
	);
}
export const TopBar = withHooks(TopBarCreate);
