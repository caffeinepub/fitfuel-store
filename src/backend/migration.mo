import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Product type
  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    description : Text;
    category : Text;
    imageUrl : Text;
    rating : Nat;
  };

  // Old actor (original actor type)
  type OldActor = {
    products : [Product];
  };

  // ProductOrder type
  type ProductOrder = {
    name : Text;
    size : Text;
    quantity : Nat;
    price : Nat;
  };

  // DeliveryAddress type
  type DeliveryAddress = {
    addressType : Text; // home/office
    flat : Text;
    floor : Text;
    area : Text;
    landmark : Text;
    name : Text;
    phone : Nat;
  };

  // Order type
  type Order = {
    orderId : Nat;
    products : [ProductOrder];
    address : DeliveryAddress;
    paymentMethod : {
      #upi : Text;
      #cod;
    };
    totalAmount : Nat;
    deliveryCharge : Nat;
    status : {
      #pending;
      #confirmed;
      #delivered;
    };
    timestamp : Int;
  };

  // New data structure with orders
  type NewActor = {
    products : [Product];
    orders : Map.Map<Nat, Order>;
    nextOrderId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      products = old.products;
      orders = Map.empty<Nat, Order>();
      nextOrderId = 1;
    };
  };
};
