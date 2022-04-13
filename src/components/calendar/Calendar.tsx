import style from "./Calendar.module.scss"

export default function Calendar() {
    const date = new Date

    return (
        <div className={style.container}>
            <span className={style.month}>{date.toLocaleString("default",{month: "long"})}</span>
            <span className={style.number}>{date.toLocaleString("default",{day: "numeric"})}</span>
            <span className={style.day}>{date.toLocaleString("default",{weekday: "long"})}</span>
        </div>
    )
}
