
window.addEventListener("DOMContentLoaded", async ()=>{
    // Add event listener to the search btn, and call getFlights when clicked
    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getAttractions);
});

async function getAttractions(){
    // Get the table body
    const tb = document.getElementById("results-table-body");
    // Remove previous attraction in the table
    while(tb.firstElementChild){
        tb.removeChild(tb.firstElementChild);
    }

    // API information
    const RAPIDAPI_KEY = "f34f0f10c2msh6855d6d77950b00p18a515jsn9e45dbeb030f";
    const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com";
    const RAPIDAPI_BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1/attraction/";
    const headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
    };

    // Div to show error messages if no results are found
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

    // Get the searched location
    const city = document.getElementById("city").value;

    // fetching the airport ids from the api based on city names
    const getLocationURL = `${RAPIDAPI_BASE_URL}searchLocation?query=`;

    // Get the from airport id
    const getLocationResponse = await fetch(`${getLocationURL}${city}`, {
        method: "GET",
        headers: headers
    });
    const locationData = await validateJSON(getLocationResponse);
    // If no attraction found
    if(locationData.data.products.length === 0){
        // Remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        // Add an error stating no attraction found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = `No attraction found for: ${city}`;
        errorMessageDiv.appendChild(errorMsg);
    }
    const dest_id = locationData.data.products[0].id;

    //Get the rest of the form data
    const arrival_date = document.getElementById("arrivalDate").value;
    const departure_date = document.getElementById("departDate").value;

    // Construct the URL to get the flight data
    const searchAttractionsURL = `${RAPIDAPI_BASE_URL}searchAttractions?id=${dest_id}&startDate=${arrival_date}&endDate=${departure_date}&page=1&currency_code=USD`;

    // Fetch the Attractions data from the API
    const searchAttractionsResponse = await fetch(searchAttractionsURL, {
        method: "GET",
        headers: headers
    });

    // Validate the JSON
    const searchAttractionsData = await validateJSON(searchAttractionsResponse);
    console.log(searchAttractionsData);

    // Check if any Attractions are found
    if(searchAttractionsData?.data?.products?.error){
        // If no Attractions found, remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        console.log("not iterable")
        // Show a message showing no Attractions found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = "No Attractions Found";
        errorMessageDiv.appendChild(errorMsg);
    }else{
        // Fill the table with the Attractions
        for(const Attractions of searchAttractionsData.data.products){
            const tr = document.createElement("tr");
            insertAttractions(tr, Attractions);
            tb.appendChild(tr);
        }
        // Remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
    }
}

async function insertAttractions(tr, Attraction){
    // Create td elements for each aspect of the Attractions and fill with proper data
    const nameTD = document.createElement("td");
    nameTD.innerText = Attraction.name;
    nameTD.id = `${Attraction.id}-name`;

    const priceTD = document.createElement("td");
    priceTD.innerText = `${Attraction.representativePrice.chargeAmount.toFixed(2)}`;
    priceTD.id = `${Attraction.id}-price`;

    const detailsTD = document.createElement("td");
    detailsTD.innerText = `${Attraction.reviewsStats.combinedNumericStats.average}/5`;
    detailsTD.id = `${Attraction.id}-details`;

    const btn_row = document.getElementById("btn_row");
    let add_btn = "";
    if(btn_row !== null){
        add_btn = document.createElement("btn");
        add_btn.innerText = "Add To Saved";
        add_btn.classList.add("btn");
        add_btn.classList.add("btn-primary");
        add_btn.id = `${Attraction.id}`;
        add_btn.addEventListener("click", addAttraction);
    }

    // Add the data to the table row
    tr.appendChild(nameTD);
    tr.appendChild(priceTD);
    tr.appendChild(detailsTD);
    if(btn_row !== null){
        tr.appendChild(add_btn);
    }
}

async function addAttraction(event){
    const errorMessageDiv = document.getElementById("search-results-errors");
    while(errorMessageDiv.firstElementChild){
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
    }
    
    const btn = event.target;
    const base_id = btn.id;
    const attraction = {
        name: document.getElementById(`${base_id}-name`).innerText,
        rating: document.getElementById(`${base_id}-details`).innerText,
        price: document.getElementById(`${base_id}-price`).innerText,
    };
    const request = fetch("/search_attractions", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(attraction)
    });
    
    const message = document.createElement("p");
    message.innerText = "Attraction Saved";
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
