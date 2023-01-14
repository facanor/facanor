## **Hooks**

Enlaces:

-   [Hooks Parte I](https://mauriciogc.medium.com/react-hooks-usestate-useeffect-usecontext-parte-i-f8cc8c9cce0f)
-   [Hooks Parte II](https://mauriciogc.medium.com/react-hooks-usereducer-usecallback-usememo-useref-and-customs-hooks-parte-ii-88950ea413d8)

Hay tres tipos de Hooks:

1. **Incorporados:** useState, useEffect, useContext
2. **Adicionales:** useReducer, useCallback, useMemo, useRef, useImperativeHandle,
   useLayoutEffect, useDebugValue
3. **Otros:** Personalizados

Reglas básicas:

-   Los Hooks no funcionan con componentes de clase.
-   Nunca llamar un Hook dentro de un loop, condición, función anidada o funciones fuera del componente, con esta regla nos aseguramos de que los Hooks siempre se llamen en el mismo orden cada vez que un componente se renderiza.
-   Los Hooks, deben estar ubicados dentro del componente en el nivel superior.
-   Solo usar cuando sea un componente funcional.
-   Un Hook puede llamar a otro Hook.

<!-- Hooks Parte I -->

### **useState**

Para poder administrar el estado local en los componentes funcionales.

```javascript
const [stateName, setStateName] = useState(initialState);
```

-   **stateName:** El nombre del estado que vamos a usar en el componente.
-   **setStateName:** Nombre de la función para setear el valor del estado.
-   **initialState:** Valor con el que va a inicializar el estado.

Ejemplo 1:

```javascript
import React, { useState } from "react";

export default function ClickCounter() {
    const [counter, setCounter] = useState(0); //Create state

    function handleClick() {
        setCounter(counter + 1); //Set state
    }

    /*  ES6
  const handleClick = () => setCounter(counter + 1)
  */

    return (
        <div>
            <p>You have clicked {counter} times</p>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
}
```

Ejemplo 2:

```javascript
import React, { useState } from "react";

import Input from "./Input"; //Import Input

export default function Accordion() {
    const [value, setValue] = useState(""); //Create state
    const handleChange = (e) => setValue(e.target.value); //set State

    return (
        <div>
            <Input onChange={handleChange} defaultValue={value} />
            <p>{value}</p>
        </div>
    );
}
```

### **useEffect**

Nos va a permitir ejecutar código adicional después que se haya renderizado el componente y se define dentro del componente para que pueda acceder directamente a las variables y funciones definidas.

```javascript
useEffect(() => {
    // ...
}, [dependency1, dependency2, ...]);
```

-   **=>:** Qué efectos secundarios se van a ejecutar.
-   **[dependency1, dependency2, ...]:** Opcional. Deben ir las propiedades o estados que cada vez que cambien ejecutarán de nuevo el useEffect.

Ejemplo 1:

```javascript
import React, { useState, useEffect } from "react";

import Welcome from "./Welcome";

export default function Container() {
    const [name, setName] = useState("Stranger");
    const [color, setColor] = useState("grayText");

    useEffect(() => {
        // (A)
        const handleSetData = (data) => {
            // Set data (D)
            setName(data.name);
            setColor(data.color);
        };

        //"API" (B)
        setTimeout(() => {
            const data = { name: "Angélica", color: "pinkText" };
            //Execute local method (C)
            handleSetData(data);
        }, 4000);
    }, []); // <-- Empty array IMPORTANT!!! (E)

    return (
        <div>
            <Welcome name={name} color={color} />
        </div>
    );
}
```

-   **(A):** Generamos el hook useEffect.
-   **(B):** "Ejecutamos la API".
-   **(C):** Mandamos los datos al método que va a actualizar el estado.
-   **(D):** Actualizamos el estado.
-   **(E):** Como no queremos observar ninguna propiedad o estado para que se ejecute, mandamos un arreglo vacío.

Ejemplo 2:

```javascript
// ...
export default function Container() {
    //States
    const [searchMovie, setSearchMovie] = useState();
    const [movie, setMovie] = useState({
        //(A)
        imdb_id: "",
        title: "",
        overview: "",
        poster: "",
    });

    const handleSearchMovie = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        setSearchMovie(data.get("search"));
    };

    //Secondary effects
    useEffect(() => {
        console.log("--->", searchMovie);
        const API_KEY = "4ff32b3a95fabacb861ecfa8aa1dfcba";
        const URL = `https://api.themoviedb.org/3/movie/${searchMovie}?api_key=${API_KEY}&language=es-MX`;

        const handleData = (data) => setMovie(data); //(D)

        fetch(URL) // (B)
            .then((res) => res.json())
            .then((data) => {
                const { imdb_id, original_title, overview, poster_path } = data;
                const poster = `https://image.tmdb.org/t/p/w200${poster_path}`;
                handleData({ imdb_id, title: original_title, overview, poster }); //(C)
            });
    }, [searchMovie]);

    return (
        <div>
            //...
            <MovieCard {...movie} /> //(E)
        </div>
    );
}
```

-   **(A):** Creamos un Hook useState, para la película.
-   **(B):** Utilizamos la API fetch, para invocar el servicio.
-   **(C):** Mandamos al método handleData los datos.
-   **(D):** Método que hemos creado para actualizar el estado.
-   **(E):** Mandamos los datos al componente funcional MovieCard.

Ejemplo 3:

```javascript
import React, { useState, useEffect } from "react";

