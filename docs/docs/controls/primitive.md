# Primitive Controls

Primitive Controls are the simplest controls. They can be created by specifying the literal value you want to use.<br/>
<span class="tiphelp">This is how Flipbook's controls are created</span>

These controls are a shorthand for the `Primitive Control Object` which is what UI Labs uses internally.

UI Labs will automatically search for literal values in your story and create the control values for you.<br/>
But you can also create them manually, sometimes, allowing you to further customize some of them.

---

Supported Primitives are:

-   `String`
-   `Number`
-   `Boolean`
-   `Color3`

---

Let's create all of them with literal values:

::: code-group

```lua [Luau] {2-5}
local controls = {
   String = "Hello UI Labs!",
   Number = 10,
   Boolean = true,
   Color3 = Color3.fromRGB(255, 0, 0),
}

local story = {
   controls = controls,
   story = ...
}
```

```ts [Roblox-TS] {2-5}
const controls = {
   String: "Hello UI Labs!",
   Number: 10,
   Boolean: true,
   Color3: Color3.fromRGB(255, 0, 0),
}

const story = {
   controls: controls,
   story: ...
}
```

:::

## Creating Primitive Controls Manually

As we said earlier, providing the literal is a shorthand, You can create them manually with the provided constructors in the
[Utility Package](/docs/installation#utilities-package)

These are the constructors:

## String Control

<img class="image-label" src="/docs/controls/primitive/string.png" alt="string" />

---

<span class="type-declaration"><span class="type-function-name">String</span>(<span class="type-name">def</span>,
<span class="type-name-opt">filters</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> def: </span><span class="type-highlight">string</span>
    <span class="arguments-body"> Default control value </span>
-   <span class="argument-name"> filters: </span><span class="type-highlight">Array</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> Array of filters that changes the input, They are functions that takes the new input and the old input, and returns a filtered input. These filters are applied in order of the array </span>

## Number Control

<img class="image-label" src="/docs/controls/primitive/number.png" alt="number" />

---

<span class="type-declaration"><span class="type-function-name">Number</span>(
<span class="type-name">def</span>,
<span class="type-name-opt">min</span>? ,
<span class="type-name-opt">max</span>? ,
<span class="type-name-opt">step</span>? ,
<span class="type-name-opt">dragger</span>? ,
<span class="type-name-opt">sens</span>? )</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> def </span><span class="type-highlight">number</span>
    <span class="arguments-body"> Default control value </span>
-   <span class="argument-name"> min </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> Minimum accepted value </span><span class="tiphelp">&nbsp;&nbsp; Default: -inf</span>
-   <span class="argument-name"> max </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> Maximum accepted value </span><span class="tiphelp">&nbsp;&nbsp; Default: inf</span>
-   <span class="argument-name"> step </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> The increment/decrement step of the control</span>
    <span class="tiphelp">&nbsp;&nbsp; Default: nil</span>
-   <span class="argument-name"> dragger </span><span class="type-highlight">boolean</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> If the control should have a drag handle </span><span class="tiphelp">&nbsp;&nbsp; Default: true</span>
-   <span class="argument-name"> sens </span><span class="type-highlight">number</span><span class="props-table-optional">Optional</span>
    <span class="arguments-body"> The sensitivity of the control. If not given, the `def` argument will be used </span><span class="tiphelp">&nbsp;&nbsp; Default: `def`</span>

## Boolean Control

<img class="image-label" src="/docs/controls/primitive/boolean.png" alt="boolean" />

---

<span class="type-declaration"><span class="type-function-name">Boolean</span>(<span class="type-name">def</span>)</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> def </span><span class="type-highlight">boolean</span>
    <span class="arguments-body"> The default value of the control</span>

## Color3 Control

<img class="image-label" src="/docs/controls/primitive/color3.png" alt="color3" />

---

<span class="type-declaration"><span class="type-function-name">Color3</span>(<span class="type-name">def</span>)</span>

<span class="item-description">Arguments</span>

-   <span class="argument-name"> def </span><span class="type-highlight">Color3</span>
    <span class="arguments-body"> The default value of the control</span>

##

::: details Example
Lets create all of them using the constructors:

::: code-group

```lua [Luau]
local UILabs = require(...) -- Path of your Utility Package
local Datatype = UILabs.Datatype

local controls = {
   String = UILabs.String("Hello UI Labs!"),
   Number = UILabs.Number(10),
   Boolean = UILabs.Boolean(true),

   -- Color3 is inside "Datatype", this is to avoid name collisions
   Color3 = Datatype.Color3(Color3.fromRGB(255, 0, 0))
}

local story = {
   controls = controls,
   story = ...
}
```

```tsx [Roblox-TS]
import { Datatype, String, Number, Boolean, Color3 } from "@rbxts/ui-labs"

const controls = {
   String: String("Hello UI Labs!"),
   Number: Number(10),
   Boolean: Boolean(true),

   // Color3 is inside "Datatype", this is to avoid name collisions
   Color3: Datatype.Color3(Color3.fromRGB(255, 0, 0))
}

const story = {
   controls: controls,
   story: ...
}
```

:::
