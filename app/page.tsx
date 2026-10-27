
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tarea = {
  id: number;
  nombre: string;
  completada: boolean;
  usuario_id: string;
};

export default function Home() {
  const router = useRouter();

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [tarea, setTarea] = useState("");
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [indiceEditar, setIndiceEditar] = useState<number | null>(null);
  const [textoEditar, setTextoEditar] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Cargar el usuario y sus tareas
  useEffect(() => {
    async function iniciar() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUsuarioId(data.user.id);

      const { data: registros, error: errorTareas } = await supabase
        .from("tareas")
        .select("id, nombre, completada, usuario_id")
        .eq("usuario_id", data.user.id)
        .order("id", { ascending: false });

      if (errorTareas) {
        setMensaje("Error al cargar tareas: " + errorTareas.message);
      } else {
        setTareas(registros ?? []);
      }

      setCargando(false);
    }

    iniciar();
  }, [router]);

  // Agregar tarea
  async function agregarTarea(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nombre = tarea.trim();

    if (!nombre || !usuarioId || procesando) return;

    setProcesando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("tareas")
      .insert({
        nombre,
        completada: false,
        usuario_id: usuarioId,
      })
      .select("id, nombre, completada, usuario_id")
      .single();

    if (error) {
      setMensaje("Error al agregar: " + error.message);
    } else {
      setTareas((anteriores) => [data, ...anteriores]);
      setTarea("");
    }

    setProcesando(false);
  }

  // Eliminar tarea
  async function eliminarTarea(id: number) {
    if (!usuarioId || procesando) return;

    setProcesando(true);
    setMensaje("");

    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", usuarioId);

    if (error) {
      setMensaje("Error al eliminar: " + error.message);
    } else {
      setTareas((anteriores) =>
        anteriores.filter((item) => item.id !== id)
      );
    }

    setProcesando(false);
  }

  // Preparar edición
  function iniciarEdicion(item: Tarea) {
    setIndiceEditar(item.id);
    setTextoEditar(item.nombre);
  }

  // Guardar edición
  async function guardarEdicion() {
    const nombre = textoEditar.trim();

    if (!nombre || indiceEditar === null || !usuarioId || procesando) {
      return;
    }

    setProcesando(true);
    setMensaje("");

    const { error } = await supabase
      .from("tareas")
      .update({ nombre })
      .eq("id", indiceEditar)
      .eq("usuario_id", usuarioId);

    if (error) {
      setMensaje("Error al editar: " + error.message);
    } else {
      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === indiceEditar ? { ...item, nombre } : item
        )
      );

      setIndiceEditar(null);
      setTextoEditar("");
    }

    setProcesando(false);
  }

  // Cambiar estado de una tarea
  async function cambiarEstado(item: Tarea) {
    if (!usuarioId || procesando) return;

    setProcesando(true);
    setMensaje("");

    const nuevoEstado = !item.completada;

    const { error } = await supabase
      .from("tareas")
      .update({ completada: nuevoEstado })
      .eq("id", item.id)
      .eq("usuario_id", usuarioId);

    if (error) {
      setMensaje("Error al actualizar: " + error.message);
    } else {
      setTareas((anteriores) =>
        anteriores.map((actual) =>
          actual.id === item.id
            ? { ...actual, completada: nuevoEstado }
            : actual
        )
      );
    }

    setProcesando(false);
  }

  // Cerrar sesión
  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMensaje("Error al cerrar sesión: " + error.message);
      return;
    }

    router.replace("/login");
  }

  // Estadísticas
  const total = tareas.length;
  const completadas = tareas.filter((item) => item.completada).length;
  const pendientes = total - completadas;
  const progreso = total === 0 ? 0 : Math.round((completadas / total) * 100);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse text-slate-300">
          Cargando tu panel de tareas...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Encabezado */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Mi espacio de trabajo
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Panel de tareas
            </h1>

            <p className="mt-2 text-slate-400">
              Organizá tus actividades y revisá tu progreso.
            </p>
          </div>

          <button
            onClick={cerrarSesion}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Cerrar sesión
          </button>
        </header>

        {/* Tarjetas de estadísticas */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total de tareas</p>
            <p className="mt-3 text-4xl font-bold text-blue-400">
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Pendientes</p>
            <p className="mt-3 text-4xl font-bold text-amber-400">
              {pendientes}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completadas</p>
            <p className="mt-3 text-4xl font-bold text-emerald-400">
              {completadas}
            </p>
          </div>
        </section>

        {/* Barra de progreso */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                Tu progreso
              </h2>
              <p className="text-sm text-slate-400">
                Tareas completadas hasta ahora
              </p>
            </div>

            <span className="text-2xl font-bold text-blue-400">
              {progreso}%
            </span>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-valuenow={progreso}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de tareas"
          >
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </section>

        {/* Lista de tareas */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              Mis tareas
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Agregá, editá o completá tus actividades.
            </p>
          </div>

          {/* Agregar tarea */}
          <form
            onSubmit={agregarTarea}
            className="mb-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              placeholder="Escribí una nueva tarea..."
              value={tarea}
              onChange={(e) => setTarea(e.target.value)}
              maxLength={200}
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={procesando || !tarea.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Agregar tarea
            </button>
          </form>

          {/* Mensajes de error */}
          {mensaje && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300"
            >
              {mensaje}
            </p>
          )}

          {/* Tareas */}
          <ul className="space-y-3">
            {tareas.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 transition hover:border-slate-600"
              >
                {indiceEditar === item.id ? (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={textoEditar}
                      onChange={(e) => setTextoEditar(e.target.value)}
                      maxLength={200}
                      className="min-w-0 flex-1 rounded-lg border border-blue-500 bg-slate-950 px-3 py-2 text-white outline-none"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={guardarEdicion}
                        disabled={procesando || !textoEditar.trim()}
                        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 disabled:opacity-50"
                      >
                        Guardar
                      </button>

                      <button
                        onClick={() => setIndiceEditar(null)}
                        disabled={procesando}
                        className="rounded-lg bg-slate-700 px-4 py-2 font-medium hover:bg-slate-600 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.completada}
                        onChange={() => cambiarEstado(item)}
                        disabled={procesando}
                        className="h-5 w-5 shrink-0 accent-blue-500"
                      />

                      <span
                        className={`break-words ${
                          item.completada
                            ? "text-slate-500 line-through"
                            : "text-slate-100"
                        }`}
                      >
                        {item.nombre}
                      </span>
                    </label>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => iniciarEdicion(item)}
                        disabled={procesando}
                        className="rounded-lg bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/25 disabled:opacity-50"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarTarea(item.id)}
                        disabled={procesando}
                        className="rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Estado vacío */}
          {tareas.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg font-medium text-slate-300">
                Todavía no tenés tareas registradas.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Agregá tu primera tarea para comenzar.
              </p>
            </div>
          )}
        </section>

        <footer className="pb-4 text-center text-sm text-slate-500">
          Desarrollado con Next.js, TypeScript y Supabase
        </footer>
      </div>
    </main>
  );
}
