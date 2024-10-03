/* 
1. 교차 타입 (A & B)
A 타입과 B 타입을 결합한 하나의 단일 타입. A와 B타입 모두 만족.
*/

type ProductItem = {
  id: number;
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  quantitiy: number;
};

type ProductItemWithDiscount = ProductItem & { discountAmount: number };

/* 
2. 유니온 타입 (A | B)
A타입 또는 B타입 중 하나가 될 수 있는 타입.
*/

type CardItem = {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
};

type PromotionEventItem = ProductItem | CardItem;

/*
3. 인덱스 시그니처
인터페이스 내부가 [key: K] : T 꼴인 타입으로,
해당 타입의 속성 키는 모두 K타입이고, 값은 모두 T타입
*/

interface IndexSignatureEx {
  [key: string]: number;
}

/*
4. 인덱스드 액세스 타입
다른 타입의 특정 속성이 가지는 타입을 조회하는 용도
*/

// 예제 01 - Example 타입의 a 속성이 가지는 타입 조회하는 인덱스드 엑세스 타입
type Example = {
  a: number;
  b: string;
  c: boolean;
};

type IndexedAccess = Example["a"];
type IndexedAccess2 = Example["a" | "b"]; // number | string
type IndexedAccess3 = Example[keyof Example]; // number | string | boolean

type ExAlias = "b" | "c";
type IndexedAccess4 = Example[ExAlias]; // string | boolean

// 예제 02 - number로 인덱싱하여 배열요소를 얻고, typeof를 붙여서 해당 요소의 타입 가져옴
const PromitionList = [
  { type: "product", name: "chicken" },
  { type: "product", name: "pizza" },
  { type: "card", name: "cheer-up" },
];
type ElementOf<T> = (typeof T)[number];

// type PromotionItemType = { type: string; name: string }
type PromotionItemType = ElementOf<PromotionList>;

/*
5. 맵드 타입 **
다른 타입을 기반으로 한 타입을 선언할 때 사용하는 문법으로,
인덱스 시그니처 문법을 사용해 반복적 타입 선언을 효과적으로 감소
*/

// 예제 01
type Example2 = {
  a: number;
  b: string;
  c: boolean;
};

type Subset<T> = {
  [K in keyof T]?: T[K];
};

const aExample: Subset<Example2> = { a: 3 };
const bExample: Subset<Example2> = { b: "hello" };
const cExample: Subset<Example2> = { a: 4, c: true };

// 예제 02
type ReadOnlyEx = {
  readonly a: number;
  readonly b: string;
};

type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]; // readonly 수식어를 제거한 타입 선언 (-)
};

type ResultType = CreateMutable<ReadOnlyEx>; // { a: number; b: string }

type OptionalEx = {
  a?: number;
  b?: string;
  c: boolean;
};

type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property]; // { a: number; b: string; c: boolean }
};

// 예제 03 - 맵드타입 실제 활용 예시 (배민 선물하기 바텀시트)
const BottomSheetMap = {
  RECENT_CONTACTS: RecentContactsBottomSheet,
  CARD_SELECT: CardSelectBottomSheet,
  SORT_FILTER: SortFilterBottomSheet,
  PRODUCT_SELECT: ProductSelectBottomSheet,
  REPLY_CARD_SELECT: ReplayCardSelectBottomSheet,
  RESEND: ResendBottomSheet,
  STICKER: StickerBottomSheet,
  BASE: null,
};

export type BOTTOM_SHEET_ID = keyof typeof BottomSheetMap;

// 불필요한 반복 발생
type _BottomSheetStore = {
  RECENT_CONTACTS: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  CARD_SELECT: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  SORT_FILTER: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  //...
};

// Mapped Type 활용해 효율적인 타입 선언! **
type BottomSheetStore = {
  [index in BOTTOM_SHEET_ID]: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
};

type BottomSheetStore2 = {
  [index in BOTTOM_SHEET_ID as `${index}_BOTTOM_SHEET`]: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
};

/*
6. 템플릿 리터럴 타입
JS 템플릿 리터럴 문자열을 사용해 선언한 문자열 리터럴 타입.
*/

// 예제 01
type Stage =
  | "init"
  | "select-image"
  | "edit-image"
  | "decorate-card"
  | "capture-image";
type StageName = `${Stage}-stage`;
// 'init-stage' | 'select-image-stage' | 'edit-image'stage' | 'decorate-card-stage' | 'capture-image-stage'

/*
7. 제네릭
다양한 타입 간에 재사용성을 높이기 위해 사용
*/

// 예제 01
type ExampleArrayType<T> = T[];
const array1: ExampleArrayType<string> = ["치킨", "피자", "우동"];

// 예제 02 - 제네릭 사용하면 배열 요소가 모두 동일한 타입임을 보장 가능
type ExampleArrayType2 = any[];

const array2: ExampleArrayType2 = [
  "치킨",
  {
    id: 0,
    name: "치킨",
    price: 20000,
    quantity: 1,
  },
  99,
  true,
];

// 예제 03 - 타입 추론 가능한 경우, 타입 명시 생략 가능
function exampleFunc<T>(arg: T): T[] {
  return new Array(3).fill(arg);
}
exampleFunc("hello"); // T는 string으로 추론된다

// 예제 04 - 특정 요소 타입을 알 수 없을때는, 제네릭 타입에 기본값을 추가 가능
interface SubmitEvent<T = HTMLElement> extends SyntheticEvent<T> {
  submitter: T;
}

// 예제 05-1 - 함수/클래스 내부에서 제네릭 사용할때, 어떤 타입이든 될수있으므로 특정 타입에서만 존재하는 멤버를 참조하면 X
function exampleFunc2<T>(arg: T): number {
  return arg.length; // 에러 발생: Property 'length' does not exist on type 'T' // length는 배열에만 존재
}

// 예제 05-2 - length 속성을 가진 타입만 받는다는 제약 걸기
interface TypeWithLength {
  length: number;
}

function exampleFunc3<T extends TypeWithLength>(arg: T): number {
  return arg.length;
}

// 예제 06 - 제네릭 사용시 주의점: tsx 파일에서 화살표 함수에 제네릭 사용하면 에러 발생!
// (제네릭의 <>와 태그의 <> 혼동하여 에러 발생)

// => extends 키워드 사용해 특정 타입의 하위타입만 올 수 있음을 확실히 알려주자
// => or 제네릭 사용시에는 함수를 화살표함수 말고 일반함수로 선언

// 에러 발생: JSX Element 'T' has no corresponding closing tag
const arrowExampleFunc = <T>(arg: T): T[] => {
  return new Array(3).fill(arg);
};

// 에러 발생 X
const arrowExampleFunc2 = <T extends {}>(arg: T): T[] => {
  return new Array(3).fill(arg);
};
