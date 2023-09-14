import { useDebounceEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";
import { Image } from "UI/UIUtils/Styles/Image";
import { Text } from "UI/UIUtils/Styles/Text";

interface LogoStartProps {}

function setProps(props: LogoStartProps) {
	return props;
}

function LogoStartCreate(setprops: LogoStartProps) {
	const props = identity<Required<LogoStartProps>>(setProps(setprops) as Required<LogoStartProps>);
	const backRef = useRef<Frame>();
	const imageLogoRef = useRef<ImageLabel>();
	const textLogoRef = useRef<Frame>();
	const titleRef = useRef<TextLabel>();
	const shadowRef = useRef<TextLabel>();

	useDebounceEffect(
		() => {
			let info = new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);
			TweenService.Create(imageLogoRef.getValue()!, info, { ImageTransparency: 0 }).Play();
			info = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0.05);
			TweenService.Create(textLogoRef.getValue()!, info, { Size: UDim2.fromOffset(340, 110) }).Play();
		},
		[],
		{ wait: 0.1 },
	);
	useDebounceEffect(
		() => {
			let info = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);
			TweenService.Create(textLogoRef.getValue()!, info, { Size: UDim2.fromOffset(0, 110) }).Play();
			info = new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0.1);
			TweenService.Create(imageLogoRef.getValue()!, info, { ImageTransparency: 1 }).Play();
			TweenService.Create(textLogoRef.getValue()!, info, { BackgroundTransparency: 1 }).Play();
			TweenService.Create(titleRef.getValue()!, info, { TextTransparency: 1 }).Play();
			TweenService.Create(shadowRef.getValue()!, info, { TextTransparency: 1 }).Play();
			info = new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0.15);
			TweenService.Create(backRef.getValue()!, info, { BackgroundTransparency: 1 }).Play();
		},
		[],
		{ wait: 0.8 },
	);
	return (
		<frame
			Key="LogoStart"
			BackgroundColor3={Color3.fromRGB(58, 31, 71)}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 1, 0)}
			Ref={backRef}
		>
			<Image
				Key="ImageLogo"
				AnchorPoint={new Vector2(0.5, 0.5)}
				ImageTransparency={1}
				Image="rbxassetid://13876047670"
				ImageColor3={Color3.fromRGB(246, 175, 255)}
				Position={new UDim2(0.5, -2, 0.5, -80)}
				Size={new UDim2(0, 260, 0, 260)}
				Ref={imageLogoRef}
			/>
			<frame
				Key="TextLogo"
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(34, 14, 42)}
				BorderSizePixel={0}
				ClipsDescendants={true}
				Position={new UDim2(0.5, 0, 0.5, 70)}
				Size={new UDim2(0, 0, 0, 110)}
				Ref={textLogoRef}
			>
				<Text
					Key="Title"
					AnchorPoint={new Vector2(0.5, 0.5)}
					FontFace={Font.fromName("JosefinSans", Enum.FontWeight.SemiBold)}
					Position={new UDim2(0.5, 0, 0.5, 15)}
					Size={new UDim2(0, 200, 0.9, 0)}
					Text="UI Labs"
					TextColor3={Color3.fromRGB(202, 148, 255)}
					TextSize={80}
					ZIndex={2}
					Ref={titleRef}
				/>
				<Text
					Key="Shadow"
					AnchorPoint={new Vector2(0.5, 0.5)}
					FontFace={Font.fromName("JosefinSans", Enum.FontWeight.SemiBold)}
					Position={new UDim2(0.5, 5, 0.5, 20)}
					Size={new UDim2(0, 200, 0.9, 0)}
					Text="UI Labs"
					TextColor3={Color3.fromRGB(0, 0, 0)}
					TextSize={80}
					TextTransparency={0.7}
					Ref={shadowRef}
				/>
				<uipadding PaddingBottom={new UDim(0, 14)} PaddingLeft={new UDim(0, 15)} PaddingRight={new UDim(0, 15)} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
			</frame>
		</frame>
	);
}
const LogoStart = withHooks(LogoStartCreate);

export = LogoStart;
