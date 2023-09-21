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
    recipe("Solar Panel", 1, "Coal Powder", 3, "Glass", 3, "Electronic Circuit", 2, "Generator", 1),
    recipe("Generator", 1, "Iron Plate", 3, "RE-Battery", 1, "Iron Furnace", 1),
    recipe("RE-Battery", 1, "Tin Item Casing", 4, "Redstone", 2, "Insulated Tin Cable", 1),
    recipe("Insulated Tin Cable", 1, "Tin Cable", 1, "Rubber", 1),
    recipe("Iron Furnace", 1, "Furnace", 1, "Iron Plate", 5),
    recipe("Machine Chassis", 1, "Iron Bars", 6, "Iron Casing", 1, "Basic Capacitor", 1, "Sturdy Casing", 1),
    recipe("Iron Bars", 16, "Iron Ingot", 6),
    recipe("Basic Capacitor", 1, "Empowered Restonia Crystal", 4, "Copper Electron Tube", 2, "Enriched Gold Ingot", 2),
    recipe("Copper Electron Tube", 8, "Copper Ingot", 10, "Redstone Ingot", 4, "Thickened Glass", 4, "Clear Glass", 1),
    recipe("High Voltage Solar Array", 1, "Medium Voltage Solar Array", 8, "HV-Transformer", 1),
    recipe("Medium Voltage Solar Array", 1, "Low Voltage Solar Array", 8, "MV-Transformer", 1),
    recipe("Low Voltage Solar Array", 1, "Solar Panel", 8, "LV-Transformer", 1),
    recipe("HV-Transformer", 1, "Circuit", 1, "2x Ins. Gold Cable", 2, "MV-Transformer", 1, "Advanced RE-Battery", 1),
    recipe("MV-Transformer", 1, "Basic Machine Casing", 1, "Insulated Copper Cable", 2),
    recipe("Basic Machine Casing", 1, "Iron Plate", 8),
    recipe("Insulated Copper Cable", 1, "Copper Cable", 1, "Rubber", 1),
    recipe("2x Ins. Gold Cable", 1, "Gold Cable", 1, "Rubber", 2),
    recipe("LV-Transformer", 1, "Wood Plank", 6, "Insulated Tin Cable", 2, "Coil", 1),
    recipe("Insulated Tin Cable", 1, "Tin Cable", 1, "Rubber", 1),
    recipe("Coil", 1, "Copper Cable", 8, "Iron Ingot", 1),
    recipe("Copper Cable", 3, "Copper Ingot", 1),
    recipe("Tin Cable", 3, "Tin Ingot", 1),
    recipe("Gold Cable", 3, "Gold Ingot", 1),
    recipe("Solar Panel", 1, "Coal Dust", 3, "Glas", 3, "Circuit", 2, "Generator", 1),
    recipe("Generator", 1, "Iron Plate", 3, "Iron Furnace", 1, "RE-Battery", 1),
    recipe("Iron Furnace", 1, "Iron Plate", 5, "Furnace", 1),
    recipe("Furnace", 1, "Cobblestone", 8),
    recipe("RE-Battery", 1, "Insulated Tin Cable", 1, "Redstone Dust", 2, "Tin Item Casing", 4),
    recipe("Tin Item Casing", 2, "Tin Plate", 1),
    recipe("Advanced RE-Battery", 1, "Insulated Copper Cable", 2, "Sulfur Dust", 1, "Lead Dust", 1, "Bronze Item Casing", 5),
    recipe("Bronze Item Casing", 2, "Bronze Plate", 1),
    recipe("Nuclear Reactor", 1, "Dense Lead Plate", 4, "Reactor Chamber", 3, "Generator", 1, "Advanced Circuit", 1),
    recipe("Dense Lead Plate", 1, "Lead Plate", 9),
    recipe("Advanced Circuit", 1, "Glowstone Dust", 2, "Empowered Restonia Crystal", 4, "Empowered Palis Crystal", 2, "Circuit", 1),
    recipe("Reactor Chamber", 1, "Lead Plate", 4, "Basic Machine Casing", 1),
    recipe("Overclocked Heat Vent", 1, "Gold Plate", 4, "Reactor Heat Vent", 1),
    recipe("Reactor Heat Vent", 1, "Heat Vent", 1, "Copper Plate", 8),
    recipe("Heat Vent", 1, "Electric Motor", 1, "Iron Bars", 4, "Iron Plate", 4),
    recipe("Electric Motor", 1, "Coil", 2, "Iron Ingot", 1, "Tin Item Casing", 2),
    recipe("Component Heat Vent", 1, "Tin Plate", 4, "Iron Bars", 4, "Heat Vent", 1),
    recipe("Reactor Plating", 1, "Lead Plate", 1, "Advanced Alloy", 1),
    recipe("Advanced Alloy", 1, "Mixed Metal Ingot", 1),
    recipe("Mixed Metal Ingot", 2, "Iron Plate", 3, "Bronze Plate", 3, "Tin Plate", 3),
    recipe("Component Heat Exchanger", 1, "Gold Plate", 4, "Heat Exchanger", 1),
    recipe("Heat Exchanger", 1, "Circuit", 1, "Copper Plate", 5, "Tin Plate", 3),
    recipe("Quad Fuel Rod", 1, "Fuel Rod", 4, "Copper Plate", 2, "Iron Plate", 3),
    recipe("Fuel Rod", 1, "Iron Plate", 1),
    recipe("420eu Reactor Setup", 1, "Nuclear Reactor", 1, "Reactor Chamber", 6, "Quad Fuel Rod", 7, "Reactor Plating", 7, "Component Heat Vent", 11, "Overclocked Heat Vent", 28, "Component Heat Exchanger", 1),
    recipe("MFSU", 1, "Advanced Machine Casing", 1, "MFE", 1, "Advanced Circuit", 1, "Lapotron Crystal", 6),
    recipe("Lapotron Crystal", 1, "Advanced Circuit", 2, "Lapis Dust", 6, "Energy Crystal", 1),
    recipe("Energy Crystal", 1, "Energium Dust", 9),
    recipe("Energium Dust", 9, "Diamond Dust", 4, "Redstone Dust", 5),
    recipe("MFE", 1, "Energy Crystal", 4, "Basic Machine Casing", 1, "2x Ins. Gold Cable", 4),
    recipe("Void Upgrade", 1, "Stick", 6, "Obsidian", 2, "Upgrade Template", 1),
    recipe("Storage Upgrade V", 1, "Emerald", 4, "Stick", 4, "Storage Upgrade IV", 1),
    recipe("Storage Upgrade IV", 1, "Diamond", 4, "Stick", 4, "Storage Upgrade III", 1),
    recipe("Storage Upgrade III", 1, "Gold Ingot", 4, "Stick", 4, "Storage Upgrade II", 1),
    recipe("Storage Upgrade II", 1, "Iron Ingot", 4, "Stick", 4, "Storage Upgrade I", 1),
    recipe("Storage Upgrade I", 1, "Obsidian", 4, "Stick", 4, "Upgrade Template", 1),
    recipe("Upgrade Template", 1, "Stick", 8, "Basic Drawer", 1),
    recipe("Basic Drawer", 1, "Plank", 6, "Chest", 1),
    recipe("Chest", 1, "Plank", 8),
    recipe("Stick", 4, "Plank", 2),
    recipe("Plank", 4, "Log", 1),
    recipe("Void Resource Miner Controller Tier 2", 1, "Block of Diamond", 4, "Void Resource Miner Controller Tier 1", 3, "Laser Core", 1, "Clear Lens", 1),
    recipe("Void Resource Miner Controller Tier 1", 1, "Block of Gold", 4, "End Stone", 1, "Netherrack", 1, "Moss Stone", 1, "Laser Core", 1, "Clear Lens", 1),
    recipe("Clear Lens", 1, "Lens", 1, "Clear Glass", 8),
    recipe("Lens", 1, "Clear Glass", 3),
    recipe("Clear Glass", 1, "Enriched Sand", 1),
    recipe("Enriched Sand", 1, "Sand", 1, "Quartz", 1),
    recipe("Laser Core", 1, "Clear Glass", 4, "Redstone", 2, "Iron Ingot", 2),
    recipe("T2 Void Resource Miner", 1, "Void Resource Miner Controller Tier 2", 1, "Structure Frame T2", 32, "Structure Panel", 16, "Null Modifier", 4, "Laser Core", 3, "White Lens", 1),
    recipe("Structure Frame T2", 1, "Diamond", 2, "Restonia Crystal", 2, "Structure Frame T1", 1, "Vibrant Alloy", 4),
    recipe("Structure Frame T1", 1, "Basalt", 1, "Redstone", 2, "Electrical Steel", 4, "Gold Ingot", 2),
    recipe("Vibrant Alloy", 1, "Ender Pearl", 1, "Energetic Alloy", 1),
    recipe("Energetic Alloy", 1, "Gold Ingot", 1, "Redstone", 1, "Glowstone", 1),
    recipe("Electrical Steel", 1, "Iron Ingot", 1, "Coal Powder", 1, "Silicon", 1),
];
