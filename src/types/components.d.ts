declare interface todoInterface {
    entry: string 
    completed: boolean
}

declare interface locationWeather {
    name: string 
    region: string 
    country: string 
    lat: number 
    lon: number 
    tz_id: string 
    localtime_epoch: number 
    localtime: string
}

declare interface currentWeather {
    time?: string
    last_updated: string 
    last_updated_epoch: number 
    temp_c: number 
    temp_f: number 
    feelslike_c: number 
    feelslike_f: number 
    condition: {
        text: string 
        icon: string 
        code: number
    }
    wind_mph: number 
    wind_kph: number 
    wind_degree: number 
    wind_dir: string 
    pressure_mb: number 
    pressure_in: number 
    precip_mm: number 
    precip_in: number 
    humidity: number 
    cloud: number 
    is_day: number 
    uv: number 
    gust_mph: number 
    gust_kph: number
    chance_of_rain?: number
}

declare interface weatherForecast {
    forecastday: Array<{
        date: string 
        date_epoch: number 
        day: {
            maxtemp_c: number
            maxtemp_f: number
            mintemp_c: number
            mintemp_f: number
            avgtemp_c: number
            avgtemp_f: number
            maxwind_mph: number
            maxwind_kph: number
            totalprecip_mm: number
            totalprecip_in: number
            avgvis_km: number
            avgvis_miles: number
            avghumidity: number
            daily_will_it_rain: number
            daily_chance_of_rain: number
            daily_will_it_snow: number
            daily_chance_of_snow: number
        }
        astro: {
            sunrise: string 
            seunset: string 
            moonrise: string 
            moonset: string 
            moon_phase: string 
            moon_illumination: string
        } 
        hour: Array<currentWeather>
    }>
}

declare interface weatherAPI {
    location: locationWeather 
    current: currentWeather 
    forecast: weatherForecast
}