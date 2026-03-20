# Advanced Controls

Advanced controls allow you to configure more complex values for your stories. <br/>
<span class="tiphelp">These controls are not available in Flipbook</span>

They are created with the provided constructors in the [Utility Package](/docs/installation#utilities-package)

These are the currently available advanced controls:

## Slider Control

Slider control allows you to add a number between a range, it gets displayed as a Slider with a number input, this control takes a min and max as the range

<img class="image-label" src="/docs/controls/advanced/slider.png" alt="slider" />

---

<span class="type-declaration"><span class="type-function-name">Slider</span>(<span class="type-name">def</span>,
<span class="type-name">min</span>,
<span class="type-name">max</span>,
<span class="type-name-opt">step</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> def </span><span class="type-highlight">number</span>
    <span class="arguments-body"> Default control value </span>
-   <span class="argument-name"> min </span><span class="type-highlight">number</span>
    <span class="arguments-body"> Minimum value range </span>
-   <span class="argument-name"> max </span><span class="type-highlight">number</span>
    <span class="arguments-body"> Maximum value range </span>
-   <span class="argument-name"> step </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> The increment/decrement step of the control, if not given
    <span class="nowrap">the slider will be continuous<span class="tiphelp">&nbsp;&nbsp; Default: nil</span></span></span>

## RGBA Control

RGBA control is similar to the Color3 primitive, but this one allows you to modify the alpha value of the color.<br/>
The alpha value gets converted to transparency when used in your story.

The control type will be: <span class="type-declaration"> {
<span class="type-name">Color:</span><span class="type-highlight">Color3</span>,
<span class="type-name">Transparency:</span><span class="type-highlight">number</span>
}</span>

<img class="image-label" src="/docs/controls/advanced/rgba.png" alt="rgba" />

---

<span class="type-declaration"><span class="type-function-name">RGBA</span>(<span class="type-name">def</span>,
<span class="type-name-opt">transparency</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> def </span><span class="type-highlight">Color3</span>
    <span class="arguments-body"> Default color value </span>
-   <span class="argument-name"> transparency </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> Default transparency value </span> <span class="tiphelp">&nbsp;&nbsp; Default: 0</span>

## Choose Control

Choose control allows you to select between a set of options, it gets displayed as a dropdown with the options as the entries.

Possible values for this are: <span class="item-description">Tables, Datatypes, Enums, Functions, Primitives</span>. You can mix types but this is not recommended.

<img class="image-label" src="/docs/controls/advanced/choose.png" alt="choose" />

---

<span class="type-declaration"><span class="type-function-name">Choose</span>(<span class="type-name">options</span>,
<span class="type-name-opt">index</span>? ,
<span class="type-name-opt">widen</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> options </span><span class="type-highlight">Array</span>
    <span class="arguments-body"> Array of possible options </span>
-   <span class="argument-name"> index </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> Index of the default option </span> <span class="tiphelp">&nbsp;&nbsp; Default: 1</span>
-   <span class="argument-name"> widen </span><span class="type-highlight">boolean</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> If true given, the control type will be widened (typescript only) </span> <span class="tiphelp">&nbsp;&nbsp; Default: false</span>

## Enum List Control

Enum list control is similar to choose, but this one allows you to give a name to your options.<br/>
This is useful when the value itself doesn't provide enough information.

You can use the same types as Choose, and you can miix types, but this is, again, not recommended.

<img class="image-label" src="/docs/controls/advanced/enumlist.png" alt="enumlist" />

---

<span class="type-declaration"><span class="type-function-name">EnumList</span>(<span class="type-name">list</span>,
<span class="type-name">key</span>,
<span class="type-name-opt">widen</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> list </span><span class="type-highlight">{ string: any }</span>
    <span class="arguments-body"> Record of possible options </span>
-   <span class="argument-name"> key </span><span class="type-highlight">keyof list</span>
    <span class="arguments-body"> Key of the default option, this is required </span> <span class="tiphelp">&nbsp;&nbsp; Default: 1</span>
-   <span class="argument-name"> widen </span><span class="type-highlight">boolean</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> If true given, the control type will be widened (typescript only) </span> <span class="tiphelp">&nbsp;&nbsp; Default: false</span>

---

::: tip Widened Types <spasn class="tiphelp">(typescript only)</spasn>

Choose and EnumList controls accept a third <span class="item-description">widen</span> parameter.

This parameter doesn't change anything on runtime, but if `true` is given, the control values will be generalized instead of the value literals

::: details Example

```ts
Choose(["One", "Two", "Three"], 0, false); // type: "One" | "Two" | "Three"
Choose(["One", "Two", "Three"], 0, true); // type: string

Choose([1, 2, 3], 0, false); // type: 1 | 2 | 3
Choose([1, 2, 3], 0, true); // type: number
```

:::

::: details Example

Lets use all of them in a more real context:

```lua [Luau]
local UILabs = require(...) -- Path of your Utility Package

local controls = {
   -- [[ Choose ]] --
   Theme = UILabs.Choose({"Dark", "Light"}),
   Currency = UILabs.Choose({"Coins", "Gems"}),

   -- [[ EnumList ]] --
   WindowSize = UILabs.EnumList({
      Mobile = 500,
      Tablet = 1000,
      Desktop = 1500,
   }, "Mobile"),
   TextColor = UILabs.EnumList({
      Red = Color3.new(1, 0, 0),
      Green = Color3.new(0, 1, 0),
      Blue = Color3.new(0, 0, 1),
   }, "Red"),

   Volume = UILabs.Slider(50, 0, 100, 1), -- it only has integer values
   FrameColor = UILabs.RGBA(Color3.new(1, 1, 1), 0) -- you will need to set BackgroundTransparency too
}

local story = {
   controls = controls,
   story = ...
}

return story
```

:::


## Object Control

Object control will let you select a roblox Instance in the explorer, you can constraint what instance can be selected.

The type for this control can be nil as the instance can be destroyed at any time. It's recommended that your code can handle nil values.


<img class="image-label" src="/docs/controls/advanced/enumlist.png" alt="enumlist" />

---


<span class="type-declaration"><span class="type-function-name">Object</span>(<span class="type-name-opt">className</span>?,
<span class="type-name-opt">def</span>? ,
<span class="type-name-opt">predicator</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> className </span><span class="type-highlight">string</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> The required classname of the Instance to be selected, this is compared with `Instance:IsA`, so superclasses are also accepted </span> <span class="tiphelp">&nbsp;&nbsp; Default: "Instance"</span>
-   <span class="argument-name"> def </span><span class="type-highlight">Instance</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> Default instance </span> <span class="tiphelp">&nbsp;&nbsp; Default: nil</span>
-   <span class="argument-name"> predicator </span><span class="type-highlight">function</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> A function that receives the selected instance and returns a boolean, if the function returns false, the instance will not be assigned </span> <span class="tiphelp">&nbsp;&nbsp; Default: nil</span>