const API_URL = import.meta.env.VITE_API_URL // URL directa

export async function getDateAppointmetns(fechaSeleccionada) {
  try {
    const resp = await fetch(`${API_URL}/appointments/fecha?date=${fechaSeleccionada}`);
    if (!resp.ok) throw new Error(resp.statusText);
    const data = await resp.json();
    console.log("URL del backend:", API_URL);
    return data;
  } catch (err) {
    console.error("Error al obtener citas:", err);
    return [];
  }
}


