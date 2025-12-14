let originalControlsHTML;

// This function basically "builds" the list of ingredients for the cupcake cards and combines it all into one 'html' variable so that when the Show Ingredients function is called via the button, it doesn't have to do all this within the button event
const ingredientsList = (cupcake) => {
    let html = "<ul>";
    for (let i = 0; i < cupcake.cupcake_ingredients.length; i++) {
        html += `<li>${cupcake.cupcake_ingredients[i]}</li>`;
    }
    if (cupcake.frosting_ingredients.length > 0) {
        html += "<li><strong>Frosting:</strong><ul>";
        for (let i = 0; i < cupcake.frosting_ingredients.length; i++) {
            html += `<li>${cupcake.frosting_ingredients[i]}</li>`;
        }
        html += "</ul></li>";
    }
    if (cupcake.toppings.length > 0) {
        html += "<li><strong>Toppings:</strong><ul>";
        for (let i = 0; i < cupcake.toppings.length; i++) {
            html += `<li>${cupcake.toppings[i]}</li>`;
        }
        html += "</ul></li>";
    }
    html += "</ul>";
    return html;
};

// This is the function where the cupcake cards are created. Also holds some jQuery styling and also has a boolean Value for whether or not the Show Ingredients button has been turned on or not, that way we can show or hide the ingredients list appropriately
const setUpCupcakes = (list) => {
    $("#cupcakeContainer").html("");
    list.forEach((cupcake) => {
        const card = $(`
            <div class="cupcake-card">
                <img class="cupcake-img" src="${cupcake.image}">
                <h3>${cupcake.cupcake_name}</h3>
                <p class="price">$${cupcake.price}</p>
                <p class="desc">${cupcake.description}</p>
                <button class="ingredientsBtn">Show Ingredients</button>
                <div class="ingredientsBox" style="display:none;"></div>
            </div>
        `);
        card.css({
            "border": "2px solid #f4c2c2",
            "border-radius": "15px",
            "padding": "15px",
            "margin": "15px",
            "background-color": "#fff0f5",
            "box-shadow": "3px 3px 15px rgba(0,0,0,0.1)",
            "text-align": "center",
            "width": "250px",
            "display": "inline-block",
            "vertical-align": "top"
        });
        card.find(".cupcake-img").css({
            "width": "100%",
            "border-radius": "12px",
            "border": "2px solid #ffb6c1",
            "margin-bottom": "10px"
        });
        card.find(".ingredientsBox").css({
            "margin-top": "10px",
            "padding": "10px",
            "border": "1px dashed #f4c2c2",
            "border-radius": "8px",
            "background-color": "#fffaf0",
            "text-align": "left",
            "max-height": "200px",
            "overflow-y": "auto"
        });
        let showing = false;
        const btn = card.find(".ingredientsBtn");
        const box = card.find(".ingredientsBox");
        btn.on("click", function () {
            if (showing) {
                box.hide();
                btn.text("Show Ingredients");
                showing = false;
            }
            else {
                box.html(ingredientsList(cupcake));
                box.show();
                btn.text("Hide Ingredients");
                showing = true;
            }
        });
        $("#cupcakeContainer").append(card);
    });
};

// This function, similar to when we did the "Eternals" project not that long ago, takes the input value from the filter selection of the user and sorts through the "flavor" array of every cupcake, only pushing the cupcakes to the filtered array that have the selected flavor by the user in that specific cupcake array, and then calls the setUpCupcakes function passing the filtered list as an argument
const applyFilter = () => {
    console.log("Filter is being applied");
    const selectedFlavor = $("#flavorFilter").val();
    console.log("Selected flavor:", selectedFlavor);
    let filtered = [];
    if (selectedFlavor == "all") {
        filtered = cupcakes;
    }
    else {
        cupcakes.forEach((cupcake) => {
            for (let i = 0; i < cupcake.flavor.length; i++) {
                if (cupcake.flavor[i] == selectedFlavor) {
                    filtered.push(cupcake);
                    break;
                }
            }
        });
    }
    setUpCupcakes(filtered);
};

