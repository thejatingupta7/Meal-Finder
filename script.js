const searchBtn = document.getElementById('search-btn');
const mealSearch = document.getElementById('search-input');
const mealResults = document.getElementById('meal-results');
const mealDetails = document.getElementById('meal-details');

searchBtn.addEventListener('click', fetchMeals);

function fetchMeals() {
    const searchTerm = mealSearch.value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(response => response.json())
        .then(data => displayMeals(data.meals));
}

function displayMeals(meals) {
    if (!meals) {
        mealResults.innerHTML = '<p>No meals found. Try a different search!</p>';
        return;
    }
    const mealsHTML = meals.map(meal => `
        <div class="meal-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button onclick="fetchMealDetails(${meal.idMeal})">View Recipe</button>
        </div>
    `).join('');
    mealResults.innerHTML = mealsHTML;
}

function fetchMealDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            displayMealDetails(meal);
        })
        .catch(error => console.error('Error fetching meal details:', error));
}

function displayMealDetails(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }

    mealDetails.innerHTML = `
        <div class="single-meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
            <div class="single-meal-info">
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Origin:</strong> ${meal.strArea}</p>
            </div>
            <div class="single-meal-ingredients">
                <h3>Ingredients:</h3>
                <ul class="ingredients-list">
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="single-meal-instructions">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
        </div>
    `;
}
