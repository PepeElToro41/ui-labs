import Roact from "@rbxts/roact";
import { useBinding, useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import Div from "UI/Styles/Div";
import Corner from "UI/Styles/Corner";
import Sprite from "UI/Utils/Sprite";

const PHASE_INFO = new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);

interface SearchInputProps {
	Size: UDim2;
	Position?: UDim2;
	LayoutOrder?: number;
	AnchorPoint?: Vector2;
	Placeholder?: string;
	OnSearchChanged: (text: string) => void;
}

function setProps(props: SearchInputProps) {
	return props;
}

function StrokeEffect(props: { Phase: Roact.Binding<number>; FrameSize: Roact.Binding<Vector2>; Theme: Theme }) {
	const theme = props.Theme;
	return (
		<Div
			Key="StrokeEffect"
			Size={props.Phase.map((phase) => new UDim2(phase, 2, 1, 2))}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			ClipsDescendants={true}
			Visible={props.Phase.map((phase) => phase > 0)}
		>
			<frame
				Key="StrokeFrame"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={props.FrameSize.map((size) => UDim2.fromOffset(size.X, size.Y))}
			>
				<Corner />
				<uistroke Color={theme.Search.Stroke} Transparency={theme.Search.StrokeTransparency} />
			</frame>
		</Div>
	);
}

function SearchInputCreate(setprops: SearchInputProps) {
	const props = identity<Required<SearchInputProps>>(setProps(setprops) as Required<SearchInputProps>);
	const theme = useTheme();
	const [frameSize, setFrameSize] = useBinding(new Vector2(0, 0));
	const [phase, tweenPhase] = useTween(PHASE_INFO, 0);
	const [focused, setFocused] = useState(false);

	useEffect(() => {
		tweenPhase(focused ? 1 : 0);
	}, [focused]);

	return (
		<frame
			LayoutOrder={props.LayoutOrder ?? 1}
			Key="SearchFrame"
			BackgroundColor3={theme.Search.Color}
			AnchorPoint={props.AnchorPoint ?? new Vector2(0.5, 0)}
			Position={props.Position ?? UDim2.fromScale(0, 0)}
			Size={props.Size}
			Change={{
				AbsoluteSize: (frame) => setFrameSize(frame.AbsoluteSize),
			}}
		>
			<StrokeEffect Phase={phase} FrameSize={frameSize} Theme={theme} />
			<Corner />
			<Sprite
				Key="MagnifyIcon"
				Sprite={"Search"}
				ImageProps={{
					ImageColor3: theme.Icon.Disabled,
					AnchorPoint: new Vector2(0, 0.5),
					Position: new UDim2(0, 6, 0.5, 0),
					Size: new UDim2(0, 19, 0, 19),
				}}
			/>
			<textbox
				Key="Input"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamMedium}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				PlaceholderColor3={theme.Search.Placeholder}
				PlaceholderText={props.Placeholder ?? ""}
				Position={new UDim2(0, 30, 0.5, 0)}
				Size={new UDim2(1, -35, 0.8, 0)}
				TextTruncate={Enum.TextTruncate.AtEnd}
				Text={""}
				TextColor3={theme.Text.Color}
				TextSize={13}
				TextXAlignment={Enum.TextXAlignment.Left}
				Event={{
					FocusLost: () => setFocused(false),
					Focused: () => setFocused(true),
				}}
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
