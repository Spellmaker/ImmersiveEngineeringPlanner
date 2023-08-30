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
    console.log(typeof selection);
}

const inventory = [];
if (localStorage.inventory) {
    console.log(typeof inventory);
    const parsed = JSON.parse(localStorage.inventory);
    parsed.forEach((r) => {
        inventory.push(r);
    })
    console.log(typeof inventory);
    inventory.findIndex(s => true);
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

        /* check inventory */
        let inventoryEntry = shadowInventory.find(i => i.recipe.name == name);
        let presentAmount = 0;
        if (inventoryEntry) {
            presentAmount = inventoryEntry.amount;
            inventoryEntry = Math.max(0, inventoryEntry.amount - neededAmount);
        }

        if (presentAmount >= neededAmount) {
            return [];
        }
        return [{
            name: name,
            amount: neededAmount - presentAmount,
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
    console.log("updateAmount for id " + id + " with selection " + isSelection);
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
    console.log(arrayToUpdate);
    console.log(arrayToUpdate.find);
    console.log(typeof arrayToUpdate);

    if (element.value == 0) {
        arrayToUpdate.splice(arrayToUpdate.findIndex((e) => e.recipe.id == id), 1);
    } else {
        arrayToUpdate.find(e => e.recipe.id == id).amount = element.value;
    }
    updateView();
}

function renderSelected(selectedElement, isSelection) {
    let stringPart = "selection";
    if (!isSelection) {
        stringPart = "inventory";
    }
    console.log(selectedElement);
    let idToUse = selectedElement.recipe.id;
    if (!idToUse) {
        idToUse = selectedElement.recipe.name.replace(" ", "-").toLowerCase();
    }
    return "<div class='"+ stringPart + "-element'><input type='number' id='input-"+ stringPart +"-"+ idToUse + "' onInput='updateAmount(\"" + idToUse + "\", " + isSelection + ")' value='"+ selectedElement.amount +"'/>" + selectedElement.recipe.name + "</div>"
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
        result += "<span class='summary-element'>" + g.name + " Amt: " + renderAmount(g.amount) + " Iterations: " + g.iterations + " from pool: " + g.fromPool + "</span><br />";
        //result += "<button onClick='craft'>Craft to Inventory</button>"
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

    console.log(selection);

    selection
    .sort((a, b) => a.recipe.name.localeCompare(b.recipe.name))
    .forEach((e) => selectionPanel.innerHTML += renderSelected(e, true));
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
    
    console.log("addElement with " + name);
    console.log(isSelection);
    let recipe = recipes.find((e) => e.name == name);

    if (!recipe) {
        recipe = {
            name: name,
            recipe: [],
            id: name.replace(" ", "-").toLowerCase(),
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
    toShow
    .sort((a, b) => a.name.localeCompare(b.name)).forEach((element) => {
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