export default function ExampleMultipleUseEffect() {
    let [userCount, setUserCount] = useState(0);
    let [simpleCount, setSimpleCount] = useState(0);

    useEffect(() => {
        // (A)
        console.log("Se ejecuta una sola vez!");
    }, []);

    useEffect(() => {
        // (B)
        console.log("Se ejecuta cada vez que userCount cambia ...", userCount);
    }, [userCount]);

    useEffect(() => {
        // (C)
        console.log("Se ejecuta cada vez que cambia simpleCount...", simpleCount);
    }, [simpleCount]);

    return (
        <div>
            [ Contador usuarios: {userCount}] [ Contador simple: {simpleCount}]
            <hr />
            <button onClick={() => setUserCount(userCount + 1)}>Contador usuario</button>
            <button onClick={() => setSimpleCount(simpleCount + 1)}>
                Contador simple
            </button>
        </div>
    );
}
```

-   **(A):** Hook useEffect, que solo se va a ejecutar la primera vez que se renderiza el componente.
-   **(B):** Hook useEffect, que se va a ejecutar cuando el estado userCount cambie de valor
-   **(C):** Hook useEffect, que se va a ejecutar cuando el estado simpleCount cambie de valor

Ejemplo 4:

```javascript
import React, { useState } from "react";
import "./styles.css";

import Welcome from "./components/Welcome";

export default function App() {
    const [showWelcome, setShowWelcome] = useState(false); //(A)
    return (
        <div className="App">
            <button
                onClick={() => {
                    setShowWelcome(!showWelcome); /* (B) */
                }}
            >
                {showWelcome ? "Hide" : "Show"} Welcome component
            </button>

            {showWelcome ? <Welcome /> : null}
        </div>
    );
}
```

-   **(A):** Creamos un estado local, para mostrar/ocultar el componente.
-   **(B):** Cuando se le da click al botón, si está montado el componente, lo va a desmontar o viceversa.

```javascript
import React, { useEffect } from "react";

export default function Welcome() {
    useEffect(() => {
        console.log("Hello!!!"); //(A)

        return () => {
            // (B)
            console.log("Bye!!!");
        };
    });

    return <h1>Hello!! :)</h1>;
}
```

-   **(A):** Cuando el componente se ha montado.
-   **(B):** Cuando queremos hacer algo, cuando el componente se haya desmontado, solo es necesario regresar una arrow function y dentro de ella la lógica.

### **useContext** **PROVIDERS**

Context provee una forma de pasar datos a través del árbol de componentes sin tener que pasar props manualmente en cada nivel. En vez de estar pasando datos a través de cada uno de los hijos, lo que hace Context, es crear un estado global, lo cual nos va a ser útil para los datos que deban compartirse entre componentes, usualmente es usado en temas (theme CSS), autentificación, idioma.

```javascript
const nameConstant = useContext(contextType);
```

-   **nameConstant:** El nombre de la constante para usar en el componente.
-   **contextType:** Nombre del contexto para obtener los valores.

Ejemplo 1:

**Provider**

```javascript
import React from "react";

