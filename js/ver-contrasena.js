// ============================================================
// Botón "Ver / Ocultar" para cualquier campo de contraseña.
//
// Una errata al escribir una contraseña no se ve: el campo enseña
// puntitos. Al iniciar sesión se nota enseguida, pero al CREAR una
// cuenta (o al establecer por primera vez un código) la errata queda
// guardada y no se descubre hasta el día siguiente, cuando ya no se
// puede entrar y no hay a quién reclamarle.
//
// Este archivo es a propósito autónomo: no depende de css/style.css
// ni de js/layout.js, porque las contraseñas de esta web están
// repartidas por apps que tienen cada una su propia hoja de estilos
// (Cifras y Letras, Economía Familiar, Novela Colectiva, Reunión de
// familias, Inglés para viajar). Se trae sus propios estilos y basta
// con enlazarlo:
//
//     <script src="../js/ver-contrasena.js"></script>
//
// Coge todos los campos de contraseña que haya en la página y, con un
// MutationObserver, también los que aparezcan después (varias de esas
// apps pintan sus formularios desde JavaScript).
// ============================================================

(function () {
  const CLASE_CAMPO = "vc-campo";
  const CLASE_BOTON = "vc-boton";
  const ESTILOS_ID = "vc-estilos";

  function ponerEstilos() {
    if (document.getElementById(ESTILOS_ID)) return;
    const style = document.createElement("style");
    style.id = ESTILOS_ID;
    // Los estilos van aquí y no en una hoja aparte para que el botón
    // se vea igual en las seis apps, que no comparten CSS.
    style.textContent = `
      .${CLASE_CAMPO} {
        position: relative;
        display: block;
      }
      .${CLASE_BOTON} {
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        z-index: 2;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        line-height: 1;
        padding: 9px 12px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: #fff;
        color: #444;
        cursor: pointer;
      }
      .${CLASE_BOTON}:hover {
        border-color: #4338ca;
        color: #4338ca;
      }
      .${CLASE_BOTON}:focus-visible {
        outline: 2px solid #4338ca;
        outline-offset: 2px;
      }
      /* Mientras la contraseña está a la vista, el botón se marca: en
         una pantalla de aula conviene que cante que está destapada. */
      .${CLASE_BOTON}[aria-pressed="true"] {
        border-color: #b45309;
        background: #fdf0dc;
        color: #b45309;
      }
      /* Edge pone su propio ojo dentro del campo; con el nuestro al
         lado quedarían dos y no se sabría cuál es cuál. */
      .${CLASE_CAMPO} input::-ms-reveal,
      .${CLASE_CAMPO} input::-ms-clear {
        display: none;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function alternar(campo, boton) {
    const estabaVisible = campo.type === "text";
    // Cambiar el tipo manda el cursor al final en algunos
    // navegadores: se guarda dónde estaba y se devuelve, para poder
    // corregir una letra de en medio sin volver a colocarse.
    let posicion = null;
    try {
      posicion = campo.selectionStart;
    } catch (e) {
      posicion = null;
    }

    campo.type = estabaVisible ? "password" : "text";
    boton.textContent = estabaVisible ? "Ver" : "Ocultar";
    boton.setAttribute("aria-pressed", estabaVisible ? "false" : "true");
    boton.setAttribute("aria-label", estabaVisible ? "Mostrar la contraseña" : "Ocultar la contraseña");

    campo.focus();
    if (posicion !== null) {
      try {
        campo.setSelectionRange(posicion, posicion);
      } catch (e) {
        // Algún navegador no deja mover el cursor en este tipo de
        // campo: se queda donde lo ponga él, que no rompe nada.
      }
    }
  }

  function prepararCampo(campo) {
    if (!campo || campo.dataset.vcListo === "1") return;
    // Los campos escondidos (por ejemplo, el de un formulario que
    // todavía no se ha abierto) se preparan igual: cuando se muestren
    // el botón ya estará puesto.
    campo.dataset.vcListo = "1";

    const envoltorio = document.createElement("span");
    envoltorio.className = CLASE_CAMPO;
    campo.parentNode.insertBefore(envoltorio, campo);
    envoltorio.appendChild(campo);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = CLASE_BOTON;
    boton.textContent = "Ver";
    boton.setAttribute("aria-pressed", "false");
    boton.setAttribute("aria-label", "Mostrar la contraseña");
    if (campo.id) boton.setAttribute("aria-controls", campo.id);
    boton.addEventListener("click", () => alternar(campo, boton));
    envoltorio.appendChild(boton);

    // El texto de la contraseña no debe pasar por debajo del botón.
    // Se mide el botón ya colocado en vez de suponer un ancho: la
    // tipografía no es la misma en todas las apps.
    //
    // Varias de estas apps traen el formulario de acceso oculto y lo
    // enseñan después (mientras comprueban si ya habías entrado), y un
    // elemento oculto mide cero. Por eso se vuelve a medir la primera
    // vez que alguien toca el campo, que es cuando ya está a la vista.
    function ajustarHueco() {
      const ancho = Math.ceil(boton.getBoundingClientRect().width);
      if (ancho > 0) campo.style.paddingRight = ancho + 16 + "px";
      return ancho > 0;
    }

    if (!ajustarHueco()) {
      campo.style.paddingRight = "84px";
      campo.addEventListener("focus", ajustarHueco, { once: true });
    }
  }

  function repasarTodo(raiz) {
    const campos = (raiz || document).querySelectorAll('input[type="password"]');
    if (campos.length) ponerEstilos();
    campos.forEach(prepararCampo);
  }

  function arrancar() {
    repasarTodo(document);

    // Varias de estas apps pintan sus formularios desde JavaScript
    // (Reunión de familias abre el código de edición en una ventana
    // emergente, Inglés para viajar dibuja sus ajustes al entrar), así
    // que hay que estar atentos a los campos que aparecen después.
    if (typeof MutationObserver !== "function" || !document.body) return;
    new MutationObserver((cambios) => {
      cambios.forEach((cambio) => {
        cambio.addedNodes.forEach((nodo) => {
          if (nodo.nodeType !== 1) return;
          if (nodo.matches && nodo.matches('input[type="password"]')) {
            ponerEstilos();
            prepararCampo(nodo);
          } else if (nodo.querySelectorAll) {
            repasarTodo(nodo);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