// Resets the controls section to give the controls for adding details to a new cupcake. 
const createCupcake = () => {
    $("#controls").html(`
        <label for="nameInput">Name:</label><br>
        <input type="text" id="nameInput" size="50" required><br>
        <label for="flavorInput">Flavor:</label><br>
        <select id="flavorInput">
            <option value="all">All Flavors</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Vanilla">Vanilla</option>
            <option value="Lemon">Lemon</option>
            <option value="Banana">Banana</option>
            <option value="Raspberry">Raspberry</option>
            <option value="Coconut">Coconut</option>
            <option value="Nutella">Nutella</option>
            <option value="Mint">Mint</option>
            <option value="Cherry">Cherry</option>
            <option value="Blueberry">Blueberry</option>
            <option value="Carrot Cake">Carrot</option>
        </select><br>
        <label for="descInput">Description:</label>
        <input type="text" id="descInput" size="100" required><br>
        <label for="priceInput">Price:</label><br>
        <input type="text" id="priceInput" size="4" required><br>
        <button id="nextBtn">Next</button>`);
    $("#nextBtn").on("click", function () {
        newCupcakeName = $("#nameInput").val();
        newFlavor = $("#flavorInput").val();
        newDesc = $("#descInput").val();
        newPrice = $("#priceInput").val();
        console.log(`${newCupcakeName}, ${newFlavor}, ${newDesc}, ${newPrice}`);
        // I had to use a callback function to get the list of ingredients and things because it wouldn't work with the regular return
        addIngredients(function(newIngredients){
            console.log("Ingredients: ", newIngredients);
            addIngredients(function(newFrosting){
                console.log("Frosting Ingredients: ", newFrosting);
                addIngredients(function(newToppings){
                    console.log("Toppings: ", newToppings);
                    const newCupcake = {
                        cupcake_name: newCupcakeName,
                        flavor: [newFlavor],
                        description: newDesc,
                        price: newPrice,
                        image: "./images/default_cupcake.jpeg",
                        cupcake_ingredients: newIngredients,
                        frosting_ingredients: newFrosting,
                        toppings: newToppings
                    };
                    cupcakes.push(newCupcake);
                    console.log(cupcakes);
                    restoreControls();
                });
            });
        });
    });
};

const addIngredients = (callback) => {
    let newList = [];
    $("#controls").html(`
        <h4>Click 'Add Ingredient' to add the ingredient. Click 'Done' when finished.</h4>
        <p>The first list is the main ingredients for the cake, the second is the ingredients for the frosting, and the third is for the toppings</p>
        <input type="text" id="ingredientTxt" size="100">
        <button id="addIngredient">Add Ingredient</button>
        <button id="doneBtn">Done</button>
        <div id="ingredientDisplay"><ul></ul></div>`);
    $("#addIngredient").on("click", function () {
        const ing = $("#ingredientTxt").val();
        if (ing != "") {
            newList.push(ing);
            $("#ingredientTxt").val("");
            $("#ingredientDisplay ul").append(`<li>${ing}</li>`);
        }
    });
    $("#doneBtn").on("click", function () {
        callback(newList);
    });
};

