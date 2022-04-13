import style from "./News.module.scss"
import { useEffect, useState, useCallback } from "react"

export default function News() {
    const [newsList, setnewsList] = useState<Array<any>>([])
    const [dynamicProp, setdynamicProp] = useState<Array<object>>([])

    // check if the text is overflowing to add a tooltip on hover

    const overflowCheck = useCallback((element:HTMLAnchorElement) => {
        if (element?.clientHeight < element?.scrollHeight) {
            setdynamicProp(dynamicProp => [...dynamicProp, { tooltip: element.innerHTML }])  
        } else {
            setdynamicProp(dynamicProp => [...dynamicProp, {}])
        } 
    },[])
    
    useEffect(() => {
        (async function newsRequest() {
            const response = await fetch("https://www.reddit.com/r/worldnews/hot.json?limit=3")
            const responseJson = await response.json()
            responseJson.data.children.map((element:any) => {
                if (!element.data.stickied){
                    setnewsList(newsList => [...newsList, element])
               }
            })
        }())
    }, [])

    return (
        <div className={style.container}>
            <h1 className={style.title}>Daily News</h1>
            <div className={style.newsLayout}>
                <div className={style.placeholderImage}></div>
                {newsList?.map((element:any, index:number) => {
                    return(
                        <span {...dynamicProp[index]} key={index}>
                            <a className={style.newsText} ref={overflowCheck} href={element.data.url} style={{gridRow: `${index+1}/${index+2}`}}>
                               {element.data.title}
                            </a>
                        </span>
                    )
                })}
            </div>
        </div>
    )
}
