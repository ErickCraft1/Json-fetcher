const doc = document;

doc.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted");
  const input = doc.getElementById("input").value;
  console.log(input);

  const res = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiName: input }),
  });

  const data = await res.json();

  doc.getElementById("response").innerHTML =
    "Mensaje del servidor: " +
    data.message +
    "\nNombre de la Api: " +
    data.apiName +
    "\nDatos recibidos:\n";
  data.data.results.forEach(({ name }) => {
    doc.getElementById("response").innerHTML += "\nNombre: " + name + "\n";
  });
});