const updateCupcake = () => {
    displayCupcakeList(function(cupcakeIndex) {
        console.log(cupcakeIndex);
        $("#controls").html(`
            <p><strong>Which would you like to change, the main details (on the front of the card), or the ingredients?</strong></p>
            <button id="changeMain">Main Details</button>
            <button id="changeIng">Ingredients</button>`);
        $("#changeMain").on("click", function () {
            // saves all of the ingredients and the image so that I can re-add them to the changed cupcake later
            const saveIngredients = cupcakes[cupcakeIndex].cupcake_ingredients;
            const saveFrosting = cupcakes[cupcakeIndex].frosting_ingredients;
            const saveToppings = cupcakes[cupcakeIndex].toppings;
            const saveImage = cupcakes[cupcakeIndex].image;
            $("#controls").html(`
                <label for="nameInput">Name:</label><br>
                <input type="text" id="nameInput" size="50" required><br>
                <label for="flavorInput">Flavor:</label><br>
                <select id="flavorInput">
                    <option value="all">All Flavors</option>
                    <option value="Chocolate">Chocolate</option>
                    <option value="Vanilla">Vanilla</option>
                    <option value="Lemon">Lemon</option>
                    <option value="Banana">Banana</option>
                    <option value="Raspberry">Raspberry</option>
                    <option value="Coconut">Coconut</option>
                    <option value="Nutella">Nutella</option>
                    <option value="Mint">Mint</option>
                    <option value="Cherry">Cherry</option>
                    <option value="Blueberry">Blueberry</option>
                    <option value="Carrot Cake">Carrot</option>
                </select><br>
                <label for="descInput">Description:</label><br>
                <input type="text" id="descInput" size="100" required><br>
                <label for="priceInput">Price:</label><br>
                <input type="text" id="priceInput" size="4" required><br>
                <button id="finishBtn">Finish</button>`);
            // This puts the already existing details of the cupcake in the input fields, in case the user only wants to make small changes like fixing typos. 
            $("#nameInput").val(`${cupcakes[cupcakeIndex].cupcake_name}`);
            $("#descInput").val(`${cupcakes[cupcakeIndex].description}`);
            $("#priceInput").val(`${cupcakes[cupcakeIndex].price}`);
            $("#finishBtn").on("click", function () {
                let updatedName = $("#nameInput").val();
                let updatedFlavor = $("#flavorInput").val();
                let updatedDesc = $("#descInput").val();
                let updatedPrice = $("#priceInput").val();
                cupcakes[cupcakeIndex] = {
                    cupcake_name: updatedName,
                    flavor: [updatedFlavor],
                    description: updatedDesc,
                    price: updatedPrice,
                    image: saveImage,
                    cupcake_ingredients: saveIngredients,
                    frosting_ingredients: saveFrosting,
                    toppings: saveToppings
                };
                console.log(cupcakes[cupcakeIndex]);
                restoreControls();
            });
        });
        $("#changeIng").on("click", function () {
            // saves main details for re-adding the changed cupcake to the array later
            const saveName = cupcakes[cupcakeIndex].cupcake_name;
            const saveFlavor = cupcakes[cupcakeIndex].flavor;
            const saveDesc = cupcakes[cupcakeIndex].description;
            const savePrice = cupcakes[cupcakeIndex].price;
            const saveImage = cupcakes[cupcakeIndex].image;
            const saveIngredients = cupcakes[cupcakeIndex].cupcake_ingredients;
            const saveFrosting = cupcakes[cupcakeIndex].frosting_ingredients;
            const saveToppings = cupcakes[cupcakeIndex].toppings;
            $("#controls").html(`
                <p><strong>Which would you like to change: the main cupcake ingredients, the frosting ingredients, or the toppings?</strong></p>
                <button id="changeCakeIng">Cupcake Ingredients</button>
                <button id="changeFrostingIng">Frosting Ingredients</button>
                <button id="changeToppings">Toppings</button>`);
            $("#changeCakeIng").on("click", function () {
                let ingredientDisplay = "<p><strong>Edit the ingredients below:</strong></p><ul>";
                cupcakes[cupcakeIndex].cupcake_ingredients.forEach((cupcake_ingredient, idx) => {
                    ingredientDisplay += `<li><input type="text" id="ingredient-${idx}" value="${cupcake_ingredient}" size="50"></li>`;
                });
                ingredientDisplay += `</ul><button id="finishIngBtn">Finish Ingredients</button>`;
                $("#controls").html(ingredientDisplay);
                $("#finishIngBtn").on("click", function () {
                    let updatedIngredients = [];
                    for (let i = 0; i < cupcakes[cupcakeIndex].cupcake_ingredients.length; i++) {
                        updatedIngredients.push($(`#ingredient-${i}`).val());
                    }
                    cupcakes[cupcakeIndex] = {
                        cupcake_name: saveName,
                        flavor: saveFlavor,
                        description: saveDesc,
                        price: savePrice,
                        image: saveImage,
                        cupcake_ingredients: updatedIngredients,
                        frosting_ingredients: saveFrosting,
                        toppings: saveToppings
                    };
                    console.log(cupcakes[cupcakeIndex]);
                    restoreControls();
                });
            });
            $("#changeFrostingIng").on("click", function () {
                let ingredientDisplay = "<p><strong>Edit the ingredients below:</strong></p><ul>";
                cupcakes[cupcakeIndex].frosting_ingredients.forEach((frosting_ingredient, idx) => {
                    ingredientDisplay += `<li><input type="text" id="ingredient-${idx}" value="${frosting_ingredient}" size="50"></li>`;
                });
                ingredientDisplay += `</ul><button id="finishIngBtn">Finish Ingredients</button>`;
                $("#controls").html(ingredientDisplay);
                $("#finishIngBtn").on("click", function () {
                    let updatedIngredients = [];
                    for (let i = 0; i < cupcakes[cupcakeIndex].frosting_ingredients.length; i++) {
                        updatedIngredients.push($(`#ingredient-${i}`).val());
                    }
                    cupcakes[cupcakeIndex] = {
                        cupcake_name: saveName,
                        flavor: saveFlavor,
                        description: saveDesc,
                        price: savePrice,
                        image: saveImage,
                        cupcake_ingredients: saveIngredients,
                        frosting_ingredients: updatedIngredients,
                        toppings: saveToppings
                    };
                    console.log(cupcakes[cupcakeIndex]);
                    restoreControls();
                });
            });
            $("#changeToppings").on("click", function () {
                let ingredientDisplay = "<p><strong>Edit the ingredients below:</strong></p><ul>";
                cupcakes[cupcakeIndex].toppings.forEach((topping, idx) => {
                    ingredientDisplay += `<li><input type="text" id="ingredient-${idx}" value="${topping}" size="50"></li>`;
                });
                ingredientDisplay += `</ul><button id="finishIngBtn">Finish Ingredients</button>`;
                $("#controls").html(ingredientDisplay);
                $("#finishIngBtn").on("click", function () {
                    let updatedIngredients = [];
                    for (let i = 0; i < cupcakes[cupcakeIndex].toppings.length; i++) {
                        updatedIngredients.push($(`#ingredient-${i}`).val());
                    }
                    cupcakes[cupcakeIndex] = {
                        cupcake_name: saveName,
                        flavor: saveFlavor,
                        description: saveDesc,
                        price: savePrice,
                        image: saveImage,
                        cupcake_ingredients: saveIngredients,
                        frosting_ingredients: saveFrosting,
                        toppings: updatedIngredients
                    };
                    console.log(cupcakes[cupcakeIndex]);
                    restoreControls();
                });
            });
        });
    });
};