// (A)
const themes = {
    light: {
        color: "#000000",
        background: "#eeeeee",
        border: "1px solid #aaaaaa",
        padding: "10px",
    },
    dark: {
        color: "#ffffff",
        background: "#555555",
        border: "1px solid #222222",
        padding: "10px",
    },
};

// (B)
const ThemeContext = React.createContext(null);

// (C)
export { themes };
export default ThemeContext;
```

-   **(A):** Es el tema que nosotros vamos a utilizar en los componentes
-   **(B):** El contexto se inicializa con la API createContext, lo que estamos haciendo es compartir un contexto ThemeContext, para que pueda ser utilizado a través de los componentes.
-   **(C):** Exportamos la constante que tiene los temas, así como el contexto que hemos creado.

```javascript
import React from "react";
import "./styles.css";

//Providers
import ThemeContext, { themes } from "./providers/theme"; // (A)

//Components

export default function App() {
    return (
        <ThemeContext.Provider value={themes.dark}>
            {" "}
            {/* (B) */}
            Hello Word!!!!
        </ThemeContext.Provider>
    );
}
```

-   **(A):** Lo que hacemos es importar el contexto y los temas que tenemos.
-   **(B):** El contexto ThemeContext va a proveer a todos los componentes dentro de App el tema, sin importar cuántos hijos tiene cada uno, inicializando con el tema themes.dark.

```javascript
import React, { useContext } from "react";
import ThemeContext from "../providers/theme"; // (A)

export default function Button() {
    const theme = useContext(ThemeContext); // (B)
    return <button style={theme}> {/* (C) */}I am styled by theme context!</button>;
}
```

-   **(A):** Importamos el contexto, con la finalidad de poder ocupar el tema.
-   **(B):** Aquí es donde usamos el Hook useContext, lo que va hacer aquí es tomar los valores que tiene el contexto ThemeContext y los va a asignar a la constante theme.
-   **(C):** En este caso agregamos la constante a los estilos.

Ejemplo 2:

**Provider**

```javascript
import { createContext } from "react";
let user = {
    //(A)
    name: "Stranger",
    token: "",
};

const setUserInfo = (obj) => (user = { user, ...obj }); //(B)

const UserInfoContext = createContext(null); //(C)

// (D)
export { user, setUserInfo };
export default UserInfoContext;
```

-   **(A):** El objeto por default
-   **(B):** El contexto se inicializa con la API createContext, lo que estamos haciendo es compartir un contexto UserInfoContext, para que pueda ser utilizado a través de los componentes.
-   **(C):** Exportamos la constante que tiene el perfil del usuario, para setear la propiedad, así como el contexto que hemos creado.

```javascript
import React, { useState } from "react";
import "./styles.css";

//Providers
import UserInfoContext, { user, setUserInfo } from "./providers/userInfo";

//Components
import Home from "./components/Home";

export default function App() {
    const [update, setUpdater] = useState(false); //(A)
    const handleUser = (e) => {
        //(B)
        setUserInfo({
            name: "Mauricio",
            token: "TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCAuLi4",
        });
        //(C)
        setUpdater(!update);
    };
    return (
        <UserInfoContext.Provider value={user}>
            <Home />
            <button onClick={handleUser}>Get Data user</button>
        </UserInfoContext.Provider>
    );
}
```

-   **(A):** Vamos a crear un estado, para que cuando entre, se actualice
-   **(B):** Seteamos el valor de user.
-   **(C):** Al actualizar el parámetro, la aplicación vuelve a mandar el objeto user actualizado.

```javascript
import React, { useContext } from "react";
import UserInfoContext from "../providers/userInfo";

