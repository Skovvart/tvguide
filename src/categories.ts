export const categories = {
    Alle: [],
    Serie: ["TV-Serie", "Serie"],
    Film: ["Film"],
    Nyheder: ["Nyheder", "Aktualitet", "Aktualitet & Debat"],
    Sport: ["Sport"],
    Dokumentar: ["Dokumentar"],
    Kultur: ["Kultur og Natur", "Oplysning & Kultur"],
    Drama: ["Drama", "Drama & Fiktion"]
};

export const getCategory = (subCategory: string) => {
    for (const category in categories) {
        if (category === subCategory || categories[category].indexOf(subCategory) > -1) return category
    }
    return "Alle"
}