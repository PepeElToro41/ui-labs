import Vide, { Derivable, effect, read, Show, source } from "@rbxts/vide";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import Divisor from "UI/Elements/Divisor";
import Corner from "UI/Styles/Corner";
import Detector from "UI/Styles/Detector";
import Div from "UI/Styles/Div";
import Frame from "UI/Styles/Frame";
import Image from "UI/Styles/Image";
import LeftList from "UI/Styles/List/LeftList";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import { connect, DerivedChildren } from "Utils/Vide";

interface ChildrenHolderProps extends DerivedChildren {
	Name: Derivable<string | Instance>;
	LayoutOrder?: Derivable<number>;
	Icon?: Vide.Node;
	IsChild?: boolean;
}

function ChildrenHolder(props: ChildrenHolderProps) {
	const theme = useTheme();
	const hovered = source(false);
	const name = source<string>(undefined!);
	const expanded = source(false);

	effect(() => {
		const readName = read(props.Name);
		if (typeIs(readName, "string")) {
			return name(readName);
		}

		name(readName.Name);
		connect(readName.GetPropertyChangedSignal("Name"), () => {
			name(readName.Name);
		});
	});

	return (
		<Div Name={name} Size={UDim2.fromScale(1, 0)} AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={props.LayoutOrder}>
			<TopList Gap={1} />
			<Frame
				Name={"Title"}
				BackgroundColor3={theme("Background3")}
				BackgroundTransparency={() => (hovered() ? 0 : 1)}
				Size={new UDim2(1, 0, 0, 25)}
			>
				<Corner Radius={6} />
				<Div Name={"Display"}>
					<Padding PaddingX={2} />
					<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Gap={2} />
					<Image
						Size={UDim2.fromOffset(16, 16)}
						ImageColor3={theme("Text")}
						Image={() => (expanded() ? Images.Expanded : Images.Collapsed)}
						LayoutOrder={-2}
					/>
					<Text
						Size={new UDim2(1, -19, 1, 0)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Text={name}
						AutomaticSize={Enum.AutomaticSize.X}
						Padding={4}
					/>
					{props.Icon}
				</Div>
				<Divisor
					Visible={!!props.IsChild}
					Anchor={0}
					Position={new UDim2(0, -6, 0.5, 0)}
					Size={new UDim(0, 6)}
					Direction="X"
					Transparency={0.8}
				/>
				<Detector Hovered={hovered} MouseButton1Click={() => expanded(!expanded())} />
			</Frame>
			<Div
				Name={"ChildrenHolder"}
				ClipsDescendants={true}
				LayoutOrder={2}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<Divisor Direction="Y" Position={new UDim2(0, 9, 0, 0)} Size={new UDim(1, -12)} Anchor={0} Transparency={0.8} />
				<Div Name={"Children"} Size={UDim2.fromScale(1, 0)} LayoutOrder={2} AutomaticSize={Enum.AutomaticSize.Y}>
					<TopList Gap={1} />
					<Padding Left={16} />
					<Show when={expanded}>{props.children}</Show>
				</Div>
			</Div>
		</Div>
	);
}

export default ChildrenHolder;
