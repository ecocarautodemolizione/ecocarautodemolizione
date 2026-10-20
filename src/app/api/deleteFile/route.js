export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function norm(p) {
  return String(p || "").replace(/^\/+|\/+$/g, "");
}

async function listAllFilesRecursive(bucket, prefix) {
  const files = [];

  async function walk(currentPrefix) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(norm(currentPrefix), { limit: 1000 });

    if (error) throw error;

    for (const item of data ?? []) {
      if (!item?.name) continue;

      const nextPath = norm([currentPrefix, item.name].filter(Boolean).join("/"));

      const isFile = item.metadata != null;

      if (isFile) {
        files.push(nextPath);
      } else {
        await walk(nextPath);
      }
    }
  }

  await walk(norm(prefix));
  return files;
}

export async function POST(req) {
  try {
    const body = await req.json();


    const storageOps = Array.isArray(body?.storage) ? body.storage : [];


    const table = body?.table;
    const idColumn = body?.idColumn;
    const uuid = body?.uuid;

    if (!storageOps.length) {
      return NextResponse.json(
        { error: "Parametri mancanti: storage (array di {bucket, folder})" },
        { status: 400 }
      );
    }

    let removedTotal = 0;
    const removedDetail = [];

    for (const op of storageOps) {
      const bucket = op?.bucket;
      const folder = op?.folder;

      if (!bucket || !folder) {
        removedDetail.push({
          bucket: bucket ?? null,
          folder: folder ?? null,
          removed: 0,
          note: "missing bucket/folder",
        });
        continue;
      }

      let pathsToRemove = [];
      try {
        pathsToRemove = await listAllFilesRecursive(bucket, folder);
      } catch (e) {
        return NextResponse.json(
          { error: `Errore list ricorsiva (${bucket}): ${e.message || String(e)}` },
          { status: 400 }
        );
      }

      if (!pathsToRemove.length) {
        removedDetail.push({ bucket, folder, removed: 0 });
        continue;
      }

      const CHUNK = 200;
      for (let i = 0; i < pathsToRemove.length; i += CHUNK) {
        const chunk = pathsToRemove.slice(i, i + CHUNK);
        const { error: rmErr } = await supabaseAdmin.storage.from(bucket).remove(chunk);
        if (rmErr) {
          return NextResponse.json(
            { error: `Errore delete storage (${bucket}): ${rmErr.message}` },
            { status: 400 }
          );
        }
      }

      removedTotal += pathsToRemove.length;
      removedDetail.push({ bucket, folder, removed: pathsToRemove.length });
    }

    let dbUpdatedDati = false;

    if (table && idColumn && uuid) {
      const { error: updErr } = await supabaseAdmin
        .from(table)
        .update({
          foto_documento_veicolo_ritirato_f: null,
          foto_documento_veicolo_ritirato_r: null,
          foto_documento_detentore_f: null,
          foto_documento_detentore_r: null,
          foto_complementare_veicolo_ritirato_f: null,
          foto_complementare_veicolo_ritirato_r: null,
        })
        .eq(idColumn, uuid);

      if (updErr) {
        return NextResponse.json(
          { error: `Errore update DB (${table}): ${updErr.message}` },
          { status: 400 }
        );
      }

      dbUpdatedDati = true;
    }
    let dbUpdatedCert = false;

    if (uuid) {
      const { error: updCertErr } = await supabaseAdmin
        .from("certificato_demolizione")
        .update({
          documento_demolizione: null,
          altro_documento_demolizione: null,
        })
        .eq("uuid_veicolo_ritirato", uuid);

      if (updCertErr) {
        return NextResponse.json(
          { error: `Errore update DB (certificato_demolizione): ${updCertErr.message}` },
          { status: 400 }
        );
      }

      dbUpdatedCert = true;
    }

    return NextResponse.json({
      ok: true,
      removedTotal,
      removedDetail,
      dbUpdatedDati,
      dbUpdatedCert,
    });
  } catch (e) {
    console.error("[delete-files-and-null-fields] error:", e);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
