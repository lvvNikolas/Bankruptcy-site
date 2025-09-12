import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from "react";
import styles from "./toast.module.css";

type ToastKind =  "succcess" | "error" | "info";
