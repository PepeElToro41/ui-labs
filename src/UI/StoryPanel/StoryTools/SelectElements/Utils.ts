export function GetGuisAtPosition(root: GuiObject, position: Vector2) {
	const list: GuiObject[] = [];

	const iterate = (instance: Instance, clipped?: [Vector2, Vector2]) => {
		const buffered: GuiObject[] = [];
		for (const child of instance.GetChildren()) {
			const isInside = visit(child, clipped);
			if (isInside && child.IsA("GuiObject")) {
				buffered.push(child);
			}
		}
		buffered.sort((a, b) => a.ZIndex < b.ZIndex).forEach((child) => list.push(child));
	};

	const visit = (instance: Instance, clipped?: [Vector2, Vector2]) => {
		if (instance.IsA("GuiObject")) {
			if (!instance.Visible) return false;

			const start = clipped
				? new Vector2(math.max(instance.AbsolutePosition.X, clipped[0].X), math.max(instance.AbsolutePosition.Y, clipped[0].Y))
				: instance.AbsolutePosition;

			const extend = clipped
				? new Vector2(
						math.min(instance.AbsolutePosition.X + instance.AbsoluteSize.X, clipped[0].X + clipped[1].X),
						math.min(instance.AbsolutePosition.Y + instance.AbsoluteSize.Y, clipped[0].Y + clipped[1].Y),
					)
				: instance.AbsolutePosition.add(instance.AbsoluteSize);

			iterate(instance, instance.ClipsDescendants ? [start, extend] : clipped);

			const minX = math.min(start.X, extend.X);
			const maxX = math.max(start.X, extend.X);
			const minY = math.min(start.Y, extend.Y);
			const maxY = math.max(start.Y, extend.Y);

			return position.X >= minX && position.X <= maxX && position.Y >= minY && position.Y <= maxY;
		}
		iterate(instance, clipped);
		return false;
	};

	iterate(root);
	return list;
}
