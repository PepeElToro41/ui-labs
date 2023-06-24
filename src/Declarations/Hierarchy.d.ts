type BindTypes = "UID" | "Path" | "Dual";
type ReferencePath = { Service: keyof Services; ModuleName: string; Path: string[] };
interface HierarchyFolder {
	DisplayName: string;
	Inside: (HierarchyModuleBind | HierarchyFolder)[];
}
interface HierarchyModuleBind {
	ReferencePath?: ReferencePath;
	UID?: string;
}
type PluginHierarchy = HierarchyFolder[];
