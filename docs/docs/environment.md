# Environment

UI Labs creates a virtual environment for each story, this replaces the `require` function, the `script` global and the `_G` table.

This is needed to allow sandboxing and avoid require caching.<br/>
Addionally, UI Labs injects extra values and functions that can be useful inside the environment.

Because the entire story runs inside the same environment, you can use any of these utilities from anywhere in the story. The [Utility Package](/docs/installation.md#installing-the-utility-package) will provide a way to access these variables.

## Environment.IsStory

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">IsStory</span>( )<span class="type-name">:</span><span class="type-highlight">boolean</span></span>

Returns `true` if the current story is running inside UI Labs.

## Environment.Unmount

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">Unmount</span>( )</span>

Unmounts the story. This is useful when the story should no longer keep running.

<span class="tiphelp">Defaults to an empty function in non-story environments</span>

## Environment.Reload

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">Reload</span>( )</span>

Reloads the story. You can use this if you wanna force a reload when something external changed, or it can be an alternative to `Environment.Unmount`.

::: danger
This has the potential to cause an infinite loop.
:::

<span class="tiphelp">Defaults to an empty function in non-story environments</span>

## Environment.CreateSnapshot

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">CreateSnapshot</span>(<span class="type-name-opt">name</span>?<span class="type-name">:</span><span class="type-highlight">string</span>)</span>

Does the same as [Create Snapshot](/docs/plugin/extras.md#creating-snapshots) button does. Useful for cloning the UI automatically.<br/>
An additional `name` argument can be given for the created `ScreenGui`

<span class="tiphelp">Defaults an empty function in non-story environments</span>

## Environment.SetStoryHolder

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">SetStoryHolder</span>(<span class="type-name-opt">target</span>?<span class="type-name">:</span><span class="type-highlight">Instance</span>)</span>

Changes what the [View On Explorer](/docs/plugin/extras.md#view-in-explorer) button selects when clicked.<br/>
Useful when the story does not use the provided target frame _(e.g using <span class="item-description">React Portals</span>)_, or when the story is not a UI.

Calling this function without a value will reset the story holder to the target frame

<span class="tiphelp">Defaults to an empty function in non-story environments</span>

## Environment.GetJanitor

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">GetJanitor</span>( )<span class="type-name">:</span><span class="type-highlight">Janitor</span></span>

Gives you a [Janitor](https://howmanysmall.github.io/Janitor/) object that gets destroyed when the story is unmounted.
Useful for cleaning up without having to access the cleanup functions.

<span class="tiphelp">Returns `nil` in non-story environments</span>

## Environment.InputListener

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">InputListener</span><span class="type-name">:</span><span class="type-highlight">InputSignals</span></span>

Gives you a user input listener. This is useful as `UserInputService` will not work inside <span class="item-description">Plugin Widgets</span>

The type of the listener is:

```ts
type InputSignals = {
   InputBegan: UserInputService.InputBegan;
   InputChanged: UserInputService.InputChanged;
   InputEnded: UserInputService.InputEnded;
   MouseMoved: Signal<(mousePos: Vector2)>;
}
```

<span class="tiphelp">Defaults to `nil` in non-story environments</span>

## Environment.UserInput

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">UserInput</span><span class="type-name">:</span><span class="type-highlight">UserInputService</span></span>

Same as `Environment.InputListener`. The difference is that this is typed as `UserInputService` and will default to it. This will also fallback to `UserInputService` for any missing methods.

<span class="tiphelp">Defaults to `UserInputService` in non-story environments</span>

## Environment.EnvironmentUID

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">EnvironmentUID</span><span class="type-name">:</span><span class="type-highlight">string</span></span>

Gives you the GUID of the environment. Changes everytime the story is reloaded.

<span class="tiphelp">Defaults to `nil` in non-story environments</span>

## Environment.PreviewUID

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">PreviewUID</span><span class="type-name">:</span><span class="type-highlight">string</span></span>

Gives you the GUID of the preview. Changes everytime the story is mounted, but stays the same between reloads.

<span class="tiphelp">Defaults to `nil` in non-story environments</span>

## Environment.OriginalG

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">OriginalG</span><span class="type-name">:</span><span class="type-highlight">\_G</span></span>

Holds the original `_G` table. Can be used to leave the sandboxed Environment.

<span class="tiphelp">Defaults to the current `_G` table in non-story environments</span>

## Environment.Plugin

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">Plugin</span><span class="type-name">:</span><span class="type-highlight">Plugin</span></span>

Gives you access to the `plugin` global. This is useful for accessing the plugin's API.

<span class="tiphelp">Defaults to `nil` in non-story environments</span>

## Environment.PluginWidget

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">PluginWidget</span><span class="type-name">:</span><span class="type-highlight">DockWidgetPluginGui</span></span>

References where the plugin is mounted. This is useful because `Sounds` can only be played inside a `DockWidgetPluginGui` in <span class="item-description">Edit Mode</span>.

::: warning
You should only parent instances directly inside the plugin widget. Touching UI Labs plugin elements can break the plugin.
:::

<span class="tiphelp">Defaults to `nil` in non-story environments</span>

##

::: details Summary

::: code-group

```lua [Luau]
local UILabs = require(ReplicatedStorage.UILabs)
local Environment = UILabs.Environment

print(Environment.IsStory())

---- [[ Variables ]] ----
print(Environment.EnvironmentUID)
print(Environment.PreviewUID)
print(Environment.OriginalG)
print(Environment.PluginWidget)


---- [[ Functions ]] ----
Environment.Reload()
Environment.Unmount()
Environment.CreateSnapshot("MySnapshot")
Environment.SetStoryHolder(game.Workspace.Baseplate)


---- [[ Janitor ]] ----
local janitor = Environment.GetJanitor()
janitor:Add(Instance.new("Part"))
janitor:Add(function()
   print("Cleanup")
end)


---- [[ InputListener ]] ----
local inputListener = Environment.InputListener

inputListener.InputBegan:Connect(function(input, gameProcessed)
   print(input.UserInputType)
end)
inputListener.InputEnded:Connect(function(input, gameProcessed)
   print(input.UserInputType)
end)
inputListener.InputChanged:Connect(function(input, gameProcessed)
   print(input.UserInputType)
end)
inputListener.MouseMoved:Connect(function(mousePos)
   print(mousePos)
end)

```

```ts [Roblox-TS]
import { Environment } from "@rbxts/ui-labs";

print(Environment.IsStory());

/* ------- Variables ------ */
print(Environment.EnvironmentUID);
print(Environment.PreviewUID);
print(Environment.OriginalG);
print(Environment.PluginWidget);

/* ------- Functions ------ */
Environment.Reload();
Environment.Unmount();
Environment.CreateSnapshot("MySnapshot");
Environment.SetStoryHolder(game.Workspace.Baseplate);

/* ------- Janitor ------ */
const janitor = Environment.GetJanitor();
janitor.Add(new Instance("Part"));
janitor.Add(() => {
	print("Cleanup");
});

/* ------- InputListener ------ */
const inputListener = Environment.InputListener;

inputListener.InputBegan.Connect((input, gameProcessed) => {
	print(input.UserInputType);
});
inputListener.InputEnded.Connect((input, gameProcessed) => {
	print(input.UserInputType);
});
inputListener.InputChanged.Connect((input, gameProcessed) => {
	print(input.UserInputType);
});
inputListener.MouseMoved.Connect((mousePos) => {
	print(mousePos);
});
```

:::
