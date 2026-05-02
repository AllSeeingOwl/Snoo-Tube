# Cómo jugar Paris Pool y usar la aplicación de seguimiento

## ¿Qué es Paris Pool?
Paris Pool es una variante del billar bola 8 tradicional que combina la habilidad con el taco con el conocimiento geográfico de la icónica red de metro de París. Los jugadores deben nombrar una estación válida del Metro de París que corresponda con el color y tipo (lisa/rayada) de la bola embocada.

## Cómo jugar

### 1. Integración básica del juego
* Juega al billar bola 8 estándar. Las bolas lisas corresponden a las líneas primarias y las rayadas a las secundarias.
* Después de embocar una bola, nombra una estación del Metro de París que coincida con el mapa de colores de la bola.
* Las estaciones solo se pueden usar una vez por partida (a menos que se modifique por reglas de Niveles o Comodín).
  * Una estación válida debe estar en el mapa oficial del Metro de París y coincidir con las reglas de color.
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
*(Nota: La tabla original contiene líneas de Nueva York, se traduce tal cual para mantener la coherencia con el original).*

### 3. Reglas de uso de estaciones
* Una vez que se nombra una estación correctamente, se "bloquea" y no se puede reutilizar.
* **Las estaciones válidas deben:**
  * Estar activas actualmente en el mapa oficial del Metro de París.
  * Coincidir con la línea(s) de color asociada a la bola embocada.
* **Nombrar una estación incorrecta** resulta en faltas estándar de billar y el final del turno.

### 4. Opciones avanzadas
* **Niveles de reutilización de estaciones:** Casual (ilimitado), Intermedio (2 usos), Avanzado (1 uso).
* **Comodín de RER y Tranvías (Opcional):**
  * Una vez por partida, un jugador puede elegir nombrar una estación del **RER** o cualquier línea de **Tranvía (T)** para **desbloquear una estación usada anteriormente**.

## Cómo usar la aplicación de seguimiento
Igual que la aplicación Pool Subway. Ejecútala localmente a través de Node.js en el puerto 3000 o instálala como PWA en tu móvil.
