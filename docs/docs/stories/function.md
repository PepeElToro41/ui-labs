# Function Stories

Function stories are the basic stories, they are functions that UI Labs will run when the story is mounted.

These functions are used in [Hoarcekat](https://github.com/Kampfkarren/hoarcekat) 

## Mounting the story

These functions will receive a `target` as a parameter, which is the Frame where the story should be rendered.

::: code-group

```lua [Luau]
function story(target: Frame)
   -- Render your story here inside "target"
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
   // Render your story here inside "target"
}

export = story;
```

:::

## Cleaning up

After the function is executed, it should return a cleanup function that will be called when the story is unmounted.

::: code-group

```lua [Luau] {4-6}
function story(target: Frame)
   -- Render your story here inside "target"

   return function()
      -- Clean up your story here
   end
end
```

```ts [Roblox-TS] {4-6}
function story(target: Frame) {
   // Render your story here inside "target"

   return () => {
	   // Clean up your story here
   };
}

export = story;
```

:::


::: danger Story Erroring
The cleanup function cant be executed if the mounting function errors. If the story did mount, a **Studio restart** may be needed to avoid memory leaks and non-destroyed Instances

<span class="dangertip">UI Labs will warn you about this</span>

```lua {5}
local function story(target)
   local newElement = Roact.createElement("TextLabel", {})
   local handle = Roact.mount(newElement, target) --Roact mounted

   error("error") --Will prevent the cleanup function from being returned
   return function()
      --Never unmounts
      Roact.unmount(handle)
   end
end
```

:::


## Examples

::: details React / Roact
::: code-group

```lua [Luau]
local function story(target)
   local component = Roact.createElement("Frame", {})
   Roact.mount(component, target)

   return function()
      Roact.unmount(component)
   end
end

return story
```



```tsx [Roblox-TS]
function story(target: Frame) {
   const component = <frame />
   Roact.mount(component, target)

   return () => {
      Roact.unmount(component)
   };
}

export = story;
```
 
:::


::: details Fusion
::: code-group

```lua [Luau]
local function story(target: Frame)
   local component = Fusion.New "Frame" {
      Parent = target,
   }

   return function()
      component:Destroy()
   end
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
   const component = Fusion.New("Frame")({
      Parent: target,
   }); 
	
   return () => {
      component:Destroy()
   }
}

export = story;
```

:::

::: details Roblox Instances 
::: code-group 

```lua [Luau]
local function story(target: Frame)
   local component = Instance.new("Frame")
   component.Parent = target

   return function()
      component:Destroy()
   end
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
   const component = new Instance("Frame")
   component.Parent = target
	
   return () => {
      component.Destroy()
   };
}

export = story;
```