export default function Login() {
    const userInfo = useContext(UserInfoContext);
    return <div>Hello, {userInfo.name}</div>;
}
```

<!-- Hooks Parte II -->

Para casos muy específicos.

### **useReducer**

Es preferible usar useReducer en vez de useState cuando se tiene una lógica de estado compleja que involucra múltiples subvalores, o cuando el siguiente estado depende del anterior. useState es el mejor para un estado simple con lógica de actualización simple y useReducer es el mejor para un estado complejo con la lógica de actualización compleja.

```javascript
const [stateName, dispatch] = useReducer(reducer, initialArg, init);
```

-   **stateName:** El nombre del estado que vamos a usar en el componente.
-   **dispatch:** Función encargada de enviar la actualización al método reducer.
-   **reducer:** Función que va a retornar el nuevo estado.
-   **initialArg:** Valor con el que va a inicializar el estado (Objeto en JS).
-   **init:** Se utiliza cuando se quiere iniciar el estado dentro de una función.

```javascript
function reducer(state, action) {
    return newState;
}
```

-   **reducer:** Función reductora que va a retornar el nuevo estado.
-   **state:** El estado actual.
-   **action:** El objeto que envía el método dispatch.
-   **newState:** El nuevo estado actualizado.

Ejemplo 1:

<!-- Con useState -->
<!-- Incrementar, reducir, resetear y congelar un número -->

```javascript
import React, { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);
    const [frozen, setFrozen] = useState(false);

    const handleIncrement = (e) => !frozen && setCount(count + 1);
    const handleDecrement = (e) => !frozen && setCount(count - 1);
    const handleReset = (e) => !frozen && setCount(0);
    const handleFrozen = (e) => setFrozen(!frozen);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleFrozen}>Frozen {frozen ? "on" : "off"}</button>
        </div>
    );
};

export default Counter;
```

<!-- Con useReducer -->

```javascript
import React, { useReducer } from "react";

const reducerCounter = (state, action) => {
    let newState = { ...state };
    switch (action.type) {
        case "INCREMENT":
            if (!state.frozen) newState.count = state.count + 1;
            break;
        case "DECREMENT":
            if (!state.frozen) newState.count = state.count - 1;
            break;
        case "RESET":
            if (!state.frozen) newState.count = 0;
            break;
        case "FROZEN":
            newState.frozen = !state.frozen;
            break;
        default:
            break;
    }
    return newState;
};

const Counter = () => {
    const [counter, dispatchCounter] = useReducer(reducerCounter, {
        count: 0,
        frozen: false,
    });

    return (
        <div>
            <p>Count: {counter.count}</p>
            <button onClick={(e) => dispatchCounter({ type: "INCREMENT" })}>
                Increment
            </button>
            <button onClick={(e) => dispatchCounter({ type: "DECREMENT" })}>
                Decrement
            </button>
            <button onClick={(e) => dispatchCounter({ type: "RESET" })}>Reset</button>
            <button onClick={(e) => dispatchCounter({ type: "FROZEN" })}>
                Frozen {counter.frozen ? "on" : "off"}
            </button>
        </div>
    );
};

export default Counter;
```

Ejemplo 2:

<!-- Bloquear, desbloquear y mostrar un mensaje al validar campos de usuario y contraseña -->

Ver [Hooks Parte II](https://mauriciogc.medium.com/react-hooks-usereducer-usecallback-usememo-useref-and-customs-hooks-parte-ii-88950ea413d8)

**Nota:** Usar useState siempre que gestionemos un valor tipo primitivo de JavaScript (number, string, boolean…). Usar useReducer siempre que administremos un objeto o arreglo.

### **useMemo**

useMemo es un Hook que memoriza la salida de una función. Si en tu proyecto es muy importante el rendimiento o si eres de las personas que le gusta optimizar… te va a ser muy útil useMemo. Su finalidad es validar si alguna de sus dependencias ha cambiado, en caso de que si haya cambiado, va a retornar el nuevo valor, caso contrario devolverá el valor que tiene en caché.

Ejemplo sin useMemo:

```javascript
import React, { useState } from "react";
import "./App.css";

function App() {
    const [name, setName] = useState("Mauricio");
    const [number, setNumber] = useState(5);
    return (
        <div className="App">
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <NameDisplay name={name} />
            <hr />
            <input value={number} onChange={(e) => setNumber(e.target.value)} />
            <ExponentDisplay number={number} />
        </div>
    );
}

function NameDisplay({ name }) {
    console.log("==> Rerendering NameDisplay...");
    return <p>Your name is {name}</p>;
}

function ExponentDisplay({ number }) {
    console.log("==> Rerendering ExponentDisplay...");

    let result = Number(number);
    for (let x = 1; x < 10; x++) {
        result = result * number;
    }
    return (
        <p>
            ({number})^10 = {result}
        </p>
    );
}

