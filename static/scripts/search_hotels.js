
window.addEventListener("DOMContentLoaded", async ()=>{
    // Add event listener to the search btn, and call getFlights when clicked
    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getHotels);
});

async function getHotels(){
    // Get the table body
    const tb = document.getElementById("results-table-body");
    // Remove previous hotels in the table
    while(tb.firstElementChild){
        tb.removeChild(tb.firstElementChild);
    }

    // API information
    const RAPIDAPI_KEY = "f34f0f10c2msh6855d6d77950b00p18a515jsn9e45dbeb030f";
    const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com";
    const RAPIDAPI_BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1/hotels/";
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
    const getLocationURL = `${RAPIDAPI_BASE_URL}searchDestination?query=`;

    // Get the from airport id
    const getLocationResponse = await fetch(`${getLocationURL}${city}`, {
        method: "GET",
        headers: headers
    });
    const locationData = await validateJSON(getLocationResponse);
    // If no hotel found
    if(locationData.data.length === 0){
        // Remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        // Add an error stating no hotels found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = `No Destination found for: ${city}`;
        errorMessageDiv.appendChild(errorMsg);
    }
    const dest_id = locationData.data[0].dest_id;

    //Get the rest of the form data
    const arrival_date = document.getElementById("arrivalDate").value;
    const departure_date = document.getElementById("departDate").value;
    const rooms = document.getElementById("rooms").value;
    const min_price = document.getElementById("min-price").value;
    let max_price = "";
    if(document.getElementById("max-price").value !== ""){
        max_price = `&price_max=${document.getElementById("max-price").value}`;
    }
    
    // Construct the URL to get the flight data
    const searchHotelsURL = `${RAPIDAPI_BASE_URL}searchHotels?dest_id=${dest_id}&search_type=CITY&arrival_date=${arrival_date}&departure_date=${departure_date}&room_qty=${rooms}&page_number=1&price_min=${min_price}${max_price}&currency_code=USD`;

    // Fetch the hotel data from the API
    const searchHotelsResponse = await fetch(searchHotelsURL, {
        method: "GET",
        headers: headers
    });

    // Validate the JSON
    const searchHotelsData = await validateJSON(searchHotelsResponse);
    console.log(searchHotelsData);

    // Check if any hotels are found
    if(searchHotelsData.data.error){
        // If no hotels found, remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
        console.log("not iterable")
        // Show a message showing no hotels found
        const errorMsg = document.createElement("p");
        errorMsg.innerText = "No Hotels Found";
        errorMessageDiv.appendChild(errorMsg);
    }else{
        // Fill the table with the hotels
        for(const hotel of searchHotelsData.data.hotels){
            const tr = document.createElement("tr");
            insertHotel(tr, hotel);
            tb.appendChild(tr);
        }
        // Remove the Searching. . . message
        errorMessageDiv.removeChild(errorMessageDiv.firstElementChild);
    }
}

async function insertHotel(tr, hotel){
    // Create td elements for each aspect of the hotel and fill with proper data
    const cityTD = document.createElement("td");
    cityTD.innerText = hotel.property.name;

    const priceTD = document.createElement("td");
    priceTD.innerText = `${hotel.property.priceBreakdown.grossPrice.value.toFixed(2)} ${hotel.property.priceBreakdown.grossPrice.currency}`;

    const detailsTD = document.createElement("td");
    detailsTD.innerText = `${hotel.property.reviewScore}/10`;

    // Add the data to the table row
    tr.appendChild(cityTD);
    tr.appendChild(priceTD);
    tr.appendChild(detailsTD);
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
