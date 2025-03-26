function IsNotTransparent(gui: GuiObject) {
	if (gui.IsA("Frame")) {
		return gui.BackgroundTransparency < 0.98;
	} else if (
		gui.IsA("TextLabel") ||
		gui.IsA("TextButton") ||
		gui.IsA("TextBox")
	) {
		return gui.BackgroundTransparency < 0.98 || gui.TextTransparency < 0.98;
	} else if (gui.IsA("ImageLabel") || gui.IsA("ImageButton")) {
		return gui.BackgroundTransparency < 0.98 || gui.ImageTransparency < 0.98;
	} else {
		return true;
	}
}

function CanBeSeen(gui: GuiObject) {
	const isNotTransparent = IsNotTransparent(gui);

	if (isNotTransparent) {
		return true;
	} else {
		return gui.FindFirstChildOfClass("UIStroke");
	}
}

export function GetGuisAtPosition(root: GuiObject, position: Vector2) {
	const list: GuiObject[] = [];

	const iterate = (instance: Instance, clipped?: [Vector2, Vector2]) => {
		const buffered: { Index: number; Object: GuiObject }[] = [];
		const children = instance.GetChildren();
		for (let i = 0; i < children.size(); i++) {
			const child = children[i];
			if (child.IsA("GuiObject")) {
				buffered.push({ Index: i, Object: child });
			}
		}
		const sorted = buffered.sort((a, b) => {
			if (a.Object.ZIndex === b.Object.ZIndex) {
				return a.Index > b.Index;
			} else {
				return a.Object.ZIndex > b.Object.ZIndex;
			}
		});

		for (const child of sorted) {
			const isInside = visit(child.Object, clipped);
			if (isInside && CanBeSeen(child.Object)) {
				list.push(child.Object);
			}
		}
	};

	const visit = (instance: Instance, clipped?: [Vector2, Vector2]) => {
		if (instance.IsA("GuiObject")) {
			if (!instance.Visible) return false;

			const start = clipped
				? new Vector2(
						math.max(instance.AbsolutePosition.X, clipped[0].X),
						math.max(instance.AbsolutePosition.Y, clipped[0].Y)
					)
				: instance.AbsolutePosition;

			const extend = clipped
				? new Vector2(
						math.min(
							instance.AbsolutePosition.X + instance.AbsoluteSize.X,
							clipped[1].X
						),
						math.min(
							instance.AbsolutePosition.Y + instance.AbsoluteSize.Y,
							clipped[1].Y
						)
					)
				: instance.AbsolutePosition.add(instance.AbsoluteSize);

			iterate(instance, instance.ClipsDescendants ? [start, extend] : clipped);

			const minX = math.min(start.X, extend.X);
			const maxX = math.max(minX, extend.X);
			const minY = math.min(start.Y, extend.Y);
			const maxY = math.max(minY, extend.Y);

			const isInside =
				position.X >= minX &&
				position.X <= maxX &&
				position.Y >= minY &&
				position.Y <= maxY;

			return isInside;
		}
		iterate(instance, clipped);
		return false;
	};
	iterate(root);
	return list;
}
