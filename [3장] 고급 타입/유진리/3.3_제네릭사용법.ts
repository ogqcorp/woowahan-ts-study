/* 
1. 함수의 제네릭 - 함수의 매개변수나 반환 값에 다양한 타입 넣고싶을때 사용
*/

function ReadOnlyRepository<T>(
  target: ObjectType<T> | EntitySchema | string
): Repository<T> {
  return getConnection("ro").getRepository(target);
}

/* 
2. 호출 시그니처의 제네릭 - 함수의 매개변수와 반환 타입을 미리 선언하는 것
*/

// 예제 01
interface useSelectPaginationProps<T> {
  categoryAtom: RecoilState<number>;
  filterAtom: RecoilState<string[]>;
  sortAtom: RecoilState<SortType>;
  fetherFunc: (
    props: CommonListRequest
  ) => Promise<DefaultResponse<ContentListResponse<T>>>;
}

// 예제 02
export type UseRequesterHookType = <RequestData = void, ResponseData = void>(
  baseURL?: string | Headers,
  defaultHeader?: Headers
) => [RequestStatus, Requester<RequestData, ResponseData>];

// 예제 03
function useSelectPagination<
  T extends CardListContent | CommonProductResponse
>({
  categoryAtom,
  filterAtom,
  sortAtom,
  fetcherFunc,
}: useSelectPaginationProps<T>): {
  intersectionRef: RefObject<HTMLDivElement>;
  data: T[];
  categoryId: number;
  isLoading: boolean;
  isEmpty: boolean;
} {
  // ...

  return {
    intersectionRef,
    data: swappedData ?? [],
    isLoading,
    categoryId,
    isEmpty,
  };
}

/* 
3. 제네릭 클래스 - 외부에서 입력된 타입을 클래스 내부에 적용할 수 있는 클래스
*/

// 예제 01
class LocalDB<T> {
  // ...
  async put(table: string, row: T): Promise<T> {
    return new Promise<T>((resolved, rejected) => {
      /* T 타입의 데이터를 DB에 저장 */
    });
  }

  async get(table: string, key: any): Promise<T> {
    return new Promise<T>((resolved, rejected) => {
      /* T 타입의 데이터를 DB에서 가져옴 */
    });
  }

  async getTable(table: string): Promise<T[]> {
    return new Promise<T[]>((resolved, rejected) => {
      /* T[] 타입의 데이터를 DB에서 가져옴 */
    });
  }
}

// 예제 02 - <T>는 메서드의 매개변수나 반환 타입으로 사용될 수 있다.
export default class IndexedDB implements ICacheStore {
  private _DB?: LocalDB<{
    key: string;
    value: Promise<Record<string, unknown>>;
    cacheTTL: number;
  }>;

  private DB() {
    if (!this._DB) {
      this._DB = new LocalDB("localCache", {
        ver: 6,
        tables: [{ name: TABLE_NAME, keyPath: "key" }],
      });
    }
    return this._DB;
  }

  //...
}

/*
4. 제한된 제네릭 - 타입 매개변수에 대한 제약 조건을 설정하는 기능
*/

// 예제 01 - 타입 매개변수에 제약 설정하려면 타입을 상속(extend)
type ErrorRecord<Key extends string> = Exclude<Key, ErrorCodeType> extends never
  ? Partial<Record<Key, Boolean>>
  : never;
// => 여기서 Key를 바운드 타입 매개변수, string은 키의 상한 한계

// 예제 02 - 상속받을 수 있는 타입: 기본 타입, + 인터페이스, 클래스, 유니온 등
function useSelectPagination<
  T extends CardListContent | CommonProductResponse
>({
  filterAtom,
  sortAtom,
  fetcherFunc,
}: useSelectPaginationProps<T>): {
  intersectionRef: RefObject<HTMLDivElement>;
  data: T[];
  categoryId: number;
  isLoading: boolean;
  isEmpty: boolean;
} {
  //...
}
// 사용 부분 코드
const { intersectionRef, data, isLoading, isEmpty } =
  useSelectPagination<CardListContent>({
    categoryAtom: replyCardCategoryAtom,
    filterAtom: replyCardFilterAtom,
    sortAtom: replyCardSortAtom,
    fetcherFunc: fetchReplyCardListByThemeGroup,
  });

/* 5. 확장된 제네릭 - 여러 타입을 상속받을 수 있으며, 타입 매개변수 여러개 둘수있음 */

// 예제 01 - 제네릭의 유연성을 잃은 타입
<Key extends string>

// 예제 02 - 제네릭의 유연성 유지하면서 타입 제약
<Key extends string | number>

// 예제 03 - 타입 매개변수 여러개일때는 유니온 말고 매개변수 하나 더 추가하여 선언


/* 6. 제네릭 예시
- 제네릭의 장점: 다양한 타입을 받아서 코드 효율적으로 재사용
- 실무에서 제네릭 가장 많이 활용되는 곳? API 응답 타입 지정
*/

// 예제 01-01 - 달라지는 data를 제네릭 타입 Data로 선언
export interface MobileApiResponse<Data> {
    data: Data;
    statusCode: string;
    statusMessage?: string;
}
// 예제 01-02 - 실제 응답 값의 타입 지정
export const fetchPriceInfo = (): Promise<MobileApiResponse<PriceInfo>> => {
    const priceUrl = "https: ~~~"; // url 주소

    return request({
        method: "GET",
        url: priceUrl
    })
}
export const fetchOrderInfo = (): Promise<MobileApiResponse<Order>> => {
    const priceUrl = "https: ~~~"; // url 주소

    return request({
        method: "GET",
        url: priceUrl
    })
}