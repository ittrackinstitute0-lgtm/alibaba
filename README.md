# 🏏 Ali Baba Sports - Ultimate Cricket Arena & Admin Portal

ایک جدید، ایڈوانسڈ اور مکمل ریسپانسیو کرکٹ ای کامرس ویب سائٹ بمعہ پروفیشنل ایڈمن پینل۔
(A modern, advanced, and fully responsive Cricket E-Commerce Website with an Admin Dashboard).

---

## 🌟 نمایاں فیچرز (Key Features)

### 🛒 1. Storefront (آن لائن کرکٹ شاپ - `index.html`)
- **Modern Cricket Luxury Theme:** Stadium dark slate `#0b0f19` اور electric neon green `#00e676` کلر تھیم، گلاس مارفزم، اور جدید اینیمیشنز۔
- **High-Performance Cricket Catalog:**
  - **Cricket Bats:** CA Plus 15000 Player Edition, Kookaburra Kahuna Pro, Gray-Nicolls Oblivion Stealth, Sialkot Kashmir Willow.
  - **Leather Balls:** Kookaburra Pink Turf (Test Spec), CA Gold Star Red Match Ball.
  - **Protective Armor:** Shrey Titanium Helmet, CA Plus Shark-Skin Batting Gloves, Gray-Nicolls Legguards.
  - **Kits & Accessories:** Ali Baba Imperial Heavy Duty Wheelie Bag, New Balance Spikes Shoes, Official Pakistan Match Jersey.
- **Interactive Custom Bat Lab (بیٹ کنفیگریٹر):**
  - بیٹسمین اپنے کھیلنے کے انداز (Power Hitter / Classical)، ولو ووڈ (Grade 1+ English / Kashmir)، بیٹ وزن (2.7 lbs, 2.8 lbs, 2.9 lbs)، اور ہینڈل ٹائپ کو اپنی مرضی سے منتخب کر کے کسٹم بیٹ تیار کروا سکتے ہیں۔
- **Live Search & Category Filters:** کسی بھی کیٹیگری کو فلٹر کریں، قیمت، ریٹنگ یا نیو ارائیولز کے مطابق ترتیب دیں۔
- **Quick View Modal:** پروڈکٹ کی مکمل تفصیلات، اناٹومی، گرینز اور سٹاک کی معلومات۔
- **Wishlist & Cart Drawers:** دائیں طرف سے کھلنے والے سمارٹ ڈراورز جن میں پروڈکٹ کو کم/زیادہ کرنے کی سہولت موجود ہے۔
- **Discount Coupons:** پرومو کوڈ باکس:
  - `CRICKET20` (20% فلیٹ ڈسکاؤنٹ)
  - `BABAR56` (Rs. 2,500 کیش ڈسکاؤنٹ)
- **Pakistani Cities Checkout Flow:** نام، فون (واٹس ایپ)، شہر (لاہور، کراچی، اسلام آباد، سیالکوٹ، پشاور، وغیرہ)، پتہ، اور ادائیگی کے طریقے:
  - Cash on Delivery (COD)
  - JazzCash / Easypaisa
  - Direct Online Bank Transfer
- **Live Currency Switcher:** پاکستانی روپے (PKR ₨) اور ڈالرز (USD $) میں لائیو سوئچ۔
- **Instant WhatsApp Integration:** آرڈر کنفرمیشن کے بعد سیالکوٹ ڈسپیچ ٹیم کے ساتھ ایک کلک پر واٹس ایپ چیٹ۔

---

### ⚙️ 2. Admin Panel (ایڈمن کنسول - `admin.html`)
- **Live KPIs Dashboard:**
  - ٹوٹل سیلز / ریونیو (Total Revenue in PKR)
  - کل موصولہ آرڈرز کی تعداد (Total Customer Orders)
  - ایکٹو انوینٹری گئیر (Active Products Count)
  - کم سٹاک الرٹ (Low Stock Warnings < 5 units)
