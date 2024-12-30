# Adding Controls


UI Labs let's you add Controls. They are configurable values that you can modify while visualizing your interface.<br/>
This is useful for testing different values for your UI without needing to modify your code.

You can use [Flipbook's Controls](https://flipbook-labs.github.io/flipbook/docs/writing-stories#controls) with UI Labs, but UI Labs allows for more customization and advanced controls.


<img class="image-label" src="/docs/controls/controlsshowcase.png" alt="controls" />


## Configuring Controls

You can add your controls list in the <span class="item-description">controls</span> key of your story table.<br />

We'll learn how to use controls later, first let's see how you can create them.

The controls table, is a list of values where the key is the name of the control and the value is the control declaration.

::: code-group
```lua [Luau] {2-4,8}
local controls = {
   control1 = ...,
   control2 = ...,
   control3 = ...,
}

local story = {
   controls = controls,
   story = ...
}

return story
```

```ts [Roblox-TS] {2-4,8}
const controls = {
   control1: ...,
   control2: ...,
   control3: ...,
}

const story = {
   controls: controls,
   story: ...
}

export = story;
```

:::

---

We can create two types of controls:

<div class="card-container">
  <div class="cards">
   <NavCard 
      ImgSrc="/docs/icons/primitive.svg"
      DynamicLogo=true
      MainString="Primitive Controls"
      IncludeBaseURL=true
      URL="/docs/controls/primitive"
   />
   <NavCard 
      ImgSrc="/docs/icons/advanced.svg"
      DynamicLogo=true
      MainString="Advanced Controls"
      IncludeBaseURL=true
      URL="/docs/controls/advanced"
   />
  </div>
</div>
