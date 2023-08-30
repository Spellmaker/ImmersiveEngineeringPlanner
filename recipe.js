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
    recipe("Fission Reactor Casing", 4, "Basic Plating", 4, "Tough Alloy", 1),
    recipe("Tough Alloy", 2, "Ferroboron Alloy", 1, "Lithium Ingot", 1),
    recipe("Ferroboron Alloy", 2, "Steel Ingot", 1, "Boron Ingot", 1),
    recipe("Steel Ingot", 1, "Iron Ingot", 1, "Coal", 1),
    recipe("Dense Helium Collector", 1, "Compact Helium Collector", 8, "Gold Ingot", 1),
    recipe("Compact Helium Collector", 1, "Helium Collector", 8, "Bronze Ingot", 1),
    recipe("Helium Collector", 1, "Basic Plating", 4, "Zirconium Ingot", 4, "Thorium-230 Block", 1),
    recipe("Basic Plating", 2, "Lead Ingot", 2, "Graphite Dust", 2),
    recipe("Bronze Ingot", 4, "Copper Ingot", 3, "Tin Ingot", 1),
    recipe("Ultimate Induction Provider", 1, "Ultimate Control Circuit", 4, "Elite Induction Provider", 4, "Ultimate Energy Cube", 1),
    recipe("Ultimate Control Circuit", 1, "Atomic Alloy", 2, "Elite Control Circuit", 1),
    recipe("Elite Control Circuit", 1, "Reinforced Alloy", 2, "Advanced Control Circuit", 1),
    recipe("Advanced Control Circuit", 1, "Enriched Alloy", 2, "Basic Control Circuit", 1),
    recipe("Basic Control Circuit", 1, "Osmium Ingot", 1),
    recipe("Enriched Alloy", 1, "Iron Ingot", 1),
    recipe("Reinforced Alloy", 1, "Enriched Alloy", 1),
    recipe("Atomic Alloy", 1, "Reinforced Alloy", 1),
    recipe("Ultimate Energy Cube", 1, "Atomic Alloy", 4, "Diamond", 2, "Energy Tablet", 2, "Elite Energy Cube", 1),
    recipe("Energy Tablet", 1, "Redstone Dust", 4, "Gold Ingot", 3, "Enriched Alloy", 2),
    recipe("Elite Energy Cube", 1, "Gold Ingot", 2, "Reinforced Alloy", 4, "Energy Tablet", 2, "Advanced Energy Cube", 1),
    recipe("Advanced Energy Cube", 1, "Enriched Alloy", 4, "Energy Tablet", 2, "Osmium Ingot", 2, "Basic Energy Cube", 1),
    recipe("Basic Energy Cube", 1, "Redstone Dust", 4, "Iron Ingot", 2, "Energy Tablet", 2, "Steel Casing", 1),
    recipe("Steel Casing", 1, "Steel Ingot", 4, "Osmium Ingot", 1, "Glass", 4),
    recipe("Elite Induction Provider", 1, "Elite Control Circuit", 4, "Elite Energy Cube", 1, "Advanced Induction Provider", 4),
    recipe("Advanced Induction Provider", 1, "Advanced Control Circuit", 4, "Advanced Energy Cube", 1, "Basic Induction Provider", 4),
    recipe("Basic Induction Provider", 1, "Lithium Dust", 4, "Basic Control Circuit", 4, "Basic Energy Cube", 1),
    recipe("Ultimate Induction Cell", 1, "Energy Tablet", 4, "Elite Induction Cell", 4, "Ultimate Energy Cube", 1),
    recipe("Elite Induction Cell", 1, "Energy Tablet", 4, "Advanced Induction Cell", 4, "Elite Energy Cube", 1),
    recipe("Advanced Induction Cell", 1, "Energy Tablet", 4, "Advanced Energy Cube", 1, "Basic Induction Cell", 4),
    recipe("Basic Induction Cell", 1, "Energy Tablet", 4, "Lithium Dust", 4, "Basic Energy Cube", 1),
    recipe("Quartz Glass", 4, "Certus Dust", 5, "Glass", 4),
    recipe("Security Terminal", 1, "ME Chest", 1, "Silver Plate", 4, "Shimmer ME Glass Cable", 2, "Engineering Processor", 1, "16k ME Storage Component", 1),
    recipe("ME Chest", 2, "Shimmer ME Glass Cable", 2, "Glass", 2, "ME Terminal", 1, "Silver Plate", 3),
    recipe("ME Terminal", 1, "Formation Core", 1, "Annihilation Core", 1, "Illuminated Panel", 1, "Logic Processor", 1),
    recipe("Formation Core", 2, "Certus Quartz", 1, "Shimmer", 1, "Logic Processor", 1),
    recipe("Annihilation Core", 2, "Nether Quartz", 1, "Shimmer", 1, "Logic Processor", 1),
    recipe("Illuminated Panel", 3, "Silver Plate", 1, "Glowstone Dust", 2, "Shimmer", 1, "Quartz Glass", 3),
    recipe("Shimmer ME Glass Cable", 4, "Quartz Fiber", 1, "Shimmer", 2),
    recipe("Shimmer", 18, "Certus Dust", 18, "Shimmer Bucket", 1),
    recipe("Quartz Fiber", 3, "Certus Dust", 3, "Glass", 6),
    recipe("16k ME Storage Component", 1, "Glowstone Dust", 4, "Quartz Glass", 1, "Calculation Processor", 1, "4k ME Storage Component", 3),
    recipe("4k ME Storage Component", 1, "Shimmer", 4, "Calculation Processor", 1, "Shimmer", 4, "Quartz Glass", 1, "1k ME Storage Component", 3),
    recipe("1k ME Storage Component", 1, "Certus Quartz", 4, "Shimmer", 4, "Logic Processor", 1),
    recipe("Wireless Access Point", 1, "Shimmer ME Glass Cable", 1, "Calculation Processor", 1, "Wireless Receiver", 1),
    recipe("Wireless Receiver", 1, "Silver Plate", 3, "Quartz Fiber", 1, "Shimmer Pearl", 1),
    recipe("Shimmer Pearl", 1, "Shimmer", 8, "Ender Pearl", 1),
    recipe("Wireless Booster", 2, "Shimmer", 1, "Silver Plate", 3, "Certus Quartz", 1, "Ender Dust", 1),
    recipe("Wireless Crafting Terminal", 1, "ME Crafting Terminal", 1, "Wireless Receiver", 1, "Dense Energy Cell", 1),
    recipe("Dense Energy Cell", 1, "Calculation Processor", 1, "Energy Cell", 8),
    recipe("Energy Cell", 1, "Certus Quartz", 4, "Shimmer", 4, "Quartz Glass", 1),
    recipe("ME Crafting Terminal", 1, "ME Terminal", 1, "Crafting Table", 1, "Calculation Processor", 1),
    recipe("ME Terminal", 1, "Annihilation Core", 1, "Formation Core", 1, "Illuminated Panel", 1, "Logic Processor", 1),
    recipe("Logic Processor", 1, "Printed Logic Circuit", 1, "Shimmer", 1, "Printed Silicon", 1),
    recipe("Printed Logic Circuit", 1, "Gold Ingot", 1),
    recipe("Printed Silicon", 1, "Silicon", 1),
    recipe("Silicon", 1, "Certus Dust", 1),
    recipe("Engineering Processor", 1, "Printed Silicon", 1, "Shimmer", 1, "Printed Engineering Circuit", 1),
    recipe("Printed Engineering Circuit", 1, "Diamond", 1),
    recipe("Calculation Processor", 1, "Printed Calculation Circuit", 1, "Shimmer", 1, "Printed Silicon", 1),
    recipe("Printed Calculation Circuit", 1, "Certus Quartz", 1),
    recipe("Balloon Upgrade 1", 1, "Logic Chip", 4, "Balloon Remnant", 4, "Airship Balloon", 1),
    recipe("Balloon Upgrade 2", 1, "Logic Chip", 4, "Balloon Remnant", 4, "Balloon Upgrade 1", 1),
    recipe("Balloon Upgrade 3", 1, "Logic Chip", 4, "Balloon Remnant", 4, "Balloon Upgrade 2", 1),
    recipe("Balloon Upgrade 4", 1, "Logic Chip", 4, "Balloon Remnant", 4, "Balloon Upgrade 3", 1),
    recipe("Balloon Upgrade 5", 1, "Logic Chip", 4, "Balloon Remnant", 4, "Balloon Upgrade 4", 1),
    recipe("Maximum Compact Machine", 1, "Enori Crystal Block", 4, "Diamatine Crystal Block", 1, "Lasered Giant Compact Machine", 4),
    recipe("Lasered Giant Compact Machine", 1, "Giant Compact Machine", 1),
    recipe("Giant Compact Machine", 1, "Block of Elementium", 4, "Block of Dragonstone", 1, "Fairy Touched Large Compact Machine", 4),
    recipe("Fairy Touched Large Compact Machine", 1, "Large Compact Machine", 1),
    recipe("Large Compact Machine", 1, "Rare Earths", 4, "Thaumium Block", 1, "Magic Infused Normal Compact Machine", 4),
    recipe("Magic Infused Normal Compact Machine", 1, "Normal Compact Machine", 1),
    recipe("Normal Compact Machine", 1, "Block of Manasteel", 4, "Block of Mana Diamond", 1, "Mana Infused Small Compact Machine", 4),
    recipe("Mana Infused Small Compact Machine", 1, "Small Compact Machine", 1),
    recipe("Small Compact Machine", 1, "Compressed Machine Wall", 4, "Treated Large Wood Plate", 1, "Compacted Tiny Compact Machine", 4),
    recipe("Compacted Tiny Compact Machine", 1, "Tiny Compact Machine", 1),
    recipe("Tiny Compact Machine", 1, "Steel Plate", 4, "Treated Large Wood Plate", 1, "Compact Machine Wall", 4),
    recipe("Compact Machine Wall", 1, "Red Alloy Ingot", 4, "Steel Plate", 1, "Seared Stone", 4),
    recipe("Compressed Machine Wall", 1, "Compact Machine Wall", 9),
];