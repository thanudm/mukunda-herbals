/* ============================================================
   Mukunda Herbal — product catalogue (single source of truth)
   Used by the cart, order summary and category filters.
   ============================================================ */

const PRODUCTS = [
  { id: "shampoo200",   name: "Herbal Shampoo",    size: "200 ml", price: 249, category: "hair",  img: "shampoo.jpg" },
  { id: "shampoo500",   name: "Herbal Shampoo",    size: "500 ml", price: 499, category: "hair",  img: "shampoo.jpg" },
  { id: "hair-oil200",  name: "Herbal Hair Oil",   size: "200 ml", price: 299, category: "hair",  img: "herbal-hair-oil.jpg"}, 
  { id: "hair-oil500",  name: "Herbal Hair Oil",   size: "500 ml", price: 649, category: "hair",  img: "herbal-hair-oil.jpg"},
  { id: "growth100",    name: "Hair Growth Pack",  size: "100 g",  price: 199, category: "hair",  img: "hair-pack.jpg" },
  { id: "growth250",    name: "Hair Growth Pack",  size: "250 g",  price: 499, category: "hair",  img: "hair-pack.jpg" },
  { id: "sunni100",     name: "Sunnipindi",        size: "100 g",  price: 149, category: "hair",  img: "sunnipindi.jpg" },
  { id: "sunni250",     name: "Sunnipindi",        size: "250 g",  price: 399, category: "hair",  img: "sunnipindi.jpg" },

  { id: "manjista",     name: "Manjista Soap",     size: "100 g",  price: 200, category: "soaps", img: "manjista.jpg" },
  { id: "kuppintaku",   name: "Kuppintaku Soap",   size: "100 g",  price: 200, category: "soaps", img: "kuppintaku.jpg" },
  { id: "herbal-soap",  name: "Herbal Soap",       size: "100 g",  price: 200, category: "soaps", img: "herbal-soap.jpg" },
  { id: "detan-soap",   name: "Detan Soap",        size: "100 g",  price: 200, category: "soaps", img: "detan-soap.jpg" },
  { id: "goatmilk",     name: "Goat Milk Soap",    size: "100 g",  price: 200, category: "soaps", img: "goat-milk-soap.jpg" },

  { id: "sesame",       name: "Sesame Oil",        size: "1000 ml", price: 549, category: "oils",  img: "sesame-oil.jpg" },
  { id: "sunflower",    name: "Sunflower Oil",     size: "1000 ml", price: 399, category: "oils",  img: "sunflower-oil.jpg" },
  { id: "groundnut",    name: "Groundnut Oil",     size: "1000 ml", price: 399, category: "oils",  img: "groundnut-oil.jpg" },
  { id: "coconut",      name: "Coconut Oil",       size: "1000 ml", price: 550, category: "oils",  img: "coconut-oil.jpg" },

  { id: "henna",        name: "Henna Powder",      size: "200 g",  price: 199, category: "henna", img: "henna-powder.jpg" },
  { id: "indigo",       name: "Indigo Powder",     size: "200 g",  price: 249, category: "henna", img: "indigo-powder.jpg" },
  { id: "lipbalm",      name: "Beetroot Lip Balm", size: "5 g",   price: 120, category: "lips",  img: "beetroot-lip-balm.jpg" }
];

/* Category config: used for filter chips and cart thumbnails */
const CATEGORIES = [
  { key: "hair",  label: "Hair Care" },
  { key: "soaps", label: "Soaps & Body" },
  { key: "oils",  label: "Cold-Pressed Oils" },
  { key: "henna", label: "Henna & Indigo" },
  { key: "lips",  label: "Lip Care" }
];

function categoryLabel(key) {
  const c = CATEGORIES.find((x) => x.key === key);
  return c ? c.label : "";
}