const displayCupcakeList = (callback) => {
    let listHTML = `<ol>`;
    cupcakes.forEach((cupcake) => {
        listHTML += `<li>${cupcake.cupcake_name}</li>`;
    });
    listHTML += `</ol><br>
    <p><strong>Enter the number of the cupcake you want to update or delete.</strong></p><br>
    <label for="indexNum">Enter number here:</label>
    <input type="text" id="indexNum" size="3" required><br>
    <button id="enterBtn">Enter</button>`;
    $("#controls").html(listHTML);
    $("#enterBtn").on("click", function () {
        let index = parseInt($("#indexNum").val(), 10) - 1;
        callback(index);
    });
};

const deleteCupcake = () => {
    displayCupcakeList(function(cupcakeIndex) {
        console.log(cupcakeIndex);
        const removedCupcake = cupcakes.splice(cupcakeIndex, 1);
        console.log(removedCupcake);
        restoreControls();
    });
};

// Restores the controls section to its original state
const restoreControls = () => {
    $("#controls").html(originalControlsHTML);
    $("#applyFilter").on("click", applyFilter);
    $("#createCupcake").on("click", createCupcake);
    $("#updateCupcake").on("click", updateCupcake);
    $("#deleteCupcake").on("click", deleteCupcake);
};

// This function essentially is here to just hold all the buttons for the controls section. It also saves the original HTML for the controls section so that it can be restored in the 'restoreControls' function.
const showInformation = () => {
    originalControlsHTML = $("#controls").html();
    console.log("Information being shown");
    $("#applyFilter").on("click", applyFilter);
    $("#createCupcake").on("click", createCupcake);
    $("#updateCupcake").on("click", updateCupcake);
    $("#deleteCupcake").on("click", deleteCupcake);
};

$(document).ready(showInformation);