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
    recipe("Steel Rod", 2, "Steel Ingot", 1),
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
    recipe("Piston", 1, "Wood Sidings", 3, "Iron Plate", 1, "Redstone", 1),
];

function clearAll() {
    selection.splice(0, selection.length);
    inventory.splice(0, inventory.length);
    localStorage.recipeSelection = undefined;
    localStorage.inventory = undefined;
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

const inventory = [];
if (localStorage.inventory) {
    const parsed = JSON.parse(localStorage.inventory);
    parsed.forEach((r) => {
        inventory.push(r);
    })

}

const searchContents = document.getElementById("search-contents");
const searchBox = document.getElementById("search");
const selectionPanel = document.getElementById("selected-panel");
const resultsPanel = document.getElementById("right-panel");
const inventoryPanel = document.getElementById("inventory-panel");
let showStacks = false;

function toggleStacks() {
    showStacks = !showStacks;
    updateView();
}

function decomposeRecipe(name, neededAmount, shadowInventory, graph) {
    const found = recipes.find((r) => r.name == name);

    const currentNode = {
        name: name,
        amount: -1,
        iterations: -1,
        fromPool: 0,
        children: [],
    };

    graph.push(currentNode);
    
    if (!found) {
        currentNode.name = name;
        currentNode.amount = neededAmount;
        currentNode.iterations = 0;
        return [{
            name: name,
            amount: neededAmount,
        }];
    }
    let produced = 0;
    let iterations = 0;

    /* check if any components are already in inventory */
    console.log(shadowInventory);
    const inventoryEntry = shadowInventory.find(e => e.recipe.name == name);
    currentNode.fromPool = 0;
    if (inventoryEntry) {
        produced = inventoryEntry.amount;
        currentNode.fromPool = Math.min(inventoryEntry.amount, neededAmount);
        inventoryEntry.amount -= neededAmount;
        if (inventoryEntry.amount < 0) {
            inventoryEntry.amount = 0;
        }
    }

    while (produced < neededAmount) {
        iterations++;
        produced += found.amount;
    }

    currentNode.iterations = iterations;
    currentNode.amount = produced - currentNode.fromPool;

    if (iterations <= 0) {
        return [];
    }

    /* place any excess produce into the shadow inventory */
    if (produced > neededAmount) {
        let newEntry = shadowInventory.find(e => e.recipe.name == name);
        if (newEntry) {
            newEntry.amount += produced - neededAmount;
        } else {
            shadowInventory.push({
                recipe: found.recipe,
                amount: produced - neededAmount,
            });
        }
    }

    return found.recipe.flatMap(component => decomposeRecipe(component.name, component.amount * iterations, shadowInventory, currentNode.children));
}

function updateAmount(id, isSelection) {
    let prefix = "selection";
    if (!isSelection) {
        prefix = "inventory";
    }
    console.log("input-" + prefix + "-" + id);
    const element = document.getElementById("input-" + prefix + "-" + id);
    let arrayToUpdate = selection;
    if (!isSelection) {
        arrayToUpdate = inventory;
    }

    if (element.value == 0) {
        arrayToUpdate.splice(arrayToUpdate.findIndex((e) => e.recipe.id == id), 1);
    } else {
        arrayToUpdate.find((e) => e.recipe.id == id).amount = element.value;
    }
    updateView();
}

function renderSelected(selectedElement, isSelection) {
    let stringPart = "selection";
    if (!isSelection) {
        stringPart = "inventory";
    }
    return "<div class='"+ stringPart + "-element'><input type='number' id='input-"+ stringPart +"-"+ selectedElement.recipe.id + "' onInput='updateAmount(\"" + selectedElement.recipe.id + "\", " + isSelection + ")' value='"+ selectedElement.amount +"'/>" + selectedElement.recipe.name + "</div>"
}

function renderAmount(amount) {
    if (showStacks) {
        return Math.floor(amount / 64) + ":" + (amount % 64);
    } else {
        return amount;
    }
}

function renderIngredient(ingredient) {
    return "<tr><td>" + renderAmount(ingredient.amount) + "</td><td>" + ingredient.name + "</td></tr>";
}

function inventoryCopy() {
    const result = [];
    inventory.forEach((e) => {
        result.push({amount: e.amount, recipe: e.recipe });
    });
    return result;
}

function renderGraph(graph, prefix) {
    if (!prefix) {
        prefix = "";
    }
/*
        name: name,
        amount: -1,
        iterations: -1,
        fromPool: 0,
        children: [],*/

    let result = "";
    graph.forEach(g => {
        result += prefix + g.name + " Amt: " + g.amount + " Iterations: " + g.iterations + " from pool: " + g.fromPool + "<br />";
        result += renderGraph(g.children, prefix + "<span class='graph-tab'></span>");
    });
    return result;
}

function updateView() {
    localStorage.recipeSelection = JSON.stringify(selection);
    localStorage.inventory = JSON.stringify(inventory);
    selectionPanel.innerHTML = "";
    inventoryPanel.innerHTML = "";

    selection.forEach((e) => selectionPanel.innerHTML += renderSelected(e, true));
    inventory.forEach((e) => inventoryPanel.innerHTML += renderSelected(e, false));

    resultsPanel.innerHTML = "";
    const computeInventory = inventoryCopy();
    let graph = [];

    const step1 = selection.flatMap((e) => decomposeRecipe(e.recipe.name, e.amount, computeInventory, graph));
    console.log(graph);

    const decomposed = [];
    step1.forEach(e => {
        const found = decomposed.find((d) => d.name == e.name);
        if (found) {
            found.amount += e.amount;
        } else {
            decomposed.push(e);
        }
    });
    decomposed.sort((a, b) => a.name.localeCompare(b.name));


    let inner = "<table><tr><td>Amount</td><td>Name</td></tr>";

    decomposed.forEach(d => inner += renderIngredient(d));
    inner += "</table>";
    inner += "<input type='checkbox' onChange='toggleStacks()'>Show Stacks";

    inner += "<br /><br />Crafting helper:<br />";
    inner += renderGraph(graph);
    resultsPanel.innerHTML = inner;
}

function addElement(name, isSelection) {
    console.log(isSelection);
    const recipe = recipes.find((e) => e.name == name);

    let arrayToUpdate = selection;
    if (!isSelection) {
        arrayToUpdate = inventory;
    }

    const found = arrayToUpdate.find((e) => e.recipe.name == recipe.name);
    if (found) {
        found.amount += 1;
    } else {
        arrayToUpdate.push({
            amount: 1,
            recipe: recipe,
        });
    }

    updateView();
}

function makeElement(recipe) {
    return "<div class='recipe-element'>" +
        "<button onClick='addElement(\"" + recipe.name + "\", true)'>Add To Plan</button>" + 
        "<button onClick='addElement(\"" + recipe.name + "\", false)'>Add To Inventory</button>" + 
        recipe.name + 
        "</div>";
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