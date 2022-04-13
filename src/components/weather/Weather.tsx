import { useEffect, useState, useMemo } from "react"
import { Chart, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
import arrow from "../../assets/arrow.svg"
import style from "./Weather.module.scss"

Chart.register(...registerables)
Chart.defaults.font.family = "Roboto"
Chart.defaults.font.weight = "500"
Chart.defaults.font.size = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'))-2
Chart.defaults.color = "#808e9b"

const options = {
    plugins:{
        tooltip:{
            backgroundColor: "#1e272e",
            titleColor: "#f4f4f4",
            bodyColor: "#f4f4f4",
        },
        legend:{
            display: false
        }
    },
    elements:{
        point:{
            borderWidth: 0
        },
        line:{
            tension: 0.25
        }
    },
    scales:{
        x:{
            grid:{
                display: false
            }
        },
        y:{
            display: true,
            beginAtZero: true,
            grid:{
                color: "#d2dae2"
            }
        },
    }
}

export default function Weather() {
    const [weather, setweather] = useState<weatherAPI>()
    const [isMetric,  setisMetric] = useState(true)
    const [currentTab, setcurrentTab] = useState("temp")
    const [graphData, setgraphData] = useState<any>()
    const date = new Date

    const weatherTime = useMemo(() => weather?.forecast.forecastday[0].hour.map((element) => {
        const hour = element.time?.split(" ", 2)
        return hour?.[1]
    }), [weather]) 

    const tempData = {
        labels: weatherTime,
        datasets: [{
            label: isMetric ? "Temperature ºC" : "Temperature ºF",
            borderColor: "#ffdd59",
            fill: true,
            backgroundColor: "rgba(255, 222, 89, 0.5)",
            data: useMemo(() => weather?.forecast.forecastday[0].hour.map((element) => {
                return isMetric ? element.temp_c : element.temp_f
            }), [weather, isMetric])
          }]
    }

    const windData = {
        labels: weatherTime,
        datasets: [{
            label: isMetric ? "Wind speed Km/h" : "Wind speed mph",
            borderColor: "#808e9b",
            fill: true,
            backgroundColor: "rgba(128, 142, 155, 0.5)",
            data: useMemo(() => weather?.forecast.forecastday[0].hour.map((element) => {
                return isMetric ? element.wind_kph : element.wind_mph
            }), [weather, isMetric])
          }]
    }

    const rainData = {
        labels: weatherTime,
        datasets: [{
            label: "Chance of rain",
            borderColor: "#0fbcf9",
            fill: true,
            backgroundColor: "rgba(15, 186, 249, 0.5)",
            data: useMemo(() => weather?.forecast.forecastday[0].hour.map((element) => {
                return element.chance_of_rain
            }), [weather]),
          }]
    }

    async function weatherReqest(position:GeolocationPosition){
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${position.coords.latitude} ${position.coords.longitude}&days=1&aqi=no&alerts=no`)
            const jsonResponse = await response.json()
            setweather(jsonResponse)
        } catch (error) {
            console.log(error) 
        }
    }

    useEffect(() => {
       navigator.geolocation.getCurrentPosition((position) => weatherReqest(position))

        if (navigator.language === "en-US") {
             setisMetric(false)
        }

    }, [])

    useEffect(() => {
        // if there is any change from current tab or the isMetric value it will reset wich graph is shown
        // this also work as an initiator for the graph, once the weather value updates for the first time
        switch (currentTab) {
            case "temp":
                setgraphData(tempData)
                break;
            case "rain":
                setgraphData(rainData)
                break;
            case "wind":
                setgraphData(windData)
                break;
            default:
                setgraphData(tempData)
                break;
        }
    }, [weather, currentTab, isMetric]);

    if (!weather) {
        return <div className={style.container}></div>
    }
    
    return (
        <div className={style.container}>
            <div className={style.currentForecast}>
                <div>
                    <div className={style.temperature}>
                        <img src={ weather.current.condition.icon } alt={ weather.current.condition.icon }/>
                        <p className={style.tempNumber}>{ isMetric ? Math.round(weather.current.temp_c) : Math.round(weather.current.temp_f) }</p>
                        <div className={style.unitSwitch} onClick={() =>  setisMetric(!isMetric)}>
                            <p className={style.tempUnit} style={{ color:  isMetric ? "#1e272e" : "#808e9b" }}>Cº</p>
                            <span className={style.spacer}></span>
                            <p className={style.tempUnit} style={{ color:  isMetric ? "#808e9b" : "#1e272e" }}>Fº</p>
                        </div>
                    </div>
                    <div className={style.conditions}>
                        <p>{ weather.current.condition.text }</p>
                        <p>Chances of rain: { weather.forecast.forecastday[0].hour[date.getHours()].chance_of_rain }%</p>
                        <p>Humidity: { weather.current.humidity }%</p>
                        <p>Wind speed: { isMetric ? weather.current.wind_kph : weather.current.wind_mph } { isMetric ? "Km/h" : "Mph" }</p>
                        <p>Wind direction: { weather.current.wind_dir } 
                            <img src={ arrow } className={style.windDirection} style={{transform: `rotate(${weather.current.wind_degree + 180}deg)`}}/>
                        </p>
                    </div>
                </div>
                <div className={style.location}>
                    <h1>{ weather.location.name }</h1>
                    <p>{ weather.location.region }, { weather.location.country }</p>
                    <p>{ date.toLocaleString("default",{weekday: "long"}) }, { date.getHours() }:00Hs</p>
                </div>
            </div>
            <div className={style.weatherTabs}>
                <span style={{backgroundColor: currentTab == "temp" ? "#e5e5e5" : ""}} onClick={() => { setcurrentTab("temp"); setgraphData(tempData) }}>Temperature</span>
                <span style={{backgroundColor: currentTab == "rain" ? "#e5e5e5" : ""}} onClick={() => { setcurrentTab("rain"); setgraphData(rainData) }}>Rain</span>
                <span style={{backgroundColor: currentTab == "wind" ? "#e5e5e5" : ""}} onClick={() => { setcurrentTab("wind"); setgraphData(windData) }}>Wind</span>
            </div>
            <div className={style.weatherGraph}>
                <Line  
                datasetIdKey="id" 
                data={graphData}
                options={options}/>
            </div>
        </div>
    )
}
