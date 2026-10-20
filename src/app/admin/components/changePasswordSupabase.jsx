"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";

export default function ModificaPassword() {
  const router = useRouter();

  const [passwordAttuale, setPasswordAttuale] = useState("");
  const [nuovaPassword, setNuovaPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");

  const [mostraPasswordAttuale, setMostraPasswordAttuale] =
    useState(false);

  const [mostraNuovaPassword, setMostraNuovaPassword] =
    useState(false);

  const [mostraConfermaPassword, setMostraConfermaPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState(false);

  const requisiti = useMemo(() => {
    return {
      lunghezza: nuovaPassword.length >= 8,
      maiuscola: /[A-Z]/.test(nuovaPassword),
      minuscola: /[a-z]/.test(nuovaPassword),
      numero: /\d/.test(nuovaPassword),
      speciale: /[^A-Za-z0-9]/.test(nuovaPassword),
    };
  }, [nuovaPassword]);

  const passwordValida = Object.values(requisiti).every(Boolean);

  const passwordCoincidono =
    confermaPassword.length > 0 &&
    nuovaPassword === confermaPassword;

  const passwordDiverse =
    nuovaPassword.length > 0 &&
    passwordAttuale !== nuovaPassword;

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !passwordAttuale ||
      !nuovaPassword ||
      !confermaPassword
    ) {
      toast.error("Compila tutti i campi.");
      return;
    }

    if (!passwordValida) {
      toast.error(
        "La nuova password non rispetta tutti i requisiti."
      );
      return;
    }

    if (nuovaPassword !== confermaPassword) {
      toast.error("Le nuove password non coincidono.");
      return;
    }

    if (passwordAttuale === nuovaPassword) {
      toast.error(
        "La nuova password deve essere diversa dalla password attuale."
      );
      return;
    }

    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error(
          "Sessione non valida. Effettua nuovamente il login."
        );

        router.push("/login");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: nuovaPassword,
        current_password: passwordAttuale,
      });

      if (error) {
        console.error(
          "Errore modifica password:",
          error
        );

        const messaggio =
          error.message?.toLowerCase() || "";

        if (
          messaggio.includes("current password") ||
          messaggio.includes("password is incorrect")
        ) {
          toast.error(
            "La password attuale non è corretta."
          );
          return;
        }

        toast.error(
          error.message ||
            "Errore durante la modifica della password."
        );

        return;
      }

      setSuccesso(true);

      toast.success(
        "Password modificata correttamente."
      );

      setPasswordAttuale("");
      setNuovaPassword("");
      setConfermaPassword("");

      const { error: logoutError } =
        await supabase.auth.signOut();

      if (logoutError) {
        console.error(
          "Errore durante il logout:",
          logoutError
        );
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Errore modifica password:",
        error
      );

      toast.error(
        "Si è verificato un errore durante la modifica della password."
      );
    } finally {
      setLoading(false);
    }
  }

  function RequisitoPassword({ valido, children }) {

    return (
      <div className={`flex items-center gap-2 text-xs ${
          valido
            ? "text-green-500"
            : "text-neutral-400"
        }`}
      >
        {valido ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}

        <span>{children}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-2xl dark:bg-neutral-900 bg-neutral-100 p-6 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="space-y-2">
            <Label
              htmlFor="passwordAttuale"
              className="dark:text-neutral-200 text-neutral-800"
            >
              Password attuale
            </Label>

            <div className="relative">
              <Input
                id="passwordAttuale"
                type={
                  mostraPasswordAttuale
                    ? "text"
                    : "password"
                }
                value={passwordAttuale}
                onChange={(e) =>
                  setPasswordAttuale(
                    e.target.value
                  )
                }
                placeholder="Inserisci la password attuale"
                autoComplete="current-password"
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setMostraPasswordAttuale(
                    !mostraPasswordAttuale
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-100"
                aria-label={
                  mostraPasswordAttuale
                    ? "Nascondi password"
                    : "Mostra password"
                }
              >
                {mostraPasswordAttuale ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>


          <div className="space-y-2">
            <Label
              htmlFor="nuovaPassword"
              className="dark:text-neutral-200 text-neutral-800"
            >
              Nuova password
            </Label>

            <div className="relative">
              <Input
                id="nuovaPassword"
                type={
                  mostraNuovaPassword
                    ? "text"
                    : "password"
                }
                value={nuovaPassword}
                onChange={(e) =>
                  setNuovaPassword(
                    e.target.value
                  )
                }
                placeholder="Inserisci la nuova password"
                autoComplete="new-password"
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setMostraNuovaPassword(
                    !mostraNuovaPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-100"
                aria-label={
                  mostraNuovaPassword
                    ? "Nascondi password"
                    : "Mostra password"
                }
              >
                {mostraNuovaPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {nuovaPassword && (
              <div className="mt-3 space-y-1.5 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3">
                <p className="mb-2 text-xs font-medium text-neutral-300">
                  La password deve contenere:
                </p>

                <RequisitoPassword
                  valido={requisiti.lunghezza}
                >
                  almeno 8 caratteri
                </RequisitoPassword>

                <RequisitoPassword
                  valido={requisiti.maiuscola}
                >
                  almeno una lettera maiuscola
                </RequisitoPassword>

                <RequisitoPassword
                  valido={requisiti.minuscola}
                >
                  almeno una lettera minuscola
                </RequisitoPassword>

                <RequisitoPassword
                  valido={requisiti.numero}
                >
                  almeno un numero
                </RequisitoPassword>

                <RequisitoPassword
                  valido={requisiti.speciale}
                >
                  almeno un carattere speciale
                </RequisitoPassword>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confermaPassword"
              className="dark:text-neutral-200 text-neutral-800"
            >
              Conferma nuova password
            </Label>

            <div className="relative">
              <Input
                id="confermaPassword"
                type={
                  mostraConfermaPassword
                    ? "text"
                    : "password"
                }
                value={confermaPassword}
                onChange={(e) =>
                  setConfermaPassword(
                    e.target.value
                  )
                }
                placeholder="Ripeti la nuova password"
                autoComplete="new-password"
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setMostraConfermaPassword(
                    !mostraConfermaPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-100"
                aria-label={
                  mostraConfermaPassword
                    ? "Nascondi password"
                    : "Mostra password"
                }
              >
                {mostraConfermaPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {confermaPassword && (
              <div
                className={`flex items-center gap-2 text-xs ${
                  passwordCoincidono
                    ? "text-green-500"
                    : "text-red-400"
                }`}
              >
                {passwordCoincidono ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}

                {passwordCoincidono
                  ? "Le password coincidono"
                  : "Le password non coincidono"}
              </div>
            )}
          </div>

          {nuovaPassword &&
            passwordAttuale &&
            !passwordDiverse && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                La nuova password deve essere diversa
                dalla password attuale.
              </div>
            )}

          <div className="rounded-lg border bg-red-700 px-4 py-3">
            <p className="text-xs leading-relaxed text-neutral-200">
              Dopo la modifica della password verrai
              disconnesso automaticamente e dovrai
              effettuare nuovamente l'accesso con la
              nuova password.
            </p>
          </div>

          <Button
            type="submit"
            disabled={
              loading ||
              !passwordAttuale ||
              !nuovaPassword ||
              !confermaPassword ||
              !passwordValida ||
              !passwordCoincidono ||
              !passwordDiverse
            }
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Modifica in corso...
              </>
            ) : (
              "Modifica password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}