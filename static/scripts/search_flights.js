
window.addEventListener("DOMContentLoaded", async ()=>{
    // Add event listener to the search btn
    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getFlights);
});

async function getFlights(){
    // Get the table body
    const tb = document.getElementById("results-table-body");
    // Remove previous flights in the table
    while(tb.firstElementChild){
        tb.removeChild(tb.firstElementChild);
    }

    // API connection stuff
    const RAPIDAPI_KEY = "f34f0f10c2msh6855d6d77950b00p18a515jsn9e45dbeb030f"
    const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com"

    const RAPIDAPI_BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1/flights/"

    const headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
    }

    // Get the data from the form in the page
    // Get the searched cities
    const from_city = document.getElementById("fromId").value;
    const to_city = document.getElementById("toId").value;

    // fetch the airport ids from the api based on city names
    const getAirportURL = `${RAPIDAPI_BASE_URL}searchDestination?query=`;

    // Get the from airport id
    let getAirportResponse = await fetch(`${getAirportURL}${from_city}`, {
        method: "GET",
        headers: headers
    });
    const fromAirportData = await validateJSON(getAirportResponse);
    if(fromAirportData.data.length === 0){
        const fromAirportField = document.getElementById("fromId");
        fromAirportField.setCustomValidity("No Airport Found");
    }
    const from_id = fromAirportData.data[0].id;

    // Get the to airport id
    getAirportResponse = await fetch(`${getAirportURL}${to_city}`, {
        method: "GET",
        headers: headers
    });
    const toAirportData = await validateJSON(getAirportResponse);
    if(toAirportData.data.length === 0){
        const fromAirportField = document.getElementById("toId");
        fromAirportField.setCustomValidity("No Airport Found");
    }
    const to_id = toAirportData.data[0].id;
    

    //Get the rest of the form data
    const depart_date = document.getElementById("departDate").value;
    const return_date = document.getElementById("returnDate").value;
    const adults = document.getElementById("adults").value;
    const sort_by = document.getElementById("sort").value;

    // Construct the URL to get the flight data
    const searchFlightsURL = `${RAPIDAPI_BASE_URL}searchFlights?fromId=${from_id}&toId=${to_id}&departDate=${depart_date}&returnDate=${return_date}&pageNo=1&adults=${adults}&children=0&sort=${sort_by}&currency_code=USD`

    // Fetch the flight data from the API
    const searchFlightResponse = await fetch(searchFlightsURL, {
        method: "GET",
        headers: headers
    });

    // Validate the JSON
    const searchFlightData = await validateJSON(searchFlightResponse);
    console.log(searchFlightData);

    if(searchFlightData.data.error){
        console.log("not iterable")
        // TODO: Show a message showing no flights
    }

    // Fill the table with the flights
    for(const flight of searchFlightData.data.flightOffers){
        const tr = document.createElement("tr");
        insertFlight(tr, flight);
        tb.appendChild(tr);
    }
}

async function insertFlight(tr, flight){
    // Create td elements for each aspect of the flight
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

    // Add the data to the table row
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
