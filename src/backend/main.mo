import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Price = Nat; // Store price in paise/cents

  type UserProfile = {
    name : Text;
    addressType : Text;
    flat : Text;
    floor : Text;
    area : Text;
    landmark : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Text, UserProfile>();

  // Save user profile
  public shared ({ caller }) func saveUserProfile(profile : UserProfile) : async () {
    userProfiles.add(profile.phone, profile);
  };

  // Get user profile by phone number
  public query ({ caller }) func getUserByPhone(phone : Text) : async ?UserProfile {
    userProfiles.get(phone);
  };

  // Get all users (admin / export)
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    userProfiles.values().toArray();
  };

  type Rating = Nat; // Rating as 1-5 integer

  type Product = {
    id : Nat;
    name : Text;
    price : Price;
    description : Text;
    category : Text; // "Oats", "Muesli", "PeanutButter"
    imageUrl : Text;
    rating : Rating;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  let products : [Product] = [
    {
      id = 1;
      name = "High Protein Oats";
      price = 25000;
      description = "Oats with high protein content for muscle gain.";
      category = "Oats";
      imageUrl = "ipfs://high-protein-oats";
      rating = 5;
    },
    {
      id = 2;
      name = "Rolled Oats";
      price = 15000;
      description = "Classic rolled oats for healthy breakfast.";
      category = "Oats";
      imageUrl = "ipfs://rolled-oats";
      rating = 4;
    },
    {
      id = 3;
      name = "Fruit Muesli";
      price = 30000;
      description = "Muesli with dried fruits for energy boosting.";
      category = "Muesli";
      imageUrl = "ipfs://fruit-muesli";
      rating = 5;
    },
    {
      id = 4;
      name = "Chocolate Muesli";
      price = 32000;
      description = "Chocolate flavored muesli for healthy snacking.";
      category = "Muesli";
      imageUrl = "ipfs://chocolate-muesli";
      rating = 4;
    },
    {
      id = 5;
      name = "Crunchy Peanut Butter";
      price = 18000;
      description = "Crunchy peanut butter with high protein content.";
      category = "PeanutButter";
      imageUrl = "ipfs://crunchy-peanut-butter";
      rating = 5;
    },
    {
      id = 6;
      name = "Creamy Peanut Butter";
      price = 17000;
      description = "Smooth and creamy peanut butter for healthy spread.";
      category = "PeanutButter";
      imageUrl = "ipfs://creamy-peanut-butter";
      rating = 5;
    },
    {
      id = 7;
      name = "Dark Chocolate Peanut Butter";
      price = 20000;
      description = "Peanut butter with dark chocolate for healthy snacking.";
      category = "PeanutButter";
      imageUrl = "ipfs://dark-chocolate-peanut-butter";
      rating = 4;
    },
    {
      id = 8;
      name = "Honey Peanut Butter";
      price = 19000;
      description = "Peanut butter with honey for natural sweetness.";
      category = "PeanutButter";
      imageUrl = "ipfs://honey-peanut-butter";
      rating = 4;
    },
  ];

  // Get all products
  public query func getAllProducts() : async [Product] {
    products.sort();
  };

  // Get product by id
  public query func getProductById(id : Nat) : async Product {
    switch (products.find(func(product) { product.id == id })) {
      case (?product) { product };
      case (null) {
        Runtime.trap("Product not found");
      };
    };
  };

  // Get by category
  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().filter(func(product) { Text.equal(product.category, category) }).toArray();
  };

  // ---- Orders Management ----

  type ProductOrder = {
    name : Text;
    size : Text;
    quantity : Nat;
    price : Nat;
  };

  type DeliveryAddress = {
    addressType : Text; // home/office
    flat : Text;
    floor : Text;
    area : Text;
    landmark : Text;
    name : Text;
    phone : Nat;
  };

  type PaymentMethod = {
    #upi : Text;
    #cod;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #delivered;
  };

  type Order = {
    orderId : Nat;
    products : [ProductOrder];
    address : DeliveryAddress;
    paymentMethod : PaymentMethod;
    totalAmount : Nat;
    deliveryCharge : Nat;
    status : OrderStatus;
    timestamp : Int;
  };

  var nextOrderId = 1;

  let orders = Map.empty<Nat, Order>();

  // Submit new order
  public shared ({ caller }) func submitOrder(order : Order) : async Nat {
    let newOrder : Order = {
      order with
      orderId = nextOrderId;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(nextOrderId, newOrder);
    let orderId = nextOrderId;
    nextOrderId += 1;
    orderId;
  };

  // Get order by id
  public query ({ caller = _ }) func getOrderById(orderId : Nat) : async ?Order {
    orders.get(orderId);
  };

  // Get all orders (admin)
  public query ({ caller = _ }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };
};
