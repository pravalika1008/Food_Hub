package com.foodhub;

import com.foodhub.entity.*;
import com.foodhub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class FoodHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodHubApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            FoodRepository foodRepository,
            CartRepository cartRepository,
            OrderRepository orderRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() > 0) {
                return; // Database already seeded
            }

            System.out.println(">>> Initializing FoodHub demo database...");

            // 1. Seed Users
            User admin = new User(null, "Admin User", "admin@foodhub.com", passwordEncoder.encode("password123"), "9876543210", "FoodHub HQ, Tech Park", "ADMIN");
            User restaurantOwner = new User(null, "Mario Rossi", "restaurant@foodhub.com", passwordEncoder.encode("password123"), "9876543211", "12 Gourmet Avenue", "RESTAURANT");
            User restaurantOwner2 = new User(null, "Spice Chef Rahul", "spices@foodhub.com", passwordEncoder.encode("password123"), "9876543212", "45 Royal Flavors St", "RESTAURANT");
            User deliveryPerson = new User(null, "John Rider", "delivery@foodhub.com", passwordEncoder.encode("password123"), "9876543213", "Delivery Hub Sector 4", "DELIVERY");
            User customer = new User(null, "Sarah Jenkins", "customer@foodhub.com", passwordEncoder.encode("password123"), "9876543214", "Apt 4B, Sunrise Heights, Metro City", "CUSTOMER");
            User chitti = new User(null, "Chitti", "chitti@gmail.com", passwordEncoder.encode("password123"), "9876543219", "Apt 4B, Sunrise Heights, Metro City", "CUSTOMER");

            userRepository.save(admin);
            restaurantOwner = userRepository.save(restaurantOwner);
            restaurantOwner2 = userRepository.save(restaurantOwner2);
            deliveryPerson = userRepository.save(deliveryPerson);
            customer = userRepository.save(customer);
            chitti = userRepository.save(chitti);

            // Initialize customer carts
            Cart customerCart = new Cart(customer);
            cartRepository.save(customerCart);
            Cart chittiCart = new Cart(chitti);
            cartRepository.save(chittiCart);

            // 2. Seed Restaurants
            Restaurant r1 = new Restaurant(
                    null,
                    "Bella Italia Bistro",
                    "Authentic artisanal stone-baked pizzas, homemade pastas, and Italian desserts.",
                    "12 Little Italy Boulevard, Downtown",
                    "+1 555-0192",
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                    "Italian",
                    restaurantOwner
            );
            r1.setRating(4.8);

            Restaurant r2 = new Restaurant(
                    null,
                    "The Spice Route",
                    "Exquisite royal Indian curries, fragrant biryanis, and tandoori charcoal delicacies.",
                    "45 Royal Plaza, City Center",
                    "+1 555-0193",
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                    "Indian",
                    restaurantOwner2
            );
            r2.setRating(4.9);

            Restaurant r3 = new Restaurant(
                    null,
                    "Burger Craft & Grill",
                    "Gourmet smash burgers, crispy chicken wings, truffle fries, and thick shakes.",
                    "88 Downtown Broadway",
                    "+1 555-0194",
                    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
                    "Fast Food",
                    restaurantOwner
            );
            r3.setRating(4.7);

            Restaurant r4 = new Restaurant(
                    null,
                    "Zen Tokyo Sushi & Ramen",
                    "Fresh hand-rolled sushi, sashimi platters, and traditional Japanese ramen bowls.",
                    "102 Sakura Lane",
                    "+1 555-0195",
                    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
                    "Japanese",
                    restaurantOwner2
            );
            r4.setRating(4.8);

            Restaurant r5 = new Restaurant(
                    null,
                    "Wok & Roll Asian Express",
                    "Authentic sizzling wok noodles, steaming dim sums, and spicy Schezwan specialties.",
                    "55 Lotus Street, Chinatown",
                    "+1 555-0196",
                    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
                    "Chinese",
                    restaurantOwner
            );
            r5.setRating(4.6);

            Restaurant r6 = new Restaurant(
                    null,
                    "Taco Fiesta Mexicana",
                    "Sizzling fajitas, loaded street tacos, cheesy quesadillas, and zesty fresh guacamole.",
                    "73 Jalisco Drive, Westside",
                    "+1 555-0197",
                    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
                    "Mexican",
                    restaurantOwner2
            );
            r6.setRating(4.7);

            Restaurant r7 = new Restaurant(
                    null,
                    "Green Bowl Healthy Café",
                    "Fresh organic superfood grain bowls, Mediterranean crisp salads, and chilled cold-press juices.",
                    "19 Oasis Boulevard, Green Park",
                    "+1 555-0198",
                    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
                    "Healthy",
                    restaurantOwner
            );
            r7.setRating(4.9);

            Restaurant r8 = new Restaurant(
                    null,
                    "Dakshin Delight Café",
                    "Golden crispy dosas, fluffy steamed idlis, hot sambar, and authentic filter kaapi.",
                    "34 Temple Bell Road, South Extension",
                    "+1 555-0199",
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
                    "South Indian",
                    restaurantOwner2
            );
            r8.setRating(4.8);

            Restaurant r9 = new Restaurant(
                    null,
                    "Sweet Treat Patisserie & Bakery",
                    "Handcrafted artisan waffles, decadent chocolate lava cakes, French pastries, and specialty coffees.",
                    "8 Baker Street, Promenade",
                    "+1 555-0200",
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                    "Desserts",
                    restaurantOwner
            );
            r9.setRating(4.9);

            Restaurant r10 = new Restaurant(
                    null,
                    "Madras Chettinad Tiffin Room",
                    "Authentic Chettinad spices, fluffy Appams with Stew, Kuzhi Paniyaram, and fiery Madurai Kari Dosa.",
                    "56 Temple Tree Lane, Little Chennai",
                    "+1 555-0201",
                    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
                    "South Indian",
                    restaurantOwner2
            );
            r10.setRating(4.9);

            Restaurant r11 = new Restaurant(
                    null,
                    "Udupi Sri Krishna Bhavan",
                    "Pure vegetarian Udupi heritage kitchen serving golden Rava Masala Dosa, Thatte Idli, Mangalore Buns, and Payasam.",
                    "108 Brahmin Street, Temple Square",
                    "+1 555-0202",
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
                    "South Indian",
                    restaurantOwner
            );
            r11.setRating(4.8);

            Restaurant r12 = new Restaurant(
                    null,
                    "Malabar Coastal Kitchen",
                    "Kerala coastal flavors featuring Malabar Dum Biryani, Flaky Parotta with Curry, Kerala Fish Moilee, and Coconut Stew.",
                    "22 Coconut Grove, Waterfront Road",
                    "+1 555-0203",
                    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                    "South Indian",
                    restaurantOwner2
            );
            r12.setRating(4.9);

            r1 = restaurantRepository.save(r1);
            r2 = restaurantRepository.save(r2);
            r3 = restaurantRepository.save(r3);
            r4 = restaurantRepository.save(r4);
            r5 = restaurantRepository.save(r5);
            r6 = restaurantRepository.save(r6);
            r7 = restaurantRepository.save(r7);
            r8 = restaurantRepository.save(r8);
            r9 = restaurantRepository.save(r9);
            r10 = restaurantRepository.save(r10);
            r11 = restaurantRepository.save(r11);
            r12 = restaurantRepository.save(r12);

            // 3. Seed Foods (Reasonable & Balanced Prices)
            List<Food> foods = new ArrayList<>();

            // Bella Italia Foods
            Food f1 = new Food(null, "Margherita Con Bufala", "San Marzano tomatoes, fresh buffalo mozzarella, fresh basil, and extra virgin olive oil.", 249.0, "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80", "Pizza", true, r1);
            Food f2 = new Food(null, "Truffle Fettuccine Alfredo", "Handmade egg pasta tossed in creamy parmesan sauce infused with black winter truffle.", 279.0, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80", "Pasta", true, r1);
            Food f3 = new Food(null, "Four Cheese Woodfire Pizza", "Thin crust loaded with mozzarella, gorgonzola, parmesan, and ricotta.", 299.0, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", "Pizza", true, r1);
            Food f4 = new Food(null, "Creamy Basil Pesto Penne", "Penne tossed in fragrant basil pesto, sun-dried tomatoes, pine nuts, and parmesan.", 229.0, "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80", "Pasta", true, r1);
            Food f5 = new Food(null, "Garlic Rosemary Focaccia", "Freshly baked Italian flatbread drizzled with roasted garlic oil and herbs.", 119.0, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80", "Sides", true, r1);
            Food f6 = new Food(null, "Classic Tiramisu", "Layered espresso-soaked ladyfingers with whipped mascarpone cream and cocoa.", 169.0, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", "Desserts", true, r1);

            // Spice Route Foods
            Food f7 = new Food(null, "Dum Hyderabadi Chicken Biryani", "Fragrant long-grain basmati rice cooked with spiced tender chicken and saffron.", 249.0, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", "Biryani", true, r2);
            Food f8 = new Food(null, "Butter Chicken Masala", "Tender clay-oven grilled chicken in rich, velvety tomato and cashew butter gravy.", 269.0, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80", "Curry", true, r2);
            Food f9 = new Food(null, "Paneer Butter Masala", "Soft cottage cheese cubes in rich tomato, cream, and butter sauce.", 219.0, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80", "Curry", true, r2);
            Food f10 = new Food(null, "Dal Makhani Amritsari", "Slow-cooked black lentils simmered with churned butter and fresh cream.", 189.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80", "Curry", true, r2);
            Food f11 = new Food(null, "Garlic Butter Naan (2 pcs)", "Soft tandoor-baked leavened bread brushed with melted butter and fresh minced garlic.", 69.0, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80", "Bread", true, r2);
            Food f12 = new Food(null, "Gulab Jamun with Rabri (2 pcs)", "Warm milk dumplings in cardamom syrup served with creamy reduced milk rabri.", 99.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", "Desserts", true, r2);

            // Burger Craft Foods
            Food f13 = new Food(null, "Classic Smash Cheeseburger", "Juicy seasoned patty, melted cheddar, crisp lettuce, pickles, and signature house sauce.", 179.0, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", "Burgers", true, r3);
            Food f14 = new Food(null, "Smoked BBQ Bacon Burger", "Prime beef patty topped with smoky barbecue sauce, crispy bacon, and caramelized onions.", 219.0, "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80", "Burgers", true, r3);
            Food f15 = new Food(null, "Crispy Truffle Parmesan Fries", "Golden crinkle-cut fries tossed with white truffle oil, grated parmesan, and rosemary.", 119.0, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", "Sides", true, r3);
            Food f16 = new Food(null, "Peri Peri Crispy Wings (6 pcs)", "Double-fried crunchy wings dusted with zesty peri-peri spice blend and herb dip.", 189.0, "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80", "Sides", true, r3);
            Food f17 = new Food(null, "Loaded Mexican Nachos", "Crunchy tortilla chips layered with warm melted cheese, salsa, and jalapeños.", 149.0, "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80", "Sides", true, r3);
            Food f18 = new Food(null, "Salted Caramel Thickshake", "Rich artisanal vanilla ice cream blended with homemade salted butter caramel.", 129.0, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", "Beverages", true, r3);

            // Zen Tokyo Sushi & Ramen Foods
            Food f19 = new Food(null, "Salmon Dragon Roll (8 pcs)", "Fresh Norwegian salmon, avocado, cucumber, unagi glaze, and orange tobiko.", 299.0, "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80", "Sushi", true, r4);
            Food f20 = new Food(null, "Tokyo Tonkotsu Ramen", "Rich 16-hour simmered pork broth with fresh springy noodles, chashu, and soft-boiled egg.", 279.0, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80", "Ramen", true, r4);
            Food f21 = new Food(null, "Crispy Chicken Katsu Curry", "Panko-crusted chicken cutlet served with aromatic Japanese golden curry and rice.", 259.0, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80", "Curry", true, r4);
            Food f22 = new Food(null, "Steamed Veg Gyoza (6 pcs)", "Pan-seared Japanese dumplings stuffed with minced vegetables and soy dipping sauce.", 159.0, "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80", "Sides", true, r4);
            Food f23 = new Food(null, "Matcha Green Tea Shake", "Premium ceremonial Japanese green tea whipped with chilled milk and cream.", 139.0, "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80", "Beverages", true, r4);

            // Wok & Roll Asian Express Foods
            Food f24 = new Food(null, "Schezwan Hakka Noodles", "Wok-tossed noodles with colorful bell peppers, cabbage, scallions, and spicy sauce.", 149.0, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80", "Noodles", true, r5);
            Food f25 = new Food(null, "Chilli Garlic Paneer Dry", "Crispy paneer cubes tossed with roasted garlic, fresh chilies, and scallions.", 179.0, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80", "Sides", true, r5);
            Food f26 = new Food(null, "Chicken Manchurian with Fried Rice", "Savory chicken meatballs in dark soya gravy served alongside classic egg fried rice.", 229.0, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80", "Rice", true, r5);
            Food f27 = new Food(null, "Steamed Chicken Dim Sums (6 pcs)", "Translucent dumplings stuffed with minced chicken, spring onions, and garlic dip.", 169.0, "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80", "Sides", true, r5);
            Food f28 = new Food(null, "Crispy Veg Spring Rolls (4 pcs)", "Golden fried rolls stuffed with seasoned shredded vegetables and sweet chilli sauce.", 129.0, "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=600&q=80", "Sides", true, r5);

            // Taco Fiesta Mexicana Foods
            Food f29 = new Food(null, "Loaded Street Tacos (3 pcs)", "Crispy corn shells stuffed with seasoned beans, lettuce, pico de gallo, and cheddar.", 159.0, "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80", "Tacos", true, r6);
            Food f30 = new Food(null, "Grilled Chicken Burrito Bowl", "Cilantro-lime rice, black beans, grilled spiced chicken, corn salsa, and sour cream.", 239.0, "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80", "Bowls", true, r6);
            Food f31 = new Food(null, "Cheesy Jalapeño Quesadilla", "Toasted folded tortilla loaded with melted cheese, grilled peppers, and jalapeños.", 179.0, "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=600&q=80", "Tacos", true, r6);
            Food f32 = new Food(null, "Tortilla Chips with Fresh Guacamole", "Crisp golden tortilla chips served with zesty avocado and lime guacamole.", 139.0, "https://images.unsplash.com/photo-1541256942802-7b2996802927?auto=format&fit=crop&w=600&q=80", "Sides", true, r6);
            Food f33 = new Food(null, "Cinnamon Sugar Churros (4 pcs)", "Crispy fried dough pastry rolled in cinnamon sugar, served with chocolate dip.", 119.0, "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=600&q=80", "Desserts", true, r6);

            // Green Bowl Healthy Café Foods
            Food f34 = new Food(null, "Avocado & Quinoa Power Bowl", "Tri-color quinoa, sliced ripe avocado, edamame, cherry tomatoes, and lemon tahini dressing.", 219.0, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80", "Healthy", true, r7);
            Food f35 = new Food(null, "Mediterranean Greek Salad", "Crisp romaine lettuce, cucumber, kalamata olives, bell peppers, and feta cheese.", 179.0, "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80", "Salads", true, r7);
            Food f36 = new Food(null, "Grilled Chicken Caesar Salad", "Herb grilled chicken, shaved parmesan cheese, garlic croutons, and caesar dressing.", 229.0, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80", "Salads", true, r7);
            Food f37 = new Food(null, "Wild Berry Acai Smoothie", "Pure Brazilian acai blended with strawberries, blueberries, chia seeds, and almond milk.", 149.0, "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80", "Beverages", true, r7);
            Food f38 = new Food(null, "Hummus Platter with Warm Pita", "Silky olive oil hummus served with toasted whole wheat pita wedges and olives.", 139.0, "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80", "Sides", true, r7);

            // Dakshin Delight Café Foods
            Food f39 = new Food(null, "Mysore Masala Dosa", "Crispy fermented rice-lentil crepe with spicy red chutney and spiced potato filling.", 119.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f40 = new Food(null, "Steamed Idli & Vada Combo", "Two steamed fluffy idlis and one crispy medu vada served with three fresh chutneys.", 89.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f41 = new Food(null, "Ghee Podi Roast Dosa", "Thin crepe roasted in pure clarified butter and spicy aromatic podi powder.", 139.0, "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f42 = new Food(null, "Crispy Medu Vada (2 pcs)", "Golden fried lentil donuts with a crunchy crust and fluffy center with sambar.", 69.0, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f43 = new Food(null, "Traditional Filter Kaapi", "Strong chicory-infused frothed coffee brewed with rich hot milk.", 49.0, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", "Beverages", true, r8);
            Food f49 = new Food(null, "Paper Ghee Roast Dosa", "Oversized ultra-thin crispy golden dosa brushed with aromatic pure ghee, served with 3 chutneys & sambar.", 159.0, "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f50 = new Food(null, "Karnataka Thatte Idli (2 pcs)", "Plate-sized ultra-soft steamed rice cakes topped with melting butter and fiery gunpowder podi.", 99.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f51 = new Food(null, "Onion Uttapam with Podi", "Thick savory fermented rice pancake generously topped with caramelized onions, coriander, and spices.", 129.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f52 = new Food(null, "Bisi Bele Bath with Boondi", "Traditional Karnataka spicy rice-lentil stew simmered with seasonal veggies, tamarind, and ghee.", 139.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80", "South Indian", true, r8);
            Food f53 = new Food(null, "Saffron Pineapple Kesari Bath", "Rich semolina dessert slowly cooked in pure ghee, saffron threads, pineapple chunks, and cashews.", 89.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", "Desserts", true, r8);

            // Sweet Treat Patisserie Foods
            Food f44 = new Food(null, "Belgian Dark Chocolate Waffle", "Warm crisp waffle topped with rich Belgian chocolate ganache and cocoa nibs.", 149.0, "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80", "Desserts", true, r9);
            Food f45 = new Food(null, "New York Blueberry Cheesecake", "Velvety dense cream cheese slice topped with sweet tart blueberry compote.", 179.0, "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", "Desserts", true, r9);
            Food f46 = new Food(null, "Molten Choco Lava Cake", "Warm chocolate cake with a luscious molten dark chocolate center.", 129.0, "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", "Desserts", true, r9);
            Food f47 = new Food(null, "Caramel Macchiato Coffee", "Freshly brewed espresso with steamed milk, vanilla essence, and caramel drizzle.", 119.0, "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80", "Beverages", true, r9);
            Food f48 = new Food(null, "Red Velvet Cream Cheese Cupcake", "Soft scarlet sponge with rich cream cheese frosting.", 89.0, "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80", "Desserts", true, r9);

            // Madras Chettinad Tiffin Room Foods
            Food f54 = new Food(null, "Chettinad Kozhi Biryani", "Aromatic seeraga samba rice infused with stone-ground 18 Chettinad spices, tender country chicken, and boiled egg.", 279.0, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", "Biryani", true, r10);
            Food f55 = new Food(null, "Madurai Mutton Kari Dosa", "Fluffy thick Kal Dosa layered with spicy egg omelette and succulent minced mutton keema gravy.", 269.0, "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", "South Indian", true, r10);
            Food f56 = new Food(null, "Chettinad Pepper Chicken Fry", "Tender chicken morsels pan-roasted with freshly cracked Tellicherry black pepper, curry leaves, and shallots.", 229.0, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80", "Sides", true, r10);
            Food f57 = new Food(null, "Crispy Kuzhi Paniyaram (7 pcs)", "Crispy outer crust with soft fluffy dumplings tempered with mustard, curry leaves, and spicy kara chutney.", 119.0, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80", "South Indian", true, r10);
            Food f58 = new Food(null, "Appam with Vegetable Stew (2 pcs)", "Lacy fermented rice bowl-hoppers with spongy centers served with fragrant coconut milk vegetable stew.", 149.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", "South Indian", true, r10);

            // Udupi Sri Krishna Bhavan Foods
            Food f59 = new Food(null, "Crispy Udupi Rava Masala Dosa", "Lacy, crunchy roasted semolina crepe filled with spiced potato onion bhaji, served with coconut chutney.", 139.0, "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", "South Indian", true, r11);
            Food f60 = new Food(null, "Mangalore Banana Buns (2 pcs)", "Sweet, mildly spiced fluffy deep-fried bread made with ripe bananas and cumin, served with coconut chutney.", 89.0, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80", "South Indian", true, r11);
            Food f61 = new Food(null, "Temple Style Curd Rice (Thayir Sadam)", "Creamy comforting rice blended with fresh yogurt, tempered with mustard, ginger, curry leaves, and pomegranate.", 109.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80", "Rice", true, r11);
            Food f62 = new Food(null, "Andhra Pesarattu with Upma", "Nutritious whole green gram moong dal crepe stuffed with savory semolina upma, served with allam (ginger) chutney.", 149.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", "South Indian", true, r11);
            Food f63 = new Food(null, "Elaneer Payasam (Tender Coconut Kheer)", "Sublime, refreshing chilled dessert made from tender coconut pulp, condensed milk, and crushed green cardamom.", 119.0, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", "Desserts", true, r11);

            // Malabar Coastal Kitchen Foods
            Food f64 = new Food(null, "Malabar Chicken Dum Biryani", "Iconic Thalassery kaima rice layered with fragrant masala chicken, caramelized onions, fried cashews, and sultanas.", 269.0, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", "Biryani", true, r12);
            Food f65 = new Food(null, "Kerala Malabar Parotta with Roast Gravy (2 pcs)", "Flaky layered multi-fold pan-fried flatbread served with rich roasted onion and tomato coconut gravy.", 139.0, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80", "South Indian", true, r12);
            Food f66 = new Food(null, "Kerala Fish Moilee", "Tender fish fillet gently poached in a delicate, velvety coconut milk broth with turmeric, ginger, and green chilies.", 289.0, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80", "Curry", true, r12);
            Food f67 = new Food(null, "Mushroom Pepper Roast", "Button mushrooms stir-fried in coconut oil with shallots, curry leaves, and freshly ground black pepper.", 179.0, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80", "Sides", true, r12);
            Food f68 = new Food(null, "Kerala Spiced Buttermilk (Sambharam)", "Refreshing chilled churned yogurt drink seasoned with ginger, green chilies, shallots, and curry leaves.", 49.0, "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80", "Beverages", true, r12);

            foods.addAll(List.of(
                    f1, f2, f3, f4, f5, f6,
                    f7, f8, f9, f10, f11, f12,
                    f13, f14, f15, f16, f17, f18,
                    f19, f20, f21, f22, f23,
                    f24, f25, f26, f27, f28,
                    f29, f30, f31, f32, f33,
                    f34, f35, f36, f37, f38,
                    f39, f40, f41, f42, f43,
                    f44, f45, f46, f47, f48,
                    f49, f50, f51, f52, f53,
                    f54, f55, f56, f57, f58,
                    f59, f60, f61, f62, f63,
                    f64, f65, f66, f67, f68
            ));
            foodRepository.saveAll(foods);

            // 4. Seed a Sample Order
            Order demoOrder = new Order();
            demoOrder.setOrderNumber("ORD-1728200001");
            demoOrder.setCustomer(customer);
            demoOrder.setRestaurant(r1);
            demoOrder.setDeliveryAddress("Apt 4B, Sunrise Heights, Metro City");
            demoOrder.setStatus("PREPARING");
            demoOrder.setDeliveryFee(40.0);
            demoOrder.setTax(20.90);
            demoOrder.setTotalAmount(418.0);
            demoOrder.setGrandTotal(478.90);
            demoOrder.setSpecialInstructions("Please leave near the door and ring doorbell");
            demoOrder.setCreatedAt(LocalDateTime.now().minusMinutes(25));
            demoOrder.setUpdatedAt(LocalDateTime.now().minusMinutes(10));

            OrderItem oi1 = new OrderItem(demoOrder, f1, f1.getName(), 1, f1.getPrice());
            OrderItem oi2 = new OrderItem(demoOrder, f6, f6.getName(), 1, f6.getPrice());
            demoOrder.setItems(List.of(oi1, oi2));

            Payment payment = new Payment(demoOrder, 478.90, "UPI", "COMPLETED", "TXN-87625149");
            demoOrder.setPayment(payment);

            Delivery delivery = new Delivery(demoOrder, deliveryPerson, "ASSIGNED");
            delivery.setDeliveryNotes("Assigned to John Rider for delivery");
            demoOrder.setDelivery(delivery);

            orderRepository.save(demoOrder);

            System.out.println(">>> FoodHub demo data initialized successfully!");
        };
    }
}
