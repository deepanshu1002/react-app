import { createSlice } from "@reduxjs/toolkit";

const data = createSlice({
  name: "data",
  initialState: {
    apiData: null,
  },
  reducers: {
    addData: (state, action) => {
      state.apiData = action.payload;
    },
  },
});
export const { addData } = data.actions;
export default data.reducer;
