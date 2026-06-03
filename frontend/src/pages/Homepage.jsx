//          three sections: Recent, Nearby, and For Rent.
// WHAT IS JSX?
//   JSX is a special syntax used in React. It looks like HTML
//   but it lives inside JavaScript files. React converts it
//   into actual web page elements behind the scenes.
// WHAT IS REACT?
//   React is a JavaScript library that helps you build
//   interactive UIs by breaking them into reusable pieces
//   called "components". Think of components like LEGO bricks.


// ── IMPORT ──────────────────────────────────────────────────
// We import { useState } from "react".
// 'useState' is a React "Hook" — a special function that lets
// a component REMEMBER information and UPDATE the screen when
// that information changes.
//
// Example: when the user clicks a filter button like "Fashion",
// useState remembers that choice so the button turns green.
//
// If you removed this import, filter buttons would still show
// but clicking them wouldn't visually highlight/toggle.
import { useState } from "react";
// ────────────────────────────────────────────────────────────


// ── DATA: products ──────────────────────────────────────────
// This is a plain JavaScript OBJECT that holds all the fake
// product data shown on the page.
//
// An object uses curly braces {}. Inside, we have three
// "keys": recent, nearby, and rent. Each key holds an ARRAY
// (a list, written with []) of product objects.
//
// Each product object has these properties:
//   id        → unique number to identify the product
//   emoji     → the big icon shown in the card image area
//   bg        → background color of the image area (hex code)
//   title     → name of the product
//   price     → price shown in bold (৳ is the Bangladeshi Taka symbol)
//   meta      → small text under the price (time ago, or location)
//   seller    → name of the person selling
//   initials  → 2-letter abbreviation of seller name (for avatar)
//   avatarBg  → background color of the avatar circle
//   avatarColor → text color inside the avatar circle
//   verified  → true/false — whether to show a green ✔ checkmark
//   badge     → text shown in the top-left corner of the card (or null = no badge)
//   badgeClass → CSS class name that sets the badge's color style
//
// ✏️ TO CUSTOMIZE: Change any title, price, emoji, or seller
//    name here and it will instantly update on the page.
const products = {

  // ── recent: products uploaded recently ──
  recent: [
    {
      id: 1,
      emoji: "📱",
      bg: "#E1F5EE",           // light green background
      title: "Samsung S23 FE",
      price: "৳28,500",
      meta: "12 min ago",      // how long ago it was listed
      seller: "Rahim K.",
      initials: "RK",
      avatarBg: "#E1F5EE",
      avatarColor: "#0F6E56",  // dark green text in avatar
      verified: true,          // shows ✔ next to seller name
      badge: "New",            // top-left label on card image
      badgeClass: "badge-new", // links to CSS at the bottom → green style
    },
    {
      id: 2,
      emoji: "👟",
      bg: "#FAEEDA",           // light orange background
      title: "Nike Air Max 97",
      price: "৳4,200",
      meta: "28 min ago",
      seller: "Sabina N.",
      initials: "SN",
      avatarBg: "#FAEEDA",
      avatarColor: "#854F0B",  // dark brown text
      verified: true,
      badge: "Hot",            // red badge — links to badge-hot CSS class
      badgeClass: "badge-hot",
    },
    {
      id: 3,
      emoji: "💻",
      bg: "#E6F1FB",           // light blue background
      title: "MacBook Air M2",
      price: "৳95,000",
      meta: "45 min ago",
      seller: "Tanvir H.",
      initials: "TH",
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",  // dark blue text
      verified: true,
      badge: "New",
      badgeClass: "badge-new",
    },
    {
      id: 4,
      emoji: "🪑",
      bg: "#FBEAF0",           // light pink background
      title: "Office Chair",
      price: "৳3,800",
      meta: "1 hr ago",
      seller: "Mina A.",
      initials: "MA",
      avatarBg: "#FBEAF0",
      avatarColor: "#72243E",  // dark pink/maroon text
      verified: false,         // no ✔ checkmark shown
      badge: null,             // null means NO badge shown
    },
  ],

  // ── nearby: products close to the user's location ──
  nearby: [
    {
      id: 1,
      emoji: "🥗",
      bg: "#E1F5EE",
      title: "Organic Veggies Box",
      price: "৳650",
      meta: "Dhanmondi",       // neighborhood name instead of time
      seller: "Green Farm",
      initials: "GF",
      avatarBg: "#E1F5EE",
      avatarColor: "#0F6E56",
      verified: true,
      badge: "0.4 km",         // distance badge
      badgeClass: "badge-nearby", // blue badge style
    },
    {
      id: 2,
      emoji: "🛋️",
      bg: "#FAEEDA",
      title: "3-Seater Sofa",
      price: "৳14,000",
      meta: "Gulshan",
      seller: "Karim A.",
      initials: "KA",
      avatarBg: "#FAEEDA",
      avatarColor: "#854F0B",
      verified: true,
      badge: "1.1 km",
      badgeClass: "badge-nearby",
    },
    {
      id: 3,
      emoji: "📚",
      bg: "#E6F1FB",
      title: "HSC Books Set",
      price: "৳900",
      meta: "Mirpur",
      seller: "Farhan J.",
      initials: "FJ",
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",
      verified: false,         // unverified seller
      badge: "1.8 km",
      badgeClass: "badge-nearby",
    },
    {
      id: 4,
      emoji: "🚲",
      bg: "#FCEBEB",           // very light red
      title: "Kids Bicycle",
      price: "৳2,200",
      meta: "Banani",
      seller: "Nadia R.",
      initials: "NR",
      avatarBg: "#FCEBEB",
      avatarColor: "#A32D2D",  // dark red text
      verified: true,
      badge: "2.0 km",
      badgeClass: "badge-nearby",
    },
  ],

  // ── rent: products available to rent (not buy) ──
  rent: [
    {
      id: 1,
      emoji: "📷",
      bg: "#FAEEDA",
      title: "Canon DSLR Kit",
      price: "৳1,200/day",     // price per day instead of a flat price
      meta: "Min. 1 day",      // minimum rental period
      seller: "Photo Studio",
      initials: "PS",
      avatarBg: "#FAEEDA",
      avatarColor: "#854F0B",
      verified: true,
      // Note: no badge/badgeClass here — the badge is added
      // programmatically in the JSX below when rendering rent cards
    },
    {
      id: 2,
      emoji: "🎪",
      bg: "#E6F1FB",
      title: "Event Tent 10×10",
      price: "৳3,500/day",
      meta: "Min. 1 day",
      seller: "Event Rentals",
      initials: "ER",
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",
      verified: true,
    },
    {
      id: 3,
      emoji: "🔧",
      bg: "#EAF3DE",           // very light green
      title: "Power Drill Set",
      price: "৳400/day",
      meta: "Min. 2 days",
      seller: "Tool Trade",
      initials: "TT",
      avatarBg: "#EAF3DE",
      avatarColor: "#3B6D11",  // dark olive green
      verified: false,
    },
    {
      id: 4,
      emoji: "🎸",
      bg: "#FBEAF0",
      title: "Acoustic Guitar",
      price: "৳350/day",
      meta: "Min. 3 days",
      seller: "Music Buddy",
      initials: "MB",
      avatarBg: "#FBEAF0",
      avatarColor: "#72243E",
      verified: true,
    },
  ],
};
// ────────────────────────────────────────────────────────────


