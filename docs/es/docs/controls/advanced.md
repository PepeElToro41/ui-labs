# Controles Avanzados

Los controles avanzados permiten configurar valores más complejos en las historias. <br/>
<span class="tiphelp">Estos controles no se encuentran disponibles en Flipbook</span>

Estos son creados manualmente utilizando los constructores disponibles en el [Paquete de Utilidades](/es/docs/installation#instalacion-del-paquete-de-utilidades).

Estos son los controles avanzados disponibles actualmente:

## Control Deslizante (Slider)

El control de **Slider** te permite añadir un número dentro de un rango, se muestra como un control deslizante con una entrada numérica. Este control toma un valor mínimo y máximo como el rango.

<img class="image-label" src="/docs/controls/advanced/slider.png" alt="slider" />

---

<span class="type-declaration"><span class="type-function-name">Slider</span>(<span class="type-name">def</span>,
<span class="type-name">min</span>,
<span class="type-name">max</span>,
<span class="type-name-opt">step</span>? )</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> def </span><span class="type-highlight">number</span>
    <span class="arguments-body"> Valor predeterminado </span>
-   <span class="argument-name"> min </span><span class="type-highlight">number</span>
    <span class="arguments-body"> El valor mínimo del rango </span>
-   <span class="argument-name"> max </span><span class="type-highlight">number</span>
    <span class="arguments-body"> El valor mínimo del rango </span>
-   <span class="argument-name"> step </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> La cantidad de incremento/disminución por cada sección. Si no se le asigna uno,
    <span class="nowrap">este sera continuo<span class="tiphelp">&nbsp;&nbsp; Predeterminado: nil</span></span></span>

## Control de Tipo RGBA

Este control es similar al control primitivo de tipo Color3, pero este te permite modificar el valor alfa del color. El valor alfa se convierte en transparencia cuando se usa en tu historia.

El tipo del control será: <span class="type-declaration"> {
<span class="type-name">Color:</span><span class="type-highlight">Color3</span>,
<span class="type-name">Transparency:</span><span class="type-highlight">number</span>
}</span>

<img class="image-label" src="/docs/controls/advanced/rgba.png" alt="rgba" />

---

<span class="type-declaration"><span class="type-function-name">RGBA</span>(<span class="type-name">def</span>,
<span class="type-name-opt">transparency</span>? )</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> def </span><span class="type-highlight">Color3</span>
    <span class="arguments-body"> Valor predeterminado de color </span>
-   <span class="argument-name"> transparency </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> Valor predeterminado de transparencia </span> <span class="tiphelp">&nbsp;&nbsp; Predeterminado: 0</span>

## Control de Selección Múltiple (Choose)

El control **Choose** te permite seleccionar entre un conjunto de opciones, y se muestra como un menú desplegable con las opciones como entradas.

Los valores posibles para esto son: <span class="item-description">Tablas, Tipos de Datos, Enumeraciones, Funciones, Primitivos</span>. Puedes mezclar tipos, pero no se recomienda.

<img class="image-label" src="/docs/controls/advanced/choose.png" alt="choose" />

---

<span class="type-declaration"><span class="type-function-name">Choose</span>(<span class="type-name">options</span>,
<span class="type-name-opt">index</span>? ,
<span class="type-name-opt">widen</span>? )</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> options </span><span class="type-highlight">Array</span>
    <span class="arguments-body"> Matriz de las opciones posibles</span>
-   <span class="argument-name"> index </span><span class="type-highlight">number</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> Índice de la opción predeterminada </span> <span class="tiphelp">&nbsp;&nbsp; Predeterminado: 1</span>
-   <span class="argument-name"> widen </span><span class="type-highlight">boolean</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> Si se establece como verdadero, el tipo de control se ampliará (solo en TypeScript) </span> <span class="tiphelp">&nbsp;&nbsp; Predeterminado: false</span>

## Control de Tipo EnumList

El control de tipo **EnumList** es similar al control *Choose*, pero este te permite darle un nombre a tus opciones. Esto es útil cuando el valor por sí mismo no proporciona suficiente información.

Puedes usar los mismos tipos que en el control de *Choose*, y puedes mezclar tipos, pero nuevamente, no se recomienda.

<img class="image-label" src="/docs/controls/advanced/enumlist.png" alt="enumlist" />

---

<span class="type-declaration"><span class="type-function-name">EnumList</span>(<span class="type-name">list</span>,
<span class="type-name">key</span>,
<span class="type-name-opt">widen</span>? )</span>

<span class="item-description">Argumentos</span>

-   <span class="argument-name"> list </span><span class="type-highlight">{ string: any }</span>
    <span class="arguments-body"> Registro de opciones posibles </span>
-   <span class="argument-name"> key </span><span class="type-highlight">keyof list</span>
    <span class="arguments-body"> Clave de la opción predeterminada, esto es requerido </span> <span class="tiphelp">&nbsp;&nbsp; Predeterminado: 1</span>
-   <span class="argument-name"> widen </span><span class="type-highlight">boolean</span><span class="props-table-optional">Opcional</span>
    <span class="arguments-body"> Si se da como verdadero, el tipo de control se ampliará (solo TypeScript) </span> <span class="tiphelp">&nbsp;&nbsp; Predeterminado: false</span>

---

::: tip Tipos Ampliados / Widened Types <spasn class="tiphelp">(solo TypeScript)</spasn>

Los controles Choose y EnumList aceptan un tercer parámetro <span class="item-description">widen</span>.

Este parámetro no cambia nada durante la ejecución, pero si se da el valor `true`, los valores del control se generalizarán en lugar de usar los literales de valor.

::: details Ejemplo

```ts
Choose(["One", "Two", "Three"], 0, false); // type: "One" | "Two" | "Three"
Choose(["One", "Two", "Three"], 0, true); // type: string

Choose([1, 2, 3], 0, false); // type: 1 | 2 | 3
Choose([1, 2, 3], 0, true); // type: number
```

:::

::: details Ejemplo

Lets use all of them in a more real context:

```lua [Luau]
local UILabs = require(...) -- Ubicación de tu Paquete de Utilidades

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

   Volume = UILabs.Slider(50, 0, 100, 1), -- solo tiene valores enteros
   FrameColor = UILabs.RGBA(Color3.new(1, 1, 1), 0) -- también tendrás que establecer el BackgroundTransparency
}

local story = {
   controls = controls,
   story = ...
}

return story
```

:::
