let form = document.querySelector(".section-search form");
let input = document.querySelector(".section-search input");
let msg = document.querySelector(".section-search .msg");
let lista = document.querySelector(".results .ciudades");

const API_KEY = "a70f90cef2e625150f48bbd1a9964621";

form.addEventListener("submit", e => {
    e.preventDefault();
    let ciudad = input.value;
    const ListaItems = lista.querySelectorAll(".results .ciudad");
    const ListaIterable = Array.from(ListaItems);

    if(ListaIterable.length > 0) {
        const filtrado = ListaIterable.filter(el => {
            let content = "";
            if(ciudad.includes(",")) {
                if(ciudad.split(",")[1].length > 2) {
                    ciudad = ciudad.split(",")[0];
                    content = el
                      .querySelector(".ciudad-name span")
                      .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".ciudad-name span").dataset.name.toLowerCase();
                }
            } else {
                content = el.querySelector(".ciudad-name span").textContent.toLowerCase();
            }
            return content == ciudad.toLowerCase();
        });

        if(filtrado.length > 0) {
            msg.innerHTML = `Ya estas observando la tarjeta clímatica de la ciudad "<strong>${ciudad}</strong>"...`;
            form.reset();
            input.focus();
            return;
        }
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            
            const { main, name, sys, weather } = data;
            const icono = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                weather[0]["icon"]
            }.svg`;
        
            const li = document.createElement("li");
            li.classList.add("ciudad");
            const marca = `<h2 class="ciudad-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="ciudad-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="ciudad-icon" src="${icono}" alt="${weather[0]["descripcion"]}">
                <figcaption><strong>${weather[0]["description"]}</strong></figcaption>
            </figure>
            `;
            li.innerHTML = marca;
            lista.appendChild(li);
        })
        .catch(() => {
            msg.innerHTML = `No pude encontrar la ciudad "<strong>${ciudad}</strong>", prueba con una ciudad real...`;
        });

    msg.textContent = "";
    form.reset();
    input.focus();
});