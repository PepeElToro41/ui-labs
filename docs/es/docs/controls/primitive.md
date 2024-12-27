# Controles Primitivos

Los controles primitivos son el tipo más básico de controles. Se pueden crear especificando el valor literal que deseas usar.<br />
<span class="tiphelp">Así es como se crean los controles en Flipbook</span>

Estos controles son una abreviatura de `Primitive Control Object` <span class="tiphelp">(Objeto de Control Primitivo)</span>, que es lo que UI Labs utiliza internamente.

UI Labs buscará automáticamente valores literales en tu historia y creará los valores de control por ti.<br />
Sin embargo, también puedes crearlos manualmente, lo que a veces te permite personalizarlos aún más.

---

Tipos de valores primitivos compatibles:

-   `String`
-   `Number`
-   `Boolean`
-   `Color3`

---

Vamos a crear todos ellos utilizando valores literales:

::: code-group

```lua [Luau] {2-5}
local controls = {
   String = "Hola UI Labs!",
   Number = 10,
   Boolean = true,
   Color3 = Color3.fromRGB(255, 0, 0),
}

local story = {
   controls = controls,
   story = ...
}

return story
```

```ts [Roblox-TS] {2-5}
const controls = {
   String: "Hola UI Labs!",
   Number: 10,
   Boolean: true,
   Color3: Color3.fromRGB(255, 0, 0),
}

const story = {
   controls: controls,
   story: ...
}

export = story;
```

:::

## Cómo Crearlos Manualmente

Como mencionamos anteriormente, proporcionar el valor literal es una forma abreviada. También puedes crearlos manualmente utilizando los constructores disponibles en el [Paquete de Utilidades](/es/docs/installation#instalacion-del-paquete-de-utilidades).

Estos son los constructores:

## Control de Tipo String

<img class="image-label" src="/docs/controls/primitive/string.png" alt="string" />

---

<span class="type-declaration"><span class="type-function-name">String</span>(<span class="type-name">def</span>,
<span class="type-name-opt">filters</span>? )</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> def: </span><span class="type-highlight">string</span>
    <span class="arguments-body"> Valor predeterminado </span>
-   <span class="argument-name"> filters: </span><span class="type-highlight">Array</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> Una matriz de filtros que modifica el valor impuesto. Estos filtros son funciones que reciben la nueva entrada y la antigua, devolviendo una entrada filtrada. Los filtros se aplican en el orden en que aparecen en la matriz. </span>

## Control de Tipo Number

<img class="image-label" src="/docs/controls/primitive/number.png" alt="number" />

---

<span class="type-declaration"><span class="type-function-name">Number</span>(
<span class="type-name">def</span>,
<span class="type-name-opt">min</span>? ,
<span class="type-name-opt">max</span>? ,
<span class="type-name-opt">step</span>? ,
<span class="type-name-opt">dragger</span>? ,
<span class="type-name-opt">sens</span>? )</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> def </span><span class="type-highlight">number</span>
    <span class="arguments-body"> Valor predeterminado </span>
-   <span class="argument-name"> min </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> El valor mínimo aceptado </span><span class="tiphelp">&nbsp;&nbsp; Predeterminado: -inf</span>
-   <span class="argument-name"> max </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> El valor máximo aceptado </span><span class="tiphelp">&nbsp;&nbsp; Predeterminado: inf</span>
-   <span class="argument-name"> step </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> La cantidad de incremento/disminución por cada sección</span>
    <span class="tiphelp">&nbsp;&nbsp; Predeterminado: nil</span>
-   <span class="argument-name"> dragger </span><span class="type-highlight">boolean</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> Si el control debe tener un controlador de arrastre </span><span class="tiphelp">&nbsp;&nbsp; Predeterminado: true</span>
-   <span class="argument-name"> sens </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> La sensibilidad del control. Si no se proporciona, se usará el argumento `def` </span><span class="tiphelp">&nbsp;&nbsp; Predeterminado: `def`</span>

## Control de Tipo Boolean

<img class="image-label" src="/docs/controls/primitive/boolean.png" alt="boolean" />

---

<span class="type-declaration"><span class="type-function-name">Boolean</span>(<span class="type-name">def</span>)</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> def </span><span class="type-highlight">boolean</span>
    <span class="arguments-body"> Valor predeterminado</span>

## Control de Tipo Color3

<img class="image-label" src="/docs/controls/primitive/color3.png" alt="color3" />

---

<span class="type-declaration"><span class="type-function-name">Color3</span>(<span class="type-name">def</span>)</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> def </span><span class="type-highlight">Color3</span>
    <span class="arguments-body"> Valor predeterminado</span>

##

::: details Ejemplo
Vamos a crear todos los anteriores usando los constructores:

::: code-group

```lua [Luau]
local UILabs = require(...) -- Ubicación de tu Paquete de Utilidades
local Datatype = UILabs.Datatype

local controls = {
   String = UILabs.String("Hello UI Labs!"),
   Number = UILabs.Number(10),
   Boolean = UILabs.Boolean(true),

   -- Color3 está dentro de 'Datatype', esto es para evitar colisiones de nombres
   Color3 = Datatype.Color3(Color3.fromRGB(255, 0, 0))
}

local story = {
   controls = controls,
   story = ...
}

return story
```

```tsx [Roblox-TS]
import { Datatype, String, Number, Boolean, Color3 } from "@rbxts/ui-labs"

const controls = {
   String: String("Hello UI Labs!"),
   Number: Number(10),
   Boolean: Boolean(true),

   // Color3 está dentro de 'Datatype', esto es para evitar colisiones de nombres
   Color3: Datatype.Color3(Color3.fromRGB(255, 0, 0))
}

const story = {
   controls: controls,
   story: ...
}
```

:::
