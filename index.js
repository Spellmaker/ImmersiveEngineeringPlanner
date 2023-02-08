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
    recipe("Steel Rod", 1, "Steel Ingot", 1),
    recipe("Redstone Engineering Block", 1, "Iron Plate", 4, "Redstone Alloy Plate", 4, "Vacuum Tube", 1),
    recipe("Vacuum Tube", 3, "Glass", 1, "Nickel Plate", 1, "Copper Wire", 1, "Redstone", 1),
    recipe("Light Engineering Block", 2, "Iron Ingot", 4, "Copper Ingot", 3, "Iron Mechanical Component", 2),
    recipe("Iron Mechanical Component", 1, "Iron Plate", 4, "Copper Ingot", 1),
    recipe("Steel Fence", 3, "Steel Ingot", 4, "Steel Rod", 2),
    recipe("Hopper", 1, "Chest", 1, "Iron Plate", 5, "Bronze Gear", 1),
    recipe("Arc Furnace", 1, "Cauldron", 1, "Steel Sheetmetal Slab", 14, "Steel Sheetmetal", 8, "Block of Steel", 6, "Steel Scaffolding", 5, "Redstone Engineering Block", 1, "Light Engineering Block", 10, "Heavy Engineering Block", 5, "Reinforced Blast Brick", 27),
    recipe("Steel Sheetmetal Slab", 6, "Steel Sheetmetal", 3),
    recipe("Steel Sheetmetal", 4, "Steel Plate", 4),
    recipe("Block of Steel", 1, "Steel Ingot", 9),
    recipe("Steel Mechanical Component", 1, "Steel Plate", 4, "Copper Ingot", 1),
    recipe("Reinforced Blast Brick", 1, "Blast Brick", 1, "Steel Plate", 1),
    recipe("Piston", 1, "Wood Sidings", 3, "Iron Plate", 1, "Redstone", 1),
    recipe("Steam Turbine", 1, "Steel Scaffolding", 3, "Fluid Pipe", 6, "Redstone Engineering Block", 1, "Heavy Engineering Block", 24, "Radiator Block", 4, "Steel Sheetmetal", 27, "Block of Steel", 10),
    recipe("Alternator", 1, "Heavy Engineering Block", 4, "Generator Block", 8, "High-Voltage Coil Block", 6, "HV Capacitor", 5, "Steel Sheetmetal", 8, "Block of Steel", 2),
    recipe("Radiator Block", 2, "Copper Ingot", 4, "Steel Ingot", 4, "Bucket of Water", 1),
    recipe("Generator Block", 2, "Steel Ingot", 6, "Kinetic Dynamo", 1, "Electrum Ingot", 2),
    recipe("Kinetic Dynamo", 1, "Redstone", 2, "Copper Coil Block", 1, "Iron Ingot", 3),
    recipe("Copper Coil Block", 1, "LV Wire Coil", 8, "Iron Ingot", 1),
    recipe("LV Wire Coil", 4, "Copper Wire", 4, "Stick", 1),
    recipe("Copper Wire", 2, "Copper Ingot", 1),
    recipe("High-Voltage Coil Block", 1, "HV Wire Coil", 8, "Iron Ingot", 1),
    recipe("HV Wire Coil", 4, "Aluminium Wire", 2, "Steel Wire", 2, "Stick", 1),
    recipe("Aluminium Wire", 2, "Aluminium Ingot", 1),
    recipe("Steel Wire", 2, "Steel Ingot", 1),
    recipe("HV Capacitor", 1, "Steel Ingot", 3, "Aluminium Ingot", 2, "Block of Lead", 1, "Treated Wood Planks", 2, "Block of Redstone", 1),
    recipe("Treated Wood Planks", 8, "Wood Planks", 8, "Creosote Oil Bucket", 1),
    recipe("Block of Redstone", 1, "Redstone", 9),
    recipe("Block of Lead", 1, "Lead Ingot", 9),
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

let summarizedGraphElements = [];

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
    console.log(selectedElement);
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