- **Product Management (مکمل CRUD سسٹم):**
  - نیا کرکٹ پروڈکٹ شامل کریں (+ Add Cricket Gear Modal: نام، کیٹیگری، پرائس، سٹاک، امیج، گرینز، وزن، تفصیل)
  - موجودہ پروڈکٹ کی قیمت یا تفصیل ایڈٹ کریں (Edit Product)
  - پروڈکٹ ڈیلیٹ کریں (Delete Product)
- **Order Tracking & Courier Dispatch:**
  - تمام گاہکوں کے موصول شدہ آرڈرز، رابطہ نمبر، ڈلیوری ایڈریس اور پروڈکٹس کی فہرست۔
  - آرڈر سٹیٹس لائیو تبدیل کریں: `Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`۔
  - تفصیلی پرنٹ ایبل انوائس اور پیکنگ سلپ (Print Order Slip)।
- **Real-Time Data Sync:**
  - ایڈمن پینل اور شاپ ایک دوسرے کے ساتھ `localStorage` کے ذریعے فوری ہم آہنگ ہیں؛ یعنی جب آپ ایڈمن پینل میں پروڈکٹ شامل کریں گے، وہ فوراً ویب سائٹ پر ظاہر ہو جائے گا۔ جب کوئی صارف شاپ سے آرڈر کرے گا، وہ فوراً ایڈمن پینل میں آ جائے گا اور سٹاک خودکار طور پر کم ہو جائے گا۔
- **Reset Demo Data:** کسی بھی وقت ڈیفالٹ 12 کرکٹ پروڈکٹس اور سیمپل آرڈرز کو ری سیٹ کرنے کا بٹن۔

---

## 📂 فائل سٹرکچر (File Structure)

```
ali baba/
│
├── index.html              # مین کسٹمر اسٹور فرنٹ (Shopfront Website)
├── admin.html              # مکمل ایڈمن ڈیش بورڈ (Admin Panel)
│
├── css/
│   ├── style.css           # اسٹور فرنٹ کے ماڈرن سٹائلز، ریسپانسیو ڈیزائن اور اینیمیشنز
│   └── admin.css           # ایڈمن پینل کا ڈارک موڈ ڈیش بورڈ ڈیزائن
│
├── js/
│   ├── data.js             # کرکٹ گئیر کا مستند ڈیٹا بیس اور لوکل سٹوریج ہینڈلر
│   ├── app.js              # کارٹ، وش لسٹ، فلٹرز، کسٹم بیٹ لیب، اور چیک آؤٹ لاجک
│   └── admin.js            # ایڈمن پینل کے کے پی آئیز، پروڈکٹ CRUD، اور آرڈر مینجمنٹ
│
└── README.md               # رہنمائی اور دستاویزات
```

---

## 🚀 چلانے کا طریقہ (How to Run & Test)

1. اپنے براؤزر (Chrome, Edge, Firefox, Brave) میں `index.html` پر ڈبل کلک کر کے کھولیں۔
2. ویب سائٹ پر پروڈکٹس براؤز کریں، سرچ بار اور کیٹیگری فلٹرز استعمال کریں۔
3. کسی بھی بیٹ یا سامان کو "Add to Cart" کریں یا "Quick View" میں دیکھیں۔
4. پرومو کوڈ `CRICKET20` درج کر کے ڈسکاؤنٹ حاصل کریں۔
5. "Proceed to Checkout" پر کلک کر کے اپنا نام، شہر اور پتہ لکھ کر آرڈر کنفرم کریں۔
6. ایڈمن پینل دیکھنے کے لیے اوپر دیے گئے **"Admin Panel"** بٹن پر کلک کریں یا براہ راست `admin.html` فائل کھولیں۔
7. ایڈمن پینل میں آپ اپنا نیا موصول شدہ آرڈر، کسٹمر کی تفصیلات، اور سیلز دیکھ سکتے ہیں، اور نیا پروڈکٹ شامل بھی کر سکتے ہیں!
