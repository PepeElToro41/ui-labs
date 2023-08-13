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
	instance: Instance;
	storybook: StorybookNode;
	parent: StorybookNode | FolderNode;
	children: ChildrenNode[];
}

type UnknownNode = {
	type: "Unknown";
	instance: Instance;
	children: StoryNode[];
};

type ParentNode = FolderNode | StorybookNode | UnknownNode; //whatever can have children
type ChildrenNode = StoryNode | FolderNode; //whatever can have a parent
type DefinedNode = StoryNode | FolderNode | StorybookNode; //whatever has a name and it's not unknown

type RootNodes = {
	storybooks: StorybookNode[];
	unknown: UnknownNode[];
}; //what is at the root of the explorer