export default App;
```

**Nota:** Podemos observar que sin importar si estamos afectando el estado name ó number los componentes NameDisplay y ExponentDisplay se vuelven a renderizar; la idea es solo afecte aquel componente que cambien sus dependencias.

```javascript
const memorizedValue = useMemo(() => {
    return value;
}, [a, b, ...]);
```

-   **memorizedValue:** El valor recordado.
-   **=>:** Método que se va a ejecutar si alguna dependencia ha cambiado.
-   **[a, b]:** Dependencias para ejecutar el método.

**Nota:** useEffect está destinado a los efectos secundarios (de ahí su nombre), mientras que useMemo no tienen efectos secundarios (son funciones puras). Si no le pasamos un arreglo de dependencias, se activará con cualquier dependencia (lo cual queremos evitar).

Ejemplo anterior con useMemo:

```javascript
function ExponentDisplay({ number }) {
    console.log("==> Rerendering ExponentDisplay...");

    const result = useMemo(() => {
        let r = number;
        console.log("==> Calculate....", r);
        for (let x = 1; x < 10; x++) {
            r = r * number;
        }
        return r;
    }, [number]);

    return (
        <p>
            ({number})^10 = {result}
        </p>
    );
}
```

```javascript
const NameDisplay = React.memo(function ({ name }) {
    console.log("Rerendering NameDisplay...");
    return <p>Your name is {name}</p>;
});
```

**Nota:** Con React.memo, es una forma de recordar todo el componente, por lo que solo renderiza cuándo las propiedades cambian.

### **useCallback**

<!-- Agrega complejidad, por lo que puede ser contraproducente en el rendimiento -->

useCallback va a memorizar una función (callback), mientras que useMemo va a memorizar la salida de una función. El objetivo es no reinicializar la función, a menos que las dependencias hayan cambiando.

```javascript
const memorizedCallback = useCallback(() => {
    doSomething(a, b);
}, [a, b, ...]);
```

-   **memorizedCallback:** La función recordada.
-   **=>:** Método que se va a crear si alguna dependencia ha cambiado.
-   **[a, b, ...]:** Dependencias para crear el método.

Ejemplo sin Callback:

```javascript
import React, { useState } from "react";
import "./App.css";

const functions = new Set();

export default function App() {
    const [counter1, setCounter1] = useState(0);
    const [counter2, setCounter2] = useState(0);

    const increment1 = () => setCounter1((c) => c + 1);
    const increment2 = () => setCounter2((c2) => c2 + 1);

    // Register the functions
    functions.add(increment1);
    functions.add(increment2);

    return (
        <div>
            <div> Counter 1 is {counter1} </div>
            <div> Counter 2 is {counter2} </div>
            <br />
            <div>
                <button onClick={increment1}>Increment Counter 1</button>
                <button onClick={increment2}>Increment Counter 2</button>
            </div>
            <br />
            <div> Newly Created Functions: {functions.size} </div>
        </div>
    );
}
```

**Nota:** Tenemos dos contadores, que están almacenados en dos estados distintos counter1 y counter2. Donde nos permite incrementarlos mediante 2 botones, que al momento de darle click, cada uno va a ejecutar una función distinta (increment1 ó increment2), donde se va a incrementar un contador setCounter1 ó setCounter2. Utilizamos new Set(), para guardar las funciones que son únicas, con el propósito de saber cuantas funciones se crean mientras el usuario interactúa con la aplicación. El objeto new Set te permite almacenar conjunto de valores únicos de cualquier tipo, incluso valores primitivos u objetos de referencia.

**Nota:** Podemos observar que la primera vez se han creado dos instancias de funciones (lo cual es correcto); pero al momento de darle click a uno de los botones, SIEMPRE crea dos nuevas instancias de funciones. Quizás, pueda parecer normal, ya que cada que cada vez que se hace el renderizado, vuelve a crear las funciones, pero, esta mal, ya que solo estamos afectado a uno de los estados…entonces la idea, es que solo se debe crear una nueva instancia y esto es cuando se actualice un valor dependiente.

Ejemplo con useCallback:

```javascript
const increment1 = useCallback(() => {
    setCounter1(counter1 + 1);
}, [counter1]);

