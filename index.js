function recipe(
    name,
    amount,
    ...recipe
) {

    let currentRecipe = [];
    let currentName = null;
    recipe.forEach(element => {
        if (currentName == null) {
            currentName = element;
        } else {
            currentRecipe.push({name: currentName, amount: element});
            currentName = null;
        }
    });
    return {
        name: name,
        amount: amount,
        recipe: currentRecipe,
    };
}


const recipes = [
    {
        name: "Crusher",
        amount: 1,
        recipe: [
            {
                name: "Steel Scaffolding",
                amount: 10,
            },
            {
                name: "Redstone Engineering Block",
                amount: 1,
            },
            {
                name: "Light Engineering Block",
                amount: 10,
            },
            {
                name: "Steel Fence",
                amount: 8,
            },
            {
                name: "Hopper",
                amount: 9,
            },
        ]
    },
    {
        name: "Heavy Engineering Block",
        amount: 2,
        recipe: [
            {
                name: "Steel Ingot",
                amount: 4,
            },
            {
                name: "Steel Mechanical Component",
                amount: 2,
            },
            {
                name: "Piston",
                amount: 2,
            },
            {
                name: "Electrum",
                amount: 1,
            },
        ],
    },
    {
        name: "Steel Scaffolding",
        amount: 6,
        recipe: [
            {
                name: "Steel Ingot",
                amount: 3,
            },
            {
                name: "Steel Rod",
                amount: 3,
            }
        ]
    },
    recipe("Steel Rod", 2, "Steel Ingot", 2),
    recipe("Redstone Engineering Block", 1, "Iron Plate", 4, "Redstone Alloy Plate", 4, "Vacuum Tube", 1),
    recipe("Vacuum Tube", 3, "Glass", 1, "Nickel Plate", 1, "Copper Wire", 1, "Redstone", 1),
    recipe("Light Engineering Block", 2, "Iron Ingot", 4, "Copper Ingot", 3, "Iron Mechanical Component", 2),
    recipe("Iron Mechanical Component", 1, "Iron Plate", 4, "Copper Ingot", 1),
    recipe("Steel Fence", 3, "Steel Ingot", 4, "Steel Rod", 2),
    recipe("Hopper", 1, "Chest", 1, "Iron Plate", 5, "Bronze Gear", 1),
    recipe("Arc Furnace", 1, "Cauldron", 1, "Steel Sheetmetal Slab", 14, "Steel Sheetmetal", 8, "Block of Steel", 6, "Steel Scaffolding", 5, "Redstone Engineering Block", 1, "Light Engineering Block", 10, "Heavy Engineering Block", 5, "Reinforced Blast Brick", 27),
    recipe("Steel Sheetmetal Slab", 6, "Steel Sheetmetal", 3),
    recipe("Steel Sheetmetal", 4, "Steel Plate", 4),
    recipe("Block of Steel", 6, "Steel Ingot", 9),
    recipe("Steel Mechanical Component", 1, "Steel Plate", 4, "Copper Ingot", 1),
    recipe("Reinforced Blast Brick", 1, "Blast Brick", 1, "Steel Plate", 1),
];

function clearAll() {
    selection.splice(0, selection.length);
    localStorage.recipeSelection = undefined;
    console.log(selection);
    updateView();
}

recipes.forEach((e, index) => {
    e.id = index
})

const selection = [];
if (localStorage.recipeSelection) {
    const parsed = JSON.parse(localStorage.recipeSelection);
    parsed.forEach((r) => {
        selection.push(r);
    })

}

const searchContents = document.getElementById("search-contents");
const searchBox = document.getElementById("search");
const selectionPanel = document.getElementById("selected-panel");
const resultsPanel = document.getElementById("right-panel");

function decomposeRecipe(name, neededAmount) {
    console.log("decompose " + name);
    const found = recipes.find((r) => r.name == name);
    
    if (!found) {
        console.log("fast return");
        console.log([{
            name: name,
            amount: neededAmount,
        }]);
        return [{
            name: name,
            amount: neededAmount,
        }];
    }
    let produced = 0;
    let iterations = 0;
    while (produced < neededAmount) {
        iterations++;
        produced += found.amount;
    }
    return found.recipe.flatMap(component => decomposeRecipe(component.name, component.amount * iterations));
}

function updateAmount(id) {
    const element = document.getElementById("input-" + id);

    if (element.value == 0) {
        selection.splice(selection.findIndex((e) => e.recipe.id == id), 1);
    } else {
        selection.find((e) => e.recipe.id == id).amount = element.value;
    }
    updateView();
}

function renderSelected(selectedElement) {
    return "<div class='selected-element'><input type='number' id='input-"+ selectedElement.recipe.id + "' onInput='updateAmount(\"" + selectedElement.recipe.id + "\")' value='"+ selectedElement.amount +"'/>" + selectedElement.recipe.name + "</div>"
}

function renderIngredient(ingredient) {
    return "<tr><td>" + ingredient.amount + "</td><td>" + ingredient.name + "</td></tr>";
}

function updateView() {
    localStorage.recipeSelection = JSON.stringify(selection);
    selectionPanel.innerHTML = "";

    selection.forEach((e) => selectionPanel.innerHTML += renderSelected(e));

    resultsPanel.innerHTML = "";

    const step1 = selection.flatMap((e) => decomposeRecipe(e.recipe.name, e.amount));

    const decomposed = [];
    step1.forEach(e => {
        const found = decomposed.find((d) => d.name == e.name);
        if (found) {
            found.amount += e.amount;
        } else {
            decomposed.push(e);
        }
    });

    console.log(decomposed);
    let inner = "<table><tr><td>Amount</td><td>Name</td></tr>";

    decomposed.forEach(d => inner += renderIngredient(d));
    inner += "</table>";
    resultsPanel.innerHTML = inner;
}

function addElement(name) {
    const recipe = recipes.find((e) => e.name == name);
    const found = selection.find((e) => e.recipe.name == recipe.name);
    if (found) {
        found.amount += 1;
    } else {
        selection.push({
            amount: 1,
            recipe: recipe,
        });
    }

    updateView();
}

function makeElement(recipe) {
    return "<div class='recipe-element'><button onClick='addElement(\"" + recipe.name + "\")'>Add</button>" + recipe.name + "</div>";
}

function makeSearchContents(filter) {
    const toShow = recipes.filter((e) => !filter || e.name.toUpperCase().includes(filter.toUpperCase()));

    searchContents.innerHTML = "";
    toShow.forEach((element) => {
        searchContents.innerHTML += makeElement(element);
    });
}


makeSearchContents(null);

searchBox.oninput = (e) => {
    console.log("changes");
    makeSearchContents(e.target.value);
};

updateView();