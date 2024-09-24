import { Storybook } from "@rbxts/ui-labs";

declare global {
	type ModuleLookup = Map<ModuleScript, StoryNode>; //Way to find nodes quickly by having the modulescript

	// Entry Point
	type RootNodes = {
		Storybooks: StorybookNode[];
		Unknown: UnknownNode[];
	};

	interface StoryNode {
		Type: "Story";
		Name: string;
		Identifier: Instance;
		Module: ModuleScript;
		Parent: ContainerNode;
	}

	interface StorybookNode {
		Type: "Storybook";
		Name: string;
		Identifier: Instance;
		Module: ModuleScript;
		Result: Storybook;
		Children: ChildrenNode[];
	}

	interface FolderNode {
		Type: "Folder";
		Instance: Instance; //No name as this is binded to a roblox instance
		Identifier: Instance;
		Storybook: StorybookNode;
		Parent: ParentNode;
		Children: ChildrenNode[];
	}

	interface UnknownNode {
		Type: "Unknown";
		Identifier: Instance;
		Instance: Instance;
		Children: StoryNode[];
	}

	type ParentNode = FolderNode | StorybookNode; //whatever can be a node parent
	type ContainerNode = FolderNode | StorybookNode | UnknownNode; //whatever can have children
	type ChildrenNode = StoryNode | FolderNode; //whatever can have a parent
	type DefinedNode = StoryNode | FolderNode | StorybookNode; //whatever has a name and it's not unknown
}
