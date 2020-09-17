// https://github.com/public-apis/public-apis  
// https://www.themealdb.com/api.php  
// https://heroicons.com/  
// https://cdnjs.com/libraries/font-awesome  
// inspired by: https://github.com/florinpop17/10-projects-10-hours/blob/master/recipe-app/script.js  

const mealPic       = document.getElementById("meals")
const searchWord    = document.querySelector('#searchMeal')
const category      = document.querySelectorAll('#cat-name')
const mealDB        = 'https://www.themealdb.com/api/json/v1'
const apiKey        = '1'
let mealName        = ''
let mealID          = ''
const showFav       = document.querySelector('.fav-meals li .fav-heart')
const catItem       = document.querySelectorAll(".fav-meals li .category")     // ID, Pic, Name  
const searchMeal    = document.querySelector('#search')
const popup         = document.getElementById("meal-popup")
const popupClose    = document.getElementById('close-popup')
const mealInfo      = document.getElementById('meal-info')



showFav.addEventListener('click', () => {       // favorites  
    getFavorites()
})


for (let i = 0; i < catItem.length; i++) {
    catItem[i].addEventListener("click", (e) => 
        mealByCategory(e)
    )
}


searchMeal.addEventListener('click', () => {    // search field  
    mealSearch(searchWord.value)
})


async function getRandomMeal() {
    const resp          = await fetch(`${mealDB}/${apiKey}/random.php`)
    const respData      = await resp.json()
    const randomMeal    = respData.meals[0]

    displayMeal(randomMeal)
}


getRandomMeal()


async function mealSearch(mealName) {
    const meals         = await fetch(`${mealDB}/${apiKey}/search.php?s=${mealName}`)
    const respData      = await meals.json()
    const namedMeal     = respData.meals
    mealPic.innerHTML   = ""

    if (namedMeal == null) {
        const meal = document.createElement("div")
        meal.classList.add("meal")
        meal.innerHTML =    `<div class="meal-header">
                                <h3>"${mealName}" was not found, <br>
                                    please try again</h3>
                            </div>
                            <div class="meal-body">
                                <h4 id="randMealName">Meal Not Found</h4>
                            </div>`
        mealPic.appendChild(meal)
    }
    
    for (let i=0; i < namedMeal.length; i++) {
        displayMeal(namedMeal[i])
    }
}


async function mealByCategory(e) {
    // get the categories from: https://www.themealdb.com/api/json/v1/1/list.php?c=list  
    const resp = await fetch(`${mealDB}/${apiKey}/filter.php?c=${e.target.alt}`)
    // fetch(`${mealDB}/${apiKey}/list.php?c=list`)
    const respData = await resp.json()
    const mealCat = respData.meals
    
    mealPic.innerHTML = ""
    for (let i=0; i < mealCat.length; i++) {
        meal = await mealByID(mealCat[i].idMeal)
        // console.log(meal)
        displayMeal(meal)
    }
}



async function mealByID(id) {
    const resp = await fetch(`${mealDB}/${apiKey}/lookup.php?i=${id}`)

    const mealData = await resp.json()
    const meal = mealData.meals[0]

    return meal
}


function displayMeal(mealInfo, favMeal = false) {
    // console.log(mealInfo)
    const meal = document.createElement("div")
    meal.classList.add("meal")
    // https://stackoverflow.com/questions/7802744/adding-an-img-element-to-a-div-with-javascript  
    // mealPic.innerHTML = `<span class="random">${mealInfo.strCategory}</span>`
    meal.innerHTML =    `<div class="meal-header">
                            <span class="random">${mealInfo.strCategory}</span>
                            <img class="instruct" id="${mealInfo.idMeal}" src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}">
                        </div>
                        <div class="meal-body">
                            <h4 id="randMealName">${mealInfo.strMeal}</h4>
                            ${ favMeal ? 
                                `<i class="fas fa-heart active" id="likeBtn"></i>` :
                                `<i class="far fa-heart" id="likeBtn"></i>`
                            }
                        </div>`

    const likeBtn = meal.querySelector('.meal-body #likeBtn')
    likeBtn.addEventListener('click', () => {
        if (likeBtn.classList.contains('active')) {
            likeBtn.classList.remove('active')
            likeBtn.classList.replace('fas', 'far')
            deleteMealLocal(mealInfo.idMeal)
        } else {
            likeBtn.classList.add('active')
            likeBtn.classList.replace('far', 'fas')
            addMealLocal(mealInfo.idMeal)
        }
    })

    const showInstruct  = meal.querySelectorAll(".meal-header .instruct")      

    for (let i = 0; i < showInstruct.length; i++) {
        showInstruct[i].addEventListener("click", async(e) => {
            const selection = await mealByID(e.target.id)
            makeMeal(selection)
        })
    }

    mealPic.appendChild(meal)
}


function addMealLocal(mealID) {
    const mealIDs = getMealLocal()

    localStorage.setItem('mealIDs', JSON.stringify([...mealIDs, mealID]))
}

function deleteMealLocal(mealID) {
    const mealIDs = getMealLocal()

    localStorage.setItem('mealIDs', JSON.stringify(mealIDs.filter(id => id !== mealID)))
}

function getMealLocal() {
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'))
    return mealIDs === null ? [] : mealIDs
}

async function getFavorites() {
    const mealIDs = getMealLocal()
    const meals = []

    mealPic.innerHTML = ""
    for (let i=0; i < mealIDs.length; i++) {
        const mealID = mealIDs[i]

        meal = await mealByID(mealID)
        // meals.push(meal)
        displayMeal(meal, true)
    }
    // console.log(meals)
}

function makeMeal(info) {
    const elem          = document.createElement('div')
    const ingredients   = []
    mealInfo.innerHTML  = ""

    for (let i=1; i <= 20; i++) {
        if (info['strIngredient'+i]) {
            ingredients.push(`<td>${info['strMeasure'+i]}</td><td>${info['strIngredient'+i]}</td>`)
        } else break
    }

    elem.innerHTML =    `<h1>${info.strMeal}</h1>
                        <hr>
                        <img class="makePic" src="${info.strMealThumb}" alt="${info.strMeal}" />
                        <h3>Ingredients</h3>
                        <table id="ingredients">
                            ${ingredients.map(ing => `<tr>${ing}</tr>`).join('')}
                        </table>
                        <hr>
                        <p>${info.strInstructions}</p>
                        <br>
                        View on: <a href="${info.strSource}" target="_blank">Website</a> / <a href="${info.strYoutube}" target="_blank">YouTube</a>`

    mealInfo.appendChild(elem)
    popup.classList.remove('hidden')
}


popupClose.addEventListener('click', () => {
    popup.classList.add('hidden')
})
