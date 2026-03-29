import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type Price = Nat;
  type Rating = Nat;

  type Product = {
    id : Nat;
    name : Text;
    price : Price;
    description : Text;
    category : Text;
    imageUrl : Text;
    rating : Rating;
  };

  type ProductOrder = {
    name : Text;
    size : Text;
    quantity : Nat;
    price : Nat;
  };

  type DeliveryAddress = {
    addressType : Text;
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

  type OldActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, Order>;
    products : [Product];
  };

  type UserProfile = {
    name : Text;
    addressType : Text;
    flat : Text;
    floor : Text;
    area : Text;
    landmark : Text;
    phone : Text;
  };

  type NewActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, Order>;
    products : [Product];
    userProfiles : Map.Map<Text, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      userProfiles = Map.empty<Text, UserProfile>();
    };
  };
};

