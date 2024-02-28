type NodeMap = Map<ModuleScript, StoryNode>; //I need a way to find nodes quickly by having the modulescript

interface StoryNode {
	Type: "Story";
	Name: string;
	Module: ModuleScript;
	Parent: ContainerNode;
}

interface StorybookNode {
	Type: "Storybook";
	Name: string;
	Module: ModuleScript;
	Result: StorybookResult;
	Children: ChildrenNode[];
}

interface FolderNode {
	Type: "Folder";
	Instance: Instance; //No name as this is binded to a roblox instance
	Storybook: StorybookNode;
	Parent: ParentNode;
	Children: ChildrenNode[];
}

interface UnknownNode {
	Type: "Unknown";
	Instance: Instance;
	Children: StoryNode[];
}

type ParentNode = FolderNode | StorybookNode; //whatever can be a node parent
type ContainerNode = FolderNode | StorybookNode | UnknownNode; //whatever can have children
type ChildrenNode = StoryNode | FolderNode; //whatever can have a parent
type DefinedNode = StoryNode | FolderNode | StorybookNode; //whatever has a name and it's not unknown

type RootNodes = {
	storybooks: StorybookNode[];
	unknown: UnknownNode[];
}; //Explorer Entry point
