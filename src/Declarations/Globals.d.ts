interface ClassIconInfo {
	Image: string;
	ImageRectOffset: Vector2;
	ImageRectSize: Vector2;
}

declare namespace React {
	type Children = Map<Key, React.Element>;
}
