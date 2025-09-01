const API_URL = "https://synaptic-fao4.onrender.com/appointments/";

export async function getDateAppointmetns(fechaSeleccionada) {
  const resp = await fetch(`${API_URL}fecha?date=${fechaSeleccionada} `);
  const data = await resp.json();
  return data;
}