// ── FILTER LABEL ARRAYS ──────────────────────────────────────
// These are simple arrays (lists) of strings.
// They define what text appears on the filter chips/buttons
// above each product grid section.
//
// ✏️ TO ADD A FILTER: Add a new string to any array, e.g.:
//    const recentFilters = ["Latest", "Electronics", "Toys"];
//    A new "Toys" button will appear. (It won't filter data
//    yet — that logic would need to be added separately.)
//
// ✏️ TO REMOVE A FILTER: Delete a string from the array.
const recentFilters = ["Latest", "Electronics", "Fashion", "Home & Garden", "Books"];
const nearbyFilters = ["≤ 2 km", "≤ 5 km", "≤ 10 km", "Delivery"];
const rentFilters   = ["All", "Per day", "Per week", "Events", "Equipment"];
// ────────────────────────────────────────────────────────────


// ================================================================
// COMPONENT: ProductCard
// ================================================================
// A "component" is a reusable piece of UI — like a template.
// ProductCard renders ONE product card (the white box with
// emoji, title, price, seller info, etc).
//
// It is called multiple times — once per product in the grid —
// with different data each time. This is the power of components:
// write once, reuse everywhere.
//
// PROPS (short for "properties"):
//   Props are the inputs you pass into a component, like function
//   arguments. This component receives:
//
//   item      → the product object (from the `products` data above)
//   metaIcon  → the emoji shown next to the meta text (🕐, 📍, 📅)
//   priceClass → optional CSS class for the price color.
//               Default "" means use the green color.
//               Rent cards pass "text-[#854F0B]" to make it brown.
//
// If you change any prop value, the card updates accordingly.
// ================================================================
function ProductCard({ item, metaIcon, priceClass = "" }) {

  // The component RETURNS JSX — the visual structure to render.
  // 'return' is always followed by a single parent element.
  return (

    // ── Card Container ──
    // This <div> is the white card box.
    // Tailwind CSS classes explain:
    //   bg-white              → white background (light mode)
    //   dark:bg-gray-900      → dark gray in dark mode
    //   border border-gray-100 → thin light gray border
    //   rounded-xl            → rounded corners (xl = quite round)
    //   overflow-hidden       → hides anything sticking outside the rounded corners
    //   cursor-pointer        → shows a hand cursor on hover
    //   hover:-translate-y-0.5 → card lifts up slightly on hover
    //   hover:border-gray-300  → border darkens on hover
    //   transition-all duration-150 → smooth animation over 150 milliseconds
    //
    // ✏️ Change 'rounded-xl' to 'rounded-none' for sharp corners.
    // ✏️ Change 'hover:-translate-y-0.5' to 'hover:-translate-y-2'
    //    to make the card lift higher on hover.
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:border-gray-300 transition-all duration-150">

      {/* ── Image Area ──
          This div shows the colored background + emoji.
          'relative' positioning is needed so the badge can be
          placed absolutely (top-left corner) on top of it.
          'aspect-square' keeps it perfectly square (1:1 ratio).
          'text-4xl' makes the emoji large.
          The background color comes from item.bg (e.g. "#E1F5EE").
          
          ✏️ Change 'aspect-square' to 'aspect-video' for a
             wider, rectangular image area. */}
      <div
        className="relative w-full aspect-square flex items-center justify-center text-4xl"
        style={{ background: item.bg }}
      >
        {/* The product emoji — e.g. 📱, 👟, 💻 */}
        <span>{item.emoji}</span>

        {/* ── Badge (optional top-left label) ──
            This only renders IF item.badge has a value (not null).
            The && operator means: "only show the right side if the
            left side is true". So if item.badge is null, nothing shows.
            
            'absolute top-2 left-2' → sticks it to top-left corner.
            'text-[10px]'           → very small text (10px).
            'rounded-full'          → pill shape.
            item.badgeClass         → e.g. "badge-new" or "badge-hot",
                                      which maps to CSS at the bottom
                                      of the file for colors. */}
        {item.badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
            {item.badge}
          </span>
        )}

        {/* ── Rent Badge ──
            For rent items, this shows a "Rent" label.
            It checks if badgeClass equals "badge-rent" specifically.
            
            ⚠️ NOTE: There's a small bug here — this condition will
            ALSO trigger for rent items when item.badge is already
            set to "badge-rent" above, potentially showing TWO badges.
            In practice, rent items in the data don't have badge set,
            so the first badge block above won't render for them. */}
        {item.badgeClass === "badge-rent" && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full badge-rent">
            Rent
          </span>
        )}
      </div>

      {/* ── Card Body ──
          'px-2.5' → horizontal padding (left & right spacing inside)
          'pt-2'   → top padding
          'pb-2.5' → bottom padding */}
      <div className="px-2.5 pt-2 pb-2.5">

        {/* Product Title
            'text-[13px]'  → 13px font size
            'font-medium'  → medium weight (not bold, not thin)
            'truncate'     → if the title is too long, it shows "..."
            'mb-0.5'       → tiny margin below */}
        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate mb-0.5">
          {item.title}
        </p>

        {/* Price
            Uses 'priceClass' prop if provided, otherwise defaults to
            green 'text-[#1D9E75]'. Rent cards pass brown as priceClass.
            
            ✏️ To change the default price color, change "#1D9E75"
               in the className below to any hex code. */}
        <p className={`font-bold text-[14px] mb-1 ${priceClass || "text-[#1D9E75]"}`}>
          {item.price}
        </p>

        {/* Meta info (time ago or location)
            'flex items-center gap-1' → places emoji and text side by side
                                        with a small gap between them.
            metaIcon is the emoji passed as a prop (🕐, 📍, 📅) */}
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <span>{metaIcon}</span> {item.meta}
        </p>

        {/* ── Seller Row ──
            Shows avatar circle, seller name, and optionally ✔.
            'mt-1.5 pt-1.5 border-t' → adds a thin line above
                                        to visually separate this row.
            'flex items-center gap-1.5' → lays items horizontally
                                           with small spacing. */}
        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-800">

          {/* Avatar Circle
              A tiny circle showing the seller's initials.
              'w-4 h-4'       → 16px × 16px size
              'rounded-full'  → makes the div a perfect circle
              'flex-shrink-0' → prevents it from squishing if text is long
              Background and text color come from item.avatarBg/avatarColor.
              
              ✏️ Change 'w-4 h-4' to 'w-6 h-6' for a bigger avatar. */}
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
            style={{ background: item.avatarBg, color: item.avatarColor }}
          >
            {item.initials}
          </div>

          {/* Seller Name
              'truncate' → adds "..." if name is too long
              'text-gray-500' → muted gray color */}
          <span className="text-[11px] text-gray-500 truncate">{item.seller}</span>

          {/* Verified Badge ✔
              Only renders if item.verified === true.
              'ml-auto' pushes it to the far right of the row.
              Remove this block to hide the checkmark entirely. */}
          {item.verified && (
            <span className="ml-auto text-[#1D9E75] text-[11px] flex-shrink-0" title="Verified seller">
              ✔
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


// ================================================================
// COMPONENT: FilterChips
// ================================================================
// Renders a row of small clickable pill-shaped buttons (chips).
// Used above each product grid to let users filter by category,
// distance, or rental period.
//
// PROPS:
//   filters  → array of strings, e.g. ["Latest", "Electronics", ...]
//   active   → string of the currently selected filter (highlighted green)
//   onSelect → function to call when user clicks a chip.
//              It receives the clicked filter string as argument.
//
// HOW IT WORKS:
//   It loops over the `filters` array using .map() and renders
//   one <button> per item. The active filter gets a green style;
//   all others get a white/outlined style.
// ================================================================
function FilterChips({ filters, active, onSelect }) {
  return (

    // Wrapper div: flex layout, small gaps between chips, wraps to next
    // line if there's not enough space ('flex-wrap'), small margin below.
    <div className="flex gap-1.5 flex-wrap mb-3">

      {/* .map() loops over the filters array.
          For each filter string 'f', it creates a <button>.
          'key={f}' is required by React to track items in lists
          — always provide a unique key when mapping over arrays. */}
      {filters.map((f) => (
        <button
          key={f}

          // When clicked, call onSelect with the filter string.
          // This updates the parent component's state (see useState below).
          onClick={() => onSelect(f)}

          // Conditional styling:
          // If this chip IS the active/selected one → green background
          // If it's NOT active → white/outlined, turns gray on hover
          //
          // The backtick string uses a TERNARY: condition ? ifTrue : ifFalse
          // ✏️ Change 'bg-[#1D9E75]' to any color for the active chip color.
          className={`text-xs px-3 py-1 rounded-full border transition-all duration-100 font-medium ${
            active === f
              ? "bg-[#1D9E75] text-white border-[#1D9E75]"    // selected style
              : "bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400" // unselected style
          }`}
        >
          {f}  {/* The filter label text, e.g. "Electronics" */}
        </button>
      ))}
    </div>
  );
}


// ================================================================
// COMPONENT: MarketplaceHomepage  (THE MAIN / DEFAULT COMPONENT)
// ================================================================
// This is the ROOT component — the one that renders the entire page.
// It includes the header, hero section, and all three product sections.
//
// 'export default' means this is the component that gets used when
// another file imports from this file. It's the "main export".
//
// Think of it as the outermost container that holds everything together.
// ================================================================
export default function MarketplaceHomepage() {

  // ── STATE with useState ──────────────────────────────────────
  // useState lets the component "remember" which filter is selected.
  //
  // Syntax:  const [value, setValue] = useState(initialValue);
  //   value      → the current value (read this to know what's selected)
  //   setValue   → a function to UPDATE the value (calling it re-renders the UI)
  //   initialValue → the starting value when the page first loads
  //
  // We have THREE separate states, one for each section's filter chips.
  //
  // Example flow:
  //   1. User clicks "Electronics" chip in Recent section.
  //   2. onClick calls setRecentFilter("Electronics").
  //   3. recentFilter is now "Electronics".
  //   4. React re-renders FilterChips with active="Electronics".
  //   5. "Electronics" chip gets the green style.
  //
  // ✏️ Change "Latest" to any other filter string to make a
  //    different chip pre-selected when the page loads.
  const [recentFilter, setRecentFilter] = useState("Latest");   // for Recent section
  const [nearbyFilter, setNearbyFilter] = useState("≤ 2 km");   // for Nearby section
  const [rentFilter,   setRentFilter]   = useState("All");      // for Rent section
  // ────────────────────────────────────────────────────────────

  // The component returns the full page HTML structure.
  return (

    // ── Page Wrapper ──
    // 'min-h-screen' → at least as tall as the browser window
    // 'bg-gray-50'   → very light gray page background
    // 'font-sans'    → uses the system's default sans-serif font
    //
    // ✏️ Change 'bg-gray-50' to 'bg-white' for a pure white background.
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">


      {/* ============================================================
          SECTION: Header / Navigation Bar
          ============================================================
          'sticky top-0 z-50' → the header sticks to the top of the
                                 screen as you scroll down. z-50 keeps
                                 it above all other content.
          'h-14'              → fixed height of 56px (14 × 4px = 56px
                                 in Tailwind's spacing scale)
          'px-6'              → 24px padding on left and right
          'border-b'          → thin line below the header
          'flex items-center justify-between' → horizontally lays out
                                 logo and nav, with space between them
          
          ✏️ Change 'h-14' to 'h-20' to make the header taller. */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between h-14">

        {/* ── Logo ──
            'font-extrabold text-xl tracking-tight' → bold, large, tight spacing.
            fontFamily 'Syne' is a custom Google Font loaded in the <style> below.
            
            The logo is split into two <span> elements:
              "Bazaar" in dark/black
              "Hub" in green
            The animated green dot (animate-pulse) blinks slowly.
            
            ✏️ Change "Bazaar" and "Hub" to rename the brand.
            ✏️ Remove 'animate-pulse' to stop the dot from blinking. */}
        <div
          className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#1D9E75] inline-block animate-pulse" /> {/* pulsing dot */}
          <span className="text-gray-900 dark:text-white">Bazaar</span>
          <span className="text-[#1D9E75]">Hub</span>  {/* green part */}
        </div>

        {/* ── Nav Buttons ──
            Three buttons: Wishlist (♡), Notifications (🔔), and Sell.
            They use 'flex items-center gap-2' to sit side by side.
            
            The "+ Sell" button has a filled green background, making
            it the primary call-to-action button.
            
            ✏️ Change '+ Sell' text to 'List Item' or anything else.
            ✏️ Change the bg color of Sell button by editing '#1D9E75'. */}
        <nav className="flex items-center gap-2">
          <button className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            ♡
          </button>
          <button className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            🔔
          </button>
          <button className="text-sm px-4 py-1.5 rounded-lg bg-[#1D9E75] text-white font-medium hover:bg-[#0F6E56] transition">
            + Sell  {/* hover darkens to #0F6E56 — a darker green */}
          </button>
        </nav>
      </header>


      {/* ============================================================
          SECTION: Hero  (the big intro area below the header)
          ============================================================
          This is the first thing users see. It contains:
            - A small badge/pill at the top ("Zero commission")
            - A large headline
            - A subtitle paragraph
            - A search bar + Nearby button
            - Stats row at the bottom
          
          'py-10' → 40px padding top and bottom (breathing room)
          'max-w-2xl mx-auto' → limits content width to ~672px and
                                 centers it horizontally on wide screens */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-10">
        <div className="max-w-2xl mx-auto">

          {/* ── Top Badge / Pill ──
              A small decorative label highlighting the value proposition.
              'inline-flex' → shrinks to fit its content (doesn't stretch full width)
              'uppercase tracking-widest' → ALL CAPS with wide letter spacing
              'px-3 py-1 rounded-full' → pill shape
              The color is set inline via style prop (light green bg, dark green text).
              
              ✏️ Change the text "Zero commission · Keep 100% of sales" to
                 your own tagline. The · is a centered dot separator. */}
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "#E1F5EE", color: "#0F6E56" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse inline-block" />
            Zero commission · Keep 100% of sales
          </div>

          {/* ── Main Headline ──
              Large bold heading.
              'text-[32px]' → 32px font size (change number to resize)
              'leading-tight' → compact line height for multi-line headings
              '<br />' forces a line break between "marketplace," and the
              green "no middleman" span.
              
              ✏️ Edit the text to change the headline.
              ✏️ Change 'text-[32px]' to 'text-[48px]' for a bigger headline. */}
          <h1
            className="text-[32px] font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Your local marketplace,<br />
            <span className="text-[#1D9E75]">no middleman</span> fees.  {/* highlighted green words */}
          </h1>

          {/* ── Subtitle Paragraph ──
              Lighter weight description text below the headline.
              'font-light' → thin/light font weight
              'max-w-lg'   → limits to ~512px wide so it doesn't stretch
                             too wide and become hard to read.
              
              ✏️ Edit this text to change the description. */}
          <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-5 font-light">
            Buy and sell products directly with people in your community. Verified sellers, secure payments, and real-time delivery tracking — all in one place.
          </p>

          {/* ── Search Bar Row ──
              'flex gap-2' → search input and Nearby button sit side by side.
              
              The search input lives inside a styled div (not a plain <input>).
              This lets us add an icon before it.
              'flex-1' on the outer div means it takes all available width,
              pushing the Nearby button to the right. */}
          <div className="flex gap-2">

            {/* Search Input Container
                'bg-gray-50' → slightly off-white background inside
                'h-11' → 44px tall
                'rounded-xl' → rounded corners */}
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 h-11">
              <span className="text-gray-400">🔍</span>  {/* search icon */}

              {/* Actual text input field
                  'bg-transparent' → no background (inherits from parent div)
                  'border-none outline-none' → removes default input borders
                  'placeholder-gray-400' → placeholder text color
                  
                  ✏️ Change 'placeholder' to change the hint text. */}
              <input
                type="text"
                placeholder="Search products, categories..."
                className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 flex-1"
              />
            </div>

            {/* Nearby Button
                'whitespace-nowrap' → prevents "📍 Nearby" from wrapping
                                      to two lines on small screens.
                ✏️ Change '📍 Nearby' to any emoji+text. */}
            <button className="h-11 px-5 bg-[#1D9E75] text-white rounded-xl text-sm font-medium hover:bg-[#0F6E56] transition whitespace-nowrap">
              📍 Nearby
            </button>
          </div>

          {/* ── Stats Row ──
              Three small statistics shown horizontally.
              Uses .map() to loop over an array of [number, label] pairs.
              
              Each pair is destructured: [num, label]
                num   → the bold number, e.g. "24,800+"
                label → the description, e.g. "active listings"
              'i' is the loop index used as the 'key' prop for React.
              
              ✏️ Edit the numbers and labels to update the stats.
              ✏️ Add more items to the array to add more stats. */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5">
            {[
              ["24,800+", "active listings"],
              ["6,200",   "verified sellers"],
              ["3.2 km",  "avg. delivery radius"],
            ].map(([num, label], i) => (
              <span key={i} className="text-sm text-gray-400 flex items-center gap-1">
                <strong className="text-gray-700 dark:text-gray-200 font-medium">{num}</strong> {label}
              </span>
            ))}
          </div>

        </div>
      </section>


      {/* ============================================================
          BODY: The three product grid sections
          ============================================================
          'max-w-2xl mx-auto' → centered, max width ~672px
          'px-6 pb-16'        → horizontal padding + bottom padding */}
      <div className="max-w-2xl mx-auto px-6 pb-16">


        {/* ==========================================================
            SECTION: Recent Uploads
            ========================================================== */}
        <section className="mt-8">  {/* mt-8 = 32px top margin, spacing from hero */}

          {/* ── Section Header Row ──
              Contains the section title on the left and "See all →" on the right.
              'justify-between' pushes title left and button right. */}
          <div className="flex items-center justify-between mb-3.5">

            {/* Section Title with Icon
                The colored square icon is a small div with an emoji inside.
                'w-7 h-7 rounded-lg' → 28×28px square with slightly rounded corners.
                Color comes from inline style — light green bg, dark green icon.
                
                ✏️ Change the emoji 🕐 to change the icon.
                ✏️ Change background/color values to recolor the icon box. */}
            <h2
              className="flex items-center gap-2 text-[17px] font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#E1F5EE", color: "#0F6E56" }}
              >
                🕐
              </span>
              Recent uploads
            </h2>

            {/* "See all" Link-style Button
                Looks like a text link (no border/background).
                ✏️ Add an onClick handler here to navigate to a full list page. */}
            <button className="text-sm text-[#1D9E75] font-medium flex items-center gap-1 hover:underline">
              See all →
            </button>
          </div>

          {/* Filter Chips for the Recent section
              - filters → the list of chip labels
              - active  → which chip is currently green (recentFilter state)
              - onSelect → when clicked, updates recentFilter state via setRecentFilter */}
          <FilterChips
            filters={recentFilters}
            active={recentFilter}
            onSelect={setRecentFilter}
          />

          {/* Product Grid
              'grid grid-cols-2' → 2 columns on mobile
              'sm:grid-cols-4'   → 4 columns on screens ≥ 640px wide (tablets+)
              'gap-2.5'          → 10px gap between grid cells
              
              ✏️ Change 'grid-cols-2' to 'grid-cols-3' for 3 columns on mobile.
              ✏️ Change 'gap-2.5' to 'gap-4' for larger gaps between cards. */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">

            {/* Loop over products.recent array and render one ProductCard per item.
                'key={item.id}' → required by React for list rendering efficiency.
                metaIcon="🕐"  → clock icon shown next to the time-ago text. */}
            {products.recent.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                metaIcon="🕐"
              />
            ))}
          </div>
        </section>


        {/* ==========================================================
            SECTION: Nearby Products
            ========================================================== */}
        <section className="mt-8">

          <div className="flex items-center justify-between mb-3.5">
            {/* Section title — blue-themed icon box */}
            <h2
              className="flex items-center gap-2 text-[17px] font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#E6F1FB", color: "#185FA5" }}  // light blue, dark blue
              >
                📍
              </span>
              Nearby products
            </h2>
            <button className="text-sm text-[#1D9E75] font-medium flex items-center gap-1 hover:underline">
              See all →
            </button>
          </div>

          {/* Filter chips with distance options.
              nearbyFilter and setNearbyFilter control which is active. */}
          <FilterChips
            filters={nearbyFilters}
            active={nearbyFilter}
            onSelect={setNearbyFilter}
          />

          {/* Product grid — same layout as Recent section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {products.nearby.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                metaIcon="📍"  /* pin icon shown next to neighborhood name */
              />
            ))}
          </div>
        </section>


        {/* ==========================================================
            SECTION: Products for Rent
            ========================================================== */}
        <section className="mt-8">

          <div className="flex items-center justify-between mb-3.5">
            {/* Section title — orange/amber-themed icon box */}
            <h2
              className="flex items-center gap-2 text-[17px] font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#FAEEDA", color: "#854F0B" }}  // light amber, dark brown
              >
                📅
              </span>
              Products for rent
            </h2>
            <button className="text-sm text-[#1D9E75] font-medium flex items-center gap-1 hover:underline">
              See all →
            </button>
          </div>

          {/* Filter chips for rental period */}
          <FilterChips
            filters={rentFilters}
            active={rentFilter}
            onSelect={setRentFilter}
          />

          {/* Product Grid for Rent items
              Notice the spread operator: { ...item, badge: "badge-rent", badgeClass: "badge-rent" }
              
              The SPREAD OPERATOR '...' copies ALL properties from item, then
              OVERRIDES badge and badgeClass with the rent-specific values.
              This is how each rent card gets the amber "Rent" badge on its image,
              without the original data needing to define badge/badgeClass.
              
              priceClass="text-[#854F0B]" → makes the price brown for rent items,
              instead of the default green. This visually distinguishes rent prices. */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {products.rent.map((item) => (
              <ProductCard
                key={item.id}
                item={{ ...item, badge: "badge-rent", badgeClass: "badge-rent" }}
                metaIcon="📅"            // calendar icon
                priceClass="text-[#854F0B]"  // brown price color for rent
              />
            ))}
          </div>
        </section>

      </div>
      {/* end of body div */}


      {/* ============================================================
          GLOBAL STYLES
          ============================================================
          A <style> tag inside JSX injects raw CSS into the page.
          It's placed at the bottom so it applies to the whole component.
          
          @import → loads the "Syne" Google Font from the internet.
                    If you remove this, the font falls back to the
                    browser default. The font-family is referenced
                    in multiple places above via style={{ fontFamily: "'Syne', sans-serif" }}
          
          .badge-new    → light green background, dark green text
          .badge-hot    → light red background, dark red text
          .badge-nearby → light blue background, dark blue text
          .badge-rent   → light amber background, dark brown text
          
          These class names are used in the product data objects above
          (the badgeClass property) to connect data to styling.
          
          ✏️ To change a badge color, edit the background or color value.
          ✏️ To add a new badge type, add a new CSS rule here AND a
             corresponding badgeClass value in the product data. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .badge-new    { background: #E1F5EE; color: #0F6E56; }
        .badge-hot    { background: #FCEBEB; color: #A32D2D; }
        .badge-nearby { background: #E6F1FB; color: #185FA5; }
        .badge-rent   { background: #FAEEDA; color: #854F0B; }
      `}</style>

    </div>
    // end of page wrapper div
  );
}