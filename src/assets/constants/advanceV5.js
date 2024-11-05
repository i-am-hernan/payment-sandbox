let checkoutConfiguration = {};
const checkout = new window.AdyenCheckout(checkoutConfiguration);

let dropinConfiguration = {}
const dropin = checkout.create('dropin', dropinConfiguration).mount('#dropin')