const increment2 = useCallback(() => {
    setCounter2(counter2 + 1);
}, [counter2]);
```

**Nota:** Le estamos indicando a increment1 que mientras counter1 no cambie, no es necesario que crea una nueva instancia. Le estamos indicando a increment2 que mientras counter2 no cambie, no es necesario que crea una nueva instancia.

### **useRef**

useRef devuelve un objeto ref mutable cuya propiedad .current se inicializa con el argumento pasado (initialValue). El objeto devuelto se mantendrá persistente durante la vida completa del componente.

```javascript
const refContainer = useRef(initialValue);
```

**Nota:** El Hook useRef se usa en dos casos:

-   Acceso a los nodos DOM o elementos React
-   Mantener una variable mutable.

Cuando ocupamos JavaScript y queremos acceder a un nodo DOM, es muy común utilizar querySelector, getElementById,…, pero si estamos desarrollando con React es recomendable utilizar useRef.

Ejemplo 1:

<!-- Acceso a los nodos DOM o elementos React -->

```javascript
import React, { useRef } from "react";
import "./App.css";

export default function App() {
    const textInput = useRef();

    const focusTextInput = () => textInput.current.focus();

    return (
        <div className="App">
            <input type="text" ref={textInput} />
            <br />
            <button onClick={focusTextInput}>Focus the text input</button>
        </div>
    );
}
```

-   useRef es una función de enlace que se asigna a la variable textInput.
-   En el input, en el atributo ref, agregamos la variable textInput, con esto, le estamos indicando a React qué debe hacer referencia a ese nodo DOM.
-   Cuando le damos click al botón, se ejecuta la función focusTextInput, donde usamos la referencia del nodo DOM; y mediante la propiedad .current hacemos focus al elemento.

Ejemplo 2:

<!-- Mantener una variable mutable -->
<!-- Acciones en segundo plano -->

Tenemos dos formas de mantener el valor de una variable:

-   **Variable de estado:** Con useState o useReducer, estas variables, siempre que se actualizan provocan un nuevo renderizado del componente.
-   **Por referencia:** Por medio de useRef, mediante la propiedad .current, la mutación de esta no causará un nuevo renderizado del componente.

```javascript
import React, { useRef } from "react";
import "./App.css";

export default function App() {
    const counter = useRef(0);

    const handleCounter = (e) => console.log("Counter:", ++counter.current);

    return (
        <div className="App">
            <button onClick={handleCounter}>Counter with useRef</button>
        </div>
    );
}
```

**Nota:** Cada vez que hacemos click en el botón se va a incrementar el valor de counter(no debemos olvidar que su valor está en la propiedad .current)

**Nota:** Sólo hay 3 buenas razones para usar useRef :

-   Administrar el focus, la selección de texto o la reproducción de medios.
-   Activar animaciones imperativas.
-   Integración de bibliotecas DOM de terceros.

<!-- Hooks Parte III -->

### **Custom Hooks**

Construir tus propios Hooks te permite extraer la lógica del componente en funciones reutilizables. Los Hooks personalizados, básicamente son funciones de JavaScript cuyo nombre tiene el prefijo use (es recomendable que inicien con ese nombre, con la finalidad de indicarle a React que es un Hook, y pueda aplicar las reglas de los Hooks que ya conocemos).

Ejemplo 1:

**Nota:** Vamos a crear un Hook bastante sencillo… imagina que quieres mostrarle al usuario, cuando se encuentra en conectado o desconectado de la página. Entonces, debemos de validar si tiene internet o no (En caso de tener le decimos que está conectado, caso contrario desconectado).

El navegador tiene dos eventos que podemos escuchar para saber si tiene conexión o no el usuario: online y offline, al ser un efecto secundario, vamos a utilizar useEffect.

```javascript
import { useEffect, useState } from "react";

const isClient = !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);

const useOnlineStatus = () => {
    let [onlineStatus, setOnlineStatus] = useState(true);
    const goOnline = () => setOnlineStatus(true);
    const goOffline = () => setOnlineStatus(false);

    useEffect(() => {
        const element = isClient ? window : undefined;
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);
        return () => {
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    return onlineStatus;
};

export default useOnlineStatus;
```

-   **(A):** Estamos validando si el navegador tiene la opción de agregar un evento.
-   **(B):** Agregamos dos eventos online y offline, donde van a ejecutar cada uno un método.
-   **(C):** Cuando se desmonte el Hook, vamos a remover los eventos.
-   **(D):** Los eventos que van a actualizar el estado onlineStatus.
