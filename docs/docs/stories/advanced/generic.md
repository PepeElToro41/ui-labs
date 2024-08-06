# Generic

Generic stories are stories that can be used with anything. They are not tied to a specific library and are flexible enough to adapt to almost any situation.

## Rendering your story

Generic stories will need a new key called `render` instead of `story`. This name difference will tell UI Labs that this is a generic story and will not expect any specific library.

This render function will be called once, and it will receive a `props` table containing the following keys:

<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">target</span> <code>Frame</code><br/></span>
   <span class="prop-description-contents">Where the story should be mounted.</span>
</div>
<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">controls</span> <code>ControlValues</code><br/></span>
   <span class="prop-description-contents">The control values that the story started with.</span>
</div>
<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">converted</span> <code>ConvertedControls</code><br/></span>
   <span class="prop-description-contents">Control objects that UI Labs is current using.
   Shouldn't be manipulated but they are useful to get info about the controls.</span><br/><br/>
</div>
<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">subscribe</span> <code>(listener: Listener) => disconnect</code><br/></span>
   <span class="prop-description-contents">Used to subscribe to changes in the controls. This is the way you can listen to changes in the controls and update your story accordingly.</span><br/><br/>
</div>

::: details Example

::: code-group

```lua [Luau]
local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")
      component.Parent = props.target

      props.subscribe(function(values, infos)
         print("controls changed", values)
      end)

      return function()
         component:Destroy()
      end
   end
}
```

```tsx [Roblox-TS]
const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = new Instance("Frame");
		component.Parent = props.target;

		props.subscribe((values, infos) => {
			print("controls changed", values);
		});

		return () => {
			component.Destroy();
		};
	},
};
```

:::

## Listening to control changes

The `subscribe` function can be used to connect a callback to be called every time the controls change. This callback will receive two arguments:

-   values: `ControlValues`: The current control values
-   infos: `ControlInfos`: Update information, this will give you the new and old values of the controls.

When `subscribe` is called, it will return a function that can be used to disconnect the callback.

---

You can use the Control values to update your story.

The control infos will give you the old and new values of the controls, you can use this to check for specific control changes.

<table>
   <thead> 
      <tr>
         <th>Key</th>
         <th width="100%">Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> __new </span></td>
         <td>current control value</td>
      </tr>
      <tr>
         <td><span class="nowrap"> __old </span></td>
         <td>the control value before the change</td>
      </tr>
   </tbody>
</table>

::: code-group

```lua [Luau] {15-17}
local controls = {
   Visible = true,
}

local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")
      component.Visible = props.controls.visible -- first update
      component.Parent = props.target

      local unsubscribe = props.subscribe(function(values, infos) -- // [!code focus:7]
         local info = infos.visible -- This will be a GenericInfo<boolean>

         if(info.__new ~= info.__old) then
            component.Visible = info.__new
         end
      end)

      return function()
         component:Destroy()
      end
   end
}
```

```tsx [Roblox-TS] {15-17}
const controls = {
	Visible: true,
};

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = new Instance("Frame");
		component.Visible = props.controls.Visible; // first update
		component.Parent = props.target;

		const unsubscribe = props.subscribe((values, infos) => {
			// [!code focus:7]
			const info = infos.Visible; // This will be a GenericInfo<boolean>

			if (info.__new !== info.__old) {
				component.Visible = info.__new;
			}
		});

		return () => {
			component.Destroy();
		};
	},
};
```

:::

### `ListenControl` Utility

UI Labs has a utility function called `ListenControl(info, callback)` that does this old/new check for you. You simply call this function inside the `subscribe` callback and it will check if the control changed.

::: details Example
::: code-group

```lua [Luau]
local UILabs = require(...)
local ListenControl = UILabs.ListenControl

local controls = {
   Visible = true,
}

local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")
      component.Visible = props.controls.visible  -- first update
      component.Parent = props.target

      props.subscribe(function(values, infos) -- // [!code focus:5]
         ListenControl(infos.visible, function(newValue)
            component.Visible = newValue
         end)
      end)

      return function()
         component:Destroy()
      end
   end
}
```

