interface StoryNode {
	type: "Story";
	name: string;
	module: ModuleScript;
	parent: ParentNode;
}

interface StorybookNode {
	type: "Storybook";
	name: string;
	module: ModuleScript;
	children: ChildrenNode[];
}

interface FolderNode {
	type: "Folder";
	name: string;
	instance: Folder;
	parent: ParentNode;
}

type UnknownNode = {
	type: "Unknown";
	name: string;
	instance: Instance;
	children: StoryNode[];
};

type ParentNode = FolderNode | StorybookNode | UnknownNode; //whatever can have children
type ChildrenNode = StoryNode | FolderNode; //whatever can be children

type RootNodes = UnknownNode | StorybookNode; //what is at the root of the explorer
