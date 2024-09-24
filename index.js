const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY ="20f6a7a31ddfc495ff47e815bc182427";
oldTab.classList.add("current-tab");
getfromSessionStorage();
 
userTab.addEventListener("click" , () => {
// pass clicked tab as input parameter
    switchTab(userTab);
});


searchTab.addEventListener("click" , () => {

    switchTab(searchTab);
});

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form invisible h , if yes make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // i was before search tab  , now weather tab ko visible krna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function renderWeatherInfo(weatherInfo){
    //fetch element first
   
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}



async function fetchUserWeatherInfo(coordinates) {
   
    let {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //loader ko visible
    loadingScreen.classList.add("active");

    try{
      
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.log("Unable to fetch data :",e);
    }
   
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geoLocation Support");
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" ,JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
    
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

const searchInput =document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e) =>{
    e.preventDefault();
    let cityName =searchInput.value;
    
    if(cityName ==="")return;
    else fetchWeatherDetails(cityName);
})

async function fetchWeatherDetails(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        
         const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
 
         const data= await response.json();
         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");
         renderWeatherInfo(data);
    }
    catch(e){
     console.log("unable to fetch data :",e);
    }
 }


// const userTab = document.querySelector("[data-userWeather]");
// const searchTab = document.querySelector("[data-searchWeather]");
// const userContainer = document.querySelector(".weather-container");

// const grantAccessContainer = document.querySelector(".grant-location-container");
// const searchForm = document.querySelector("[data-searchForm]");
// const loadingScreen = document.querySelector(".loading-container");
// const userInfoContainer = document.querySelector(".user-info-container");

// let oldTab = userTab;
// const API_KEY = "20f6a7a31ddfc495ff47e815bc182427";
// oldTab.classList.add("current-tab");

// userTab.addEventListener("click", () => {
//     switchTab(userTab);
// });

// searchTab.addEventListener("click", () => {
//     switchTab(searchTab);
// });

// function switchTab(newTab) {
//     if (newTab !== oldTab) {
//         oldTab.classList.remove("current-tab");
//         oldTab = newTab;
//         oldTab.classList.add("current-tab");

//         if (!searchForm.classList.contains("active")) {
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         } else {
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             getfromSessionStorage();
//         }
//     }
// }

// function getfromSessionStorage() {
//     const localCoordinates = sessionStorage.getItem("user-coordinates");
//     if (!localCoordinates) {
//         grantAccessContainer.classList.add("active");
//     } else {
//         const coordinates = JSON.parse(localCoordinates);
//         fetchUserWeatherInfo(coordinates);
//     }
// }

// function renderWeatherInfo(data) {
//     const cityName = document.querySelector("[data-cityName]");
//     const countryIcon = document.querySelector("[data-countryIcon]");
//     const desc = document.querySelector("[data-weatherDesc]");
//     const weatherIcon = document.querySelector("[data-weatherIcon]");
//     const temp = document.querySelector("[data-temp]");
//     const windspeed = document.querySelector("[data-windspeed]");
//     const humidity = document.querySelector("[data-humidity]");
//     const cloudiness = document.querySelector("[data-cloudiness]");

//     cityName.innerText = data?.name;
//     countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
//     desc.innerText = data?.weather?.[0]?.description;
//     weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
//     temp.innerText = `${data?.main?.temp} °C`;
//     windspeed.innerText = `${data?.wind?.speed} m/s`;
//     humidity.innerText = `${data?.main?.humidity}%`;
//     cloudiness.innerText = `${data?.clouds?.all}%`;
// }

// async function fetchUserWeatherInfo(coordinates) {
//     let { lat, lon } = coordinates;
//     grantAccessContainer.classList.remove("active");
//     loadingScreen.classList.add("active");

//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();
//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     } catch (e) {
//         loadingScreen.classList.remove("active");
//         console.log("Unable to fetch data:", e);
//     }
// }

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         console.log("No geoLocation Support");
//     }
// }

// function showPosition(position) {
//     const userCoordinates = {
//         lat: position.coords.latitude,
//         lon: position.coords.longitude,
//     };
//     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
//     fetchUserWeatherInfo(userCoordinates);
// }

// const grantAccessButton = document.querySelector("[data-grantAccess]");
// grantAccessButton.addEventListener("click", getLocation);

// const searchInput = document.querySelector("[data-searchInput]");
// searchForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     let cityName = searchInput.value;  // Corrected this line

//     if (cityName === "") return;
//     else fetchWeatherDetails(cityName);  // Corrected the function call
// });

// async function fetchWeatherDetails(city) {
//     loadingScreen.classList.add("active");
//     userInfoContainer.classList.remove("active");
//     grantAccessContainer.classList.remove("active");

//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();
//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     } catch (e) {
//         console.log("Unable to fetch data:", e);
//     }
// }
