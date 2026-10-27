
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Registro() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  async function registrarUsuario(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMensaje("");
    setExito(false);

    if (contrasena !== confirmar) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (contrasena.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    const { data, error } = await supabase.auth.signUp({
      email: correo.trim(),
      password: contrasena,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setCargando(false);

    if (error) {
      setMensaje("No se pudo completar el registro: " + error.message);
      return;
    }

    setExito(true);
    setContrasena("");
    setConfirmar("");

    if (data.session) {
      setMensaje(
        "Cuenta creada correctamente. Ya podés ir a tus tareas."
      );
    } else {
      setMensaje(
        "Solicitud recibida. Revisá tu correo para confirmar tu cuenta, si corresponde, antes de iniciar sesión."
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <form
        onSubmit={registrarUsuario}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Registrate para organizar tus tareas.
          </p>
        </div>

        <div>
          <label
            htmlFor="correo"
            className="mb-2 block text-sm text-slate-300"
          >
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="contrasena"
            className="mb-2 block text-sm text-slate-300"
          >
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            minLength={6}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirmar"
            className="mb-2 block text-sm text-slate-300"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmar"
            type="password"
            placeholder="Repetí tu contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-xl bg-blue-600 p-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>

        {mensaje && (
          <p
            role="status"
            className={`text-center text-sm ${
              exito ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {mensaje}
          </p>
        )}

        <p className="text-center text-sm text-slate-400">
          ¿Ya tenés una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-400 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
