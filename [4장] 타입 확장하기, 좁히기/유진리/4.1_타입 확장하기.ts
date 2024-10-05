/* 1. 타입 확장의 장점 - 코드 중복을 줄임 */

// 예제 01
interface BaseMenuItem {
  itemName: string | null;
  itemImageUrl: string | null;
  itemDiscountAmount: number;
  stock: number | null;
}
interface BaseCartItem extends BaseMenuItem {
  quantity: number;
}

// 예제 02
type BaseMenuItem2 = {
  itemName: string | null;
  itemImageUrl: string | null;
  itemDiscountAmount: number;
  stock: number | null;
};
type BaseCartItem2 = {
  quantity: number;
} & BaseMenuItem2;

// 예제 03
interface EditableCartItem extends BaseCartItem {
  isSoldOut: boolean;
  optionGroups: SelectableOptionGroups[];
}
interface EventCartItem extends BaseCartItem {
  orderable: boolean;
}

/* 2. 유니온 타입 - 2개 이상의 타입을 조합 (합집합) */

// 예제 01
type MyUnion = A | B;

// 예제 02
interface CookingStep {
  orderId: string;
  price: number;
}
interface DeliveryStep {
  orderId: string;
  time: number;
  distance: string;
}

function getDeliveryDistance(step: CookingStep | DeliveryStep) {
  return step.distance; // Error : Property 'distance' does not exist on type 'CookingStep | DeliveryStep'
}

/* 3. 교차 타입 - 기존 타입을 합쳐 모든 기능을 가진 하나의 타입으로 만든것 (교집합) */

// 예제 01
interface CookingStep {
  orderId: string;
  price: number;
}
interface DeliveryStep {
  orderId: string;
  time: number;
  distance: string;
}
// * 유니온 타입과 다른점: BaedalProgress는 CookingStep과 DeliveryStep 타입을 합친 단일타입! (교집합)
type BaedalProgress = CookingStep & DeliveryStep; // 속성 - orderId, price, time, distance

// 예제 02
function logBaedalInfo(progress: BaedalProgress) {
  console.log(`주문 금액: ${progress.price}`); // OK
  console.log(`배달 거리: ${progress.distance}`); // OK
}

// 예제 03 - 타입은 속성의 집합이 아닌 '값의 집합' 이다
interface DeliveryTip {
  tip: string;
}
interface StarRating {
  rate: number;
}
type Filter = DeliveryTip & StarRating;
const filter: Filter = {
  tip: "1000원 이하",
  rate: 4,
};

// 예제 04 - 교차 타입 사용시, 타입이 서로 호환되지 않는 경우
type IdType = string | number;
type Numeric = number | boolean;
type Universal = IdType & Numeric;


/* 4. extends와 교차 타입 */

// 예제 01
interface BaseMenuItem {
  itemName: string | null;
  itemImageUrl: string | null;
  itemDiscountAmount: number;
  stock: number | null;
}
interface BaseCartItem extends BaseMenuItem {
  quantity: number;
}
