# Características Adicionales

Por otro lado, veamos algunas funciones y opciones adicionales que ofrece UI Labs.

<div class="image-tip-holder" style="padding-top: 60px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar.png" alt="Zoom Buttons">
      <div class="explorer-selector" />
   </div>
</div>

## Ver en el Explorador  &nbsp; <span class="item-description">E</span>
<div class="side-img-text">
Puedes ver tu historia en el explorador de Roblox seleccionando el botón <b>View In Explorer</b> <span class="tiphelp">(Ver en el Explorador)</span> en la barra lateral de herramientas.
</div>

<br />
<img class="image-label" src="/docs/plugin/extras/viewinexplorer.png" alt="viewexplorer" />

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar2.png" alt="toolbar">
      <div class="fullscreen-selector" />
   </div>
</div>

## Modo Pantalla Completa  &nbsp; <span class="item-description">F</span>
<div class="side-img-text">
Puedes alternar el modo de pantalla completa seleccionando el botón <b>Fullscreen Mode</b> <span class="tiphelp">(Modo Pantalla Completa)</span> en la barra lateral de herramientas.

Esto hará que el explorador de historias y la lista de vistas previas desaparezcan, permitiendo que la historia ocupe toda la pantalla. Haz clic nuevamente en el botón para que vuelvan a aparecer.

<img class="image-label" src="/docs/plugin/extras/fullscreen.png" alt="fullscreen">
</div>

## Recarga Automática

Por defecto, UI Labs detectará cualquier cambio en los scripts de las historias o vinculados a las historias y recargará automáticamente la historia. De todas formas, puedes desactivar esta función.

Haz <span class="item-description">Clic Derecho</span> en la pestaña de tu historia y activa/desactiva <span class="button-reference">Auto Reload</span> <span class="tiphelp">(Recarga Automática)</span>

<div style="position: relative; display: inline-block;">
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -95px;">
         <img src="/docs/plugin/previewdropdown.png" alt="autoreload">
         <div class="auto-reload-selector" />
      </div>
   </div>
</div>

Esto te permite comparar diferentes versiones de la misma historia montándola dos veces y desactivando <span class="button-reference">Auto Reload</span> <span class="tiphelp">(Recarga Automática)</span> en una de ellas.

## Ocultar Historias

Puedes ocultar historias cuando hay varias montadas a la vez. Esto dehabilita la propiedad `Visible`.

Para lograr esto haz <span class="item-description">Clic Derecho</span> 

Haz <span class="item-description">Clic Derecho</span> en la pestaña de tu historia y selecciona <span class="button-reference">Hide</span> <span class="tiphelp">(Ocultar)</span><br/>Puedes volvera mostrarla presionando <span class="button-reference">Un-hide</span> <span class="tiphelp">(Mostrar)</span>

<div style="position: relative; display: flex; flex-direction: row; gap: 10px;">
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -150px;">
         <img src="/docs/plugin/previewdropdown.png" alt="hide">
         <div class="hide-selector"/>
      </div>
   </div> 
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -150px;">
         <img src="/docs/plugin/extras/unhide.png" alt="hide" style="margin-bottom: -150px;">
         <div class="unhide-selector" />
      </div >
   </div>
</div>

## Guardar Versiones

Puedes guardar la versión actual de la interfaz tu historia al hacer <span class="item-description">Clic Derecho</span> sobre la pestaña de tu historia y seleccionando <span class="button-reference">Create Snapshot</span> <span class="tiphelp">(Guardar Versión)</span>

Esta función clona la interfaz actual y la almacena en un `ScreenGui` dentro de `StarterGui`

<span class="tiphelp">No se clonará la historia como tal, en cambio, solo la interfaz. Ningún código adicional será ejecutado en este caso</span>

<div style="position: relative; display: flex; flex-direction: row; gap: 50px;">
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -75px;">
         <img src="/docs/plugin/previewdropdown.png" alt="snapshotgui" >
         <div class="snapshot-selector" />
      </div>
   </div> 
   <img class="image-label" src="/docs/plugin/extras/snapshotgui.png" alt="snapshotgui" style="margin-top: 20px; width: fit-content; height: fit-content; margin-bottom: -150px;" />
</div>

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar2.png" alt="toolbar">
      <div class="invert-selector" />
   </div>
</div>

## Invertir Fondo  &nbsp; <span class="item-description">F</span>


<div class="side-img-text">
Puedes alternar entre fondo oscuro y claro seleccionando el botón <span class="button-reference">Invert Background</span> <span class="tiphelp">(Invertir Fondo)</span> en la barra lateral de herramientas.

Esto hará que los fondos oscuros se vuelvan claros, mejorando el contraste en tu historia.
</div>
<br/><br/><br/><br/>

## Borrar *Output* al Recargar

UI Labs tiene una opción que borra el *Output* cuando se recarga la historia que has seleccionado.

Esta opción está desactivada por defecto, pero puedes activarla en el menú desplegable que aparece en el <span class="item-description">&middot;&middot;&middot;</span> del panel lateral.

<div class="image-label" style="overflow: hidden;">
   <div style="position: relative; margin-bottom: -75px;">
      <img src="/docs/plugin/titledropdown.png" alt="snapshotgui" >
      <div class="clearoutput-selector" />
   </div>
</div> 