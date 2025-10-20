import { useEffect, useState } from "react";
import { ReportsAPI } from "../../services/api";
import { useToast } from "../../ui/Toast";

type Row = {
  codigo_unico: string;
  nombre: string;
  unidades: number;
  vendido: number;
  utilidad_estimada?: number;
};

export default function TopProducts() {
  const [rows, setRows] = useState<Row[]>([]);
  const { show } = useToast();

  useEffect(() => {
    ReportsAPI.topProducts(20)
      .then(setRows)
      .catch((e) => show(e.message, "error"));
  }, []);

  return (
    <div className="grid">
      <h1>Top productos</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Unidades</th>
              <th>Vendido</th>
              <th>Utilidad estimada</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((r) => (
                <tr key={r.codigo_unico}>
                  <td className="code">{r.codigo_unico}</td>
                  <td>{r.nombre}</td>
                  <td>{r.unidades}</td>
                  <td>${(r.vendido || 0).toLocaleString("es-CO")}</td>
                  <td>${(r.utilidad_estimada || 0).toLocaleString("es-CO")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="muted">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
