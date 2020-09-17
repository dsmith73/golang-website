setInterval(countdown, 1000)

const day       = document.getElementById("days")
const hour      = document.getElementById("hours")
const mins      = document.getElementById("mins")
const secs      = document.getElementById("secs")
const seconds   = 1000
const minutes   = seconds *60
const hours     = minutes *60
const days      = hours *24

function countdown() {
    const today     = new Date()
    const newYear   = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)

    if (today.getMonth() == 0 && today.getDate() >= 1) {
        newYear.setFullYear(newYear.getFullYear() +1)
    }
    
    day.innerHTML   = Math.ceil((newYear.getTime() -today.getTime()) / (days))
    hour.innerHTML  = Math.ceil(24 - today.getHours())
    mins.innerHTML  = Math.ceil(60 - today.getMinutes())
    secs.innerHTML  = Math.ceil(60 - today.getSeconds())
}

countdown()


// https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-9.php  
