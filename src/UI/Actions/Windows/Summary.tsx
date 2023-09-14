import Roact from "@rbxts/roact";
import { useContext, withHooks } from "@rbxts/roact-hooked";
import ThemeContext from "UI/Contexts/ThemeContext";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

interface SummaryProps {
	Summary: string;
	StoryName: string;
}

const PADDING = 15;

function setProps(props: SummaryProps) {
	return props;
}

function SummaryCreate(setprops: SummaryProps) {
	const props = identity<Required<SummaryProps>>(setProps(setprops) as Required<SummaryProps>);
	const theme = useContext(ThemeContext).Theme;
	return (
		<Div Key="Summary" Size={new UDim2(1, 0, 1, 0)} ZIndex={2}>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<Div Key="Title" Size={new UDim2(1, 100, 0, 30)}>
				<frame Key="Contents" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
					<uipadding PaddingLeft={new UDim(0, 10)} />
					<Text
						Key="ControlLabel"
						Size={new UDim2(0, 200, 1, 0)}
						Text={props.StoryName}
						TextColor3={theme.TextDisabledColor}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
				<frame
					Key="Divisor1"
					BackgroundColor3={theme.Divisor}
					BackgroundTransparency={0.85}
					BorderSizePixel={0}
					Position={new UDim2(0, 0, 1, 0)}
					Size={new UDim2(1, 0, 0, 1)}
				/>
				<frame
					Key="Divisor2"
					BackgroundColor3={theme.Divisor}
					BackgroundTransparency={0.85}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, 1)}
				/>
			</Div>
			<frame Key="Description" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, -30)}>
				<uipadding
					PaddingBottom={new UDim(0, 10)}
					PaddingLeft={new UDim(0, 15)}
					PaddingRight={new UDim(0, 15)}
					PaddingTop={new UDim(0, 10)}
				/>
				<Text
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					RichText={true}
					TextWrapped={true}
					Size={new UDim2(1, 0, 1, 0)}
					Text={props.Summary}
					TextColor3={theme.TextColor}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				/>
			</frame>
		</Div>
	);
}
const Summary = withHooks(SummaryCreate);

export = Summary;
