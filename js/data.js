/* data.js
 * Seeds localStorage with initial products and an admin user if not present.
 * Provides helper functions to read/write products/users/orders.
 */

(function(){
  // helper uid
  function uid(){ return 'p_' + Math.random().toString(36).slice(2,9) }

  const seedProducts = [
    {
      id: uid(),
      title: "Classic Silver Watch",
      price: 16921.23,
      category: "Men",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a61a6f3c9c8f4a715d7a3a0f8ebc36f",
      description: "Polished silver case with minimalist face — perfect for everyday elegance."
    },
    {
      id: uid(),
      title: "Leather Chronograph",
      price: 2115.54,
      category: "Men",
      image: "/assests/imgs/Leather Chronograph.webp",
      description: "Genuine leather strap with stopwatch features for classic chronograph functionality."
    },
    {
      id: uid(),
      title: "Sport Digital Watch",
      price: 12693.92,
      category: "Smart",
      image: "/assests/imgs/Sport Digital Watch.avif",
      description: "Water resistant digital display with backlight and stopwatch for active lifestyles."
    },
    {
      id: uid(),
      title: "Luxury Gold Edition",
      price: 42313.08,
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=7f7b63a28d2b3b7f0a5d6f7d2f2a3f4b",
      description: "Gold-plated case and premium materials for a statement piece."
    },
    {
      id: uid(),
      title: "Women Minimal Rose",
      price: 18335.67,
      category: "Women",
      image: "/assests/imgs/Women Minimal Rose.jpeg",
      description: "Soft rose-gold case with a slim strap designed for a refined silhouette."
    },
    {
      id: uid(),
      title: "Hybrid Smart Watch",
      price: 28067.68,
      category: "Smart",
      image: "/assests/imgs/Hybrid Smart Watch.avif",
      description: "Analog look with smart notifications — the best of both worlds."
    },
    //
    {
      id: uid(),
      title: "Titan Quartz Analog Silver Dial Metal Strap Watch",
      price: 7430.00,
      category: "Women",
      image: "assests/imgs/Titan-Quartz-Analog.webp",
      description: "Titan Quartz Analog Watch for Women With Silver Dial Rose Gold Colour Metal Strap."
    },
    {
      id: uid(),
      title: "Titan Raga Viva Champagne Dial Women Watch With Metal Strap",
      price: 10690,
      category: "Women",
      image: "/assests/imgs/Raga viva.webp",
      description: "Titan Raga Viva Quartz Analog Women Watch Champagne Dial With Golden Colour Metal Strap."
    },
    {
      id: uid(),
      title: "Titan Raga I Am Pink Dial Women Watch With Metal Strap",
      price: 43110.00,
      category: "Women",
      image: "/assests/imgs/titan-raga-i-am-pink.webp",
      description: "Titan Raga I Am Quartz Analog Women Watch Pink Dial With Rose Gold Colour Metal Strap."
    },
    {
      id: uid(),
      title: "Versace V-Sporty Greca Green Round Quartz Men Watch",
      price: 124600.00,
      category: "Luxury",
      image: "/assests/imgs/Versace V-Sporty Greca Green .png",
      description: "Designed to suit the preference of urban men, this analog watch watch from the collection by Versace is sure to make a style statement. Secured by a sapphire crystal with anti-reflective coating, the green round dial is protected in a case. It exhibits crown for time adjustment. The stainless steel strap flaunts a multi hue that accentuates the look of the watch. Moreover, it is fitted with a fold-over clasp with double push button safety clasp to ensure a secure fit on the wrist."
    },
    {
      id: uid(),
      title: "Philipp Plein Plein Lady Royal Green Octagonal Quartz Women Watch",
      price: 45497,
      category: "Luxury",
      image: "/assests/imgs/Philipp Plein Plein Lady Royal Green Octagonal Quartz Women Watch.png",
      description: "Designed to suit the preference of urban women, this analog watch from the collection by PHILIPP PLEIN is sure to make a style statement. Secured by a mineral glass, the blue round dial is protected in a case. It exhibits crown for time adjustment. The stainless steel strap flaunts a silver hue that accentuates the look of the watch. Moreover, it is fitted with a fold over clasp with single push button safety clasp to ensure a secure fit on the wrist."
    },
    {
      id: uid(),
      title: "Timex Smart Coregen 1.76inch (4.47 cm) Display with Functional Crown and BT Calling Smartwatch",
      price: 4295 ,
      category: "Luxury",
      image: "/assests/imgs/Timex Smart Coregen  Display with Functional Crown and BT Calling Smartwatch.png",
      description: "The Timex Smart CoreGen smartwatch combines style and toughness. This wristwatch redefines toughness with its elegant 1.76-inch(4.5 cm) screen and alloy metallic casing. The Timex Smart CoreGen offers many features, such as smart notifications, a functional crown, HRM, blood oxygen, an activity tracker, 100+ sports modes, and 100+ watch faces. With the interactive Dafit app, you can keep all the activity data saved on your smartphone."
    }
  ];

  function setIfEmpty(key, value){
    if(!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
  }

  // seed users (admin)
  const seedUsers = [
    { username: "admin", password: "admin123", role: "admin" }
  ];

  setIfEmpty('wg_products', seedProducts);
  setIfEmpty('wg_users', seedUsers);
  setIfEmpty('wg_all_orders', []); // global orders for admin

  // expose uid helper
  window.uid = uid;
})();
