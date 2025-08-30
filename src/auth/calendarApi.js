const API_URL = "http://localhost:3000/appointments/";

export async function getDateAppointmetns(fechaSeleccionada) {
  const resp = await fetch(`${API_URL}fecha?date=${fechaSeleccionada} `);
  const data = await resp.json();
  return data;
}
