import Roact from "@rbxts/roact";
import { useCallback, useContext, useMemo, useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";
import { StoryContext } from "UI/Contexts/StoryContext";
import ThemeContext from "UI/Contexts/ThemeContext";

interface StoryLabelProps {
	DisplayName: string;
	StoryNode: StoryNode;
	LayoutOrder: number;
	Unknown?: boolean;
	Visible: boolean;
	Icon?: string;
	IconOffset?: Vector2;
	IconSize?: UDim2;
	Displayed: boolean;
	Selected?: boolean;
	SelectNode: (node: StoryNode) => void;
}

function setProps(props: StoryLabelProps) {
	props.Unknown = props.Unknown ?? false;
	return props;
}

function StoryLabelCreate(setprops: StoryLabelProps) {
	const [hover, setHover] = useState(false);
	const props = setProps(setprops);
	const theme = useContext(ThemeContext).Theme;
	const OnSetStory = () => {
		props.SelectNode(props.StoryNode);
	};
	const OnHover = () => {
		setHover(true);
	};
	const OnHoverEnd = () => {
		setHover(false);
	};
	return (
		<textbutton
			Key="EntryLabel"
			BackgroundColor3={
				props.Displayed
					? props.Unknown
						? theme.StoryDisplayed.Disabled
						: theme.StoryDisplayed.Entry
					: props.Unknown
					? theme.StoryIdle.Disabled
					: theme.StoryIdle.Entry
			}
			Text={""}
			TextTransparency={1}
			AutoButtonColor={false}
			BackgroundTransparency={props.Displayed ? 0 : hover ? 0.6 : 1}
			Size={new UDim2(1, 0, 0, 25)}
			Visible={props.Visible}
			Event={{
				MouseEnter: OnHover,
				MouseLeave: OnHoverEnd,
				MouseButton1Click: OnSetStory,
			}}
		>
			<uicorner CornerRadius={new UDim(0, 6)} />
			<uipadding
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 4)}
				PaddingRight={new UDim(0, 4)}
				PaddingTop={new UDim(0, 4)}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 5)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<imagelabel
				Key="IconLabel"
				AnchorPoint={new Vector2(1, 0.5)}
				BackgroundTransparency={1}
				Image={Configs.IconsSprite}
				ImageColor3={
					props.Displayed
						? props.Unknown
							? theme.StoryDisplayed.DisabledImage
							: theme.StoryDisplayed.Image
						: props.Unknown
						? theme.StoryIdle.DisabledImage
						: theme.StoryIdle.Image
				}
				ImageRectOffset={new Vector2(64, 192)}
				ImageRectSize={new Vector2(64, 64)}
				LayoutOrder={1}
				Position={new UDim2(1, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 1.1, 0)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
			/>
			<textlabel
				Key="TitleLabel"
				Text={props.DisplayName}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamMedium}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				LayoutOrder={2}
				Size={new UDim2(1, -46, 1, 0)}
				TextColor3={
					props.Displayed
						? props.Unknown
							? theme.StoryDisplayed.DisabledText
							: theme.StoryDisplayed.Text
						: props.Unknown
						? theme.TextDisabledColor
						: theme.TextColor
				}
				TextSize={14}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</textbutton>
	);
}

const StoryLabel = withHooksPure(StoryLabelCreate);

export = StoryLabel;
