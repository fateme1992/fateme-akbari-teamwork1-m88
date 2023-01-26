
const getCityWeather = (lat, lon) => {
    fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=385a7a70d4dca4ccb79d668d67357807`
    )
        .then((response) => {
            console.log(response);
            response.json()
        })
        .then((result) => {
            const tempearature = result.list[0].main.temp;
            const humidity = result.list[0].main.humidity;
            const visibility = result.list[0].visibility;
            const windSpeed = result.list[0].wind.speed;
        })
        .catch((err) => {
            console.log(err);
        });
    
        countryDetail(countryList, true)
};

const getCityLatAndLon = (selectedCountry) => {
    fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${selectedCountry}&limit=5&appid=385a7a70d4dca4ccb79d668d67357807`
    )
        .then((response) => response.json())
        .then((result) => {
            const lat = result[0].lat;
            const lon = result[0].lon;
            getCityWeather(lat, lon);
        })
        .catch((err) => {
            console.log(err);
        });
};
const arrayToObjectByNestedKey = (array, keyName) => {
    return array.reduce((acc, cur) => {
        const resultedKeyValue = keyName.split(".").reduce((accu, currentKey) => {
            return accu[currentKey];
        }, cur);
        acc[resultedKeyValue] = cur;
        return acc;
    }, {});
};

const getCountryList = () => {
    fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            const res = result.map((country) => ({
                flag: country.flags.png,
                code: country.idd.root,
                population: country.population,
                timezones: country.timezones[0],
                name: country.name.common,
                capital: country.capital,
                region: country.region,
                languages:country.languages
            }));
            const countryList = arrayToObjectByNestedKey(res, "name");
            console.log(countryList);
            showCountriesNameInDropDown(countryList);
            countryDetail(countryList, true)
        });
};

const showCountriesNameInDropDown = (countryList) => {
    for (const countryName in countryList) {
        const optionElm = $(`
      <option class="country-list" style="overflow:scroll" id="${countryName}">${countryName}</option>
      `).data(countryList[countryName])

        $("#country-name-select")
            .append(optionElm);
    }
};
$("#country-name-select").change(function (event) {

    if ($(this).val() !== "countryList") {
        const selectedCountryName = $(this).val();
        const selectedCountryInfo = ($("#country-name-select option:selected").data());
        const url = `https://maps.google.com/maps?q=${selectedCountryName}&t=&z=5&ie=UTF8&iwloc=&output=embed`;
        $("#gmap_canvas").attr("src", url);
        getCityLatAndLon(selectedCountryName);
        countryDetail(selectedCountryInfo)
    }
});
const countryDetail = (countryList, isnull = false) => {
    $('.country-detail').html('')
    if (isnull === true) {

        $('.country-detail').html(`
            <h5>country name</h5>
            <div><span class="title">Native Name:</span><span></span></div>
            <div><span class="title">Capital:</span></div>
            <div><span class="title">Region:</span></div>
            <div><span class="title">Population:</span></div>
            <div><span class="title">Languages:</span></div>
            <div><span class="title">Timezones:</span></div>
            `)
        
            $('.weather').html(`
            <div><span class="title">Wind Speed:</span></div>
            <div><span class="title">Tempearature:</span></div>
            <div><span class="title">Humidity:</span></div>
            <div><span class="title">Visibility:</span></div>
            `)

    }
    else {
        $('.country-detail').html(`
        <h5>country name</h5>
        <div><span class="title">Native Name:</span><span>${countryList.name}</span></div>
        <div><span class="title">Capital:</span><span>${countryList.capital[0]}</span></div>
        <div><span class="title">Region:</span><span>${countryList.region}</span></div>
        <div><span class="title">Population:</span><span>${countryList.population}</span></div>
        <div><span class="title">Languages:</span><span>${countryList.language}</span></div>
        <div><span class="title">Timezones:</span><span>${countryList.timezones}</span></div>
        `)

        $('#flag').attr("src", `${countryList.flag}`)
        
        
        $('.weather').html(`
        <div><span class="title">Wind Speed:</span></div>
        <div><span class="title">Tempearature:</span></div>
        <div><span class="title">Humidity:</span></div>
        <div><span class="title">Visibility:</span></div>
        `)
    }


}



getCountryList();


