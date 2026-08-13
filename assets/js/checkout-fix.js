
// Replace your existing checkout functions with these:

function checkout(){
  if(!cart.length){ showToast("Your bag is empty"); return; }
  const modal = document.getElementById("checkoutModal");
  if(modal) modal.classList.add("open");
}

function closeCheckout(){
  const modal = document.getElementById("checkoutModal");
  if(modal) modal.classList.remove("open");
}

function submitWhatsAppOrder(e){
  e.preventDefault();

  const customerName=document.getElementById("customerName").value.trim();
  const customerPhone=document.getElementById("customerPhone").value.trim();
  const customerAddress=document.getElementById("customerAddress").value.trim();

  let total=0;
  const lines=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    const lineTotal=p.price*item.qty;
    total+=lineTotal;
    return `${item.qty} × ${p.name} - ₹${lineTotal}`;
  });

  const message = [
    "Hi! I'd like to place an order:",
    "",
    "ORDER",
    ...lines,
    "",
    `Subtotal: ₹${total}`,
    "",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Address: ${customerAddress}`
  ].join("\n");

  const whatsappNumber="919876543210";
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  closeCheckout();
}
