// products.js - sample dataset
const PRODUCTS = [
  // Athletic
  {id:'blue navy hoodie', name:'Blue Hoodie', category:'athletic', type:'tops', price:40000, limited:true, desc:'Navy Hoodie', sizes:['S','M','L','XL'], stock:{S:0,M:0,L:0,XL:0}, img:'assets/images/bluehoodie.png', createdAt:'2025-08-02'},

  // General
  {id:'black fleece', name:'Fleece', category:'general', type:'tops', price:45000, limited:false, desc:'Black fleece', sizes:['S','M','L'], stock:{S:Infinity,M:Infinity,L:Infinity}, img:'assets/images/fleece.png', createdAt:'2025-09-02'},

  // Seasonal
  {id:'Merlins T-Shirt', name:'Black T-Shirt', category:'seasonal', type:'tops', price:25000, limited:false, desc:'Black T-Shirt', sizes:['S','M','L','XL'], stock:{S:Infinity,M:Infinity,L:Infinity,XL:Infinity}, img:'assets/images/tshirt.png', createdAt:'2025-09-02'},
];
window.PRODUCTS = PRODUCTS;