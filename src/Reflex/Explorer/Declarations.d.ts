interface StoryNode {
	Type: "Story";
	Name: string;
	Module: ModuleScript;
	Parent: ParentNode;
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
	Instance: Instance;
	Storybook: StorybookNode;
	Parent: StorybookNode | FolderNode;
	Children: ChildrenNode[];
}

type UnknownNode = {
	Type: "Unknown";
	Instance: Instance;
	Children: StoryNode[];
};

type ParentNode = FolderNode | StorybookNode | UnknownNode; //whatever can have children
type ChildrenNode = StoryNode | FolderNode; //whatever can have a parent
type DefinedNode = StoryNode | FolderNode | StorybookNode; //whatever has a name and it's not unknown

type RootNodes = {
	storybooks: StorybookNode[];
	unknown: UnknownNode[];
}; //what is at the root of the explorer
