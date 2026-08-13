const products = [
  {id:1,name:"Miniature Glow Rabbit",price:20,old:29,cat:"mini",emoji:"🐇",badge:"PRICE DROP"},
  {id:2,name:"Miniature Glow Elephant",price:29,old:45,cat:"mini",emoji:"🐘"},
  {id:3,name:"Spacecraft Building Block",price:199,old:349,cat:"space",emoji:"🚀",badge:"PRICE DROP"},
  {id:4,name:"Classic Red Rose Pot",price:129,old:159,cat:"flowers",emoji:"🌹"},
  {id:5,name:"Rabbit Building Block",price:79,old:119,cat:"animals",emoji:"🐰"},
  {id:6,name:"Elephant Building Block",price:79,old:119,cat:"animals",emoji:"🐘"},
  {id:7,name:"Space Station Building Block",price:199,old:349,cat:"space",emoji:"🛸",badge:"PRICE DROP"},
  {id:8,name:"Golden Sunflower Pot",price:129,old:159,cat:"flowers",emoji:"🌻"},
  {id:9,name:"Pug Building Block",price:79,old:119,cat:"animals",emoji:"🐶"},
  {id:10,name:"Miniature Cute Piglet",price:29,old:45,cat:"mini",emoji:"🐷"},
  {id:11,name:"Apollo Space Rocket",price:199,old:299,cat:"space",emoji:"🚀"},
  {id:12,name:"Spring Blossom Tree",price:199,old:249,cat:"flowers",emoji:"🌸"},
  {id:13,name:"Tricera Building Block",price:79,old:119,cat:"animals",emoji:"🦕"},
  {id:14,name:"Dachshund Building Block",price:79,old:119,cat:"animals",emoji:"🐕"},
  {id:15,name:"Miniature Panda",price:55,old:75,cat:"mini",emoji:"🐼"},
  {id:16,name:"Star Mission Rocket",price:199,old:299,cat:"space",emoji:"🚀",badge:"PRICE DROP"}
];

let cart = JSON.parse(localStorage.getItem("buildo-cart") || "[]");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function card(p){
  return `<article class="product-card">
    <div class="product-image">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      <span class="product-emoji">${p.emoji}</span>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div>
      <button class="add" onclick="addToCart(${p.id})">ADD TO BAG</button>
    </div>
  </article>`;
}

function renderProducts(filter="all"){
  const list = filter==="all" ? products : products.filter(p=>p.cat===filter);
  document.getElementById("productGrid").innerHTML = list.map(card).join("");
}
function renderMost(){
  document.getElementById("mostSearched").innerHTML = products.slice(0,5).map(card).join("");
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1});
  saveCart();
  showToast(`${p.name} added to your bag`);
}
function saveCart(){localStorage.setItem("buildo-cart",JSON.stringify(cart));renderCart();updateCount();}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div class="empty"><div style="font-size:45px">🛍️</div><h3>Your bag is empty</h3><p>Start adding little things you love.</p></div>';document.getElementById("cartTotal").textContent="₹0";return;}
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); total+=p.price*item.qty;
    return `<div class="cart-line"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)} × ${item.qty}</small><br><button class="remove" onclick="removeFromCart(${p.id})">Remove</button></div><strong>${money(p.price*item.qty)}</strong></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("backdrop").classList.add("open");renderCart();}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("backdrop").classList.remove("open");}
function openSearch(){document.getElementById("searchOverlay").classList.add("open");setTimeout(()=>document.getElementById("searchInput").focus(),50);}
function closeSearch(){document.getElementById("searchOverlay").classList.remove("open");}
function searchProducts(q){
  q=q.toLowerCase().trim();
  const results=products.filter(p=>p.name.toLowerCase().includes(q)).slice(0,8);
  document.getElementById("searchResults").innerHTML=q ? (results.length?results.map(p=>`<div class="search-result"><span>${p.emoji} ${p.name}</span><span>${money(p.price)}</span></div>`).join(""):"<p>No products found.</p>") : "";
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}
function subscribe(e){e.preventDefault();e.target.reset();showToast("You're on the list ✨");}
function checkout(){
  if(!cart.length){showToast("Your bag is empty");return;}
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open");}
function submitWhatsAppOrder(e){
  e.preventDefault();
  if(!cart.length){showToast("Your bag is empty");closeCheckout();return;}

  const customerName=document.getElementById("customerName").value.trim();
  const customerPhone=document.getElementById("customerPhone").value.trim();
  const customerAddress=document.getElementById("customerAddress").value.trim();

  let total=0;
  const lines=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    const lineTotal=p.price*item.qty;
    total+=lineTotal;
    return `${item.qty} × ${p.name} — ${money(lineTotal)}`;
  });

  const message=[
    "Hi! I'd like to place an order:",
    "",
    "🛍️ ORDER",
    ...lines,
    "",
    `Subtotal: ${money(total)}`,
    "",
    "👤 CUSTOMER DETAILS",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Delivery Address: ${customerAddress}`,
    "",
    "Please confirm my order. Thanks!"
  ].join("\n");

  const whatsappNumber="919876543210";
  const url=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener,noreferrer");
}
function toggleMobileMenu(){document.getElementById("mainNav").classList.toggle("mobile-open");}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderProducts(btn.dataset.filter);
}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();closeCart();closeCheckout();}});
renderProducts();renderMost();renderCart();updateCount();

document.getElementById("checkoutModal").addEventListener("click",e=>{
  if(e.target.id==="checkoutModal") closeCheckout();
});