```tsx [Roblox-TS]
import { ListenControl, InferGenericProps } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = new Instance("Frame");
		component.Visible = props.controls.Visible; // first update
		component.Parent = props.target;

		props.subscribe((values, infos) => {
			// [!code focus:5]
			ListenControl(infos.Visible, (newValue) => {
				component.Visible = newValue;
			});
		});

		return () => {
			component.Destroy();
		};
	},
};
```

:::

::: details Implementation
This is how the `ListenControl` utility is implemented in case you wanna implement it yourself.

```lua [Luau]
local function ListenControl(info, callback)
   local oldValue = info.__old
   local newValue = info.__new

   if oldValue ~= newValue then
      callback(newValue)
   end
end
```

:::

## Using a custom UI Library

This type of story is not tied to a specific library. You can use any library.

There are some utilities that UI Labs provides to help you with this.

### CreateControlStates

<span class="type-declaration"><span class="type-function-name">CreateControlStates</span>(<span class="type-name">converted</span>,
<span class="type-name">controls</span>,
<span class="type-name">creator</span>)</span>

This function will use the `converted` table key to create control state values (similar to `Fusion.Value`) for your UI Library.

---

::: code-group

```lua [Luau]
local UILabs = require(...)
local CreateControlStates = UILabs.CreateControlStates

-- We're gonna use an imaginary library called Lib for this example

local controls = { ... }

local story = {
   controls = controls,
   render = function(props)
      local states = CreateControlStates(props.converted, props.controls, function(value) -- // [!code focus:3]
         return Lib.State(value) -- This is how the library would create a state
      end)

      return function()
         -- Cleanup
      end
   end
}
```

```tsx [Roblox-TS]
import { CreateControlStates, InferGenericProps } from "@rbxts/ui-labs"

// We're gonna use an imaginary library called Lib for this example

const controls = { ... }

const story = {
   controls: controls,
   render: (props: InferGenericProps<typeof controls>) => {
      const states = CreateControlStates(props.converted, props.controls, (value) => { // [!code focus:3]
         return Lib.State(value) // This is how the library would create a state
      })

      return () => {
         // Cleanup
      }
   }
}
```

:::

::: details Implementation
This is how the `CreateControlStates` utility is implemented, in case you want to re-implement this yourself:

```lua [Luau]
local function CreateControlStates(converted, controls, creator)
   local states = {}

   for key, control in pairs(converted) do
      local controlValue = controls[key]

      if control.EntryType == "ControlGroup" then -- control is a control group, we need to recurse
         states[key] = CreateControlStates(control.Controls, controlValue, creator)
         continue
      end
      states[key] = creator(controlValue)
   end

   return states
end
```

:::

::: danger Roblox-TS Typing
Typing for `CreateControlStates` wont be possible in typescript as this requires Higher Kinded Types ( HKT ) to infer it correctly which typescript doesnt support.
However, there's a workaround for this.

::: details Workaround

The function wont be able to infer the type of the states, but this will return `any` so you can cast it to the correct type.

UI Labs exports a `HKT` type to make this possible. The sintax is weird, but follow these examples below.

---

::: code-group

```ts [Fusion Value]
import Fusion from "@rbxts/fusion";
import { HKT, InferCreatedControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
	Value: "foo",
};

// we will use the "new" function as the creator, it will have x as the type of the control
interface FusionValueCreator extends HKT {
	new: (x: this["T"]) => Fusion.Value<typeof x>; // use typeof x to get the type of the control
}

// This will have the correct types, we just need to cast it
type FusionValues = InferCreatedControls<typeof controls, FusionValueCreator>;

const states: FusionValues = CreateControlStates(props.converted, props.controls, (value) => {
	return Fusion.Value(value);
});

states.Visible; // Fusion.Value<boolean>
states.Value; // Fusion.Value<string>
```

```ts [Iris State]
import { State } from "@rbxts/iris/out/IrisDeclaration";
import { HKT, InferCreatedControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
	Value: "foo",
};

// we will use the "new" function as the creator, it will have x as the type of the control
interface IrisStateCreator extends HKT {
	new: (x: this["T"]) => State<typeof x>; // use typeof x to get the type of the control
}

// This will have the correct types, we just need to cast it
type IrisStates = InferCreatedControls<typeof controls, IrisStateCreator>;

const states: IrisStates = CreateControlStates(props.converted, props.controls, (value) => {
	return Iris.State(value);
});

states.Visible; // Iris.State<boolean>
states.Value; // Iris.State<string>
```

