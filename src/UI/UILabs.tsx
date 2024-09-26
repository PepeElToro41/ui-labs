import Vide from "@rbxts/vide";
import Div from "./Styles/Div";
import LeftList from "./Styles/List/LeftList";
import ResizablePanel from "./Holders/ResizablePanel";
import SidePanel from "./SidePanel";
import MainPanel from "./MainPanel";

function UILabs() {
	return (
		<Div Name={"UILabs"}>
			<LeftList />
			<ResizablePanel
				PanelSize={250}
				MinimumSize={120}
				MaximumSize={600}
				CollapseThreshold={50}
				UncollapseThreshold={60}
				PanelNative={{ ZIndex: 2 }}
			>
				<SidePanel />
			</ResizablePanel>
			<MainPanel />
		</Div>
	);
}

export default UILabs;
