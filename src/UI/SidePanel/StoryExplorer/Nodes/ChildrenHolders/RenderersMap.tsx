import Vide from "@rbxts/vide";
import { Derived } from "Utils/Vide";

export type NodeRenderer = (node: Derived<ChildrenNode>, index: Derived<number>) => Vide.Node;