```ts [Vide Source]
import Vide from "@rbxts/vide";
import { HKT, InferCreatedControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
	Value: "foo",
};

// we will use the "new" function as the creator, it will have x as the type of the control
interface VideSourceCreator extends HKT {
	new: (x: this["T"]) => Vide.Source<typeof x>; // use typeof x to get the type of the control
}

// This will have the correct types, we just need to cast it
type VideSources = InferCreatedControls<typeof controls, VideSourceCreator>;

const states: VideSources = CreateControlStates(props.converted, props.controls, (value) => {
	return Vide.source(value);
});

states.Visible; // Video.Source<boolean>
states.Value; // Video.Source<string>
```

:::

### UpdateControlStates

<span class="type-declaration"><span class="type-function-name">UpdateControlStates</span>(<span class="type-name">states</span>,
<span class="type-name">converted</span>,
<span class="type-name">controls</span>,
<span class="type-name">updater</span>)</span>

This function will update the control states returned by `CreateControlStates` with the new values. It should be called inside the `subscribe` callback.

---

::: code-group

```lua [Luau]
local UILabs = require(...)
local CreateControlStates = UILabs.CreateControlStates
local UpdateControlStates = UILabs.UpdateControlStates

-- We will use an imaginary library called Lib for this example

local controls = { ... }

local story = {
   controls = controls,
   render = function(props)
      local states = CreateControlStates(props.converted, props.controls, function(value)
         return Lib.State(value) -- This is how the library would create a state
      end)

      props.subscribe(function(values) -- // [!code focus:5]
         UpdateControlStates(states, props.converted, values, function(state, value)
            return state:set(value) -- This is how the library would update a state
         end)
      end)

      return function()
         -- Cleanup
      end
   end
}
```

```tsx [Roblox-TS]
import { CreateControlStates, UpdateControlStates, InferGenericProps } from "@rbxts/ui-labs"

// We will use an imaginary library called Lib for this example

const controls = { ... }

const story = {
   controls: controls,
   render: (props: InferGenericProps<typeof controls>) => {
      const states = CreateControlStates(props.converted, props.controls, (value) => {
         return Lib.State(value) // This is how the library would create a state
      })

      props.subscribe((values) => { // [!code focus:6]
         // "state" argument will be typed as any, you need to cast it to the correct type
         UpdateControlStates(states, props.converted, values, (state: Lib.State<any>, value) => {
            return state.set(value) // This is how the library would update a state
         })
      })

      return () => {
         // Cleanup
      }
   }
}
```

:::

::: details Implementation

This is how the `UpdateControlStates` utility is implemented, in case you want to re-implement this yourself:

```lua [Luau]
local function UpdateControlStates(states, converted, controls, updater)
   for key, control in pairs(converted) do
      local controlValue = controls[key]

      if control.EntryType == "ControlGroup" then -- control is a control group, we need to recurse
         UpdateControlStates(states[key], control.Controls, controlValue, updater)
         continue
      end
      updater(states[key], controlValue)
   end
end
```

:::

## Examples

Let's see how we can re-implement the already supported libraries with Generic Stories to get used to using them.

::: tip Tip
If you are gonna use a library for your stories, It's recommended to abstract it with your own utility so you dont have to write the same boilerplate code over and over again.
:::

---

::: details React
::: code-group

```lua [Luau]
local React = require(...)
local ReactRoblox = require(...)

local controls = {
   Visible = true,
}

-- This would be the `story` function key
local function RenderComponent(controls) {
   return React.createElement("Frame", {
      Visible = controls.Visible
   })
}

local story = {
   controls = controls,
   render = function(props)
      local component = Render(props.controls)
      local root = ReactRoblox.createRoot(props.target)
      root:render(component)

      props.subscribe(function(values)
         local newComponent = Render(values)
         root:render(newComponent)
      end)

      return function()
         root:unmount()
      end
   end
}
```

