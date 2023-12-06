window.addEventListener("DOMContentLoaded", async ()=>{
    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getFlights);
});

async function getFlights(){
    const tb = document.getElementById("results-table-body");
    while(tb.firstElementChild){
        tb.removeChild(tb.firstElementChild);
    }

    const RAPIDAPI_KEY = "f34f0f10c2msh6855d6d77950b00p18a515jsn9e45dbeb030f"
    const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com"
    const RAPIDAPI_BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights"

    const headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
    }

    const from_id = document.getElementById("fromId").value;
    const to_id = document.getElementById("toId").value;
    const depart_date = document.getElementById("departDate").value;
    const return_date = document.getElementById("returnDate").value;
    const adults = document.getElementById("adults").value;
    const sort_by = document.getElementById("sort").value;

    const URL = `${RAPIDAPI_BASE_URL}?fromId=${from_id}&toId=${to_id}&departDate=${depart_date}&returnDate=${return_date}&pageNo=1&adults=${adults}&children=0&sort=${sort_by}&currency_code=USD`

    const r = await fetch(URL, {
        method: "GET",
        headers: headers,
    });

    const data = await validateJSON(r);
    console.log(data);

    for(const flight of data.data.flightOffers){
        const tr = document.createElement("tr");
        insertFlight(tr, flight);
        tb.appendChild(tr);
    }
}

async function insertFlight(tr, flight){
    const fromTD = document.createElement("td");
    fromTD.innerText = flight.segments[0].departureAirport.cityName;

    const toTD = document.createElement("td");
    toTD.innerText = flight.segments[0].arrivalAirport.cityName;

    const depart_timeTD = document.createElement("td");
    depart_timeTD.innerText = flight.segments[0].legs[0].departureTime;

    const arrive_timeTD = document.createElement("td");
    arrive_timeTD.innerText = flight.segments[0].legs[0].arrivalTime;

    const priceTD = document.createElement("td");
    priceTD.innerText = flight.priceBreakdown.total.units;

    tr.appendChild(fromTD);
    tr.appendChild(toTD);
    tr.appendChild(depart_timeTD);
    tr.appendChild(arrive_timeTD);
    tr.appendChild(priceTD);
}

/**
 * Validate a response to ensure the HTTP status code indcates success.
 * 
 * @param {Response} response HTTP response to be checked
 * @returns {object} object encoded by JSON in the response
 */
function validateJSON(response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}
