
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(true);

  // Comprobar si el usuario ya inició sesión
  useEffect(() => {
    async function verificarSesion() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/");
      } else {
        setVerificando(false);
      }
    }

    verificarSesion();
  }, [router]);

  // Iniciar sesión con Supabase
  async function iniciarSesion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });

    if (error) {
      setMensaje("No se pudo iniciar sesión. Revisá tus datos.");
      setCargando(false);
      return;
    }

    router.replace("/");
  }

  // Evitar mostrar el login mientras verificamos la sesión
  if (verificando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
      <form
        onSubmit={iniciarSesion}
        className="w-full max-w-sm space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6"
      >
        <h1 className="text-2xl font-bold text-center">
          Iniciar sesión
        </h1>

        <p className="text-center text-sm text-slate-400">
          Ingresá para administrar tus tareas.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="w-full rounded border p-3 text-black bg-white"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="w-full rounded border p-3 text-black bg-white"
        />

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded bg-blue-600 p-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        {mensaje && (
          <p className="text-center text-red-500">{mensaje}</p>
        )}

        {/* Enlace para crear una cuenta nueva */}
        <p className="text-center text-sm text-slate-400">
          ¿No tenés una cuenta?{" "}
          <Link
            href="/registro"
            className="text-blue-400 font-semibold hover:underline"
          >
            Registrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