```tsx [Roblox-TS]
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferGenericProps, InferControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

// This would be the `story` function key
function RenderComponent(controls: InferControls<controls>) {
	return <frame Visible={controls.Visible} />;
}

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = Render(props.controls);
		const root = ReactRoblox.createRoot(props.target);
		root.render(component);

		props.subscribe((values) => {
			const newComponent = Render(values);
			root.render(newComponent);
		});

		return () => {
			root.unmount();
		};
	},
};
```

:::

::: details Roact
::: code-group

```lua [Luau]
local Roact = require(...)

local controls = {
   Visible = true,
}

-- This would be the `story` function key
function RenderComponent(controls) {
   return Roact.createElement("Frame", {
      Visible = controls.Visible
   })
}

local story = {
   controls = controls,
   render = function(props)
      local component = RenderComponent(props.controls)
      local tree = Roact.mount(component, props.target)

      props.subscribe(function(values)
         local newComponent = RenderComponent(values)
         Roact.update(tree, newComponent)
      end)

      return function()
         React.unmount(tree)
      end
   end
}
```

```tsx [Roblox-TS]
import Roact from "@rbxts/roact";
import { InferGenericProps, InferControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

// This would be the `story` function key
function RenderComponent(controls: InferControls<controls>) {
	return <frame Visible={controls.Visible} />;
}

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = RenderComponent(props.controls);
		const tree = Roact.mount(component, props.target);

		props.subscribe((values) => {
			const newComponent = RenderComponent(values);
			Roact.update(tree, newComponent);
		});

		return () => {
			React.unmount(tree);
		};
	},
};
```

:::

::: details Fusion

For Fusion, we are gonna use the `CreateControlStates` and `UpdateControlStates` utilities.

::: code-group

```lua [Luau]
local Fusion = require(...)

local UILabs = require(...)
local CreateControlStates = UILabs.CreateControlStates
local UpdateControlStates = UILabs.UpdateControlStates

local controls = {
   Visible = true,
}

local story = {
   controls = controls,
   render = function(props)
      local states = CreateControlStates(props.converted, props.controls, function(value)
         return Fusion.Value(value)
      end)

      local component = Fusion.New "Frame" {
         Parent = props.target,
         Visible = states.Visible, -- This will be a Fusion.Value<boolean>
      }

      props.subscribe(function(values)
         UpdateControlStates(states, props.converted, values, function(state, value)
            return state:set(value)
         end)
      end)

      return function()
         component:Destroy()
      end
   end
}
```

```tsx [Roblox-TS]
import Fusion from "@rbxts/fusion";
import { InferGenericProps, InferCreatedControls, CreateControlStates, UpdateControlStates, HKT } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

// Type problem discussed above, we will use this to type the states
interface FusionValueCreator extends HKT {
	new: (x: this["T"]) => Fusion.Value<typeof x>;
}
type FusionValues = InferCreatedControls<typeof controls, FusionValueCreator>;

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		ks;
		const states: FusionValues = CreateControlStates(props.converted, props.controls, (value) => {
			return Fusion.Value(value);
		});

		const component = Fusion.New("Frame")({
			Parent: props.target,
			Visible: states.Visible, // This will be a Fusion.Value<boolean>
		});

		props.subscribe((values) => {
			// we need to cast "state" to the correct type
			UpdateControlStates(states, props.converted, values, (state: Fusion.Value<any>, value) => {
				return state.set(value);
			});
		});

		return () => {
			component.Destroy();
		};
	},
};
```

:::

## Using the Story Creator

You can use the story creators to create your story. These will infer the control types for Roblox-TS.

```ts
function CreateGenericStory(info, render): StoryTable;
```

::: details Example

::: code-group

```lua [Luau]
local UILabs = require(...)
local CreateGenericStory = UILabs.CreateGenericStory

local story = CreateGenericStory({
   controls = {},
}, function(props)
   local component = Instance.new("Frame")
   component.Parent = props.target

   props.subscribe(function(values)
      print("controls changed", values)
   end)

   return function()
      component:Destroy()
   end
end)
```

```tsx [Roblox-TS]
import { CreateGenericStory } from "@rbxts/ui-labs";

const story = CreateGenericStory(
	{
		controls: {},
	},
	(props) => {
		const component = new Instance("Frame");
		component.Parent = props.target;

		props.subscribe((values) => {
			print("controls changed", values);
		});

		return () => {
			component.Destroy();
		};
	},
);
```
