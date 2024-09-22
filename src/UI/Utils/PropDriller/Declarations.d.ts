interface Position {
	Position?: UDim2;
	LayoutOrder?: number;
	AnchorPoint?: Vector2;
}
interface Size {
	Size?: UDim2;
}

interface Display {
	ZIndex?: number;
}

interface Shape extends Position, Size {}
