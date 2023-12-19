
window.addEventListener("DOMContentLoaded", async ()=>{
    // Add event listener to the search btn, and call getFlights when clicked
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

    // API information
    const RAPIDAPI_KEY = "f34f0f10c2msh6855d6d77950b00p18a515jsn9e45dbeb030f"
    const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com"
    const RAPIDAPI_BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1/flights/"
    const headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
    }

    // Div to show error messages if no flights are found or no airport is found
    const errorMessageDiv = document.getElementById("search-results-errors");
    // Clear the error messages from the last search
    while(errorMessageDiv.firstElementChild){
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
    }
    // Show the user that the page is searching
    const searchingMsg = document.createElement("p");
    searchingMsg.innerText = "Searching. . .";
    errorMessageDiv.appendChild(searchingMsg);

    // Get the data from the form in the page

    // Get the searched cities
    const from_city = document.getElementById("fromId").value;
    const to_city = document.getElementById("toId").value;

    // fetching the airport ids from the api based on city names
    const getAirportURL = `${RAPIDAPI_BASE_URL}searchDestination?query=`;

    // Get the from airport id
    let getAirportResponse = await fetch(`${getAirportURL}${from_city}`, {
        method: "GET",
        headers: headers
    });
    const fromAirportData = await validateJSON(getAirportResponse);
    // If no airport found
    if(fromAirportData.data.length === 0){
        // Remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        // Add an error stating no airport found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = `No airport found in ${from_city}`;
        errorMessageDiv.appendChild(errorMsg);
    }
    const from_id = fromAirportData.data[0].id;

    // Get the to airport id
    getAirportResponse = await fetch(`${getAirportURL}${to_city}`, {
        method: "GET",
        headers: headers
    });
    const toAirportData = await validateJSON(getAirportResponse);
    // If no airport found
    if(toAirportData.data.length === 0){
        // Remove the Serching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        // Add a message saying no airport found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = `No airport found in ${to_city}`;
        errorMessageDiv.appendChild(errorMsg);
    }
    const to_id = toAirportData.data[0].id;

    //Get the rest of the form data
    const depart_date = document.getElementById("departDate").value;
    const return_date = document.getElementById("returnDate").value;
    const adults = document.getElementById("adults").value;
    const sort_by = document.getElementById("sort").value;

    // Construct the URL to get the flight data
    const searchFlightsURL = `${RAPIDAPI_BASE_URL}searchFlights?fromId=${from_id}&toId=${to_id}&departDate=${depart_date}&returnDate=${return_date}&pageNo=1&adults=${adults}&children=0&sort=${sort_by}&currency_code=USD`;
    // Fetch the flight data from the API
    const searchFlightResponse = await fetch(searchFlightsURL, {
        method: "GET",
        headers: headers
    });

    // Validate the JSON
    const searchFlightData = await validateJSON(searchFlightResponse);
    //console.log(searchFlightData);

    // Check if any flights are found
    if(searchFlightData.data.error){
        // If no flights found, remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        console.log("not iterable")
        // Show a message showing no flights found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = "No Flights Found";
        errorMessageDiv.appendChild(errorMsg);
    }else{
        // Fill the table with the flights
        for(const flight of searchFlightData.data.flightOffers){
            const tr = document.createElement("tr");
            tr.id = `${flight.offerKeyToHighlight}-tr`;
            insertFlight(tr, flight);
            tb.appendChild(tr);
        }
        // Remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
    }
}

async function insertFlight(tr, flight){
    // Create td elements for each aspect of the flight and fill with proper data
    const fromTD = document.createElement("td");
    fromTD.innerText = flight.segments[0].departureAirport.cityName;
    fromTD.id = `${flight.offerKeyToHighlight}-from`;

    const toTD = document.createElement("td");
    toTD.innerText = flight.segments[0].arrivalAirport.cityName;
    toTD.id = `${flight.offerKeyToHighlight}-to`;

    const depart_timeTD = document.createElement("td");
    const depart = flight.segments[0].legs[0].departureTime.split("T");
    depart_timeTD.innerText = `${depart[0]} ${depart[1]}`;
    depart_timeTD.id = `${flight.offerKeyToHighlight}-depart-time`;

    const arrive_timeTD = document.createElement("td");
    const arrive = flight.segments[0].legs[0].arrivalTime.split("T");
    arrive_timeTD.innerText = `${arrive[0]} ${arrive[1]}`;
    arrive_timeTD.id = `${flight.offerKeyToHighlight}-arrive-time`;

    const priceTD = document.createElement("td");
    priceTD.innerText = flight.priceBreakdown.total.units;
    priceTD.id = `${flight.offerKeyToHighlight}-price`;

    const btn_row = document.getElementById("btn_row");
    let add_btn = "";
    if(btn_row !== null){
        add_btn = document.createElement("btn");
        add_btn.innerText = "Add To Saved";
        add_btn.classList.add("btn");
        add_btn.classList.add("btn-primary");
        add_btn.id = `${flight.offerKeyToHighlight}`;
        add_btn.addEventListener("click", addFlight);
    }

    // Add the data to the table row
    tr.appendChild(fromTD);
    tr.appendChild(toTD);
    tr.appendChild(depart_timeTD);
    tr.appendChild(arrive_timeTD);
    tr.appendChild(priceTD);
    if(btn_row !== null){
        tr.appendChild(add_btn);
    }
}

async function addFlight(event){
    const errorMessageDiv = document.getElementById("search-results-errors");
    while(errorMessageDiv.firstElementChild){
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
    }

    const btn = event.target;
    const base_id = btn.id;
    console.log(document.getElementById(`${base_id}-from`).innerText);
    const flight = {
        from_city: document.getElementById(`${base_id}-from`).innerText,
        to_city: document.getElementById(`${base_id}-to`).innerText,
        price: document.getElementById(`${base_id}-price`).innerText,
        depart_date: document.getElementById(`${base_id}-depart-time`).innerText
    };
    const request = fetch("/search_flights", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(flight)
    });
    
    const message = document.createElement("p");
    message.innerText = "Flight Saved";
    errorMessageDiv.appendChild(message);
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