function enterGraphElement(name) {
    document.querySelectorAll(".graph-element").forEach(e => e.classList.remove("g-hovered"));
    document.querySelectorAll(".g-" + name.replace(" ", "-").toLowerCase()).forEach(e => e.classList.add("g-hovered"));
}

function leaveGraphElement(name) {
    document.querySelectorAll(".g-" + name.replace(" ", "-").toLowerCase()).forEach(e => e.classList.remove("g-hovered"));
}

function addSummarize(name) {
    if (summarizedGraphElements.find(n => name == n)) {
        return;
    }
    summarizedGraphElements.push(name);
    updateView();
}

function removeSummarize(name) {
    summarizedGraphElements.splice(summarizedGraphElements.findIndex(x => x == name), 1);
    updateView();
}

function renderSummarized(graph) {
    let result = "<div class='graph-summarized'>";

    summarizedGraphElements.forEach(e => {
        result += "<div class='summary-container' onClick='removeSummarize(\"" + e + "\")'>";
        const applicable = filterGraph(graph, e);
    
        let g = { name: e, amount: 0, iterations: 0, fromPool: 0, children: [] };
        applicable.forEach(a => {
            g.amount += a.amount;
            g.iterations += a.iterations;
            g.fromPool += a.fromPool;
        });
        result += "<span class='summary-element'>" + g.name + " Amt: " + g.amount + " Iterations: " + g.iterations + " from pool: " + g.fromPool + "</span><br />";
        result += "</div>";
    });

    result += "</div>";
    return result;
}

function filterGraph(graph, name) {
    return graph.flatMap(element => {
        console.log(element);
            let childResult = filterGraph(element.children, name);

            if (element.name == name) {
                childResult.push(element);
            }
            return childResult;
        }
    );
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
        result += prefix + "<span class='graph-element g-" + g.name.replace(" ", "-").toLowerCase() + "' onClick='addSummarize(\""+g.name+"\")' onMouseOver='enterGraphElement(\"" + g.name + "\")' onMouseOut='leaveGraphElement(\"" + g.name + "\")'>" + g.name + " Amt: " + g.amount + " Iterations: " + g.iterations + " from pool: " + g.fromPool + "</span><br />";
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
    inner += "Summarized elements (Click to remove from list)<br />";
    inner += renderSummarized(graph);
    inner += "Full Crafting graph (click on elements to summarize)<br />";
    inner += renderGraph(graph);
    resultsPanel.innerHTML = inner;
}

function addElement(name, isSelection) {
    console.log(isSelection);
    let recipe = recipes.find((e) => e.name == name);

    if (!recipe) {
        recipe = {
            name: name,
            recipe: [],
        };
    }

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

function makeElement(recipe, hasPlan) {
    let planButton = "";
    if (hasPlan) {
        planButton = "<button onClick='addElement(\"" + recipe.name + "\", true)'>Add To Plan</button>";
    }
    return "<div class='recipe-element'>" +
        planButton  +
        "<button onClick='addElement(\"" + recipe.name + "\", false)'>Add To Inventory</button>" + 
        recipe.name + 
        "</div>";
}

function makeSearchContents(filter) {
    const toShow = recipes.filter((e) => !filter || e.name.toUpperCase().includes(filter.toUpperCase()));

    searchContents.innerHTML = "";
    toShow.forEach((element) => {
        searchContents.innerHTML += makeElement(element, true);
    });
    let leaves = recipes
        .flatMap(e => recipeLeaves(e))
        .sort((a, b) => a.name.localeCompare(b.name));


    let sortedLeaves = [];
    leaves.forEach(l => {
        if (!sortedLeaves.find(x => x.name == l.name)) {
            sortedLeaves.push(l);
        }
    });

    sortedLeaves.forEach((element) => {
        searchContents.innerHTML += makeElement(element, false);
    });

}

function recipeLeaves(node) {
    let result = [];
    node.recipe.forEach((recipe) => {
        if (!recipes.find(r => r.name == recipe.name)) {
            result.push(recipe);
        }
    });
    return result;
}


makeSearchContents(null);

searchBox.oninput = (e) => {
    console.log("changes");
    makeSearchContents(e.target.value);
};

updateView();