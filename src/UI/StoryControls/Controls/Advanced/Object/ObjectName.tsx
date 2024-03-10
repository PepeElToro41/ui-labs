import React, { useEffect, useState } from "@rbxts/react";
import Text from "UI/Styles/Text";

interface ObjectNameProps extends Omit<React.InstanceProps<TextLabel>, "Text"> {
	Object: Instance;
}

function ObjectName(setprops: ObjectNameProps) {
	const object = setprops.Object;
	const [objectName, setObjectName] = useState(() => object.Name ?? "");

	useEffect(() => {
		if (!object) return;

		setObjectName(object.Name);
		const connection = object.GetPropertyChangedSignal("Name").Connect(() => {
			setObjectName(object.Name);
		});
		return () => connection.Disconnect();
	}, [object]);

	const props = { ...setprops };
	props.Object = undefined!;

	return (
		<Text Text={objectName} {...props}>
			{props["children"]}
		</Text>
	);
}

export default ObjectName;
