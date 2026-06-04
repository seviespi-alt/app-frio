"use client";

import { useEffect, useState } from "react";
import { tiendas } from "./data/tiendas";

export default function Home() {
  const [pantalla, setPantalla] = useState("inicio");
  const [
  tiendaHistorial,
  setTiendaHistorial,
] = useState(null);
const [tiendaSeleccionada, setTiendaSeleccionada] = useState<any>(null);

const [nuevaIncidencia, setNuevaIncidencia] = useState("");
const [cantidadGas, setCantidadGas] = useState("");
const [nuevoRepuesto, setNuevoRepuesto] = useState("");
const [pedidoPor, setPedidoPor] = useState("");
const [mostrarHistorial, setMostrarHistorial] =
  useState(false);
const [instaladoPor, setInstaladoPor] =
  useState("");
const [repuestos, setRepuestos] = useState<{
  [key: number]: any[];
}>({});
const [tipoCentral, setTipoCentral] = useState("");
const [registrosGas, setRegistrosGas] = useState<{
  [key: number]: any[];
}>({});
const [busqueda, setBusqueda] = useState("");
const [incidencias, setIncidencias] = useState<{
  [key: number]: string[];
}>({});
  useEffect(() => {

  const incidenciasGuardadas =
    localStorage.getItem("incidenciasPorTienda");

  if (incidenciasGuardadas) {
    setIncidencias(
      JSON.parse(incidenciasGuardadas)
    );
  }

  const registrosGuardados =
    localStorage.getItem("registrosGas");

  if (registrosGuardados) {
    setRegistrosGas(
      JSON.parse(registrosGuardados)
    );
  }
const repuestosGuardados =
  localStorage.getItem("repuestos");

if (repuestosGuardados) {
  setRepuestos(JSON.parse(repuestosGuardados));
}
}, []);
  


  if (pantalla === "tiendas") {
    return (
      <main style={mainStyle}>
        <input
  type="text"
  placeholder="Buscar tienda..."
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
  style={inputStyle}
/>
        <h1>🏪 TIENDAS</h1>

        {tiendas
  .filter((tienda) => {
    const texto = busqueda.toLowerCase();

    return (
      tienda.nombre.toLowerCase().includes(texto) ||
      tienda.poblacion.toLowerCase().includes(texto) ||
      tienda.numero.toString().includes(texto)
    );
  })
  .map((tienda, index) => (
          <div
  key={index}
  style={{
  ...cardStyle,
  transition: "0.2s",
  cursor: "pointer",
}}
  onClick={() => {
    setTiendaSeleccionada(tienda);
    setPantalla("detalle");
  }}
>
            <h3>
              #{tienda.numero} - {tienda.nombre}
            </h3>

            <p>📍 {tienda.poblacion}</p>
            <p>❄️ Gas: {tienda.gas}</p>
            <p>👨‍🔧 Técnico: {tienda.tecnico}</p>
          </div>
        ))}
        <button
  onClick={() =>
    setMostrarHistorial(
      !mostrarHistorial
    )
  }
  style={buttonStyle}
>
  {mostrarHistorial
    ? "Ocultar historial"
    : "Ver historial"}
</button>
{mostrarHistorial && (

  <div>

    <h3>
      Repuestos instalados
    </h3>

    {repuestos[
      tiendaSeleccionada.numero
    ]
      ?.filter(
        (repuesto) =>
          repuesto.estado ===
          "Instalado"
      )
      .map((repuesto, index) => (

        <div
          key={index}
          style={cardStyle}
        >
          <p>
            {repuesto.nombre}
          </p>

          <p>
            Instalado por:
            {" "}
            {
              repuesto.instaladoPor
            }
          </p>

          <p>
            Pedido por:
            {" "}
            {
              repuesto.pedidoPor
            }
          </p>

        </div>

      ))}

  </div>

)}

        <button
          onClick={() => setPantalla("inicio")}
          style={buttonStyle}
        >
          Volver
        </button>
        
      </main>
    );
  }
if (pantalla === "detalle" && tiendaSeleccionada) {
  
  return (
    <main style={mainStyle}>
      <h1>🏪 {tiendaSeleccionada.nombre}</h1>


<div>
<h2 style={{ marginTop: "30px" }}>
  Repuestos
</h2>
<input
  type="text"
  placeholder="Nuevo repuesto"
  
  value={nuevoRepuesto}
  onChange={(e) => setNuevoRepuesto(e.target.value)}
  style={inputStyle}
/>
<input
  type="text"
  placeholder="Pedido por"
  value={pedidoPor}
  onChange={(e) =>
    setPedidoPor(e.target.value)
  }
  style={inputStyle}
/>
<input
  type="text"
  placeholder="Instalado por"
  value={instaladoPor}
  onChange={(e) =>
    setInstaladoPor(e.target.value)
  }
  style={inputStyle}
/>



</div>
<button
  onClick={() => {
    if (nuevoRepuesto !== "") {

const numeroTienda =
  tiendaSeleccionada.numero;

const repuestosActuales =
  repuestos[numeroTienda] || [];

const nuevosRepuestos = {
  ...repuestos,
  [numeroTienda]: [
    ...repuestosActuales,
{
  nombre: nuevoRepuesto,
  estado: "Pedido",
  pedidoPor: pedidoPor,
  instaladoPor: instaladoPor,
},
  ],
};

setRepuestos(nuevosRepuestos);

localStorage.setItem(
  "repuestos",
  JSON.stringify(nuevosRepuestos)
);

      setNuevoRepuesto("");
      setPedidoPor("");
    }
  }}
  style={buttonStyle}
>
  Añadir repuesto
</button>
<h2
  style={{
    marginTop: "30px",
    fontSize: "28px",
    fontWeight: "bold",
  }}
>
  📦 Pedidos
</h2>
{repuestos[tiendaSeleccionada.numero]
?.filter(
  (repuesto) =>
    repuesto.estado === "Pedido" 
  
)
  .map((repuesto, index) => (
    <div
  key={index}
  style={cardStyle}
>
  <p>{repuesto.nombre}</p>

<p>
  Estado: {repuesto.estado}
</p>
<p>
  Pedido por: {repuesto.pedidoPor}
</p>
<p>
  Instalado por:
  {repuesto.instaladoPor || "-"}
</p>
<button
  onClick={() => {
    const numeroTienda = tiendaSeleccionada.numero;

    const nuevosRepuestos =
      repuestos[numeroTienda].map((r) =>
        r.nombre === repuesto.nombre
          ? {
              ...r,
              estado: "Almacen",
            }
          : r
      );

    const repuestosActualizados = {
      ...repuestos,
      [numeroTienda]: nuevosRepuestos,
    };

    setRepuestos(repuestosActualizados);

    localStorage.setItem(
      "repuestos",
      JSON.stringify(repuestosActualizados)
    );
  }}
  style={{
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "10px",
  }}
>
  En almacén
</button>
  <button
    onClick={() => {

      const numeroTienda =
        tiendaSeleccionada.numero;

      const nuevosRepuestos =
        repuestos[numeroTienda].filter(
          (_, i) => i !== index
        );

      const repuestosActualizados = {
        ...repuestos,
        [numeroTienda]: nuevosRepuestos,
      };

      setRepuestos(
        repuestosActualizados
      );

      localStorage.setItem(
        "repuestos",
        JSON.stringify(
          repuestosActualizados
        )
      );
    }}
    style={{
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "10px",
    }}
  >
    Eliminar
  </button>
  
</div>
  )
)}
<h2
  style={{
    marginTop: "30px",
    fontSize: "28px",
    fontWeight: "bold",
  }}
>
  🏬 En almacén
</h2>

{repuestos[tiendaSeleccionada.numero]
  ?.filter(
    (repuesto) =>
      repuesto.estado === "Almacen"
  )
  .map((repuesto, index) => (
    <div
      key={index}
      style={cardStyle}
    >
      <p>{repuesto.nombre}</p>

      <p>
        Estado: {repuesto.estado}
      </p>

      <p>
        Pedido por: {repuesto.pedidoPor}
      </p>
      <button
  onClick={() => {
    const instalador = prompt(
      "¿Quién lo instala?"
    );

    if (!instalador) return;

    const numeroTienda =
      tiendaSeleccionada.numero;

    const nuevosRepuestos =
      repuestos[numeroTienda].map((r) =>
        r.nombre === repuesto.nombre
          ? {
              ...r,
              estado: "Instalado",
              instaladoPor: instalador,
            }
          : r
      );

    const repuestosActualizados = {
      ...repuestos,
      [numeroTienda]: nuevosRepuestos,
    };

    setRepuestos(
      repuestosActualizados
    );

    localStorage.setItem(
      "repuestos",
      JSON.stringify(
        repuestosActualizados
      )
    );
  }}
  style={{
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Instalar
</button>
    </div>
  ))}
  <h2
  style={{
    marginTop: "30px",
    fontSize: "28px",
    fontWeight: "bold",
  }}
>
  Historial de instalados
</h2>

{repuestos[tiendaSeleccionada.numero]
  ?.filter(
    (repuesto) =>
      repuesto.estado === "Instalado"
  )
  .map((repuesto, index) => (
    <div
      key={index}
      style={cardStyle}
    >
      <p>{repuesto.nombre}</p>

      <p>
        Instalado por:{" "}
        {repuesto.instaladoPor || "-"}
      </p>

      <p>
        Pedido por:{" "}
        {repuesto.pedidoPor}
      </p>
    </div>
  ))}
      
     <h2 style={{ marginTop: "40px" }}>
  Registro refrigerante
</h2>

<input
  type="text"
  placeholder="Cantidad kg"
  value={cantidadGas}
  onChange={(e) => setCantidadGas(e.target.value)}
  style={inputStyle}
/>

<select
  value={tipoCentral}
  onChange={(e) => setTipoCentral(e.target.value)}
  style={inputStyle}
>
  <option value="">Tipo central</option>
  <option value="Positiva">Positiva</option>
  <option value="Negativa">Negativa</option>
  <option value="CO2">CO2</option>
</select>

<button
  onClick={() => {
    const nuevoRegistro = {
      fecha: new Date().toLocaleString(),
      cantidad: cantidadGas,
      tipo: tipoCentral,
    };

   const numeroTienda = tiendaSeleccionada.numero;

const registrosActuales =
  registrosGas[numeroTienda] || [];

const nuevosRegistros = {
  ...registrosGas,
  [numeroTienda]: [
    ...registrosActuales,
    nuevoRegistro,
  ],
};

setRegistrosGas(nuevosRegistros);

localStorage.setItem(
  "registrosGas",
  JSON.stringify(nuevosRegistros)
);

    setCantidadGas("");
    setTipoCentral("");
  }}
  style={buttonStyle}
>

  Añadir carga
</button>
{registrosGas[tiendaSeleccionada.numero]?.map(
  (registro, index) => (
  <div key={index} style={cardStyle}>
    <p>{registro.fecha}</p>
    <p>{registro.tipo}</p>
    <p>{registro.cantidad} kg</p>
    <button
  onClick={() => {
    const numeroTienda = tiendaSeleccionada.numero;

    const nuevosRegistros =
      registrosGas[numeroTienda].filter(
        (_, i) => i !== index
      );

    const registrosActualizados = {
      ...registrosGas,
      [numeroTienda]: nuevosRegistros,
    };

    setRegistrosGas(registrosActualizados);

    localStorage.setItem(
      "registrosGas",
      JSON.stringify(registrosActualizados)
    );
  }}
  style={{
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Eliminar
</button>
  </div>
  )
)}

<input
  type="text"
  placeholder="Nueva incidencia"
  value={nuevaIncidencia}
  onChange={(e) => setNuevaIncidencia(e.target.value)}
  style={inputStyle}
/>

<button
  onClick={() => {
    if (nuevaIncidencia !== "") {

      const numeroTienda = tiendaSeleccionada.numero;

      const incidenciasActuales =
        incidencias[numeroTienda] || [];

      const nuevasIncidencias = {
        ...incidencias,
        [numeroTienda]: [
          ...incidenciasActuales,
          nuevaIncidencia,
        ],
      };

      setIncidencias(nuevasIncidencias);

      localStorage.setItem(
        "incidenciasPorTienda",
        JSON.stringify(nuevasIncidencias)
      );

      setNuevaIncidencia("");
    }
  }}
  style={buttonStyle}
>
  Añadir incidencia
</button>
  


{incidencias[tiendaSeleccionada.numero]?.map(
  (incidencia, index) => (
<div key={index} style={cardStyle}>
  <p>{incidencia}</p>

  <button
    onClick={() => {
      const numeroTienda = tiendaSeleccionada.numero;

      const nuevasIncidencias = {
        ...incidencias,
        [numeroTienda]: incidencias[numeroTienda].filter(
          (_, i) => i !== index
        ),
      };

      setIncidencias(nuevasIncidencias);

      localStorage.setItem(
        "incidenciasPorTienda",
        JSON.stringify(nuevasIncidencias)
      );
    }}
    style={buttonStyle}
  >
    Borrar
  </button>
</div>   
  
))}

<button
  onClick={() => setPantalla("tiendas")}
  style={buttonStyle}
>
  ← Volver
</button>

</main>
);
}

if (pantalla === "detalle" && tiendaSeleccionada) {
  return (
    <main style={mainStyle}>
      <h1>🏪 {tiendaSeleccionada.nombre}</h1>

      <p><strong>Nº tienda:</strong> {tiendaSeleccionada.numero}</p>
      <p><strong>Población:</strong> {tiendaSeleccionada.poblacion}</p>
      <p><strong>Gas:</strong> {tiendaSeleccionada.gas}</p>
      <p><strong>Técnico:</strong> {tiendaSeleccionada.tecnico}</p>
<input
  type="text"
  placeholder="Nueva incidencia"
  value={nuevaIncidencia}
  onChange={(e) => setNuevaIncidencia(e.target.value)}
  style={inputStyle}
/>

<button
  onClick={() => {
    if (nuevaIncidencia !== "") {
const numeroTienda = tiendaSeleccionada.numero;

const incidenciasActuales =
  incidencias[numeroTienda] || [];

const nuevasIncidencias = {
  ...incidencias,
  [numeroTienda]: [
    ...incidenciasActuales,
    nuevaIncidencia,
  ],
};

setIncidencias(nuevasIncidencias);

localStorage.setItem(
  "incidenciasPorTienda",
  JSON.stringify(nuevasIncidencias)
);

setNuevaIncidencia("");
      setNuevaIncidencia("");
    }
  }}
  style={buttonStyle}
>
  Añadir incidencia
</button>

{incidencias[tiendaSeleccionada.numero]?.map(
  (incidencia, index) => (
    <div key={index} style={cardStyle}>
      <p>{incidencia}</p>

      <button
        onClick={() => {
          const numeroTienda = tiendaSeleccionada.numero;

          const nuevasIncidencias = {
            ...incidencias,
            [numeroTienda]: incidencias[numeroTienda].filter(
              (_, i) => i !== index
            ),
          };

          setIncidencias(nuevasIncidencias);

          localStorage.setItem(
            "incidenciasPorTienda",
            JSON.stringify(nuevasIncidencias)
          );
        }}
        style={buttonStyle}
      >
        Borrar
      </button>
    </div>
  )
)}

<button
  onClick={() => setPantalla("tiendas")}
        style={buttonStyle}
      >
        ← Volver
      </button>
    </main>
  );
}
  return (
    <main style={mainStyle}>
      <h1>APP FRIO</h1>

      <h2>Gestión de mantenimiento frigorífico</h2>

      <button
        onClick={() => setPantalla("tiendas")}
        style={buttonStyle}
      >
        Ver tiendas
      </button>
      
    </main>
  );
}

const mainStyle = {
  padding: "20px",
  backgroundColor: "#f4f6f8",
  minHeight: "100vh",
  fontFamily: "Arial",
};

const cardStyle = {
  backgroundColor: "white",
  background: "linear-gradient(to bottom, white, #f9fafb)",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "10px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  border: "1px solid #e3e6ea",
};
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};


const buttonStyle = {
  backgroundColor: "#0b5ed7",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  marginTop: "10px",
  marginBottom: "10px",
};
const inputStyle = {
  padding: "12px",
  width: "100%",
  maxWidth: "400px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  fontSize: "15px",
};
const sectionStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};
