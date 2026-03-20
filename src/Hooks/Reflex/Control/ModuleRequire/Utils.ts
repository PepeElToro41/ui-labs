export function CheckBookReturn(result: unknown): result is StorybookResult {
	if (!typeIs(result, "table")) return false;
	if ("name" in result) {
		if (!typeIs(result.name, "string")) return false;
	}
	if ("groupRoots" in result) {
		if (!typeIs(result.groupRoots, "boolean")) return false;
	}
	if ("storyRoots" in result) {
		if (!typeIs(result.storyRoots, "table")) return false;
		const roots = result.storyRoots as Array<unknown>;
		for (let index = 0; index < roots.size(); index++) {
			const value = roots[index];
			if (!typeIs(value, "Instance")) return false;
		}
		return true;
	} else {
		return false;
	}
}
