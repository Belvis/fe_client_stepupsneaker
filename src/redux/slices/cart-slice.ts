import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { v4 as uuidv4 } from "uuid";
import { getDiscountInfo } from "../../helpers/product";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  showWarningToast,
} from "../../helpers/toast";
import {
  ICartDetailRequest,
  ICartDetailResponse,
  ICartItem,
} from "../../interfaces";
import { axiosInstance } from "../../utils";

const httpClient: AxiosInstance = axiosInstance;
const API_BASE_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_BACKEND_API_BASE_PATH}`;

export interface CartState {
  cartItems: ICartItem[];
}

const toCartItem = (item: ICartDetailResponse): ICartItem => {
  const productDetail = item.productDetail;
  const discountInfo = getDiscountInfo(productDetail.promotionProductDetails);

  return {
    id: item.id,
    cartItemId: productDetail.product.id,
    image: productDetail.image,
    name: productDetail.product.name,
    quantity: item.quantity,
    selectedProductColor: productDetail.color,
    selectedProductSize: {
      id: productDetail.size.id,
      name: productDetail.size.name,
      stock: productDetail.quantity,
      price: productDetail.price,
      discount: discountInfo?.value ?? 0,
      offerEnd: discountInfo?.endDate ?? 0,
      saleCount: productDetail.saleCount,
      productDetailId: productDetail.id,
    },
    createdAt: item.createdAt,
  };
};

const toCartRequest = (item: ICartItem): ICartDetailRequest => ({
  productDetail: item.selectedProductSize.productDetailId,
  quantity: item.quantity,
});

const makeApiRequest = async <T>(
  url: string,
  method: "get" | "post" | "put" | "delete",
  data?: any
): Promise<{ data: T }> => {
  try {
    const response = await httpClient[method](url, data);

    return {
      data: response.data.content,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchCartFromDB = async () => {
  const url = `${API_BASE_URL}/cart-details`;
  return makeApiRequest<ICartDetailResponse[]>(url, "get");
};

const mergeCartToDB = async (cartItems: ICartItem[]) => {
  const url = `${API_BASE_URL}/cart-details/merge`;
  const variables = cartItems.map(toCartRequest);
  return makeApiRequest<ICartDetailResponse[]>(url, "post", variables);
};

const addCartToDB = async (cartItem: ICartItem) => {
  const url = `${API_BASE_URL}/cart-details`;
  const variables = [cartItem].map(toCartRequest)[0];
  return makeApiRequest<ICartDetailResponse[]>(url, "post", variables);
};

const deleteCartFromDB = async (id: string) => {
  const url = `${API_BASE_URL}/cart-details/${id}`;
  return makeApiRequest<ICartDetailResponse[]>(url, "delete");
};

const deleteAllCartFromDB = async () => {
  const url = `${API_BASE_URL}/cart-details`;
  return makeApiRequest<ICartDetailResponse[]>(url, "delete");
};
const deleteAllCartByOrderFromDB = async (id: string) => {
  const url = `${API_BASE_URL}/cart-details/order/${id}`;
  return makeApiRequest<ICartDetailResponse[]>(url, "delete");
};

const updateCartQtyFromDB = async (cartItem: ICartItem) => {
  const url = `${API_BASE_URL}/cart-details/update/${cartItem.id}`;
  const variables = [cartItem].map(toCartRequest)[0];
  return makeApiRequest<ICartDetailResponse[]>(url, "put", variables);
};

const decreaseCartQtyFromDB = async (cartItem: ICartItem) => {
  const url = `${API_BASE_URL}/cart-details/decrease/${cartItem.id}`;
  const variables = [cartItem].map(toCartRequest)[0];
  return makeApiRequest<ICartDetailResponse[]>(url, "put", variables);
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCartFromDB();

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async (cartItems: ICartItem[], { rejectWithValue }) => {
    try {
      const res = await mergeCartToDB(cartItems);

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error merging cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const addToDB = createAsyncThunk(
  "cart/addToDB",
  async (cartItem: ICartItem, { rejectWithValue }) => {
    try {
      const res = await addCartToDB(cartItem);

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error add cart to database:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFromDB = createAsyncThunk(
  "cart/deleteFromDB",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deleteCartFromDB(id);

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error delete cart from database:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAllFromDB = createAsyncThunk(
  "cart/deleteAllFromDB",
  async (_, { rejectWithValue }) => {
    try {
      const res = await deleteAllCartFromDB();

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error delete all cart from database:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAllByOrderFromDB = createAsyncThunk(
  "cart/deleteAllByOrderFromDB",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deleteAllCartByOrderFromDB(id);

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error delete all cart by order from database:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseFromDB = createAsyncThunk(
  "cart/decreaseFromDB",
  async (cartItem: ICartItem, { rejectWithValue }) => {
    try {
      const res = await decreaseCartQtyFromDB(cartItem);

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error decrease cart quantity from database:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateFromDB = createAsyncThunk(
  "cart/updateFromDB",
  async (cartItem: ICartItem, { rejectWithValue }) => {
    try {
      const res = await updateCartQtyFromDB(cartItem);

      return res.data.map(toCartItem);
    } catch (error: any) {
      console.error("Error update cart from database:", error);
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [] as ICartItem[],
  } as CartState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const product = action.payload;

      const cartItem = state.cartItems.find(
        (item) => item.cartItemId === product.cartItemId
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (!cartItem) {
        state.cartItems.push({
          ...product,
          quantity: product.quantity ? product.quantity : 1,
          cartItemId: product.cartItemId,
          createdAt: currentTimestamp,
          id: product.id || uuidv4(),
        });
      } else if (
        cartItem !== undefined &&
        (cartItem.selectedProductColor?.id !==
          product.selectedProductColor?.id ||
          cartItem.selectedProductSize?.id !== product.selectedProductSize?.id)
      ) {
        state.cartItems = [
          ...state.cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: product.cartItemId,
            createdAt: currentTimestamp,
            id: product.id || uuidv4(),
          },
        ];
      } else {
        state.cartItems = state.cartItems.map((item) => {
          if (item.cartItemId === cartItem.cartItemId) {
            return {
              ...item,
              quantity: product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1,
              selectedProductColor: product.selectedProductColor,
              selectedProductSize: product.selectedProductSize,
            };
          }
          return item;
        });
      }

      showSuccessToast("Thêm vào giỏ hàng thành công");
    },
    updateCartItemQuantity(state, action: PayloadAction<any>) {
      const { cartItemId, quantity, showNoti = true } = action.payload;

      const updatedCartItems = state.cartItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: quantity } : item
      );

      const itemUpdated = updatedCartItems.some(
        (item) => item.cartItemId === cartItemId
      );

      if (itemUpdated) {
        state.cartItems = updatedCartItems;
        if (showNoti) {
          showInfoToast("Cập nhật số lượng thành công");
        }
      } else {
        if (showNoti) {
          showErrorToast("Không tìm thấy sản phẩm trong giỏ hàng");
        }
      }
    },
    updateCartItemsOrder(state, action: PayloadAction<string | null>) {
      const orderId = action.payload;

      state.cartItems = state.cartItems.map((item) => ({
        ...item,
        order: orderId !== null ? orderId : item.order,
      }));

      console.log(
        "Cập nhật thành công order cho tất cả các sản phẩm trong giỏ hàng"
      );
    },
    deleteCartItemsByOrder(state, action: PayloadAction<string | null>) {
      state.cartItems = state.cartItems.filter(
        (item) => item.order !== action.payload
      );

      console.log(
        "Xoá tất cả các sản phẩm trong giỏ hàng thuộc đơn hàng thành công"
      );
    },
    deleteFromCart(state, action: PayloadAction<string | undefined>) {
      state.cartItems = state.cartItems.filter((item) => {
        console.log("item", item);

        return item.id !== action.payload;
      });
      showWarningToast("Loại bỏ sản phẩm khỏi giỏ hàng thành công");
    },
    decreaseQuantity(state, action: PayloadAction<ICartItem>) {
      const product = action.payload;
      if (product.quantity === 1) {
        state.cartItems = state.cartItems.filter(
          (item) => item.cartItemId !== product.cartItemId
        );
        showErrorToast("Mặt hàng đã được loại bỏ khỏi giỏ hàng");
      } else {
        state.cartItems = state.cartItems.map((item) =>
          item.cartItemId === product.cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        showWarningToast("Mặt hàng đã giảm từ giỏ hàng");
      }
    },
    deleteAllFromCart(state) {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        mergeCart.fulfilled,
        addToDB.fulfilled,
        deleteFromDB.fulfilled,
        deleteAllFromDB.fulfilled,
        deleteAllByOrderFromDB.fulfilled,
        decreaseFromDB.fulfilled,
        updateFromDB.fulfilled
      ),
      (state, action) => {
        state.cartItems = action.payload;

        switch (action.type) {
          case "cart/mergeCart/fulfilled":
          case "cart/updateFromDB/fulfilled":
            showInfoToast(successMessages[action.type]);
            break;
          case "cart/deleteFromDB/fulfilled":
          case "cart/decreaseFromDB/fulfilled":
            showWarningToast(successMessages[action.type]);
            break;
          case "cart/deleteAllByOrderFromDB/fulfilled":
            break;
          default:
            showSuccessToast(successMessages[action.type]);
            break;
        }
      }
    );
    builder.addMatcher(
      isAnyOf(
        mergeCart.rejected,
        addToDB.rejected,
        deleteFromDB.rejected,
        deleteAllFromDB.rejected,
        decreaseFromDB.rejected,
        updateFromDB.rejected,
        fetchCart.rejected
      ),
      (_, action) => {
        console.error(
          `Error: ${errorMessages[action.type]}`,
          action.error.message
        );
        showErrorToast(errorMessages[action.type]);
      }
    );
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  updateCartItemsOrder,
  deleteCartItemsByOrder,
  deleteFromCart,
  decreaseQuantity,
  deleteAllFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;

const successMessages: Record<string, string> = {
  [String(mergeCart.fulfilled)]: "Giỏ hàng đã được đồng bộ",
  [String(addToDB.fulfilled)]: "Thêm vào giỏ hàng thành công",
  [String(deleteFromDB.fulfilled)]: "Loại bỏ sản phẩm khỏi giỏ hàng thành công",
  [String(deleteAllFromDB.fulfilled)]: "Làm mới giỏ hàng thành công",
  [String(decreaseFromDB.fulfilled)]: "Mặt hàng đã giảm từ giỏ hàng",
  [String(updateFromDB.fulfilled)]: "Cập nhật số lượng thành công",
  [String(fetchCart.fulfilled)]: "",
};

const errorMessages: Record<string, string> = {
  [String(mergeCart.rejected)]: "Xảy ra lỗi khi đồng bộ giỏ hàng",
  [String(addToDB.rejected)]: "Xảy ra lỗi khi thêm vào giỏ hàng",
  [String(deleteFromDB.rejected)]:
    "Xảy ra lỗi khi loại bỏ sản phẩm khỏi giỏ hàng",
  [String(deleteAllFromDB.rejected)]: "Xảy ra lỗi khi làm mới giỏ hàng",
  [String(decreaseFromDB.rejected)]: "Xảy ra lỗi khi giảm số lượng từ giỏ hàng",
  [String(updateFromDB.rejected)]: "Xảy ra lỗi khi cập nh số lượng từ giỏ hàng",
  [String(fetchCart.rejected)]: "Không thể lấy giỏ hàng từ cơ sở dữ liệu",
};
