// products.js - sample dataset
const PRODUCTS = [
  // Athletic
  //{id:'blue navy hoodie', name:'Blue Hoodie', category:'athletic', type:'tops', price:40000, limited:true, desc:'Navy Hoodie', sizes:['S','M','L','XL'], stock:{S:0,M:0,L:0,XL:0}, img:'assets/images/bluehoodie.png', createdAt:'2025-08-02'},

  // General
  //{id:'shirt one', name:'Shirt 1', category:'general', type:'tops', price:23000, limited:false, desc:'T shirt merch', sizes:['S','M','L'], stock:{S:Infinity,M:Infinity,L:Infinity}, img:'assets/images/shirt1.png', createdAt:'2025-09-06'},

  {id:'whitekeyring', name:'KKFS Merlins key rings', category:'general', type:'etc', price:5000, limited:false, desc:'White KKFS Merlins key rings', sizes:['Free'], stock:{Free:9}, img:'/kkfs-merch/assets/images/accessories/keychain/whitekeyring.png', createdAt:'2025-09-06'},
  {id:'blackkeyring', name:'KKFS Merlins key rings', category:'general', type:'etc', price:5000, limited:false, desc:'Black KKFS Merlins key rings', sizes:['Free'], stock:{Free:2}, img:'assets/images/accessories/keychain/blackkeyring.png', createdAt:'2025-09-06'},
  {id:'lanyard', name:'KKFS Lanyards', category:'general', type:'etc', price:5000, limited:false, desc:'KKFS Lanyards', sizes:['Free'], stock:{Free:Infinity}, img:'assets/images/accessories/keychain/lanyard.png', createdAt:'2025-09-06'},
  {id:'hat', name:'Embroidered Merlins Hat', category:'general', type:'etc', price:30000, limited:false, desc:'White embroidered hat', sizes:['Adult'], stock:{Adult:Infinity}, img:'assets/images/accessories/keychain/hat.png', createdAt:'2025-09-06'},
  {id:'regularhat', name:'Printed Merlins Hat', category:'general', type:'etc', price:23000, limited:false, desc:'White Printed Merlins Hat', sizes:['Kids', 'Adult'], stock:{Kids: Infinity, Adult:Infinity}, img:'assets/images/accessories/keychain/regularhat.png', createdAt:'2025-09-06'},
  // Seasonal
  {id:'shirt one', name:'Shirt 1', category:'seasonal', type:'tops', price:32000, limited:false, desc:'T shirt merch', sizes:['S','M','L','XL'], stock:{S:Infinity,M:Infinity,L:Infinity, XL:Infinity}, img:'assets/images/shirt/shirt1/shirt1og.png', createdAt:'2025-09-06'},
  {id:'shirt two', name:'Shirt 2', category:'seasonal', type:'tops', price:32000, limited:false, desc:'T shirt merch', sizes:['S','M','L','XL'], stock:{S:Infinity,M:Infinity,L:Infinity, XL:Infinity}, img:'assets/images/shirt/shirt2/shirt2.png', createdAt:'2025-09-06'},
  {id:'standard', name:'Standard', category:'seasonal', type:'tops', price:32000, limited:false, desc:'T shirt merch', sizes:['S','M','L','XL'], stock:{S:Infinity,M:Infinity,L:Infinity, XL:Infinity}, img:'assets/images/shirt/standard/standard.png', createdAt:'2025-09-06'},
  {id:'hoodie', name:'Hoodie', category:'seasonal', type:'tops', price:42000, limited:false, desc:'Merlins Hoodie', sizes:['S','M','L','XL'], stock:{S:Infinity,M:Infinity,L:Infinity, XL:Infinity}, img:'assets/images/shirt/hoodie.png', createdAt:'2025-09-06'},
  {id:'green', name:'Earth House Shirt', category:'seasonal', type:'tops', price:30000, limited:false, desc:'Green Earth House Shirt', sizes:['13','14','15','16','17'], stock:{13:Infinity,14:Infinity,15:Infinity, 16:Infinity, 17:Infinity}, img:'assets/images/house shirts/earth/greenhouse.png', createdAt:'2025-09-06'},
  {id:'yellow', name:'Fire House Shirt', category:'seasonal', type:'tops', price:30000, limited:false, desc:'Yellow Fire House Shirt', sizes:['13','14','15','16','17'], stock:{13:Infinity,14:Infinity,15:Infinity, 16:Infinity, 17:Infinity}, img:'assets/images/house shirts/fire/yellowhouse.png', createdAt:'2025-09-06'},
  {id:'blue', name:'Water House Shirt', category:'seasonal', type:'tops', price:30000, limited:false, desc:'Blue Water House Shirt', sizes:['13','14','15','16','17'], stock:{13:Infinity,14:Infinity,15:Infinity, 16:Infinity, 17:Infinity}, img:'assets/images/house shirts/water/bluehouse.png', createdAt:'2025-09-06'},
  {id:'red', name:'Air House Shirt', category:'seasonal', type:'tops', price:30000, limited:false, desc:'Red Air House Shirt', sizes:['13','14','15','16','17'], stock:{13:Infinity,14:Infinity,15:Infinity, 16:Infinity, 17:Infinity}, img:'assets/images/house shirts/wind/redhouse.png', createdAt:'2025-09-06'},
];
window.PRODUCTS = PRODUCTS;
