console.log("Hello")

// existing fetch-based implementation
// callAPI()
function callAPI() {
    fetch('https://api.restful-api.dev/objects')
        .then(res => res.json())                // return parsed JSON
        .then(data => console.log(data))
        .catch(err => console.error(err));
}

// new axios-based implementation for Node
const axios = require('axios');
callAPIWithAxios()
function callAPIWithAxios() {
    axios.get('https://api.restful-api.dev/objects')
        .then(response => {
            // axios already parses JSON for us
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}

// you can invoke callAPIWithAxios() instead of callAPI() if you prefer axios

// getData()
async function getData() {
    const url = "https://example.org/products.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(response, response.ok)
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error("error", error.message);
    }
}