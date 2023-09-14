import Roact from "@rbxts/roact";
import { useContext, useEffect, useRef, useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { MouseContext } from "UI/Contexts/MouseContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import { Text } from "UI/UIUtils/Styles/Text";

interface DescriptorProps {
	mouseDesc: string | undefined;
	descVisible: boolean;
	mousePos: Vector2;
}

function setProps(props: DescriptorProps) {
	return props;
}

function DescriptorCreate(setprops: DescriptorProps) {
	const props = identity<Required<DescriptorProps>>(setProps(setprops) as Required<DescriptorProps>);
	const [wrapped, setWrapped] = useState(false);
	const mouseFrame = useContext(MouseContext).mouseFrameRef;
	const descriptorFrame = useRef<Frame>();
	const theme = useContext(ThemeContext).Theme;
	useEffect(() => {
		if (!mouseFrame!.getValue() || !descriptorFrame.getValue()) return;
		const frame = descriptorFrame.getValue()!;
		if (props.mousePos.X + frame.AbsoluteSize.X > mouseFrame!.getValue()!.AbsoluteSize.X) {
			if (!wrapped) {
				setWrapped(true);
			}
		} else {
			if (wrapped) {
				setWrapped(false);
			}
		}
	}, [props.mouseDesc, props.mousePos]);
	return (
		<frame
			Key="Descriptor"
			AnchorPoint={wrapped ? new Vector2(1, 0) : new Vector2(0, 0)}
			Position={wrapped ? UDim2.fromOffset(-2, 17) : UDim2.fromOffset(12, 15)}
			AutomaticSize={Enum.AutomaticSize.XY}
			BackgroundColor3={theme.Descriptor}
			BorderSizePixel={0}
			Size={new UDim2(0, 0, 0, 22)}
			Visible={props.mouseDesc !== undefined && props.descVisible}
			Ref={descriptorFrame}
		>
			<Text
				Key="DescriptionText"
				AnchorPoint={new Vector2(0, 0.5)}
				AutomaticSize={Enum.AutomaticSize.XY}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Light)}
				Position={new UDim2(0, 0, 0.5, 0)}
				Text={props.mouseDesc}
				TextColor3={theme.DescriptorText}
				TextSize={13}
			/>
			<uipadding
				PaddingBottom={new UDim(0, 6)}
				PaddingLeft={new UDim(0, 5)}
				PaddingRight={new UDim(0, 5)}
				PaddingTop={new UDim(0, 6)}
			/>
			<uicorner CornerRadius={new UDim(0, 4)} />
		</frame>
	);
}
const Descriptor = withHooksPure(DescriptorCreate);

export = Descriptor;
