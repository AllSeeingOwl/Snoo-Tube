# Cómo jugar Pool Subway y usar la aplicación de seguimiento

## ¿Qué es Pool Subway?
Pool Subway es una variante del billar bola 8 tradicional que combina la habilidad con el taco con el conocimiento geográfico de la icónica red de metro de Nueva York. Los jugadores deben nombrar una estación válida del metro de Nueva York que corresponda con el color y tipo (lisa/rayada) de la bola embocada.

## Cómo jugar

### 1. Integración básica del juego
* Juega al billar bola 8 estándar. Las bolas lisas corresponden a las líneas primarias y las rayadas a las secundarias.
* Después de embocar una bola, nombra una estación del metro de Nueva York que coincida con el mapa de colores de la bola.
* Las estaciones solo se pueden usar una vez por partida (a menos que se modifique por reglas de Niveles o Comodín).
  * Una estación válida debe estar en el mapa oficial del metro de Nueva York y coincidir con las reglas de color.
  * Los jugadores tienen **10 segundos** para nombrar una estación después de embocar un color; fallar resulta en la pérdida de los puntos de ese tiro y el final de su turno.

### 2. Asignación de colores a líneas
| Color de la bola | Líneas (Lisas) | Líneas (Rayadas) |
| :--- | :--- | :--- |
| **Amarillo** | N, Q | R, W |
| **Azul** | A | C, E |
| **Rojo** | 1, 2 | 3 |
| **Morado** | 7 | 7 |
| **Naranja** | B, D | F, M |
| **Verde** | 4 | 5, 6 |
| **Marrón/Burdeos** | J | Z |
| **Negro (Bola 8)** | L, G | N/A |

* **Intercambiadores:** Las estaciones que sirven a múltiples líneas pueden contar para *cualquiera* de sus líneas asociadas, siempre que la línea coincida con el color embocado.

### 3. Reglas de uso de estaciones
* Una vez que se nombra una estación correctamente, se "bloquea" y no se puede reutilizar (a menos que se modifique por las reglas de Comodín o Nivel de Reutilización).
* **Las estaciones válidas deben:**
  * Estar activas actualmente en el mapa oficial del metro de Nueva York.
  * Coincidir con la línea(s) de color asociada a la bola embocada (ver Sección 2).
* **Nombrar una estación incorrecta** (ej., línea equivocada, ya usada, no en el mapa, fuera de tiempo) resulta en:
  * Faltas estándar de billar (ej., bola en mano para el oponente).
  * El final del turno del jugador.

### 4. Opciones avanzadas
* **Niveles de reutilización de estaciones:**
  * *Casual:* Las estaciones son reutilizables.
  * *Intermedio:* Cada estación se puede usar dos veces por partida.
  * *Avanzado:* Uso estricto de una vez por estación por partida.
* **Regla de "Sin Estaciones":**
  * Si un jugador cree que no quedan estaciones válidas y no usadas para una línea requerida, puede:
    * Nombrar una estación de intercambio que sirva a la línea requerida (incluso si es conocida principalmente por otras líneas).
    * Si es desafiado e incorrecto, se aplica la penalización estándar. Si es correcto, el juego continúa.
* **Comodín de Staten Island y Shuttles (Opcional):**
  * Una vez por partida, inmediatamente después de embocar *cualquier* bola de color, un jugador puede elegir nombrar una estación del **Staten Island Railway** o cualquier línea de **Shuttle (S)**.
  * Si la estación del comodín es válida, se **desbloqueea una estación usada anteriormente**, poniéndola disponible para ser nombrada de nuevo más tarde en la partida por cualquier jugador. El jugador debe declarar qué estación se desbloquea.
  * Este comodín reemplaza el requisito estándar de nombrar una estación que coincida con el color embocado para ese tiro.

## Cómo usar la aplicación de seguimiento

La aplicación **Pool Subway Tracker** es una aplicación web complementaria diseñada para ayudarte a mantener un registro de las estaciones mientras juegas.

### Características principales
- **Búsqueda y Filtro:** Busca estaciones al instante por nombre, línea o color.
- **Niveles de Dificultad:** Cambia sin problemas entre reglas Avanzadas (1 uso), Intermedias (2 usos) y Casuales (uso ilimitado). La app bloqueará las estaciones automáticamente según tu nivel.
- **Bloqueo de estaciones:** Cuando se nombre una estación válida, encuéntrala en la lista y haz clic en "Record Use". Se bloqueará y pondrá en gris automáticamente.
- **Comodín de Staten Island:** Desbloquea fácilmente estaciones usando el botón comodín integrado.
- **Soporte sin conexión:** Creada como PWA. Puedes instalarla en tu dispositivo y usarla sin internet.
- **Persistencia de datos:** Tu partida se guarda automáticamente en tu dispositivo.

## Cómo instalar la aplicación

### Ejecución local
Debe ejecutarse a través de un servidor web local.

1. Abre tu terminal.
2. Navega a la carpeta raíz del proyecto.
3. Instala dependencias: `pnpm install`
4. Inicia el servidor: `pnpm start`
5. Abre `http://localhost:3000/pool/`

### Instalación en el móvil (Sin conexión)
#### iOS (Safari):
Abre la URL, toca **Compartir** y luego **Añadir a la pantalla de inicio**.

#### Android (Chrome):
Abre la URL y toca **Añadir a la pantalla de inicio** cuando se te pida o desde el menú.
