# Montaje Múltiple

UI Labs te permite montar varias historias al mismo tiempo, incluso si son del mismo módulo.<br/>
Esto es útil para crear borradores con componentes separados o para comparar diferentes historias.

Cada una de estas historias tendrá su propio entorno y no interactuarán entre sí.
También actualizarán los cambios de manera independiente.

Para lograr lo anterior, da <span class="item-description">Clic Derecho</span> en tu historia y selecciona <span class="button-reference">Mount On Top</span> <span class="tiphelp">(Montar Encima)</span>

<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/storydropdown.png" alt="mountontop">
   <div class="mountontop-selector" />
</div>

Ahora que tenemos dos historias montadas a la vez, podrás ver dos pestañas en la parte superior y un número al lado de la historia que te indicará cuántas de ellas están montadas. El *ZIndex* será determinado por el orden de las pestañas.

Al hacer <span class="item-description">Clic Izquierdo</span> sobre una historia, como lo harías normalmente, esta se montará en la *Pestaña Principal*.<br/> Esto también desmontará la *Pestaña Principal* actual.

La Pestaña Principal tendrá un punto pequeño • al comienzo

<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/multimounting/multitabs.png" alt="multitabs">
   
   <div class="main-tab-selector" />
   <span class="main-tab-description"><b>•</b> Pestaña Principal</span>
   
   <div class="new-tab-selector" />
   <span class="new-tab-description">Pestaña Nueva</span>
   
   <div class="tabs-amount-selector" />
   <span class="tabs-amount-description">Cantidad de Pestañas</span>
</div>

::: tip Pestaña Seleccionada

Las acciones del plugin se aplicarán a la pestaña seleccionada, como lo pueden ser:

   - Botones de la barra de herramientas
   - Controles
   - Movimiento y zoom

:::


## Montar a un Widget

Puedes utilizar una ventana de widget separada para tus historias.<br/>
Esto habilita: el modo pantalla completa, interfaces sin distracciones, visualización tipo plugin y configuraciones de múltiples monitores.

Da clic derecho sobre tu historia y selecciona <span class="button-reference">Mount in Widget</span> <span class="tiphelp">(Montar en Widget)</span>

<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/multimounting/mountinwidget.png" alt="mountinwidget">
   
   <div class="widget-tab-selector" />
   <span class="widget-tab-description" >Pestaña de Widget</span>
   
   <div class="widget-window-selector" />
   <span class="widget-window-description" >Ventana Separada</span>

   <div class="mountinwidget-selector" />
</div>

Puedes alternar entre el modo Widget y Editor presionando la pestaña de tu historia<br/>
y seleccionando <span class="button-reference">Mount in Editor</span> <span class="tiphelp">(Montar en Editor)</span> o <span class="button-reference">Mount in Widget</span> <span class="tiphelp">(Montar en Widget)</span>

<div style="display: flex; flex-direction: row; gap: 10px;">
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -170px;">
         <img src="/docs/plugin/multimounting/mountineditor.png" alt="mountineditor">
         <div class="ineditor-selector" />
      </div>
   </div>
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -170px;">
         <img src="/docs/plugin/previewdropdown.png" alt="hide">
         <div class="inwidget-selector" />
      </div> 
   </div> 
</div> 