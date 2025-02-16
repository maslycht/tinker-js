import { useDispatch } from "react-redux";
import { AppDispatch } from "../state";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();