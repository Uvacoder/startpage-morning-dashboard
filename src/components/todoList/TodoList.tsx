import { useState, useEffect, useCallback } from "react"
import style from "./TodoList.module.scss"
import checkBox from "../../assets/checkbox.svg"
import checkedCheckBox from "../../assets/checkbox-checked.svg"
import deleteText from "../../assets/delete.svg"

const defaultStorage = [
    { entry: "", completed: false },
    { entry: "", completed: false },
    { entry: "", completed: false },
    { entry: "", completed: false },
    { entry: "", completed: false },
    { entry: "", completed: false },
]

export default function TodoList() {
    const [storage, setstorage] = useState<Array<todoInterface>>(localStorage["todoList"] ? JSON.parse(localStorage["todoList"]) : defaultStorage)
    const [tooltip, settooltip] = useState<Array<Object>>([])
    let tooltipList:Array<object> = []

    useEffect(() => {
        localStorage.setItem("todoList", JSON.stringify(storage))
    }, [storage])

    const overflowCheck = useCallback((element:HTMLInputElement | null) => {
        if (element && (element.offsetWidth < element.scrollWidth)) {
            tooltipList.push({tooltip: element.value})
            settooltip(tooltipList)
        } else {
            tooltipList.push({})
            settooltip(tooltipList)
        }
      },[storage])
    

    return (
        <div className={style.container}>
            <span className={style.topBar}></span>
            <h2 className={style.title}>Things to do</h2>
            {storage?.map((element:todoInterface, index:number) => {
                return(
                    <span {...tooltip[index]} className={style.task} key={index}>
                        <img src={ storage[index].completed ? checkedCheckBox : checkBox } alt={ storage[index].completed ? checkedCheckBox : checkBox } draggable={false}
                            onClick={() => {
                                let newStorage = [...storage]
                                newStorage[index] = { entry: storage[index].entry, completed: !element.completed}
                                setstorage(newStorage)
                            }}/>
                        <input className={`${style.textInput} ${ storage[index].completed ? style.crossed : null}`} ref={overflowCheck} type="text" value={storage[index].entry} readOnly={storage[index].completed}
                            onChange={(event) => {
                                let newStorage = [...storage]
                                newStorage[index] = { entry: event.target.value, completed: storage[index].completed}
                                setstorage(newStorage)
                        }}/>
                        <img className={style.deleteText} src={deleteText} alt={deleteText} draggable={false} 
                            onClick={() => {
                                let newStorage = [...storage]
                                newStorage.splice(index, 1)
                                newStorage.push({ entry: "", completed: false })
                                setstorage(newStorage) 
                        }}/>
                    </span>
                )
            })}
        </div>
    )
}