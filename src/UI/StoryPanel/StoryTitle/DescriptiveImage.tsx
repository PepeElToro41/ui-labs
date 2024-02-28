import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useCallback, useEffect } from "@rbxts/roact";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { useToggler } from "Hooks/Utils/Toggler";

interface DescriptiveImageProps extends Roact.JsxInstanceProperties<ImageLabel> {
	ImageName: string;
	Description: string;
}

function DescriptiveImage(props: DescriptiveImageProps) {
	const imageName = props.ImageName;
	const description = props.Description;
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay(imageName);
	const [hovered, hoverApi] = useToggler(false);

	const setprops = { ...props };
	setprops.ImageName = undefined!;
	setprops.Description = undefined!;

	useEffect(() => {
		if (hovered) {
			DisplayDescription(description);
		} else {
			RemoveDescription();
		}
	}, [hovered, description, DisplayDescription, RemoveDescription]);

	return (
		<imagelabel
			key={imageName}
			BackgroundTransparency={1}
			{...setprops}
			Event={{
				MouseEnter: hoverApi.enable,
				MouseLeave: hoverApi.disable,
			}}
		></imagelabel>
	);
}

export default DescriptiveImage;
